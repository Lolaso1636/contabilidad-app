import { useEffect, useState } from "react";
import Login from "../pages/Login.jsx";

export default function AuthGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuth(false);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:3001/api/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token inválido");

        const data = await res.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        setIsAuth(true);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setIsAuth(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) return null;

  if (!isAuth) return <Login onLogin={() => setIsAuth(true)} />;

  return children;
}
