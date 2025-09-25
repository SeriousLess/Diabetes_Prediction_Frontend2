import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";
import Login from "./pages/Login";
import Historial from "./pages/Historial";
import Register from "./pages/Register";
import Ayuda from "./pages/Ayuda";
import EditarPerfil from "./pages/EditarPerfil";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/register" element={<Register />} />
        <Route path="/ayuda" element={<Ayuda />} />
        <Route path="/editar-perfil" element={<EditarPerfil />} />
        
      </Routes>
    </Router>
  );
}

export default App;