import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-md py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-800">
            Plataforma de predicción de diabetes tipo 2
          </h1>
          <div className="hidden md:flex space-x-6">
            <button
              className={`px-3 py-2 ${
                activeTab === "home"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("home")}
            >
              Inicio
            </button>
            <button
              className={`px-3 py-2 ${
                activeTab === "history"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("history")}
            >
              Historial
            </button>
            <button
              className={`px-3 py-2 ${
                activeTab === "faq"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("faq")}
            >
              Preguntas
            </button>
            <button
              className={`px-3 py-2 ${
                activeTab === "contact"
                  ? "text-blue-600 font-semibold"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("contact")}
            >
              Contacto
            </button>
            {/* Botón Iniciar Sesión */}
            {user ? (
              <>
                <span className="px-3 py-2 text-blue-600 font-semibold">
                  👤 {user.username}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-2 text-red-600 font-semibold"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="px-3 py-2 text-green-600 font-semibold"
              >
                Iniciar Sesión
              </Link>
            )}
          </div>
          <button className="md:hidden text-blue-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-6">
            Evalúa tu riesgo de diabetes
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Comienza tu evaluación y descubre tu nivel de riesgo de diabetes
            tipo 2 hoy mismo.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/formulario"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
            >
              Iniciar evaluación
            </Link>
            {/* Botón Iniciar Sesión en el Hero */}
            <Link
              to="/login"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
            >
              Iniciar Sesión
            </Link>
            <Link
              to="/ayuda"
              className="bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-lg border border-blue-600 shadow-md transition duration-300"
            >
              Ayuda
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Descubre tu riesgo de diabetes fácilmente
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-lg text-gray-600 mb-6">
                Completa el formulario con tus datos personales. Obtén un
                análisis claro y visual de tu riesgo de diabetes tipo 2.
              </p>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Datos necesarios para la evaluación
              </h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2 mb-8">
                <li>
                  Deberá ingresar su edad, sexo, medidas y otros datos más.
                </li>
              </ul>
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Información sobre el riesgo de diabetes
              </h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-2">
                <li>Conoce cómo tus hábitos afectan tu salud.</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
              <h3 className="text-2xl font-bold text-center text-blue-800 mb-6">
                Inicia tu evaluación ahora
              </h3>
              <p className="text-center text-gray-600 mb-6">
                Haz clic en el botón para comenzar.
              </p>
              <div className="text-center">
                <Link
                  to="/formulario"
                  className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
                >
                  Comenzar evaluación
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-blue-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Beneficios de nuestra plataforma para todos
          </h2>
          <p className="text-lg text-center text-gray-600 mb-12 max-w-4xl mx-auto">
            Nuestra plataforma ofrece una evaluación precisa del riesgo de
            diabetes tipo 2. Con un diseño accesible, facilita el seguimiento de
            la salud de los jóvenes, adultos mayores y público en general.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Evaluación Rápida
              </h3>
              <p className="text-gray-600">
                Obtén resultados claros y visuales sobre tu riesgo de diabetes.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Acceso Fácil
              </h3>
              <p className="text-gray-600">
                Accede a tu historial y recomendaciones en cualquier momento.
              </p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Resultados Confiables
              </h3>
              <p className="text-gray-600">
                Utilizamos algoritmos validados para predecir tu riesgo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      {/*<section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Lo que dicen nuestros usuarios
          </h2>
          <div className="bg-blue-50 p-8 rounded-xl max-w-4xl mx-auto">
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-yellow-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="text-center text-gray-700 text-lg italic mb-6">
              "Gracias a esta plataforma, pude conocer mi riesgo de diabetes y
              tomar medidas a tiempo. La evaluación fue fácil de entender y muy
              útil para mi salud."
            </blockquote>
            <div className="text-center">
              <p className="font-semibold text-gray-800">Maria Lopez</p>
              <p className="text-gray-600">Lima, Perú</p>
            </div>
          </div>
        </div>
      </section>*/}

      {/* CTA Section */}
      <section className="py-16 px-6 bg-blue-600 text-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para conocer tu riesgo de diabetes?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Comienza tu evaluación ahora y toma el control de tu salud.
          </p>
          <Link
            to="/formulario"
            className="inline-block bg-white hover:bg-gray-100 text-blue-600 font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300"
          >
            Comenzar evaluación
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Plataforma de predicción diabetes tipo 2
            </h3>
            <p className="text-gray-400">
              Nuestra plataforma te ayuda a evaluar tu riesgo de diabetes tipo 2
              de manera sencilla y accesible.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Evaluar riesgo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Historial
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white">
                  Preguntas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-gray-400">
              <li>diegomoscoso2019@gmail.com</li>
              {/*<li>+51 999 999 999</li>*/}
              <li>Lima, Perú</li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto pt-8 mt-8 border-t border-gray-700 text-center text-gray-400">
          <p>
            © {new Date().getFullYear()} Plataforma de predicción diabetes tipo
            2. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
