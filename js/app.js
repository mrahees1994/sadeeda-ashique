/* SADEEDA & ASHIQUE — invitation interactions */
(function () {
  const W = window.WEDDING;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  const intro = $("#intro");
  const app = $("#app");
  const audio = $("#bgm");
  const musicBtn = $("#musicBtn");
  const dock = $("#dock");
  const lightbox = $("#lightbox");
  const lightImg = $("#lightboxImg");

  /* ---------- Countdown ---------- */
  const target = new Date(W.startISO).getTime();
  const nums = {
    d: $("#cdDays"),
    h: $("#cdHours"),
    m: $("#cdMins"),
    s: $("#cdSecs")
  };
  const done = $("#cdDone");
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    const now = Date.now();
    let diff = target - now;
    if (diff <= 0) {
      if (done) done.classList.add("is-on");
      return;
    }
    const d = Math.floor(diff / 86400000);
    diff -= d * 86400000;
    const h = Math.floor(diff / 3600000);
    diff -= h * 3600000;
    const m = Math.floor(diff / 60000);
    diff -= m * 60000;
    const s = Math.floor(diff / 1000);
    if (nums.d) nums.d.textContent = pad(d);
    if (nums.h) nums.h.textContent = pad(h);
    if (nums.m) nums.m.textContent = pad(m);
    if (nums.s) nums.s.textContent = pad(s);
  }
  tick();
  setInterval(tick, 1000);

  /* ---------- Opening ---------- */
  let opened = false;
  function openInvitation() {
    if (opened) return;
    opened = true;
    intro.classList.add("is-opening");
    document.body.classList.remove("is-locked");
    document.body.classList.add("is-open");
    setTimeout(() => {
      intro.classList.add("is-open");
      app.classList.add("is-revealed");
      tryStartMusic();
    }, 720);
    setTimeout(() => { intro.style.display = "none"; }, 1850);
  }
  intro.addEventListener("click", openInvitation);
  intro.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openInvitation(); }
  });

  /* ---------- Music ---------- */
  let wantMusic = true;
  function tryStartMusic() {
    if (!audio || !wantMusic) return;
    audio.volume = typeof W.audioVolume === "number" ? W.audioVolume : 0.16;
    if (W.audioSrc && audio.getAttribute("src") !== W.audioSrc) {
      audio.src = W.audioSrc;
    }
    const p = audio.play();
    if (p && p.then) {
      p.then(() => musicBtn.classList.add("is-playing"))
        .catch(() => musicBtn.classList.remove("is-playing"));
    }
  }
  musicBtn.addEventListener("click", () => {
    if (!audio) return;
    if (audio.paused) {
      wantMusic = true;
      tryStartMusic();
    } else {
      wantMusic = false;
      audio.pause();
      musicBtn.classList.remove("is-playing");
    }
    updateMusicIcon();
  });
  function updateMusicIcon() {
    const playing = audio && !audio.paused;
    musicBtn.setAttribute("aria-label", playing ? "Pause music" : "Play music");
    const pause = musicBtn.querySelector("[data-icon=pause]");
    const play = musicBtn.querySelector("[data-icon=play]");
    if (pause && play) {
      pause.style.display = playing ? "block" : "none";
      play.style.display = playing ? "none" : "block";
    }
  }
  if (audio) {
    audio.addEventListener("play", updateMusicIcon);
    audio.addEventListener("pause", updateMusicIcon);
  }

  /* ---------- Dock show/hide ---------- */
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > lastY && y > 120) dock.classList.add("is-hidden");
    else dock.classList.remove("is-hidden");
    lastY = y;
    highlightDock();
  }, { passive: true });

  function highlightDock() {
    const sections = $$("[data-section]");
    let current = sections[0];
    const mid = window.scrollY + window.innerHeight * 0.35;
    sections.forEach((s) => {
      if (s.offsetTop <= mid) current = s;
    });
    $$("#dock a").forEach((a) => {
      a.classList.toggle("is-active", a.getAttribute("href") === "#" + (current && current.id));
    });
  }

  $$("#dock a").forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      const el = id && $(id);
      if (!el) return;
      e.preventDefault();
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  /* ---------- Reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("is-in");
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- Gallery lightbox ---------- */
  $$("[data-full]").forEach((btn) => {
    btn.addEventListener("click", () => {
      lightImg.src = btn.getAttribute("data-full");
      lightImg.alt = btn.getAttribute("data-alt") || "";
      lightbox.classList.add("is-on");
    });
  });
  function closeLight() {
    lightbox.classList.remove("is-on");
    lightImg.src = "";
  }
  lightbox.addEventListener("click", closeLight);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeLight();
  });

  /* ---------- Maps ---------- */
  $$("[data-maps]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(W.venue.mapsUrl, "_blank", "noopener");
    });
  });

  /* ---------- RSVP ---------- */
  $$("[data-rsvp]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const num = String(W.whatsappNumber || "").replace(/[^\d]/g, "");
      if (!num) {
        alert("Kindly confirm your presence with the family. A WhatsApp RSVP number can be added in js/config.js (whatsappNumber).");
        return;
      }
      const url = "https://wa.me/" + num + "?text=" + encodeURIComponent(W.rsvpMessage);
      window.open(url, "_blank", "noopener");
    });
  });

  /* ---------- Add to calendar (.ics) ---------- */
  function icsStamp(iso) {
    const d = new Date(iso);
    const p = (n) => String(n).padStart(2, "0");
    return (
      d.getUTCFullYear() +
      p(d.getUTCMonth() + 1) +
      p(d.getUTCDate()) +
      "T" +
      p(d.getUTCHours()) +
      p(d.getUTCMinutes()) +
      p(d.getUTCSeconds()) +
      "Z"
    );
  }
  $$("[data-calendar]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Sadeeda Ashique Wedding//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VEVENT",
        "UID:sadeeda-ashique-wedding-20260924@invitation",
        "DTSTAMP:" + icsStamp(W.startISO),
        "DTSTART:" + icsStamp(W.startISO),
        "DTEND:" + icsStamp(W.endISO),
        "SUMMARY:Sadeeda & Ashique — Wedding Ceremony",
        "LOCATION:Crystal Plaza, Melangadi, Kalpakanchery",
        "DESCRIPTION:Wedding ceremony of Sadeeda and Ashique. 11:00 AM – 3:00 PM at Crystal Plaza, Melangadi, Kalpakanchery.",
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sadeeda-Ashique-Wedding.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);
    });
  });

  /* ---------- Gold dust ---------- */
  const canvas = $("#goldDust");
  if (canvas && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const ctx = canvas.getContext("2d");
    let w, h, parts;
    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      parts = Array.from({ length: Math.min(42, Math.floor(w / 24)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.4 + 0.3,
        s: Math.random() * 0.25 + 0.05,
        a: Math.random() * 0.35 + 0.08
      }));
    }
    resize();
    window.addEventListener("resize", resize);
    function frame() {
      ctx.clearRect(0, 0, w, h);
      parts.forEach((p) => {
        p.y -= p.s;
        p.x += Math.sin(p.y * 0.01) * 0.15;
        if (p.y < -4) { p.y = h + 4; p.x = Math.random() * w; }
        ctx.beginPath();
        ctx.fillStyle = "rgba(226,197,122," + p.a + ")";
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      });
      requestAnimationFrame(frame);
    }
    frame();
  }

  /* ---------- Gentle parallax ---------- */
  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const leaves = $$(".botany");
    window.addEventListener("scroll", () => {
      const y = window.scrollY;
      leaves.forEach((el, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        el.style.transform = "translate3d(0," + (y * 0.04 * dir) + "px,0)";
      });
    }, { passive: true });
  }
})();
