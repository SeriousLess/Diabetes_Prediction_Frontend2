import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getFactorMessages } from "../utils/factores";

import { Stage, Layer, Circle, Line, Text, Rect } from "react-konva";

import API_URL from "../config";

const campos = {
  RIDAGEYR: "Edad (años)",
  RIAGENDR: "Sexo (1 = Hombre, 2 = Mujer)",
  BMXBMI: "Índice de Masa Corporal",
  BMXWAIST: "Circunferencia de cintura (cm)",
  MCQ300C: "Historia familiar de diabetes (1 = Sí, 2 = No)",
  PAQ605: "Actividad física (1 = Regular, 2 = Ocasional)",
  SMQ020: "Fumador (1 = Sí, 2 = No)",
  DMDEDUC2: "Nivel educativo (1-5)",
  INDHHIN2: "Ingreso familiar (1-5)",
  SLD010H: "Horas de sueño",
  HSD010: "Salud general (1 = Excelente, 5 = Mala)",
};

export default function Formulario() {
  const { user, token } = useContext(AuthContext); // 👈 ahora tenemos el usuario logeado
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      const parsed = JSON.parse(saved);
      // eliminamos campos que no son del formulario (id, fecha, probabilidad, etc.)
      const clean = Object.fromEntries(
        Object.keys(campos).map((k) => [k, parsed[k] ?? ""])
      );
      localStorage.removeItem("formData"); // limpiar después de usar
      return clean;
    }
    return Object.fromEntries(Object.keys(campos).map((k) => [k, ""]));
  });
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [factores, setFactores] = useState([]);

  // Estado para guardar los datos
  const [scatterData, setScatterData] = useState([]);

  // Fetch desde public/pca_coords.json
  useEffect(() => {
    fetch("/pca_coords.json")
      .then((res) => res.json())
      .then((data) => setScatterData(data))
      .catch((err) => console.error("Error cargando JSON:", err));
  }, []);

  // Colores para clusters
  const clusterColors = {
    0: "red", // peor salud
    1: "green", // mejor salud
  };

  const width = 700; // 👈 más ancho
  const height = 400;
  const margin = 50;

  // valores de scatter + el punto del usuario si existe
  const allX = [
    ...scatterData.map((d) => d.x),
    ...(resultado?.no_supervisado?.pca_coords
      ? [resultado.no_supervisado.pca_coords.x]
      : []),
  ];
  const allY = [
    ...scatterData.map((d) => d.y),
    ...(resultado?.no_supervisado?.pca_coords
      ? [resultado.no_supervisado.pca_coords.y]
      : []),
  ];

  const rawXMin = Math.min(...allX);
  const rawXMax = Math.max(...allX);
  const rawYMin = Math.min(...allY);
  const rawYMax = Math.max(...allY);

  // añadimos 10% de aire
  const xRange = rawXMax - rawXMin;
  const yRange = rawYMax - rawYMin;

  const xMin = rawXMin - xRange * 0.05;
  const xMax = rawXMax + xRange * 0.05;
  const yMin = rawYMin - yRange * 0.05;
  const yMax = rawYMax + yRange * 0.05;

  const scaleX = (x) =>
    margin + ((x - xMin) / (xMax - xMin)) * (width - 2 * margin);
  const scaleY = (y) =>
    height - margin - ((y - yMin) / (yMax - yMin)) * (height - 2 * margin);

  const getRiskLevel = (prob) => {
    if (prob >= 0.66) return "alto";
    if (prob >= 0.33) return "medio";
    return "bajo";
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResultado(null);

    try {
      // Asegurar que token no es undefined
      //const response = await fetch("http://127.0.0.1:8000/prediccion/", {
      const response = await fetch(`${API_URL}/prediccion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "", // 👈 fuerza header vacío si no hay token
        },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [k, Number(v)])
          )
        ),
      });

      if (!response.ok) throw new Error("Error en la solicitud");
      const data = await response.json();
      setResultado(data);

      // Generar explicaciones SOLO en frontend (reglas)
      const mensajes = getFactorMessages(
        Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [k, Number(v)])
        ),
        { limit: 12 }
      );
      setFactores(mensajes);
    } catch (error) {
      console.error(error);
      alert("Error en la predicción.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">
            Predicción Diabetes Tipo 2
          </h1>
          {user && (
            <Link
              to="/historial"
              className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base ml-4"
            >
              Ver Historial
            </Link>
          )}
          <Link
            to="/"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
          >
            ← Volver al Inicio
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Form Section - Más compacto */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
            {user && (
              <p className="text-right text-gray-600 mb-2">
                Sesión iniciada como:{" "}
                <span className="font-semibold text-blue-700">
                  {user.username}
                </span>
              </p>
            )}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Ingresa tus datos
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(campos).map(([key, label]) => (
                  <div key={key} className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">
                      {label.split("(")[0].trim()}
                      {label.includes("(") && (
                        <span className="text-xs text-gray-500 block">
                          {label.match(/\(([^)]+)\)/)[1]}
                        </span>
                      )}
                    </label>
                    <input
                      type="number"
                      name={key}
                      value={formData[key]}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                      min="0"
                    />
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition ${
                    isLoading
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:shadow-md"
                  }`}
                >
                  {isLoading ? "Calculando..." : "Evaluar Riesgo"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Result Section - Al lado derecho en desktop, debajo en móvil */}
        <div className="w-full lg:w-1/2">
          {resultado ? (
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Resultado
              </h2>

              {/* 👇 en lugar del bloque anterior */}
              {resultado &&
                (() => {
                  const nivel = getRiskLevel(
                    resultado.supervisado.probabilidad
                  );
                  return (
                    <div
                      className={`p-6 rounded-lg mb-6 ${
                        nivel === "alto"
                          ? "bg-red-50 border-l-4 border-red-500"
                          : nivel === "medio"
                          ? "bg-yellow-50 border-l-4 border-yellow-500"
                          : "bg-green-50 border-l-4 border-green-500"
                      }`}
                    >
                      <div className="flex items-center justify-center space-x-4">
                        <div
                          className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                            nivel === "alto"
                              ? "bg-red-100"
                              : nivel === "medio"
                              ? "bg-yellow-100"
                              : "bg-green-100"
                          }`}
                        >
                          <span
                            className={`text-2xl font-bold ${
                              nivel === "alto"
                                ? "text-red-600"
                                : nivel === "medio"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {nivel === "alto"
                              ? "!"
                              : nivel === "medio"
                              ? "⚠"
                              : "✓"}
                          </span>
                        </div>
                        <div>
                          <h3
                            className={`text-xl font-bold ${
                              nivel === "alto"
                                ? "text-red-600"
                                : nivel === "medio"
                                ? "text-yellow-600"
                                : "text-green-600"
                            }`}
                          >
                            {nivel === "alto"
                              ? "Riesgo Alto de Diabetes"
                              : nivel === "medio"
                              ? "Riesgo Intermedio"
                              : "Sin Riesgo"}
                          </h3>
                          <p className="text-gray-600">
                            Probabilidad:{" "}
                            <span className="font-bold">
                              {(
                                resultado.supervisado.probabilidad * 100
                              ).toFixed(2)}
                              %
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

              {/* 🔎 Factores que influyen (reglas basadas en SHAP global) */}
              {factores.length > 0 && (
                <div className="mt-4 p-5 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                    Factores que influyen en tu riesgo
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-yellow-900">
                    {factores.map((f, i) => (
                      <li key={i}>{f.msg}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-yellow-800/80">
                    Nota: Estas son reglas simples basadas en tu entrada y la
                    importancia global del modelo. No reemplazan la evaluación
                    clínica.
                  </p>
                </div>
              )}

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    setResultado(null);
                    setFactores([]);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Realizar otra evaluación
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <svg
                  className="w-16 h-16 mx-auto text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  ></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Esperando datos
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Completa el formulario para evaluar tu riesgo de diabetes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 👇 Aquí agregamos el gráfico */}
      {resultado ? (
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-bold text-center mb-4">
            Resultados del Análisis de Grupos
          </h3>
          <div className="flex flex-col md:flex-row items-center md:items-start justify-center gap-6">
            <Stage width={width} height={height + 30}>
              <Layer>
                {/* Ejes X e Y */}
                <Line
                  points={[
                    margin,
                    height - margin,
                    width - margin,
                    height - margin,
                  ]}
                  stroke="black"
                  strokeWidth={2}
                />
                <Line
                  points={[margin, margin, margin, height - margin]}
                  stroke="black"
                  strokeWidth={2}
                />

                {/* Ticks y labels X personalizados */}
                {[
                  { value: xMin, label: "Bajo riesgo" },
                  { value: xMax, label: "Alto riesgo" },
                ].map((tick, i) => {
                  const x = scaleX(tick.value);
                  return [
                    <Line
                      key={`x-tick-${i}`}
                      points={[x, height - margin, x, height - margin + 5]}
                      stroke="black"
                    />,
                    <Text
                      key={`x-label-${i}`}
                      x={i === 0 ? x - 30 : x - 30} // ajuste distinto para Bajo y Alto
                      y={height - margin + 15}
                      text={tick.label}
                      fontSize={12}
                    />,
                  ];
                })}

                {/* Ticks Y sin labels */}
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                  const y = scaleY(yMin + v * (yMax - yMin));
                  return (
                    <Line
                      key={`y-tick-${i}`}
                      points={[margin - 5, y, margin, y]}
                      stroke="black"
                    />
                  );
                })}

                {/* Grid vertical */}
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                  const x = scaleX(xMin + v * (xMax - xMin));
                  return (
                    <Line
                      key={`grid-x-${i}`}
                      points={[x, margin, x, height - margin]}
                      stroke="lightgray"
                      strokeWidth={1}
                    />
                  );
                })}

                {/* Grid horizontal */}
                {[0, 0.25, 0.5, 0.75, 1].map((v, i) => {
                  const y = scaleY(yMin + v * (yMax - yMin));
                  return (
                    <Line
                      key={`grid-y-${i}`}
                      points={[margin, y, width - margin, y]}
                      stroke="lightgray"
                      strokeWidth={1}
                    />
                  );
                })}

                {/* Puntos */}
                {scatterData.map((point, i) => (
                  <Circle
                    key={i}
                    x={scaleX(point.x)}
                    y={scaleY(point.y)}
                    radius={4}
                    fill={clusterColors[point.cluster] || "gray"}
                    opacity={0.7}
                  />
                ))}
                {/* 🔴 Punto del usuario (modelo NS) */}
                {resultado?.no_supervisado?.pca_coords && (
                  <Circle
                    x={scaleX(resultado.no_supervisado.pca_coords.x)}
                    y={scaleY(resultado.no_supervisado.pca_coords.y)}
                    radius={8} // más grande
                    fill="blue" // azul para diferenciar
                    stroke="black" // borde negro
                    strokeWidth={2}
                  />
                )}
              </Layer>

              {/* 🔹 Leyenda movida abajo del eje X */}
              <Layer>
                {/* Fondo de la leyenda */}
                <Rect
                  x={margin + 40}
                  y={height - margin + 35} // debajo del eje X
                  width={500}
                  height={40}
                  fill="white"
                  stroke="black"
                  cornerRadius={10}
                  shadowBlur={5}
                />

                {/* Grupo de menor riesgo */}
                <Circle
                  x={margin + 60}
                  y={height - margin + 55}
                  radius={6}
                  fill="green"
                />
                <Text
                  x={margin + 70}
                  y={height - margin + 50}
                  text="Grupo de menor riesgo"
                  fontSize={14}
                  fill="black"
                />

                {/* Grupo de mayor riesgo */}
                <Circle
                  x={margin + 235}
                  y={height - margin + 55}
                  radius={6}
                  fill="red"
                />
                <Text
                  x={margin + 245}
                  y={height - margin + 50}
                  text="Grupo de mayor riesgo"
                  fontSize={14}
                  fill="black"
                />

                {/* Tu evaluación */}
                <Circle
                  x={margin + 410}
                  y={height - margin + 55}
                  radius={6}
                  fill="blue"
                  stroke="black"
                />
                <Text
                  x={margin + 420}
                  y={height - margin + 50}
                  text="Tu evaluación"
                  fontSize={14}
                  fill="black"
                />
              </Layer>
            </Stage>

            {/* 📖 Descripción */}
            <div className="w-64 p-5 bg-gray-50 border rounded-xl shadow-md text-sm">
              <h2 className="text-lg font-semibold mb-2">Interpretación</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>Cada punto representa un grupo de personas similares.</li>
                <li>🔴 = Mayor riesgo de diabetes.</li>
                <li>🟢 = Menor riesgo de diabetes.</li>
                <li>🔵 = Tu resultado.</li>
              </ul>
              <p className="mt-3 text-gray-700">
                Si tu punto azul se acerca a los rojos → tu perfil se parece al
                de quienes tienen mayor riesgo. Si está cerca de los verdes → tu
                perfil es más parecido al de menor riesgo.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {/* Footer simplificado */}
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
