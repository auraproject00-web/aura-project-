/* Intro bumper: tekan & tahan untuk "merekam" logo Aura. */
(() => {
  "use strict";

  const root = document.documentElement;
  const intro = document.getElementById("intro");
  if (!intro || root.classList.contains("no-intro")) {
    if (intro) intro.remove();
    return;
  }

  window.AURA_INTRO = "pending";
  const hold = document.getElementById("introHold");
  const skip = document.getElementById("introSkip");
  const tc = document.getElementById("introTc");
  const pct = document.getElementById("introPct");
  const txt = hold.querySelector(".hold-txt");
  const state = document.getElementById("introState");

  const FILL_MS = 1700;   // lama menahan sampai penuh
  const REWIND_MS = 650;  // lama mundur kalau dilepas
  let p = 0, holding = false, done = false, last = performance.now(), frames = 0, idleTimer;

  const pad = (n) => String(n).padStart(2, "0");

  function setHolding(on) {
    if (done) return;
    holding = on;
    intro.classList.toggle("is-holding", on);
    intro.classList.remove("is-idle");
    state.textContent = on ? "REC" : "STBY";
    txt.textContent = on ? "Merekam…" : p > 0.02 ? "Tahan lebih lama" : "Tekan & tahan untuk merekam";
    clearTimeout(idleTimer);
    if (!on) idleTimer = setTimeout(() => intro.classList.add("is-idle"), 4000);
  }

  function frame(now) {
    const dt = Math.min(250, now - last); // tetap akurat di perangkat yang lambat
    last = now;
    if (!done) {
      p += holding ? dt / FILL_MS : -dt / REWIND_MS;
      p = Math.max(0, Math.min(1, p));
      // timecode hanya jalan saat merekam; mundur saat rewind (25 fps)
      frames = Math.max(0, frames + (holding ? dt : p > 0 ? -2 * dt : 0) / 40);
      const f = Math.floor(frames);
      tc.textContent = `00:00:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
      pct.textContent = String(Math.round(p * 100)).padStart(3, "0") + "%";
      intro.style.setProperty("--p", p.toFixed(4));
      if (p >= 1) finish();
    }
    if (!intro.isConnected) return;
    requestAnimationFrame(frame);
  }

  function finish() {
    done = true;
    holding = false;
    intro.classList.remove("is-holding", "is-idle");
    intro.classList.add("is-done");
    state.textContent = "REC";
    intro.style.setProperty("--p", "1");
    setTimeout(() => intro.classList.add("is-out"), 1500);
    setTimeout(close, 2250);
  }

  function close() {
    if (window.AURA_INTRO === "done") return;
    window.AURA_INTRO = "done";
    window.dispatchEvent(new Event("aura:intro-done"));
    try { sessionStorage.setItem("aura-intro", "1"); } catch (e) {}
    root.classList.remove("intro-lock");
    intro.classList.add("is-gone");
    setTimeout(() => intro.remove(), 700);
  }

  // pointer: tahan di mana saja pada layar intro (kecuali tombol lewati)
  intro.addEventListener("pointerdown", (e) => {
    if (e.target.closest(".intro-skip") || e.button > 0) return;
    e.preventDefault();
    try { intro.setPointerCapture(e.pointerId); } catch (err) {}
    setHolding(true);
  });
  const release = () => holding && setHolding(false);
  intro.addEventListener("pointerup", release);
  intro.addEventListener("pointercancel", release);
  intro.addEventListener("lostpointercapture", release);
  intro.addEventListener("contextmenu", (e) => e.preventDefault());

  // keyboard: tahan Spasi / Enter, Esc untuk lewati
  hold.addEventListener("keydown", (e) => {
    if ((e.key === " " || e.key === "Enter") && !e.repeat) { e.preventDefault(); setHolding(true); }
  });
  hold.addEventListener("keyup", (e) => {
    if (e.key === " " || e.key === "Enter") { e.preventDefault(); setHolding(false); }
  });
  hold.addEventListener("click", (e) => e.preventDefault());
  intro.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  skip.addEventListener("click", close);

  // parallax halus mengikuti kursor
  intro.addEventListener("pointermove", (e) => {
    intro.style.setProperty("--mx", ((e.clientX / innerWidth) * 2 - 1).toFixed(3));
    intro.style.setProperty("--my", ((e.clientY / innerHeight) * 2 - 1).toFixed(3));
  });

  idleTimer = setTimeout(() => intro.classList.add("is-idle"), 2500);
  requestAnimationFrame(frame);
})();
