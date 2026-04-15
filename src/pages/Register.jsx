import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API_URL from "../config";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (response.ok) {
        alert("✅ Registro exitoso. Ahora puedes iniciar sesión.");
        navigate("/login"); // 👈 Te manda al login
      } else {
        const errorData = await response.json();
        alert("❌ Error en registro: " + errorData.detail);
      }
    } catch (error) {
      console.error("Error:", error);
      //alert("⚠️ Error al conectar con el servidor");
      alert("⚠️ Error en registro: Correo ya usado por otro usuario.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-green-100 to-green-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Registrarse
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Elige un usuario"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Crea una contraseña"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-300"
              placeholder="Tu correo electrónico"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-green-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Inicia sesión
          </Link>
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold hover:bg-gray-300 transition duration-300"
        >
          ← Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default Register;
