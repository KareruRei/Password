import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { Loader2 } from "lucide-react";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [view, setView] = useState("login");
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize view from URL if present
    const path = window.location.pathname.replace(/^\//, "") || "login";
    const allowed = ["login", "register", "dashboard"];
    const initial = allowed.includes(path) ? path : "login";
    if (token && initial !== "dashboard") setView("dashboard");
    else if (!token && initial === "dashboard") setView("login");
    else setView(initial);

    setIsInitializing(false);

    // handle back/forward browser buttons
    const onPop = () => {
      const p = window.location.pathname.replace(/^\//, "") || "login";
      if (allowed.includes(p)) {
        // prevent showing dashboard when not authenticated
        if (p === "dashboard" && !localStorage.getItem("token")) {
          setView("login");
        } else {
          setView(p);
        }
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [token]);

  const navigate = (path) => {
    const route = path.replace("/", "");
    const allowed = ["login", "register", "dashboard"];
    if (!allowed.includes(route)) return;
    // update browser URL without reload and update internal state
    const url = route === "login" ? "/" : `/${route}`;
    try {
      window.history.pushState({}, "", url);
    } catch (e) {
      // fallback
      window.location.hash = `#${route}`;
    }
    setView(route);
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
      <AnimatePresence mode="wait" initial={false}>
        {token && view === "dashboard" ? (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
          >
            <Dashboard token={token} setToken={setToken} navigate={navigate} />
          </motion.div>
        ) : (
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28 }}
            className="flex min-h-screen items-center justify-center py-12 px-4"
          >
            <div className="w-full">
              {view === "register" ? (
                <Register navigate={navigate} />
              ) : (
                <Login setToken={setToken} navigate={navigate} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;