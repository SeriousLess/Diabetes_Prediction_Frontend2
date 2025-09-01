import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

import API_URL from "../config";

const opcionesCampos = {
  RIAGENDR: [
    { label: "Hombre", value: 1 },
    { label: "Mujer", value: 2 },
  ],
  MCQ300C: [
    { label: "Sí", value: 1 },
    { label: "No", value: 2 },
  ],
  PAQ605: [
    { label: "Regular", value: 1 },
    { label: "Ocasional", value: 2 },
  ],
  SMQ020: [
    { label: "Sí", value: 1 },
    { label: "No", value: 2 },
  ],
  DMDEDUC2: [
    { label: "Primaria incompleta", value: 1 },
    { label: "Primaria completa / Secundaria incompleta", value: 2 },
    { label: "Secundaria completa", value: 3 },
    { label: "Superior técnico o universitario incompleto", value: 4 },
    { label: "Universitario completo o más", value: 5 },
  ],
  INDHHIN2: [
    { label: "Muy bajo (≤ S/1,000)", value: 1 },
    { label: "Bajo (S/1,001 – S/2,000)", value: 2 },
    { label: "Medio (S/2,001 – S/4,000)", value: 3 },
    { label: "Alto (S/4,001 – S/8,000)", value: 4 },
    { label: "Muy alto (≥ S/8,001)", value: 5 },
  ],
  HSD010: [
    { label: "Excelente", value: 1 },
    { label: "Muy buena", value: 2 },
    { label: "Buena", value: 3 },
    { label: "Regular", value: 4 },
    { label: "Mala", value: 5 },
  ],
};

// Función para obtener el label de un valor numérico
function getLabel(campo, valor) {
  const opciones = opcionesCampos[campo];
  if (!opciones) return valor;
  const op = opciones.find((o) => Number(o.value) === Number(valor));
  return op ? op.label : valor;
}

export default function Historial() {
  const { user, token } = useContext(AuthContext);
  const [registros, setRegistros] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const getRiskLevel = (prob) => {
    if (prob >= 0.66) return "Riesgo de diabetes";
    if (prob >= 0.33) return "Riesgo moderado";
    return "Bajo riesgo";
  };

  const handleRepeat = (registro) => {
    // Guardamos los valores en localStorage
    localStorage.setItem("formData", JSON.stringify(registro));
    // Redirigimos al formulario
    navigate("/formulario");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este registro?")) return;

    try {
      const response = await fetch(`${API_URL}/prediccion/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar el registro");

      // Actualizar lista en frontend
      setRegistros(registros.filter((r) => r.id !== id));
    } catch (error) {
      console.error(error);
      alert("No se pudo eliminar el registro.");
    }
  };

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const response = await fetch(`${API_URL}/prediccion/historial`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error("Error al obtener historial");
        const data = await response.json();
        setRegistros(data);
      } catch (error) {
        console.error(error);
        alert("No se pudo cargar el historial.");
      } finally {
        setIsLoading(false);
      }
    };

    if (token) {
      fetchHistorial();
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">
            Historial de Predicciones
          </h1>
          <Link
            to="/formulario"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
          >
            ← Volver al Formulario
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {user && (
          <p className="text-right text-gray-600 mb-6">
            Sesión iniciada como:{" "}
            <span className="font-semibold text-blue-700">{user.username}</span>
          </p>
        )}

        {isLoading ? (
          <p className="text-center text-gray-500">Cargando historial...</p>
        ) : registros.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              No tienes registros aún
            </h2>
            <p className="text-gray-500 mt-2">
              Realiza tu primera predicción en el formulario.
            </p>
            <Link
              to="/formulario"
              className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow"
            >
              Ir al Formulario
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {registros.map((reg, index) => (
              <div
                key={index}
                className={(() => {
                  const nivel = getRiskLevel(reg.probabilidad);
                  return `rounded-xl shadow-md p-6 ${
                    nivel === "Riesgo de diabetes"
                      ? "bg-red-50 border-l-4 border-red-500"
                      : nivel === "Riesgo moderado"
                      ? "bg-yellow-50 border-l-4 border-yellow-500"
                      : "bg-green-50 border-l-4 border-green-500"
                  }`;
                })()}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3
                      className={(() => {
                        const nivel = getRiskLevel(reg.probabilidad);
                        return `text-lg font-bold ${
                          nivel === "Riesgo de diabetes"
                            ? "text-red-700"
                            : nivel === "Riesgo moderado"
                            ? "text-yellow-700"
                            : "text-green-700"
                        }`;
                      })()}
                    >
                      {getRiskLevel(reg.probabilidad)}
                    </h3>
                    <p className="text-gray-600">
                      Probabilidad:{" "}
                      <span className="font-bold">
                        {(reg.probabilidad * 100).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <p className="text-sm text-gray-500">
                      {new Date(reg.fecha).toLocaleString()}
                    </p>
                    <button
                      onClick={() => handleRepeat(reg)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      🔄 Repetir
                    </button>

                    <button
                      onClick={() => handleDelete(reg.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>

                {/* Datos del paciente */}
                <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-gray-700">
                  <p>
                    <span className="font-semibold">Edad:</span> {reg.RIDAGEYR}
                  </p>
                  <p>
                    <span className="font-semibold">Sexo:</span>{" "}
                    {getLabel("RIAGENDR", reg.RIAGENDR)}
                  </p>
                  <p>
                    <span className="font-semibold">IMC:</span> {reg.BMXBMI}
                  </p>
                  <p>
                    <span className="font-semibold">Cintura:</span>{" "}
                    {reg.BMXWAIST} cm
                  </p>
                  <p>
                    <span className="font-semibold">Hist. Familiar:</span>{" "}
                    {getLabel("MCQ300C", reg.MCQ300C)}
                  </p>
                  <p>
                    <span className="font-semibold">Actividad:</span>{" "}
                    {getLabel("PAQ605", reg.PAQ605)}
                  </p>
                  <p>
                    <span className="font-semibold">Fumador:</span>{" "}
                    {getLabel("SMQ020", reg.SMQ020)}
                  </p>
                  <p>
                    <span className="font-semibold">Educación:</span>{" "}
                    {getLabel("DMDEDUC2", reg.DMDEDUC2)}
                  </p>
                  <p>
                    <span className="font-semibold">Ingreso:</span>{" "}
                    {getLabel("INDHHIN2", reg.INDHHIN2)}
                  </p>
                  <p>
                    <span className="font-semibold">Horas sueño:</span>{" "}
                    {reg.SLD010H}
                  </p>
                  <p>
                    <span className="font-semibold">Salud:</span>{" "}
                    {getLabel("HSD010", reg.HSD010)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

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
