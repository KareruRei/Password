import { useState, useEffect } from "react";
import { Plus, Search, Copy, Trash2, LogOut, ShieldCheck, Globe, Key, User, Loader2 } from "lucide-react";
import API from "../api";

function Dashboard({ token, setToken, navigate }) {
  const [creds, setCreds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [account, setAccount] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const fetchCredentials = async () => {
    setIsFetching(true);
    try {
      const res = await API.get("/credentials");
      setCreds(res.data.credentials || []);
    } catch (err) {
      if (err.response?.status === 401) handleLogout();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => { if (token) fetchCredentials(); }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await API.post("/credentials", { account, username, password });
      setAccount(""); setUsername(""); setPassword("");
      await fetchCredentials();
      setMessage({ type: "success", text: "Encrypted & Stored" });
    } catch (err) {
      setMessage({ type: "error", text: "Error" });
    } finally {
      setIsLoading(false);
      setTimeout(() => setMessage(null), 2000);
    }
  };

  const handleCopy = (pwd) => {
    navigator.clipboard.writeText(pwd);
    setMessage({ type: "success", text: "Copied" });
    setTimeout(() => setMessage(null), 2000);
  };

  const filteredCreds = creds.filter(c => c.account.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#800020]" size={24} />
            <span className="text-xl font-black tracking-tighter text-[#800020]">in<span className="text-white">Vault</span></span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#800020] transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </nav>

      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-10 md:grid-cols-[300px_1fr]">
          
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="rounded-2xl bg-[#121212] p-6 border border-white/5">
              <h2 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-[#800020]">New Records</h2>
              <form onSubmit={handleAdd} className="space-y-4">
                <div className="relative">
                  <Globe className="absolute left-3 top-3 text-gray-600" size={16} />
                  <input className="w-full rounded-xl bg-black border border-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#800020] outline-none" placeholder="Service" value={account} onChange={(e) => setAccount(e.target.value)} />
                </div>
                <div className="relative">
                  <User className="absolute left-3 top-3 text-gray-600" size={16} />
                  <input className="w-full rounded-xl bg-black border border-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#800020] outline-none" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="relative">
                  <Key className="absolute left-3 top-3 text-gray-600" size={16} />
                  <input className="w-full rounded-xl bg-black border border-white/5 py-2.5 pl-10 pr-4 text-sm text-white focus:border-[#800020] outline-none" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button disabled={isLoading} className="w-full rounded-xl bg-[#800020] py-3 text-xs font-black uppercase text-white hover:bg-[#950026] transition-all">
                  {isLoading ? <Loader2 className="mx-auto animate-spin" size={16} /> : "Encrypt"}
                </button>
              </form>
            </div>
            {message && <div className="text-center text-[10px] font-black uppercase tracking-widest text-[#800020]">{message.text}</div>}
          </aside>

          {/* Main List */}
          <main className="space-y-6">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600" size={20} />
              <input 
                className="w-full rounded-2xl bg-[#121212] border border-white/5 py-5 pl-14 pr-6 text-white text-lg outline-none focus:border-[#800020] shadow-2xl" 
                placeholder="Search encrypted records..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-3">
              {isFetching ? (
                <Loader2 className="mx-auto mt-20 animate-spin text-[#800020]" size={40} />
              ) : filteredCreds.map((c, i) => (
                <div key={i} className="group flex items-center justify-between rounded-2xl bg-[#121212] p-5 border border-white/5 hover:border-[#800020]/40 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-black border border-white/5 text-[#800020] font-black group-hover:scale-110 transition-transform">
                      {c.account.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg">{c.account}</h3>
                      <p className="text-sm text-gray-500 font-mono">{c.username}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleCopy(c.password)} className="flex items-center gap-2 rounded-xl bg-black border border-white/5 px-4 py-2 text-xs font-bold text-gray-400 hover:text-white hover:border-[#800020] transition-all">
                      <Copy size={14} /> Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;