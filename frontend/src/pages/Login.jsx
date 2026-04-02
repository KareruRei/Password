import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, Loader2, Shield } from "lucide-react";
import API from "../api";

function Login({ setToken, navigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await API.post("/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      setToken(token);
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail || err.response?.data?.message;
      setMessage({ type: "error", text: detail || "Access Denied." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[400px]">
      <div className="mb-10 flex flex-col items-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#800020] shadow-xl shadow-[#800020]/20">
          <Shield className="text-white" size={28} />
        </div>
        <h2 className="mt-6 text-3xl font-black tracking-tight text-[#800020]">in<span className="text-white">Vault</span></h2>
        <p className="mt-2 text-sm text-gray-500">Login</p>
      </div>

      <div className="rounded-3xl bg-[#121212] p-8 border border-white/5 shadow-2xl">
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type="email"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-4 text-white outline-none transition-all focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-11 pr-12 text-white outline-none transition-all focus:border-[#800020] focus:ring-1 focus:ring-[#800020]"
              placeholder="Master Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {message && (
            <div className="rounded-xl bg-red-500/10 p-3 text-center text-xs font-bold text-red-500 border border-red-500/20">
              {message.text}
            </div>
          )}

          <button
            disabled={isLoading}
            className="w-full rounded-xl bg-[#800020] py-4 font-bold text-white transition-all hover:bg-[#950026] active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-[#800020]/10"
            type="submit"
          >
            {isLoading ? <Loader2 className="mx-auto animate-spin" size={20} /> : "Unlock Vault"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button onClick={() => navigate("/register")} className="text-sm font-medium text-gray-500 ">
            Need a new vault? <span className="hover:text-white transition-colors text-[#800020]">Register</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;