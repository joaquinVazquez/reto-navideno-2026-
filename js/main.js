import { construirUrlWhatsApp } from "./whatsapp.js";

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

function iniciarAnimacionesScroll() {
  const elementos = document.querySelectorAll(".reveal-on-scroll");
  if (!elementos.length) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    elementos.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  elementos.forEach((el) => observer.observe(el));
}

function actualizarEstadoVentanaOficial() {
  const statusEl = document.getElementById("estado-ventana-registro");
  if (!statusEl) return;

  // Fin del 30 de noviembre de 2026 (hora local)
  const cierreOficial = new Date(2026, 10, 30, 23, 59, 59);
  const ahora = new Date();

  if (ahora <= cierreOficial) {
    const msRestantes = cierreOficial - ahora;
    const diasRestantes = Math.max(
      1,
      Math.ceil(msRestantes / (1000 * 60 * 60 * 24))
    );
    statusEl.textContent = `Tarifa de Inscripción Oficial ($75 MXN) disponible hasta el 30 de noviembre (${diasRestantes} ${
      diasRestantes === 1 ? "día" : "días"
    } restantes).`;
  } else {
    statusEl.textContent =
      "La ventana de Inscripción Oficial de $75 MXN ha concluido; consulta disponibilidad o súmate en Participación Libre por WhatsApp.";
  }
}

function configurarSelectoresInteres() {
  const triggers = document.querySelectorAll("[data-select-interes]");
  const selectInteres = document.getElementById("interes_inicial");
  if (!triggers.length || !selectInteres) return;

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const valor = btn.getAttribute("data-select-interes");
      if (valor) {
        selectInteres.value = valor;
      }
    });
  });
}

function limpiarTelefono(valor) {
  return valor.replace(/\D/g, "");
}

function configurarFormulario() {
  const form = document.getElementById("registro-form");
  const btnSubmit = document.getElementById("btn-submit");
  const feedbackEl = document.getElementById("form-feedback");
  const waBoxEl = document.getElementById("whatsapp-action-box");

  if (!form || !btnSubmit || !feedbackEl || !waBoxEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    feedbackEl.textContent = "";
    feedbackEl.className = "form-feedback";
    waBoxEl.hidden = true;
    waBoxEl.innerHTML = "";

    const nombreCompleto = form.nombre_completo.value.trim();
    const telefonoWhatsApp = form.telefono_whatsapp.value.trim();
    const digitosTelefono = limpiarTelefono(telefonoWhatsApp);
    const interesInicial = form.interes_inicial
      ? form.interes_inicial.value
      : "inscripcion_oficial_75";
    const desafiosInteres = form.desafios_interes
      ? form.desafios_interes.value
      : "4.3k_y_desafio_final";
    const notas = form.notas ? form.notas.value.trim() : "";

    if (nombreCompleto.length < 2) {
      feedbackEl.textContent = "Por favor escribe tu nombre completo.";
      feedbackEl.classList.add("is-error");
      form.nombre_completo.focus();
      return;
    }

    if (digitosTelefono.length < 10) {
      feedbackEl.textContent =
        "Ingresa un número de WhatsApp válido (al menos 10 dígitos).";
      feedbackEl.classList.add("is-error");
      form.telefono_whatsapp.focus();
      return;
    }

    const payload = {
      nombreCompleto,
      telefonoWhatsApp,
      interesInicial,
      desafiosInteres,
      notas,
    };

    const urlWhatsApp = construirUrlWhatsApp(payload);

    feedbackEl.textContent =
      "Tu mensaje está listo. Abre WhatsApp para continuar tu seguimiento con el equipo organizador.";
    feedbackEl.classList.add("is-success");

    waBoxEl.innerHTML = `
      <p style="margin:0; font-weight:600;">Paso final: envía tu seguimiento por WhatsApp</p>
      <a
        href="${urlWhatsApp}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary btn-full"
      >
        Abrir chat de WhatsApp ahora
      </a>
    `;
    waBoxEl.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarAnimacionesScroll();
  actualizarEstadoVentanaOficial();
  configurarSelectoresInteres();
  configurarFormulario();
});