import { useEffect, useState } from "react";
import Login from "../pages/Login";

export default function AuthGate({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuth(!!token);
    setLoading(false);
  }, []);

  if (loading) return null;

  if (!isAuth) return <Login onLogin={() => setIsAuth(true)} />;

  return children;
}
