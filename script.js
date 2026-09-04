const BIRTHDAY = Date.parse("2026-09-04T18:30:00.000Z"); // September 5, 2026 at midnight IST
const ALWAYS_UNLOCKED = false; // Set to true only when you want to bypass the countdown.
const pageParams = new URLSearchParams(window.location.search);
const previewMode = pageParams.get("preview") === "1";
const autoOpenPreview = previewMode && pageParams.get("open") === "1";
const previewSection = pageParams.get("section");

const body = document.body;
const gateNote = document.getElementById("gateNote");
const countdown = document.getElementById("countdown");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const openButton = document.getElementById("openButton");
const openButtonText = document.getElementById("openButtonText");
const experience = document.getElementById("experience");
const gate = document.getElementById("gate");
const soundButton = document.getElementById("soundButton");
const toast = document.getElementById("toast");

let countdownTimer;
let audioContext;
let masterGain;
let musicTimer;
let isPlaying = false;
let toastTimer;
const activeOscillators = new Set();

function pad(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function unlockBirthday() {
  clearInterval(countdownTimer);
  countdown.hidden = true;
  gateNote.innerHTML = "September 5 is finally here.<br />And this little universe belongs to you.";
  openButton.disabled = false;
  openButtonText.textContent = "Open your birthday sky";
  document.querySelector(".ist-note").textContent = previewMode ? "private preview for Muneeb" : "made only for Fiza";
}

function updateCountdown() {
  const remaining = BIRTHDAY - Date.now();

  if (remaining <= 0 || previewMode || ALWAYS_UNLOCKED) {
    unlockBirthday();
    return;
  }

  countdown.hidden = false;

  const totalSeconds = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  hoursEl.textContent = pad(hours);
  minutesEl.textContent = pad(minutes);
  secondsEl.textContent = pad(seconds);
}

function openExperience() {
  body.classList.remove("locked");
  body.classList.add("opened");
  gate.inert = true;
  gate.setAttribute("aria-hidden", "true");
  experience.setAttribute("aria-hidden", "false");
  window.scrollTo({ top: 0, behavior: "instant" });

  setTimeout(() => {
    body.classList.add("experience-visible");
    if (autoOpenPreview && previewSection) {
      document.getElementById(previewSection)?.scrollIntoView({ behavior: "instant" });
    }
  }, 80);

  setTimeout(() => document.querySelector(".hero-title").focus({ preventScroll: true }), 850);

  setTimeout(() => {
    showToast("Happy birthday, Fiza ✦");
  }, 1500);
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("visible");
  toastTimer = setTimeout(() => toast.classList.remove("visible"), 2500);
}

openButton.addEventListener("click", openExperience);
updateCountdown();
countdownTimer = setInterval(updateCountdown, 1000);
if (autoOpenPreview) {
  body.classList.add("instant-preview");
  setTimeout(openExperience, 120);
}

// A lightweight, dependency-free star field.
const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");
let stars = [];
let pixelRatio = 1;

function makeStars() {
  const count = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 9000));
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: Math.random() * 1.15 + 0.2,
    a: Math.random() * 0.55 + 0.12,
    phase: Math.random() * Math.PI * 2,
  }));
}

function resizeCanvas() {
  pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = window.innerWidth * pixelRatio;
  canvas.height = window.innerHeight * pixelRatio;
  ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  makeStars();
}

