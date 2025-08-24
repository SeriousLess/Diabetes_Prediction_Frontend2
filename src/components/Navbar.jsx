import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-800">Diabetes Predictor</h1>

      <div className="space-x-4 flex items-center">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/formulario" className="hover:text-blue-600">Formulario</Link>
        {user ? (
          <>
            <Link to="/historial" className="hover:text-blue-600">Historial</Link>
            <span className="text-gray-600">
              Sesión: <strong>{user.username}</strong>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login" className="hover:text-blue-600">Login</Link>
        )}
      </div>
    </nav>
  );
}