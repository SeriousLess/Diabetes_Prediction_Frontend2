import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { updateUserProfile } from "../services/userApi";
import { Link } from "react-router-dom";

export default function EditarPerfil() {
  const { user, setUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateUserProfile(formData);

      if (response && response.id) {
        setUser(response);
        setMessage("Perfil actualizado ✅");
      }
    } catch (err) {
      console.error("Error al actualizar perfil:", err.response || err);
      // mostramos mensaje del backend si existe
      if (err.response && err.response.data && err.response.data.detail) {
        setMessage(`Error: ${err.response.data.detail}`);
      } else {
        setMessage("Error al actualizar ❌");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">
            Plataforma de predicción diabetes tipo 2
          </h1>
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* Contenido principal */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            Editar Perfil
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Nombre de usuario (Nuevo)
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Correo electrónico (Nuevo)
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300"
            >
              Guardar cambios
            </button>
          </form>

          {message && (
            <p className="mt-6 text-center font-medium text-gray-700">
              {message}
            </p>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Plataforma de predicción diabetes tipo
            2
          </p>
        </div>
      </footer>
    </div>
  );
}