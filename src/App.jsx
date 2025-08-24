import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";
import Login from "./pages/Login";
import Historial from "./pages/Historial";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
        <Route path="/login" element={<Login />} />
        <Route path="/historial" element={<Historial />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;