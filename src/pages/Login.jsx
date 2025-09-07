import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

import ReCAPTCHA from "react-google-recaptcha"; // 👈 Importar librería

import API_URL from "../config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null); // 👈 estado captcha
  const [loading, setLoading] = useState(false); // 👈 estado de carga
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 👈 empieza la carga

    if (!captchaToken) {
      alert("Por favor completa el reCAPTCHA ⚠");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          token: captchaToken, // 👈 ahora sí lo mandamos
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("✅ Token recibido:", data.access_token);

        // Guardar token en localStorage
        login(data.access_token, username); // 👈 Guardamos token y usuario en contexto

        alert("Login exitoso ✅");
        navigate("/formulario"); // 👈 Igual seguimos redirigiendo
      } else {
        const errorData = await response.json();
        alert("❌ Error en login: " + errorData.detail);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("⚠️ Error al conectar con el servidor");
    } finally {
      setLoading(false); // 👈 termina la carga siempre
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 to-blue-200">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Iniciar Sesión
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ingresa tu usuario"
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
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="Ingresa tu contraseña"
              required
            />
          </div>

          {/* 👇 Aquí el reCAPTCHA */}
          <ReCAPTCHA
            sitekey="6Ldt4MArAAAAAN7cAWahNmxNL4jCOJcttAx--cNz" // 👉 pon la tuya de Google
            onChange={(token) => setCaptchaToken(token)}
          />

          <button
            type="submit"
            disabled={loading} // Deshabilita mientras carga
            className={`w-full py-3 rounded-lg font-semibold transition duration-300 
    ${
      loading
        ? "bg-blue-400 text-white cursor-not-allowed"
        : "bg-blue-600 text-white hover:bg-blue-700"
    }`}
          >
            {loading ? "Cargando..." : "Entrar"}
          </button>
        </form>
        <p className="mt-6 text-center text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Regístrate
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

export default Login;