function drawStars(time = 0, animate = true) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  stars.forEach((star) => {
    const flicker = Math.sin(time * 0.001 + star.phase) * 0.13;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 239, 218, ${star.a + flicker})`;
    ctx.fill();
  });
  if (animate) requestAnimationFrame(drawStars);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  requestAnimationFrame(drawStars);
} else {
  drawStars(0, false);
}

// Reveal each chapter as Fiza reaches it.
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("visible");
    });
  },
  { threshold: 0.16 }
);

document.querySelectorAll(".observe").forEach((element) => observer.observe(element));

// Five interactive wishes.
const wishMessage = document.getElementById("wishMessage");
const wishButtons = document.querySelectorAll(".wish-star");

wishButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("opened")) return;
    button.classList.add("opened");
    button.setAttribute("aria-label", `Opened wish: ${button.dataset.wish}`);
    wishMessage.classList.add("changing");
    setTimeout(() => {
      wishMessage.textContent = button.dataset.wish;
      wishMessage.classList.remove("changing");
    }, 230);

    const openedCount = document.querySelectorAll(".wish-star.opened").length;
    if (openedCount === wishButtons.length) {
      setTimeout(() => showToast("All five wishes are yours ✦"), 700);
    }
  });
});

// Candle finale and celebratory burst.
const cake = document.getElementById("cake");
const cakePrompt = document.getElementById("cakePrompt");
const finale = document.getElementById("birthdayFinale");

cake.addEventListener("click", () => {
  if (cake.classList.contains("blown")) return;
  cake.classList.add("blown");
  cakePrompt.style.opacity = "0";
  cake.setAttribute("aria-label", "Your birthday wish has been sent");
  finale.setAttribute("aria-hidden", "false");
  finale.classList.add("visible");
  launchConfetti();
  playSparkle();
  setTimeout(() => {
    finale.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "center",
    });
  }, 500);
});

function launchConfetti() {
  const colors = ["#f1a7b9", "#e8c690", "#fff8ef", "#b85980", "#d7a6c2"];
  const amount = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 18 : 90;

  for (let i = 0; i < amount; i += 1) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.setProperty("--drift", `${Math.random() * 200 - 100}px`);
    piece.style.setProperty("--rotation", `${Math.random() * 900 - 450}deg`);
    piece.style.setProperty("--fall-time", `${Math.random() * 2.4 + 3}s`);
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 6500);
  }
}

// A tiny original ambient melody built with Web Audio; it starts only after a tap.
function playTone(frequency, start, duration, volume = 0.025) {
  if (!audioContext || !isPlaying) return;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0, start);
  gain.gain.linearRampToValueAtTime(volume, start + 0.12);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(gain).connect(masterGain);
  activeOscillators.add(oscillator);
  oscillator.addEventListener("ended", () => activeOscillators.delete(oscillator), { once: true });
  oscillator.start(start);
  oscillator.stop(start + duration + 0.05);
}

function scheduleMelody() {
  if (!isPlaying || !audioContext) return;
  const start = audioContext.currentTime + 0.08;
  const notes = [261.63, 329.63, 392, 493.88, 440, 392, 329.63, 293.66];
  notes.forEach((note, index) => playTone(note, start + index * 0.62, 1.25, index % 3 === 0 ? 0.032 : 0.02));
  playTone(130.81, start, 4.8, 0.012);
  musicTimer = setTimeout(scheduleMelody, notes.length * 620);
}

function playSparkle() {
  if (!isPlaying || !audioContext) return;
  const start = audioContext.currentTime;
  [523.25, 659.25, 783.99, 1046.5].forEach((note, index) => {
    playTone(note, start + index * 0.11, 0.8, 0.03);
  });
}

soundButton.addEventListener("click", async () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
  }
  if (audioContext.state === "suspended") await audioContext.resume();

  isPlaying = !isPlaying;
  soundButton.classList.toggle("playing", isPlaying);
  soundButton.querySelector(".sound-label").textContent = isPlaying ? "sound off" : "sound on";
  soundButton.setAttribute("aria-label", isPlaying ? "Turn music off" : "Turn music on");

  if (isPlaying) {
    masterGain.gain.setValueAtTime(1, audioContext.currentTime);
    scheduleMelody();
    showToast("A little birthday melody is playing");
  } else {
    clearTimeout(musicTimer);
    masterGain.gain.setValueAtTime(0, audioContext.currentTime);
    activeOscillators.forEach((oscillator) => {
      try { oscillator.stop(); } catch {}
    });
    activeOscillators.clear();
  }
});
