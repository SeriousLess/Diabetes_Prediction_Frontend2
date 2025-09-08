import { useEffect, useState, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { getFactorMessages } from "../utils/factores";
import { Stage, Layer, Circle, Line, Text, Rect } from "react-konva";
import API_URL from "../config";
import jsPDF from "jspdf";

const campos = {
  RIDAGEYR: "Edad (años)",
  RIAGENDR: "Sexo (1 = Hombre, 2 = Mujer)",
  BMXBMI: "Índice de Masa Corporal",
  BMXWAIST: "Circunferencia de cintura (cm)",
  MCQ300C: "Historia familiar de diabetes (1 = Sí, 2 = No)",
  PAQ605: "Actividad física (1 = Varias veces por semana, 2 = Solo a veces)",
  SMQ020: "Fumador (1 = Sí, 2 = No)",
  DMDEDUC2: "Nivel educativo (1-5)",
  INDHHIN2: "Ingreso familiar anual (1-12)",
  SLD010H: "Horas de sueño",
  HSD010: "Salud general autopercibida (1 = Excelente, 5 = Mala)",
};

const recomendacionesPorVariable = {
  BMXBMI: (valor) =>
    valor >= 25
      ? "Tu IMC está por encima del rango saludable (>=25). Mantener un peso adecuado mediante una alimentación balanceada y actividad física regular puede reducir significativamente el riesgo de diabetes tipo 2. Consulta con un nutricionista para un plan personalizado."
      : "Tu IMC está en el rango saludable. Continúa con tus buenos hábitos para mantener tu peso ideal.",
  BMXWAIST: (valor, form) => {
    const sexo = Number(form?.RIAGENDR);
    if (sexo === 1 && valor > 94)
      return "Una circunferencia de cintura elevada en hombres (>94 cm) se asocia con mayor riesgo de diabetes y enfermedades cardiovasculares. Intenta reducirla con ejercicio aeróbico y una dieta baja en azúcares y grasas saturadas.";
    if (sexo === 2 && valor > 80)
      return "Una circunferencia de cintura elevada en mujeres (>80 cm) se asocia con mayor riesgo de diabetes y enfermedades cardiovasculares. Intenta reducirla con ejercicio aeróbico y una dieta baja en azúcares y grasas saturadas.";
    if (!sexo && valor >= 90)
      return "Una circunferencia de cintura elevada se asocia con mayor riesgo de diabetes y enfermedades cardiovasculares. Intenta reducirla con ejercicio aeróbico y una dieta baja en azúcares y grasas saturadas.";
    return "Tu circunferencia de cintura es adecuada. Mantén hábitos saludables para conservar este resultado.";
  },
  MCQ300C: (valor) =>
    valor === 1
      ? "Tener antecedentes familiares de diabetes aumenta tu riesgo. Realiza chequeos médicos periódicos y mantén estilos de vida saludables para detectar y prevenir a tiempo."
      : "No tienes antecedentes familiares de diabetes, lo cual disminuye tu riesgo. Aun así, mantén hábitos saludables.",
  PAQ605: (valor) =>
    valor === 2
      ? "La actividad física varias veces por semana ayuda a controlar el peso y la glucosa en sangre. Intenta realizar al menos 150 minutos de ejercicio moderado a la semana, como caminar, nadar o andar en bicicleta."
      : "Tu nivel de actividad física es adecuado. Sigue así para mantener tu salud.",
  SMQ020: (valor) =>
    valor === 1
      ? "Fumar incrementa el riesgo de diabetes y otras enfermedades graves. Considera buscar apoyo profesional para dejar de fumar y mejorar tu salud general."
      : "No fumas, lo cual es excelente para tu salud. Mantén este buen hábito.",
  SLD010H: (valor) =>
    valor < 7
      ? "Dormir menos de 7 horas por noche puede afectar el metabolismo y aumentar el riesgo de diabetes. Intenta mejorar tu higiene del sueño y establecer horarios regulares para descansar mejor."
      : valor > 9
      ? "Dormir más de 9 horas también puede asociarse a mayor riesgo de diabetes. Procura mantener un rango de 7 a 8 horas por noche."
      : "Tus horas de sueño son adecuadas. Dormir bien ayuda a mantener un metabolismo saludable.",
  HSD010: (valor) =>
    valor >= 4
      ? "Tu salud general podría mejorar. Adopta una dieta equilibrada, haz ejercicio regularmente y realiza chequeos médicos para prevenir enfermedades."
      : "Tu salud general es buena. Continúa cuidándote para mantener este estado.",
};

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
    { label: "Varias veces por semana", value: 1 },
    { label: "Solo a veces", value: 2 },
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
    { label: "Menos de S/ 25,000 al año", value: 1 },
    { label: "S/ 25,000 - 35,000 al año", value: 2 },
    { label: "S/ 35,000 - 45,000 al año", value: 3 },
    { label: "S/ 45,000 - 55,000 al año", value: 4 },
    { label: "S/ 55,000 - 65,000 al año", value: 5 },
    { label: "S/ 65,000 - 75,000 al año", value: 6 },
    { label: "S/ 75,000 - 85,000 al año", value: 7 },
    { label: "S/ 85,000 - 100,000 al año", value: 8 },
    { label: "S/ 100,000 - 120,000 al año", value: 9 },
    { label: "S/ 120,000 - 140,000 al año", value: 10 },
    { label: "S/ 140,000 - 160,000 al año", value: 11 },
    { label: "Más de S/ 160,000 al año", value: 12 },
  ],
  HSD010: [
    { label: "Excelente", value: 1 },
    { label: "Muy buena", value: 2 },
    { label: "Buena", value: 3 },
    { label: "Regular", value: 4 },
    { label: "Mala", value: 5 },
  ],
};

