import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "src/components/Navbar.jsx";
import Home from "./pages/Home";
import Formulario from "./pages/Formulario";

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/formulario" element={<Formulario />} />
      </Routes>
    </Router>
  );
}