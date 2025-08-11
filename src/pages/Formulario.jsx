import { useState } from "react";
import { Link } from "react-router-dom";

const campos = {
  RIDAGEYR: "Edad (años)",
  RIAGENDR: "Sexo (1 = Hombre, 2 = Mujer)",
  RIDRETH1: "Etnia (1-5)",
  BMXBMI: "Índice de Masa Corporal",
  BMXWAIST: "Circunferencia de cintura (cm)",
  MCQ300C: "Historia familiar de diabetes (1 = Sí, 2 = No)",
  PAQ605: "Actividad física (1 = Regular, 2 = Ocasional)",
  SMQ020: "Fumador (1 = Sí, 2 = No)",
  DMDEDUC2: "Nivel educativo (1-5)",
  INDHHIN2: "Ingreso familiar (1-5)",
  SLD010H: "Horas de sueño",
  HSD010: "Salud general (1 = Excelente, 5 = Mala)"
};

export default function Formulario() {
  const [formData, setFormData] = useState(
    Object.fromEntries(Object.keys(campos).map((k) => [k, ""]))
  );
  const [resultado, setResultado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResultado(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/prediccion/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          Object.fromEntries(
            Object.entries(formData).map(([k, v]) => [k, Number(v)])
          )
        )
      });

      if (!response.ok) throw new Error("Error en la solicitud");
      const data = await response.json();
      setResultado(data);
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
          <h1 className="text-xl md:text-2xl font-bold text-blue-800">Predicción Diabetes Tipo 2</h1>
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
                    isLoading ? "opacity-70 cursor-not-allowed" : "hover:shadow-md"
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
              
              <div className={`p-6 rounded-lg mb-6 ${
                resultado.prediccion === 1 
                  ? "bg-red-50 border-l-4 border-red-500" 
                  : "bg-green-50 border-l-4 border-green-500"
              }`}>
                <div className="flex items-center justify-center space-x-4">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center ${
                    resultado.prediccion === 1 ? "bg-red-100" : "bg-green-100"
                  }`}>
                    <span className={`text-2xl font-bold ${
                      resultado.prediccion === 1 ? "text-red-600" : "text-green-600"
                    }`}>
                      {resultado.prediccion === 1 ? "!" : "✓"}
                    </span>
                  </div>
                  <div>
                    <h3 className={`text-xl font-bold ${
                      resultado.prediccion === 1 ? "text-red-600" : "text-green-600"
                    }`}>
                      {resultado.prediccion === 1 ? "Riesgo de Diabetes" : "Sin Riesgo"}
                    </h3>
                    <p className="text-gray-600">
                      Probabilidad: <span className="font-bold">{(resultado.probabilidad * 100).toFixed(2)}%</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-800">Recomendaciones:</h4>
                {resultado.prediccion === 1 ? (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li>Consulta con un médico para una evaluación completa</li>
                    <li>Considera realizar cambios en tu dieta y aumentar actividad física</li>
                    <li>Monitorea regularmente tus niveles de glucosa</li>
                    <li>Reduce el consumo de azúcares y carbohidratos refinados</li>
                  </ul>
                ) : (
                  <ul className="list-disc pl-5 space-y-2 text-sm text-gray-700">
                    <li>Mantén tus hábitos saludables actuales</li>
                    <li>Realiza chequeos médicos periódicos</li>
                    <li>Continúa con actividad física regular</li>
                    <li>Lleva una dieta balanceada</li>
                  </ul>
                )}
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => setResultado(null)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                >
                  Realizar otra evaluación
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">Esperando datos</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Completa el formulario para evaluar tu riesgo de diabetes.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer simplificado */}
      <footer className="bg-gray-800 text-white py-8 px-6 mt-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Plataforma de predicción diabetes tipo 2
          </p>
        </div>
      </footer>
    </div>
  );
}