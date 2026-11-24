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

function iniciarNieveNavidena() {
  const hero = document.querySelector(".hero");
  if (!hero) return;

  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReduced) return;

  const capaNieve = document.createElement("div");
  capaNieve.className = "snow-layer";
  capaNieve.setAttribute("aria-hidden", "true");

  const simbolos = ["❄", "❅", "•"];
  const cantidadCopos = window.innerWidth < 640 ? 12 : 20;

  for (let i = 0; i < cantidadCopos; i++) {
    const copo = document.createElement("span");
    copo.className = "snowflake";
    copo.textContent = simbolos[i % simbolos.length];

    const izquierda = Math.random() * 100;
    const duracion = 8 + Math.random() * 9;
    const retraso = Math.random() * -12;
    const tamano = 0.65 + Math.random() * 0.75;

    copo.style.left = `${izquierda}%`;
    copo.style.animationDuration = `${duracion}s`;
    copo.style.animationDelay = `${retraso}s`;
    copo.style.fontSize = `${tamano}rem`;
    copo.style.opacity = `${0.35 + Math.random() * 0.45}`;

    capaNieve.appendChild(copo);
  }

  hero.prepend(capaNieve);
}

function iniciarContadorCarrera() {
  const diasEl = document.getElementById("cd-dias");
  const horasEl = document.getElementById("cd-horas");
  const minutosEl = document.getElementById("cd-minutos");
  const segundosEl = document.getElementById("cd-segundos");
  const segundosLineEl = document.getElementById("cd-segundos-line");

  if (!diasEl || !horasEl || !minutosEl || !segundosEl) return;

  // Domingo 20 de diciembre de 2026 a las 7:00 a.m. (hora local)
  const fechaSalida = new Date(2026, 11, 20, 7, 0, 0);

  const render = () => {
    const ahora = new Date();
    const diff = fechaSalida - ahora;

    if (diff <= 0) {
      diasEl.textContent = "00";
      horasEl.textContent = "00";
      minutosEl.textContent = "00";
      segundosEl.textContent = "00s";
      if (segundosLineEl) {
        segundosLineEl.textContent = "¡La jornada ha iniciado!";
      }
      return false;
    }

    const totalSegundos = Math.floor(diff / 1000);
    const dias = Math.floor(totalSegundos / 86400);
    const horas = Math.floor((totalSegundos % 86400) / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    diasEl.textContent = String(dias).padStart(2, "0");
    horasEl.textContent = String(horas).padStart(2, "0");
    minutosEl.textContent = String(minutos).padStart(2, "0");
    segundosEl.textContent = `${String(segundos).padStart(2, "0")}s`;

    return true;
  };

  if (render()) {
    const timer = setInterval(() => {
      if (!render()) {
        clearInterval(timer);
      }
    }, 1000);
  }
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

function configurarSelectoresModalidad() {
  const triggers = document.querySelectorAll("[data-select-modalidad]");
  const selectModalidad = document.getElementById("tipo_registro");
  if (!triggers.length || !selectModalidad) return;

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      const valor = btn.getAttribute("data-select-modalidad");
      if (valor) {
        selectModalidad.value = valor;
      }
    });
  });
}

function limpiarTelefono(valor) {
  return valor.replace(/\D/g, "");
}

function configurarFormulario() {
  const form = document.getElementById("registro-form");
  const feedbackEl = document.getElementById("form-feedback");
  const waBoxEl = document.getElementById("whatsapp-action-box");

  if (!form || !feedbackEl || !waBoxEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    feedbackEl.textContent = "";
    feedbackEl.className = "form-feedback";
    waBoxEl.hidden = true;
    waBoxEl.innerHTML = "";

    const nombreCompleto = form.nombre_completo.value.trim();
    const telefonoWhatsApp = form.telefono_whatsapp.value.trim();
    const digitosTelefono = limpiarTelefono(telefonoWhatsApp);
    const tipoRegistro = form.tipo_registro
      ? form.tipo_registro.value
      : "inscripcion_oficial_75";
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

    const urlWhatsApp = construirUrlWhatsApp({
      nombreCompleto,
      telefonoWhatsApp,
      tipoRegistro,
      notas,
    });

    // Apertura directa en un solo paso
    const ventana = window.open(urlWhatsApp, "_blank", "noopener,noreferrer");

    feedbackEl.textContent = ventana
      ? "Abriendo WhatsApp con tu mensaje listo..."
      : "Si WhatsApp no se abrió automáticamente, usa el enlace de abajo:";
    feedbackEl.classList.add("is-success");

    waBoxEl.innerHTML = `
      <a
        href="${urlWhatsApp}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn btn-primary btn-full"
      >
        Abrir WhatsApp ahora
      </a>
    `;
    waBoxEl.hidden = false;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  iniciarAnimacionesScroll();
  iniciarNieveNavidena();
  iniciarContadorCarrera();
  actualizarEstadoVentanaOficial();
  configurarSelectoresModalidad();
  configurarFormulario();
});