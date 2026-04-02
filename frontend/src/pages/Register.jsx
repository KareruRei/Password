import { useState } from "react";
import { Mail, Lock, UserCircle, Loader2, ArrowLeft, ShieldPlus } from "lucide-react";
import API from "../api";

function Register({ navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [account, setAccount] = useState("Personal");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isPasswordValid = password.length >= 8;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await API.post("/register", { email, password, account });
      setMessage({ type: "success", text: "Identity Initialized. Redirecting..." });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message;
      setMessage({ type: "error", text: detail || "Registration Failed" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[400px]">
      {/* Brand Header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800020] shadow-xl shadow-[#800020]/20">
          <ShieldPlus className="text-white" size={28} />
        </div>
        <h2 className="text-3xl font-black tracking-tight text-white uppercase">Initialize</h2>
        <p className="mt-2 text-sm text-gray-500">Create your master encryption key</p>
      </div>

      <div className="relative rounded-3xl bg-[#121212] p-8 border border-white/5 shadow-2xl">
        {/* Back Button */}
        <button 
          onClick={() => navigate("/login")}
          className="absolute left-6 top-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} /> Back
        </button>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          {/* Email */}
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition-all focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
              <input
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition-all focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
                placeholder="Master Password (8+ chars)"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Strength Indicator */}
            <div className="mt-3 h-1 w-full bg-white/5 rounded-full overflow-hidden">
               <div 
                 className={`h-full transition-all duration-700 ${isPasswordValid ? 'w-full bg-[#800020]' : 'w-1/3 bg-gray-700'}`} 
               />
            </div>
          </div>

          {/* Account Name */}
          <div className="relative">
            <UserCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition-all focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
              placeholder="Vault Name (e.g. Work)"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              required
            />
          </div>

          <button
            disabled={isLoading || !isPasswordValid}
            className="w-full rounded-xl bg-[#800020] py-4 font-black uppercase tracking-widest text-white transition-all hover:bg-[#950026] active:scale-[0.98] disabled:opacity-30 shadow-lg shadow-[#800020]/10"
            type="submit"
          >
            {isLoading ? <Loader2 className="mx-auto animate-spin" size={20} /> : "Establish Identity"}
          </button>
        </form>

        {message && (
          <div className={`mt-6 rounded-xl p-3 text-center text-xs font-black uppercase tracking-widest animate-in fade-in zoom-in-95 ${
            message.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button onClick={() => navigate("/login")} className="text-sm font-medium text-gray-500 ">
            Already have a vault? <span className="hover:text-white transition-colors text-[#800020]">Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Register;