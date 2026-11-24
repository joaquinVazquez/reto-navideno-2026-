const WHATSAPP_NUMERO_ORGANIZACION = "5219921393565"; // Reemplaza con tu número real

const ETIQUETAS_MODALIDAD = {
  inscripcion_oficial_75: "Inscripción Oficial ($75 MXN hasta el 30 de noviembre)",
  participacion_libre: "Participación Libre ($0 MXN)",
};

export function construirUrlWhatsApp({
  nombreCompleto,
  telefonoWhatsApp,
  tipoRegistro,
  notas,
}) {
  const modalidadTexto =
    ETIQUETAS_MODALIDAD[tipoRegistro] || "Seguimiento general";

  const lineas = [
    "Hola! Acabo de enviar mi registro para el *Reto Navideño DIF UNISA Panther 2026*.",
    `*Nombre:* ${nombreCompleto.trim()}`,
    `*Mi WhatsApp:* ${telefonoWhatsApp.trim()}`,
    `*Modalidad:* ${modalidadTexto}`,
  ];

  if (notas && notas.trim()) {
    lineas.push(`*Comentario:* ${notas.trim()}`);
  }

  lineas.push("Quedo atento(a) para continuar con mi seguimiento.");

  const mensajeCodificado = encodeURIComponent(lineas.join("\n"));
  return `https://wa.me/${WHATSAPP_NUMERO_ORGANIZACION}?text=${mensajeCodificado}`;
}