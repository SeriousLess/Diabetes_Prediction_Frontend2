import { Link } from "react-router-dom";

export default function Ayuda() {
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

      {/* Ayuda principal */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md p-8 border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-800 mb-6 text-center">
            ¿Cómo usar la plataforma?
          </h2>
          <p className="text-lg text-gray-700 mb-8 text-center">
            Sigue estos pasos para evaluar tu riesgo de diabetes tipo 2 y
            aprovechar al máximo la plataforma.
          </p>
          <ol className="list-decimal pl-6 space-y-6 text-gray-700">
            <li>
              <span className="font-semibold text-blue-700">
                Accede al formulario:
              </span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Haz clic en el botón{" "}
                  <span className="font-semibold text-blue-700">
                    "Iniciar evaluación"
                  </span>{" "}
                  o{" "}
                  <span className="font-semibold text-blue-700">
                    "Comenzar evaluación"
                  </span>{" "}
                  en la página principal.
                </li>
                {/*<li>
                  También puedes acceder desde el menú superior seleccionando <span className="font-semibold text-blue-700">"Evaluar riesgo"</span>.
                </li>*/}
              </ul>
            </li>
            <li>
              <span className="font-semibold text-blue-700">
                Completa tus datos:
              </span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Ingresa tu edad, sexo, medidas corporales y otros datos
                  solicitados en el formulario.
                </li>
                <li>
                  Si tienes dudas sobre algún campo, pasa el cursor sobre el
                  texto para ver detalles o unidades.
                </li>
                <li>
                  Todos los campos son obligatorios para obtener una evaluación
                  precisa.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-blue-700">
                Envía el formulario:
              </span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Haz clic en el botón{" "}
                  <span className="font-semibold text-blue-700">
                    "Evaluar Riesgo"
                  </span>
                  .
                </li>
                <li>
                  Espera unos segundos mientras se procesa tu información.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-blue-700">
                Revisa tus resultados:
              </span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Verás tu nivel de riesgo de diabetes tipo 2, junto con una
                  explicación y recomendaciones personalizadas.
                </li>
                <li>
                  Puedes ver un gráfico que compara tu perfil con el de otras
                  personas.
                </li>
                <li>
                  Si tienes una cuenta y has iniciado sesión, puedes consultar
                  tu historial de evaluaciones.
                </li>
              </ul>
            </li>
            <li>
              <span className="font-semibold text-blue-700">
                Descarga tu evaluación:
              </span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Haz clic en el botón{" "}
                  <span className="font-semibold text-green-700">
                    "Descargar evaluación en PDF"
                  </span>{" "}
                  para guardar o imprimir tus resultados.
                </li>
              </ul>
            </li>
            {/*<li>
              <span className="font-semibold text-blue-700">¿Dudas o problemas?</span>
              <ul className="list-disc pl-6 mt-2 space-y-1">
                <li>
                  Si tienes preguntas adicionales, revisa la sección de <span className="font-semibold text-blue-700">Preguntas Frecuentes</span> o utiliza el formulario de contacto.
                </li>
              </ul>
            </li>*/}
          </ol>
          <div className="mt-10 text-center">
            <Link
              to="/formulario"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
            >
              Ir al formulario
            </Link>
          </div>
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
