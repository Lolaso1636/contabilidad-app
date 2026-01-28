import { useState } from "react";
import { BadgeDollarSign, UserPlus, LogIn } from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const endpoint = isRegister
        ? "http://localhost:3001/api/auth/register"
        : "http://localhost:3001/api/auth/login";

      const body = isRegister
        ? { name, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Error al procesar la solicitud");
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      onLogin();
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-8">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-green-500/10 p-3 rounded-full mb-3">
            <BadgeDollarSign className="w-8 h-8 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">
            {isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </h2>
          <p className="text-gray-400 text-sm mt-1">
            {isRegister
              ? "Regístrate para comenzar a usar tu sistema contable"
              : "Accede a tu sistema contable"}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-sm text-gray-400">Nombre</label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm text-gray-400">Correo electrónico</label>
            <input
              type="email"
              placeholder="correo@ejemplo.com"
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Contraseña</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-lg font-medium transition flex items-center justify-center gap-2"
          >
            {isRegister ? (
              <>
                <UserPlus className="w-5 h-5" />
                Crear cuenta
              </>
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                Entrar
              </>
            )}
          </button>
        </form>

        {/* Toggle */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {isRegister ? "¿Ya tienes cuenta?" : "¿No tienes cuenta?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-green-400 hover:text-green-500 font-medium"
          >
            {isRegister ? "Inicia sesión" : "Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
}
