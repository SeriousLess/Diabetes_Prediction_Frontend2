/**
 * Orden global de importancia (de tu salida SHAP)
 * MCQ300C > RIDAGEYR > HSD010 > BMXWAIST > INDHHIN2 > DMDEDUC2 > BMXBMI > SLD010H
 * > RIAGENDR > PAQ605 > SMQ020
 */
export const FACTORES_ORDENADOS = [
  "MCQ300C",
  "RIDAGEYR",
  "HSD010",
  "BMXWAIST",
  "INDHHIN2",
  "DMDEDUC2",
  "BMXBMI",
  "SLD010H",
  "RIAGENDR",
  "PAQ605",
  "SMQ020",
];

/**
 * Diccionario de reglas por variable.
 * Cada función recibe el valor ingresado y el formulario completo (por si necesitas cruzar info).
 * Devuelve un mensaje (string) o null si no corresponde mostrar nada.
 */
const reglas = {
  // Historial familiar (1 = Sí, 2 = No)
  MCQ300C: (v) => {
    if (v === 1) return "Cuenta con historial familiar de diabetes: esto eleva el riesgo comparado con quienes no lo tienen.";
    if (v === 2) return "No reporta historial familiar de diabetes: esto es un factor ligeramente protector.";
    return null;
  },

  // Edad en años
  RIDAGEYR: (v) => {
    if (v >= 60) return "La edad (≥ 60) es un factor importante: el riesgo aumenta con la edad.";
    if (v >= 45) return "La edad (≥ 45) puede incrementar el riesgo: considera controles más frecuentes.";
    if (v < 30) return "Ser menor de 30 años suele asociarse a menor riesgo, mantén hábitos saludables.";
    return null;
  },

  // Salud general (1 = Excelente, 5 = Mala)
  HSD010: (v) => {
    if (v >= 4) return "Auto-reporte de salud general regular/mala: es un indicador asociado a mayor riesgo.";
    if (v === 1) return "Reporta salud excelente: suele relacionarse con menor riesgo global.";
    return null;
  },

  // Cintura (cm). Si tienes el sexo, puedes ajustar umbrales (Hombre >94, Mujer >80).
  BMXWAIST: (v, form) => {
    const sexo = form?.RIAGENDR; // 1=Hombre, 2=Mujer
    if (sexo === 1 && v > 94) return "Circunferencia de cintura elevada para hombres (>94 cm): esto incrementa el riesgo metabólico.";
    if (sexo === 2 && v > 80) return "Circunferencia de cintura elevada para mujeres (>80 cm): esto incrementa el riesgo metabólico.";
    if (!sexo && v > 88) return "Circunferencia de cintura elevada: asociado a mayor riesgo metabólico.";
    return null;
  },

  // Ingreso familiar (1-5, menor = menor ingreso)
  INDHHIN2: (v) => {
    if (v <= 2) return "Nivel de ingreso reportado bajo: puede asociarse a barreras para hábitos saludables y seguimiento médico.";
    if (v >= 4) return "Nivel de ingreso medio/alto: podría facilitar acceso a hábitos y controles; aprovechalo.";
    return null;
  },

  // Educación (1-5, menor = menor educación)
  DMDEDUC2: (v) => {
    if (v <= 2) return "Menor nivel educativo: a veces se asocia con menor acceso a información de salud y prevención.";
    if (v >= 4) return "Buen nivel educativo: suele asociarse a mejores estrategias de prevención; sigue informándote.";
    return null;
  },

  // IMC
  BMXBMI: (v) => {
    if (v >= 30) return "IMC en rango de obesidad (≥30): factor de riesgo importante. Valora plan de peso saludable.";
    if (v >= 25) return "IMC en sobrepeso (25–29.9): trabajar en hábitos puede reducir el riesgo.";
    if (v < 18.5) return "IMC bajo: cuida que la pérdida de peso no sea involuntaria y mantén una dieta equilibrada.";
    return null;
  },

  // Sueño (horas)
  SLD010H: (v) => {
    if (v < 6) return "Dormir < 6 horas puede alterar metabolismo y aumentar el riesgo. Intenta llegar a 7–8 h.";
    if (v > 9) return "Dormir > 9 horas también puede asociarse a mayor riesgo; procura un rango de 7–8 h.";
    if (v >= 7 && v <= 8) return "Tu rango de sueño (7–8 h) es adecuado: factor protector.";
    return null;
  },

  // Sexo (1=Hombre, 2=Mujer). Impacto bajo en tu SHAP: mensaje suave.
  RIAGENDR: (v) => {
    if (v === 1) return "El sexo masculino puede presentar ligeras diferencias de riesgo; el impacto es menor que otros factores.";
    if (v === 2) return "El sexo femenino puede presentar ligeras diferencias de riesgo; el impacto es menor que otros factores.";
    return null;
  },

  // Actividad física (1 = Varias veces por semana, 2 = Solo aveces)
  PAQ605: (v) => {
    if (v === 2) return "Actividad física solo aveces: aumentar la regularidad puede reducir tu riesgo.";
    if (v === 1) return "Actividad física varias veces por semana: excelente, factor protector. ¡Sigue así!";
    return null;
  },

  // Fumador (1 = Sí, 2 = No)
  SMQ020: (v) => {
    if (v === 1) return "El consumo de tabaco se asocia a mayor riesgo cardiometabólico. Considera un plan para dejar de fumar.";
    if (v === 2) return "No fumar es un factor protector; mantenlo.";
    return null;
  },
};

/**
 * Genera mensajes personalizados:
 * - Ordenados por importancia global (FACTORES_ORDENADOS)
 * - Solo los que apliquen según el formulario
 * - Puedes limitar la cantidad (por defecto 6)
 */
export function getFactorMessages(formData, { limit = 6 } = {}) {
  const mensajes = [];
  for (const key of FACTORES_ORDENADOS) {
    const regla = reglas[key];
    if (!regla) continue;
    const valor = formData?.[key];
    if (valor === undefined || valor === null || valor === "") continue;

    const msg = regla(Number(valor), formData);
    if (msg) mensajes.push({ key, msg });
    if (mensajes.length >= limit) break;
  }
  return mensajes;
}