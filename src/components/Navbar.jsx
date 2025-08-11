import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">PrediDiabetes</h1>
      <div className="flex gap-6">
        <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
        <Link to="/formulario" className="text-gray-700 hover:text-blue-600 transition">Formulario</Link>
      </div>
    </nav>
  );
}