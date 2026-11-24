const WHATSAPP_NUMERO_ORGANIZACION = "5219670000000";

const ETIQUETAS_INTERES = {
  inscripcion_oficial_75: "Inscripción Oficial ($75 hasta el 30 nov)",
  participacion_libre: "Participación Libre",
};

const ETIQUETAS_RECORRIDO = {
  "4.3k_y_desafio_final": "4.3 km + Desafío Final en campo",
  "solo_4.3k": "Recorrido 4.3 km a mi propio ritmo",
};

export function construirUrlWhatsApp({
  nombreCompleto,
  telefonoWhatsApp,
  interesInicial,
  desafiosInteres,
  notas,
}) {
  const interesTexto =
    ETIQUETAS_INTERES[interesInicial] || "Seguimiento general";
  const recorridoTexto =
    ETIQUETAS_RECORRIDO[desafiosInteres] || "Recorrido 4.3 km";

  const lineas = [
    "¡Hola! Acabo de registrarme en la landing del *Reto Navideño DIF UNISA Panther 2026*",
    `*Nombre:* ${nombreCompleto.trim()}`,
    `*Mi WhatsApp:* ${telefonoWhatsApp.trim()}`,
    `*Interés inicial:* ${interesTexto}`,
    `*Dinámica:* ${recorridoTexto}`,
  ];

  if (notas && notas.trim()) {
    lineas.push(`*Comentario:* ${notas.trim()}`);
  }

  lineas.push("Quedo atento(a) para continuar con mi seguimiento.");

  const mensajeCodificado = encodeURIComponent(lineas.join("\n"));
  return `https://wa.me/${529921393565}?text=${mensajeCodificado}`;
}