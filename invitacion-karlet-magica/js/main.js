const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const portal = $("#portal");
const experience = $("#experience");
const music = $("#bgMusic");
let willAttend = true;

// Reproducción automática de música
let isMusicPlaying = false;

function playMusic() {
  if (!music) return;
  const playPromise = music.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        isMusicPlaying = true;
        const button = $("#soundToggle");
        const label = $("#soundLabel");
        if (button) button.classList.add("playing");
        if (label) label.textContent = "Pausar";
      })
      .catch(() => {
        // Los navegadores requieren interacción del usuario antes de reproducir audio no silenciado.
        // Se activará inmediatamente en el primer toque o gesto del usuario en la pantalla.
      });
  }
}

// Intentar reproducir apenas cargue la página
window.addEventListener("DOMContentLoaded", playMusic);
window.addEventListener("load", playMusic);
playMusic();

// Ante cualquier primera interacción (toque, clic, tecla o scroll), activar la música de inmediato
const triggerMusicOnFirstGesture = () => {
  playMusic();
  ["click", "pointerdown", "touchstart", "scroll", "keydown"].forEach((evt) => {
    window.removeEventListener(evt, triggerMusicOnFirstGesture, { capture: true });
  });
};

["click", "pointerdown", "touchstart", "scroll", "keydown"].forEach((evt) => {
  window.addEventListener(evt, triggerMusicOnFirstGesture, { capture: true, passive: true });
});

// Entrada: develar la invitación al pulsar el botón del portal
$("#enterButton").addEventListener("click", () => {
  playMusic();
  portal.style.transition = "opacity 0.9s cubic-bezier(0.2, 0.8, 0.2, 1), transform 0.9s cubic-bezier(0.2, 0.8, 0.2, 1)";
  portal.style.opacity = "0";
  portal.style.transform = "scale(1.03)";
  
  setTimeout(() => {
    portal.classList.add("hidden");
    experience.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "instant" });
    
    // Re-observar los elementos revelables una vez visible el contenedor
    $$(".reveal").forEach((el) => revealObserver.observe(el));
    updateCountdown();
    updateProgress();
    showToast("El misterio te da la bienvenida");
  }, 800);
});

// Animaciones de entrada al hacer scroll
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

$$(".reveal").forEach((el) => revealObserver.observe(el));

// Barra de progreso y seguimiento de capítulos
const chapters = $$(".story-section");
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? (window.scrollY / max) * 100 : 0;
  const progressBar = $("#progressBar");
  if (progressBar) progressBar.style.width = `${Math.min(100, Math.max(0, pct))}%`;

  let current = "I";
  chapters.forEach((section) => {
    if (section.getBoundingClientRect().top < window.innerHeight * 0.55) {
      current = section.dataset.chapter;
    }
  });

  const roman = {
    I: "CAPÍTULO I",
    II: "CAPÍTULO II",
    III: "CAPÍTULO III",
    IV: "CAPÍTULO IV",
    V: "CAPÍTULO V",
    VI: "CAPÍTULO FINAL"
  };
  const label = $("#chapterLabel");
  if (label) label.textContent = roman[current] || "EL MISTERIO";
}

window.addEventListener("scroll", updateProgress, { passive: true });
window.addEventListener("resize", updateProgress);

// Cuenta regresiva precisa hacia el 11 de diciembre de 2026 a las 8:00 P.M.
function updateCountdown() {
  const target = new Date("2026-12-11T20:00:00");
  const now = new Date();
  let diff = Math.max(0, target - now);

  const days = Math.floor(diff / 86400000);
  diff %= 86400000;
  const hours = Math.floor(diff / 3600000);
  diff %= 3600000;
  const minutes = Math.floor(diff / 60000);
  diff %= 60000;
  const seconds = Math.floor(diff / 1000);

  const daysEl = $("#days");
  const hoursEl = $("#hours");
  const minutesEl = $("#minutes");
  const secondsEl = $("#seconds");

  if (daysEl) daysEl.textContent = String(days).padStart(3, "0");
  if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
  if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();

// Desplazamiento suave al panel de coordenadas
$("#detailsButton").addEventListener("click", () => {
  const panel = $("#detailsPanel");
  if (panel) {
    panel.scrollIntoView({ behavior: "smooth", block: "center" });
    showToast("Coordenadas en pantalla");
  }
});

// Control manual de audio ambiental
$("#soundToggle").addEventListener("click", async () => {
  const button = $("#soundToggle");
  const label = $("#soundLabel");
  try {
    if (music.paused) {
      await music.play();
      button.classList.add("playing");
      if (label) label.textContent = "Pausar";
    } else {
      music.pause();
      button.classList.remove("playing");
      if (label) label.textContent = "Música";
    }
  } catch (e) {
    showToast("Error al reproducir el audio");
  }
});

// Modal de confirmación de asistencia (RSVP)
const modal = $("#rsvpModal");
function openModal() {
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$("#rsvpButton").addEventListener("click", openModal);
$("#closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

$$(".choice").forEach((btn) => {
  btn.addEventListener("click", () => {
    $$(".choice").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    willAttend = btn.dataset.attending !== "no";
    const sendBtnLabel = $("#sendRsvp span");
    if (sendBtnLabel) {
      sendBtnLabel.textContent = willAttend ? "Enviar confirmación" : "Enviar respuesta";
    }
  });
});

$("#sendRsvp").addEventListener("click", () => {
  const nameInput = $("#guestName");
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.focus();
    showToast("Por favor, escribe tu nombre");
    return;
  }

  // Número oficial de confirmación (WhatsApp Venezuela: 584145085368)
  const whatsappNumber = "584145085368";
  const message = willAttend
    ? `Hola, soy ${name}. ¡Confirmo mi asistencia a los XV años de Karlet Alvarado el 11 de diciembre de 2026 (de 8:00 P.M. a 3:00 A.M.) en Granja Mano Vieja! Allí estaré.`
    : `Hola, soy ${name}. Muchas gracias por la invitación a los XV años de Karlet Alvarado; lamentablemente no podré asistir en esta ocasión. ¡Les deseo una noche maravillosa!`;

  window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
  closeModal();
});

// Brillo sutil del cursor solo en escritorio con ratón
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (e) => {
    const glow = $(".cursor-glow");
    if (glow) {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    }
  });
}

// Efecto de toque sutil en pantalla (onda mística dorada, sin emojis)
document.addEventListener("pointerdown", (e) => {
  if (e.target.closest("button, a, input, select, .sound-toggle")) return;
  const ripple = document.createElement("span");
  ripple.className = "tap-ripple";
  ripple.style.left = `${e.clientX}px`;
  ripple.style.top = `${e.clientY}px`;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 750);
});

// Sistema de notificaciones toast
let toastTimer;
function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}
