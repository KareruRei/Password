import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Loader2 } from "lucide-react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("login");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (token) {
      setView("dashboard");
    } else if (view === "dashboard") {
      setView("login");
    }
    setIsInitializing(false);
  }, [token]);

  const navigate = (path) => {
    const route = path.replace("/", "");
    if (["login", "register", "dashboard"].includes(route)) {
      setView(route);
    }
  };

  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a]">
        <Loader2 className="h-8 w-8 animate-spin text-[#800020]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#800020]/30">
      {token && view === "dashboard" ? (
        <Dashboard token={token} setToken={setToken} navigate={navigate} />
      ) : (
        <div className="flex min-h-screen items-center justify-center py-12 px-4">
          <div className="w-full animate-in fade-in zoom-in-95 duration-500">
            {view === "register" ? (
              <Register navigate={navigate} />
            ) : (
              <Login setToken={setToken} navigate={navigate} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;