const getLabel = (campo, valor) => {
  const opciones = opcionesCampos[campo];
  if (!opciones) return valor;
  const op = opciones.find((o) => Number(o.value) === Number(valor));
  return op ? op.label : valor;
};

const getRiskLevel = (prob) => {
  if (prob >= 0.66) return "alto";
  if (prob >= 0.33) return "medio";
  return "bajo";
};

export default function Formulario() {
  const { user, token } = useContext(AuthContext);
  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem("formData");
    if (saved) {
      const parsed = JSON.parse(saved);
      const clean = Object.fromEntries(
        Object.keys(campos).map((k) => [k, parsed[k] ?? ""])
      );
      localStorage.removeItem("formData");
      return clean;
    }
    return Object.fromEntries(Object.keys(campos).map((k) => [k, ""]));
  });
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [factores, setFactores] = useState([]);
  const [recomendacionesMostradas, setRecomendacionesMostradas] = useState([]);
  const [scatterData, setScatterData] = useState([]);

  // Referencia para el Stage de Konva
  const stageRef = useRef(null);

  useEffect(() => {
    fetch("/pca_coords.json")
      .then((res) => res.json())
      .then((data) => setScatterData(data))
      .catch((err) => console.error("Error cargando JSON:", err));
  }, []);

  const clusterColors = {
    0: "red",
    1: "green",
  };

  const margin = 50;

  const [chartSize, setChartSize] = useState({
    width: 700,
    height: 400,
    legendWidth: 500,
    legendX: 40,
    legendTextWidth: 420,
  });

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 600) {
        setChartSize({
          width: 320,
          height: 220,
          legendWidth: 220,
          legendX: 10,
          legendTextWidth: 120,
        });
      } else {
        setChartSize({
          width: 700,
          height: 400,
          legendWidth: 500,
          legendX: 40,
          legendTextWidth: 420,
        });
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const xRange = rawXMax - rawXMin;
  const yRange = rawYMax - rawYMin;

  const xMin = rawXMin - xRange * 0.05;
  const xMax = rawXMax + xRange * 0.05;
  const yMin = rawYMin - yRange * 0.05;
  const yMax = rawYMax + yRange * 0.05;

  const scaleX = (x) =>
    margin + ((x - xMin) / (xMax - xMin)) * (chartSize.width - 2 * margin);
  const scaleY = (y) =>
    chartSize.height -
    margin -
    ((y - yMin) / (yMax - yMin)) * (chartSize.height - 2 * margin);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleDescargarPDF = async () => {
    if (!resultado) return;
    const doc = new jsPDF();
    let y = 20;
    const pageHeight = doc.internal.pageSize.getHeight();

    // Encabezado principal con fondo degradado azul
    doc.setFillColor(36, 123, 160); // azul moderno
    doc.rect(0, 0, 210, 18, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.text("Resultado de tu evaluación de riesgo", 105, 12, {
      align: "center",
    });

    // --- Nivel de riesgo ---
    y = 25;
    let nivel = getRiskLevel(resultado.supervisado.probabilidad);
    let colorNivel =
      nivel === "alto"
        ? [230, 57, 70] // rojo moderno
        : nivel === "medio"
        ? [255, 183, 3] // amarillo moderno
        : [67, 170, 139]; // verde moderno
    let colorBordeNivel =
      nivel === "alto"
        ? [230, 57, 70]
        : nivel === "medio"
        ? [255, 183, 3]
        : [67, 170, 139];
    let colorFondoNivel =
      nivel === "alto"
        ? [255, 236, 236]
        : nivel === "medio"
        ? [255, 249, 224]
        : [236, 255, 245];

    const riesgoTitulo = "Nivel de riesgo";
    const riesgoValor =
      nivel === "alto" ? "Alto" : nivel === "medio" ? "Intermedio" : "Bajo";
    const riesgoPorcentaje = `Probabilidad: ${(
      resultado.supervisado.probabilidad * 100
    ).toFixed(2)}%`;

    const riesgoLines = [riesgoTitulo, riesgoValor, riesgoPorcentaje];
    const riesgoBoxHeight = 8 + riesgoLines.length * 7;
    if (y + riesgoBoxHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    doc.setFillColor(...colorFondoNivel);
    doc.setDrawColor(...colorBordeNivel);
    doc.setLineWidth(0.8);
    doc.roundedRect(10, y, 190, riesgoBoxHeight, 4, 4, "FD");

    let yRiesgo = y + 9;
    doc.setFontSize(15);
    doc.setTextColor(36, 123, 160);
    doc.text(riesgoTitulo, 15, yRiesgo);
    yRiesgo += 7;
    doc.setFontSize(13);
    doc.setTextColor(...colorNivel);
    doc.text(riesgoValor, 15, yRiesgo);
    yRiesgo += 7;
    doc.setFontSize(12);
    doc.setTextColor(36, 123, 160);
    doc.text(riesgoPorcentaje, 15, yRiesgo);

    y = y + riesgoBoxHeight + 4;

    // --- Resumen de datos ---
    const colorFondoResumen = [245, 247, 250];
    doc.setFillColor(...colorFondoResumen);
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);

    let datosLines = [];
    Object.entries(campos).forEach(([key, label]) => {
      const valor = formData[key];
      if (valor !== undefined && valor !== "") {
        datosLines.push(
          `${label.split("(")[0].trim()}: ${getLabel(key, valor)}`
        );
      }
    });
    const resumenTitulo = "Resumen de tus datos:";
    const resumenTituloLines = doc.splitTextToSize(resumenTitulo, 180);
    let resumenLines = [...resumenTituloLines];
    datosLines.forEach((line) => {
      const l = doc.splitTextToSize(line, 180);
      resumenLines = resumenLines.concat(l);
    });
    const datosHeight = 8 + resumenLines.length * 6 + 4;
    if (y + datosHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }
    doc.roundedRect(10, y, 190, datosHeight, 4, 4, "FD");
    doc.setTextColor(36, 123, 160);
    doc.setFontSize(13);
    doc.text(resumenTituloLines, 15, y + 7);
    let yDatos = y + 7 + resumenTituloLines.length * 6;
    doc.setFontSize(11);
    doc.setTextColor(44, 62, 80);
    datosLines.forEach((line) => {
      const l = doc.splitTextToSize(line, 180);
      doc.text(l, 17, yDatos);
      yDatos += l.length * 6;
    });
    y = y + datosHeight + 2;

    // --- Factores ---
    if (factores.length > 0) {
      const colorFondoFactores = [255, 248, 225];
      const colorBordeFactores = [255, 183, 3];
      doc.setFontSize(13);
      doc.setTextColor(255, 183, 3);
      const titulo = "Factores que influyen en tu riesgo:";
      const tituloLines = doc.splitTextToSize(titulo, 180);

      let lines = [...tituloLines];
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);

      factores.forEach((f) => {
        const fLines = doc.splitTextToSize(`- ${f.msg}`, 180);
        lines = lines.concat(fLines);
      });

      const boxHeight = 8 + lines.length * 6 + 4;
      if (y + boxHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(...colorFondoFactores);
      doc.setDrawColor(...colorBordeFactores);
      doc.setLineWidth(0.8);
      doc.roundedRect(10, y, 190, boxHeight, 4, 4, "FD");

      let yFact = y + 7;
      doc.setFontSize(13);
      doc.setTextColor(255, 183, 3);
      doc.text(tituloLines, 15, yFact);
      yFact += tituloLines.length * 6;
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      factores.forEach((f) => {
        const fLines = doc.splitTextToSize(`- ${f.msg}`, 180);
        doc.text(fLines, 17, yFact);
        yFact += fLines.length * 6;
      });
      y = y + boxHeight + 2;
    }

    // --- Recomendaciones ---
    if (recomendacionesMostradas.length > 0) {
      const colorFondoRec = [232, 246, 255];
      const colorBordeRec = [36, 123, 160];
      doc.setFontSize(13);
      doc.setTextColor(36, 123, 160);
      const titulo = "Recomendaciones personalizadas:";
      const tituloLines = doc.splitTextToSize(titulo, 180);

      let lines = [...tituloLines];
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);

      recomendacionesMostradas.forEach((rec) => {
        const recLines = doc.splitTextToSize(`- ${rec}`, 180);
        lines = lines.concat(recLines);
      });

      const boxHeight = 8 + lines.length * 6 + 4;
      if (y + boxHeight > pageHeight - 20) {
        doc.addPage();
        y = 20;
      }
      doc.setFillColor(...colorFondoRec);
      doc.setDrawColor(...colorBordeRec);
      doc.setLineWidth(0.8);
      doc.roundedRect(10, y, 190, boxHeight, 4, 4, "FD");

      let yRec = y + 7;
      doc.setFontSize(13);
      doc.setTextColor(36, 123, 160);
      doc.text(tituloLines, 15, yRec);
      yRec += tituloLines.length * 6;
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      recomendacionesMostradas.forEach((rec) => {
        const recLines = doc.splitTextToSize(`- ${rec}`, 180);
        doc.text(recLines, 17, yRec);
        yRec += recLines.length * 6;
      });
      y = y + boxHeight + 2;
    }

    // --- Nota final ---
    doc.setFontSize(10);
    doc.setTextColor(230, 57, 70);
    doc.text(
      "Este resultado es solo informativo. Consulta a un profesional de salud para una evaluación completa.",
      15,
      y + 6
    );

    // --- Gráfico ---
    if (stageRef.current) {
      const dataURL = stageRef.current.toDataURL({ pixelRatio: 2 });
      const imgProps = doc.getImageProperties(dataURL);
      const pdfWidth = 180;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addPage();

      // Encabezado gráfico profesional
      doc.setFillColor(36, 123, 160); // azul moderno
      doc.rect(0, 0, 210, 18, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.text("Gráfico de comparación con personas similares", 105, 12, {
        align: "center",
      });

      // Imagen del gráfico
      doc.addImage(dataURL, "PNG", 15, 25, pdfWidth, pdfHeight);

      let leyendaY = 30 + pdfHeight;

      // --- Interpretación del gráfico en un cuadro profesional ---
      let yInterpretacion = leyendaY;
      const colorFondoInterpretacion = [232, 246, 255];
      const colorBordeInterpretacion = [36, 123, 160];

      // Prepara el texto
      doc.setFontSize(13);
      doc.setTextColor(36, 123, 160);
      const interpretacionTitulo = "Interpretación del gráfico";
      const interpretacionTexto = [
        "Este gráfico compara tu perfil con el de otras personas, basándose principalmente en el IMC, cintura y edad.",
        "- Verde: Personas con menor riesgo de diabetes tipo 2",
        "- Rojo: Personas con mayor riesgo de diabetes tipo 2",
        "- Azul: Tú",
        "",
        "Si tu punto azul está más cerca de los rojos, tu perfil se parece al de quienes tienen más riesgo.",
        "Si está más cerca de los verdes, se parece al de menor riesgo.",
        "Este resultado es solo informativo. Puede no coincidir con el otro análisis del sistema, porque cada método mira la información de forma distinta. Para una evaluación completa consulta a un profesional de salud.",
      ];

      // Calcula la altura del cuadro
      let lines = [interpretacionTitulo];
      doc.setFontSize(11);
      interpretacionTexto.forEach((linea) => {
        const l = doc.splitTextToSize(linea, 180);
        lines = lines.concat(l);
      });
      const boxHeight = 8 + lines.length * 6 + 4;

      // Dibuja el cuadro
      doc.setFillColor(...colorFondoInterpretacion);
      doc.setDrawColor(...colorBordeInterpretacion);
      doc.setLineWidth(0.8);
      doc.roundedRect(10, yInterpretacion, 190, boxHeight, 4, 4, "FD");

      // Escribe el texto dentro del cuadro
      let yText = yInterpretacion + 7;
      doc.setFontSize(13);
      doc.setTextColor(36, 123, 160);
      doc.text(interpretacionTitulo, 15, yText);
      yText += 8;
      doc.setFontSize(11);
      doc.setTextColor(44, 62, 80);
      interpretacionTexto.forEach((linea) => {
        const l = doc.splitTextToSize(linea, 180);
        doc.text(l, 15, yText);
        yText += l.length * 6;
      });
    }

    doc.save("resultado-diabetes.pdf");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResultado(null);

    try {
      const response = await fetch(`${API_URL}/prediccion/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
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

      const mensajes = getFactorMessages(
        Object.fromEntries(
          Object.entries(formData).map(([k, v]) => [k, Number(v)])
        ),
        { limit: 12 }
      );
      setFactores(mensajes);

      // Calcular recomendaciones solo al evaluar riesgo
      const recomendaciones = Object.entries(recomendacionesPorVariable)
        .map(([key, fn]) => {
          const valor = Number(formData[key]);
          if (valor && !isNaN(valor)) {
            if (key === "BMXWAIST") return fn(valor, formData);
            return fn(valor);
          }
          return null;
        })
        .filter(Boolean);
      setRecomendacionesMostradas(recomendaciones);
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
        {/* Form Section */}
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
                    {opcionesCampos[key] ? (
                      <select
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Selecciona una opción</option>
                        {opcionesCampos[key].map((op) => (
                          <option key={op.value} value={op.value}>
                            {op.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="number"
                        name={key}
                        value={formData[key]}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                        min="0"
                        step={
                          key === "BMXBMI" || key === "BMXWAIST" ? "any" : "1"
                        }
                      />
                    )}
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

        {/* Result Section */}
        <div className="w-full lg:w-1/2">
          {resultado ? (
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                Resultado
              </h2>

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

              {recomendacionesMostradas.length > 0 && (
                <div className="mt-4 p-5 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-800 mb-2">
                    Recomendaciones personalizadas
                  </h3>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-blue-900">
                    {recomendacionesMostradas.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs text-blue-800/80">
                    Recuerda: Estas recomendaciones son generales y no
                    sustituyen el consejo de un profesional de salud.
                  </p>
                </div>
              )}

              {/* Botón para reiniciar */}
              <div className="mt-6 flex flex-col items-center gap-3">
                <button
                  onClick={() => {
                    setResultado(null);
                    setFactores([]);
                    setRecomendacionesMostradas([]);
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

      {/* Gráfico y leyenda */}
      {resultado ? (
        <>
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-bold text-center mb-4">
              Resultados del Análisis con Personas Similares
            </h3>
            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-12">
              <div className="w-full md:w-auto flex-shrink-0 flex-grow-0">
                <div className="w-full overflow-x-auto">
                  <Stage
                    ref={stageRef}
                    width={chartSize.width}
                    height={
                      chartSize.width < 400
                        ? chartSize.height + 80
                        : chartSize.height + 60
                    }
                  >
                    <Layer>
                      {/* Ejes X e Y */}
                      <Line
                        points={[
                          margin,
                          chartSize.height - margin,
                          chartSize.width - margin,
                          chartSize.height - margin,
                        ]}
                        stroke="black"
                        strokeWidth={2}
                      />
                      <Line
                        points={[
                          margin,
                          margin,
                          margin,
                          chartSize.height - margin,
                        ]}
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
                            points={[
                              x,
                              chartSize.height - margin,
                              x,
                              chartSize.height - margin + 5,
                            ]}
                            stroke="black"
                          />,
                          <Text
                            key={`x-label-${i}`}
                            x={i === 0 ? x - 30 : x - 30}
                            y={chartSize.height - margin + 15}
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
                            points={[x, margin, x, chartSize.height - margin]}
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
                            points={[margin, y, chartSize.width - margin, y]}
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
                          radius={8}
                          fill="blue"
                          stroke="black"
                          strokeWidth={2}
                        />
                      )}
                    </Layer>

                    {/* Leyenda: vertical en móvil, horizontal en desktop */}
                    {chartSize.width < 400 ? (
                      <Layer>
                        <Rect
                          x={margin}
                          y={chartSize.height - margin + 35}
                          width={chartSize.width - 2 * margin}
                          height={90}
                          fill="white"
                          stroke="black"
                          cornerRadius={10}
                          shadowBlur={5}
                        />
                        {/* Menor riesgo */}
                        <Circle
                          x={margin + 20}
                          y={chartSize.height - margin + 55}
                          radius={6}
                          fill="green"
                        />
                        <Text
                          x={margin + 40}
                          y={chartSize.height - margin + 48}
                          text="Menor riesgo"
                          fontSize={14}
                          fill="black"
                        />
                        {/* Mayor riesgo */}
                        <Circle
                          x={margin + 20}
                          y={chartSize.height - margin + 80}
                          radius={6}
                          fill="red"
                        />
                        <Text
                          x={margin + 40}
                          y={chartSize.height - margin + 73}
                          text="Mayor riesgo"
                          fontSize={14}
                          fill="black"
                        />
                        {/* Tú */}
                        <Circle
                          x={margin + 20}
                          y={chartSize.height - margin + 105}
                          radius={6}
                          fill="blue"
                          stroke="black"
                        />
                        <Text
                          x={margin + 40}
                          y={chartSize.height - margin + 98}
                          text="Tú"
                          fontSize={14}
                          fill="black"
                        />
                      </Layer>
                    ) : (
                      <Layer>
                        <Rect
                          x={margin + chartSize.legendX}
                          y={chartSize.height - margin + 35}
                          width={chartSize.legendWidth}
                          height={40}
                          fill="white"
                          stroke="black"
                          cornerRadius={10}
                          shadowBlur={5}
                        />
                        <Circle
                          x={margin + 60}
                          y={chartSize.height - margin + 55}
                          radius={6}
                          fill="green"
                        />
                        <Text
                          x={margin + 70}
                          y={chartSize.height - margin + 50}
                          text="Grupo de menor riesgo"
                          fontSize={14}
                          fill="black"
                        />
                        <Circle
                          x={margin + 235}
                          y={chartSize.height - margin + 55}
                          radius={6}
                          fill="red"
                        />
                        <Text
                          x={margin + 245}
                          y={chartSize.height - margin + 50}
                          text="Grupo de mayor riesgo"
                          fontSize={14}
                          fill="black"
                        />
                        <Circle
                          x={margin + 410}
                          y={chartSize.height - margin + 55}
                          radius={6}
                          fill="blue"
                          stroke="black"
                        />
                        <Text
                          x={margin + 420}
                          y={chartSize.height - margin + 50}
                          text="Tu evaluación"
                          fontSize={14}
                          fill="black"
                        />
                      </Layer>
                    )}
                  </Stage>
                </div>
              </div>
              <div className="w-full max-w-xs md:max-w-sm lg:max-w-md">
                <div className="p-5 bg-gray-50 border rounded-xl shadow-md text-sm">
                  <h2 className="text-lg font-semibold mb-2">
                    📊 Interpretación del gráfico
                  </h2>
                  <p className="text-gray-700 mb-3">
                    Este gráfico compara tu perfil con el de otras personas,
                    basándose principalmente en el IMC, cintura y edad.
                  </p>
                  <ul className="list-none pl-0 space-y-1 mb-3">
                    <li>🟢 = Personas con menor riesgo de diabetes tipo 2</li>
                    <li>🔴 = Personas con mayor riesgo de diabetes tipo 2</li>
                    <li>🔵 = Tú</li>
                  </ul>
                  <p className="text-gray-700 mb-2">
                    👉 Si tu punto azul está más cerca de los rojos, tu perfil
                    se parece al de quienes tienen más riesgo.
                    <br />
                    👉 Si está más cerca de los verdes, se parece al de menor
                    riesgo.
                  </p>
                  <p className="mt-3 text-xs text-gray-500 border-t pt-2">
                    <span className="font-semibold">
                      ⚠️ Este resultado es solo informativo.
                    </span>{" "}
                    Puede no coincidir con el otro análisis del sistema, porque
                    cada método mira la información de forma distinta. Para una
                    evaluación completa consulta a un profesional de salud.
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Botón para descargar PDF abarcando todo */}
          <div className="flex justify-center my-8">
            <button
              onClick={handleDescargarPDF}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg shadow flex items-center gap-2"
            >
              {/* Icono PDF SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <rect
                  x="2"
                  y="2"
                  width="20"
                  height="20"
                  rx="3"
                  fill="#E53935"
                />
                <text
                  x="12"
                  y="17"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                  fontFamily="Arial, Helvetica, sans-serif"
                >
                  PDF
                </text>
              </svg>
              Descargar evaluación en PDF
            </button>
          </div>
        </>
      ) : null}

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
