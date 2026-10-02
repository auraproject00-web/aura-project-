(() => {
  "use strict";

  const D = window.AURA;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const rupiah = (n) => "Rp " + Math.round(n).toLocaleString("id-ID");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const media = (src, alt, label = "Frame kosong") =>
    src
      ? `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" decoding="async" />`
      : `<div class="ph" role="img" aria-label="${esc(label)}"><span>${esc(label)}</span></div>`;

  /* ---------- kontak & teks statis ---------- */
  const K = D.kontak;
  $$("[data-kota]").forEach((el) => (el.textContent = K.kota));
  $("#yr").textContent = new Date().getFullYear();
  const mail = $("#mailBig");
  mail.href = "mailto:" + K.email;
  mail.textContent = K.email;
  const ig = $("#igLink");
  ig.href = "https://instagram.com/" + K.instagram;
  ig.textContent = "Instagram @" + K.instagram;
  if (K.whatsapp) {
    const wa = $("#waLink");
    wa.href = "https://wa.me/" + K.whatsapp;
    wa.hidden = false;
  }

  /* ---------- timecode REC (25 fps) ---------- */
  const tc = $("#tc");
  const t0 = performance.now();
  const pad = (n) => String(n).padStart(2, "0");
  const tick = () => {
    const f = Math.floor(((performance.now() - t0) / 1000) * 25);
    tc.textContent = `${pad(Math.floor(f / 90000))}:${pad(Math.floor(f / 1500) % 60)}:${pad(Math.floor(f / 25) % 60)}:${pad(f % 25)}`;
    requestAnimationFrame(tick);
  };
  if (!reduce) tick();

  /* ---------- bar & nav aktif ---------- */
  const bar = $("#bar");
  const onScroll = () => bar.classList.toggle("is-solid", scrollY > 40);
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const navLinks = $$(".nav a");
  const spy = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + e.target.id));
    }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  ["karya", "sheet", "paket", "proses", "kontak"].forEach((id) => spy.observe($("#" + id)));

  /* ---------- HERO: rack focus + HUD ---------- */
  const hero = $("#hero");
  const pt = $("#vfPoint");
  const hud = { iso: $("#hudIso"), sh: $("#hudSh"), f: $("#hudF"), wb: $("#hudWb"), ev: $("#hudEv") };
  const F_STOPS = [1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11];
  const SHUTTERS = ["1/25", "1/50", "1/100", "1/250", "1/500", "1/1000"];
  const ISOS = [100, 200, 400, 800, 1600, 3200];
  let lockTimer, lastMove = { x: 0, y: 0, t: 0 };

  function focusAt(x, y, speed = 0) {
    const r = hero.getBoundingClientRect();
    const px = x - r.left, py = y - r.top;
    hero.style.setProperty("--fx", px + "px");
    hero.style.setProperty("--fy", py + "px");
    const nx = px / r.width, ny = py / r.height;
    const dist = Math.min(1, Math.hypot(nx - 0.5, ny - 0.5) * 1.6);
    const fIdx = Math.round(dist * (F_STOPS.length - 1));
    hero.style.setProperty("--fr", 150 + fIdx * 22 + "px"); // f besar → area tajam lebih luas
    hud.f.textContent = F_STOPS[fIdx];
    hud.sh.textContent = SHUTTERS[Math.min(SHUTTERS.length - 1, Math.round(speed * 1.6))];
    hud.iso.textContent = ISOS[Math.round(ny * (ISOS.length - 1))];
    hud.wb.textContent = Math.round((3200 + nx * 3300) / 100) * 100 + "K";
    hud.ev.style.setProperty("--ev", Math.round(nx * 100) + "%");
  }

  if (fine && !reduce) {
    hero.addEventListener("pointermove", (e) => {
      const now = performance.now();
      const speed = Math.hypot(e.clientX - lastMove.x, e.clientY - lastMove.y) / Math.max(16, now - lastMove.t);
      lastMove = { x: e.clientX, y: e.clientY, t: now };
      pt.style.left = e.clientX + "px";
      pt.style.top = e.clientY + "px";
      pt.classList.remove("is-locked");
      clearTimeout(lockTimer);
      lockTimer = setTimeout(() => {
        pt.classList.add("is-locked");
        hud.sh.textContent = "1/50";
      }, 380);
      focusAt(e.clientX, e.clientY, speed);
    });
  } else if (!reduce) {
    // layar sentuh: titik fokus bergerak pelan sendiri, sentuhan memindahkannya
    let touchUntil = 0;
    hero.addEventListener("pointerdown", (e) => { touchUntil = performance.now() + 3500; focusAt(e.clientX, e.clientY); });
    const drift = (t) => {
      if (t > touchUntil && hero.getBoundingClientRect().bottom > 0) {
        const r = hero.getBoundingClientRect();
        focusAt(r.left + r.width * (0.55 + 0.25 * Math.sin(t / 2600)), r.top + r.height * (0.35 + 0.12 * Math.sin(t / 1700)));
      }
      requestAnimationFrame(drift);
    };
    requestAnimationFrame(drift);
  }

  /* ---------- INDEKS KARYA ---------- */
  const list = $("#indexList");
  const peek = $("#peek");
  const peekIn = $(".peek-in", peek);

  list.innerHTML = D.karya
    .map((k, i) => `
      <button class="row" role="listitem" data-i="${i}" data-j="${esc(k.jenis)}" aria-label="${esc(k.judul)}, ${esc(k.jenis)} ${k.tahun}. Buka detail">
        <span class="row-no">${pad(i + 1)}</span>
        <span class="row-thumb">${media(k.gambar, k.judul)}</span>
        <span class="row-title">${esc(k.judul)}${k.contoh ? "<em>Contoh</em>" : ""}</span>
        <span class="row-meta row-klien">${esc(k.klien)}</span>
        <span class="row-meta row-tag-cell"><span class="row-tag" data-j="${esc(k.jenis)}">${esc(k.jenis)}</span></span>
        <span class="row-meta row-tahun">${k.tahun}</span>
        <span class="row-arrow" aria-hidden="true">↗</span>
      </button>`)
    .join("");

  const counts = { semua: D.karya.length, foto: 0, video: 0 };
  D.karya.forEach((k) => counts[k.jenis]++);
  $$("[data-count]").forEach((el) => (el.textContent = counts[el.dataset.count]));

  $$(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      const f = chip.dataset.filter;
      $$(".chip").forEach((c) => { c.classList.toggle("is-on", c === chip); c.setAttribute("aria-pressed", c === chip); });
      $$(".row", list).forEach((r) => r.classList.toggle("is-out", f !== "semua" && r.dataset.j !== f));
    })
  );

  // pratinjau melayang mengikuti kursor, dengan sedikit lag
  if (fine) {
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, cur = -1;
    const loop = () => {
      cx += (tx - cx) * 0.16; cy += (ty - cy) * 0.16;
      peek.style.setProperty("--px", cx + "px");
      peek.style.setProperty("--py", cy + "px");
      raf = Math.abs(tx - cx) + Math.abs(ty - cy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };
    list.addEventListener("pointermove", (e) => {
      tx = e.clientX + 28; ty = e.clientY - 120;
      if (tx + 340 > innerWidth) tx = e.clientX - 350;
      if (!raf) raf = requestAnimationFrame(loop);
      const row = e.target.closest(".row");
      if (!row) return;
      const i = +row.dataset.i;
      if (i !== cur) {
        cur = i;
        const k = D.karya[i];
        peekIn.innerHTML = media(k.gambar, "", k.contoh ? "Contoh — ganti gambar" : "Frame kosong");
      }
      if (!peek.classList.contains("is-on")) { cx = tx; cy = ty; }
      peek.classList.add("is-on");
      list.classList.add("has-hover");
    });
    list.addEventListener("pointerleave", () => {
      peek.classList.remove("is-on");
      list.classList.remove("has-hover");
    });
  }

  /* ---------- LIGHTBOX ---------- */
  const lb = $("#lb");
  let lbIdx = 0;
  function openLb(i) {
    const vis = visibleKarya();
    lbIdx = (i + D.karya.length) % D.karya.length;
    if (!vis.includes(lbIdx)) lbIdx = vis[0] ?? 0;
    const k = D.karya[lbIdx];
    $("#lbMedia").innerHTML = media(k.gambar, k.judul, "Ganti gambar di js/data.js");
    $("#lbMeta").textContent = `${pad(lbIdx + 1)} · ${k.jenis} · ${k.klien} · ${k.tahun}${k.contoh ? " · contoh" : ""}`;
    $("#lbTitle").textContent = k.judul;
    $("#lbText").textContent = k.ringkas;
    $("#lbCredits").innerHTML = (k.kredit || []).map((c) => `<li>${esc(c)}</li>`).join("");
    if (!lb.open) lb.showModal();
  }
  const visibleKarya = () => $$(".row", list).filter((r) => !r.classList.contains("is-out")).map((r) => +r.dataset.i);
  const stepLb = (dir) => {
    const vis = visibleKarya();
    const at = vis.indexOf(lbIdx);
    openLb(vis[(at + dir + vis.length) % vis.length]);
  };
  list.addEventListener("click", (e) => {
    const row = e.target.closest(".row");
    if (row) openLb(+row.dataset.i);
  });
  $("#lbClose").addEventListener("click", () => lb.close());
  $("#lbPrev").addEventListener("click", () => stepLb(-1));
  $("#lbNext").addEventListener("click", () => stepLb(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") stepLb(1);
    if (e.key === "ArrowLeft") stepLb(-1);
  });

  /* ---------- CONTACT SHEET ---------- */
  const strip = $("#strip");
  const picks = new Set(store.get("aura-picks", []));
  // lingkaran grease pencil: sedikit miring dan tidak menutup rapi, seperti tangan
  const greasePath = (seed) => {
    const j = (n) => (Math.sin(seed * 9.7 + n * 3.1) * 4).toFixed(1);
    return `M ${40 + +j(1)} ${20 + +j(2)} C ${120} ${4 + +j(3)}, ${262 + +j(4)} ${10}, ${284} ${70 + +j(5)} S ${250} ${192 + +j(6)}, ${150} ${190} S ${8} ${170 + +j(7)}, ${14} ${100} S ${70} ${12 + +j(8)}, ${150 + +j(9)} ${14}`;
  };
  const frameNo = (i) => pad(i + 1) + "A";

  strip.innerHTML = D.contactSheet
    .map((f, i) => `
      <button class="frame${picks.has(i) ? " is-pick" : ""}" data-i="${i}" type="button" aria-pressed="${picks.has(i)}" aria-label="Frame ${frameNo(i)}: ${esc(f.ket)}">
        ${media(f.gambar, f.ket)}
        <svg class="grease" viewBox="0 0 300 200" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="${greasePath(i + 1)}" /></svg>
        <span class="frame-no">${frameNo(i)}</span>
        <span class="frame-ket">${esc(f.ket)}</span>
      </button>`)
    .join("");

  const pickCount = $("#pickCount");
  const syncPicks = () => {
    pickCount.textContent = picks.size;
    store.set("aura-picks", [...picks]);
    updateBuilder(false);
  };

  let drag = null;
  strip.addEventListener("pointerdown", (e) => {
    if (e.pointerType !== "mouse") return; // sentuh pakai scroll native
    drag = { x: e.clientX, left: strip.scrollLeft, moved: false };
  });
  addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (Math.abs(dx) > 5) { drag.moved = true; strip.classList.add("is-drag"); }
    strip.scrollLeft = drag.left - dx;
  });
  addEventListener("pointerup", () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    // klik yang menyusul drag jangan dihitung sebagai "pilih frame"
    strip.dataset.justDragged = "1";
    setTimeout(() => { strip.classList.remove("is-drag"); delete strip.dataset.justDragged; }, 0);
  });
  strip.addEventListener("click", (e) => {
    if (strip.dataset.justDragged) { delete strip.dataset.justDragged; return; }
    const fr = e.target.closest(".frame");
    if (!fr) return;
    const i = +fr.dataset.i;
    picks.has(i) ? picks.delete(i) : picks.add(i);
    fr.classList.toggle("is-pick", picks.has(i));
    fr.setAttribute("aria-pressed", picks.has(i));
    syncPicks();
  });
  strip.addEventListener("keydown", (e) => {
    if (e.target !== strip) return;
    if (e.key === "ArrowRight") strip.scrollBy({ left: 300, behavior: reduce ? "auto" : "smooth" });
    if (e.key === "ArrowLeft") strip.scrollBy({ left: -300, behavior: reduce ? "auto" : "smooth" });
  });
  $("#pickClear").addEventListener("click", () => {
    picks.clear();
    $$(".frame", strip).forEach((f) => { f.classList.remove("is-pick"); f.setAttribute("aria-pressed", "false"); });
    syncPicks();
  });

  /* ---------- RAKIT PAKET ---------- */
  const H = D.harga;
  const optL = $("#optLayanan"), optT = $("#optTambah");
  const qty = $("#qty"), qtyOut = $("#qtyOut");
  const slate = $(".slate");

  optL.innerHTML = H.layanan
    .map((l, i) => `
      <label class="opt-card">
        <input type="radio" name="layanan" value="${l.id}"${i === 0 ? " checked" : ""} />
        <span>${esc(l.nama)}<small>mulai ${rupiah(l.dasar)}</small></span>
      </label>`)
    .join("");
  optT.innerHTML = H.tambahan
    .map((t) => `
      <label class="opt-card">
        <input type="checkbox" name="tambah" value="${t.id}" />
        <span>${esc(t.nama)}<small>+${rupiah(t.harga)}</small></span>
      </label>`)
    .join("");

  const svc = () => H.layanan.find((l) => l.id === $('input[name="layanan"]:checked').value);
  let shown = 0, animRaf = 0;
  const priceEl = $("#sHarga");
  function animatePrice(to) {
    cancelAnimationFrame(animRaf);
    if (reduce) { shown = to; priceEl.textContent = rupiah(to); return; }
    const from = shown, t0 = performance.now();
    const step = (t) => {
      const p = Math.min(1, (t - t0) / 450);
      shown = from + (to - from) * (1 - Math.pow(1 - p, 3));
      priceEl.textContent = rupiah(shown);
      if (p < 1) animRaf = requestAnimationFrame(step);
    };
    animRaf = requestAnimationFrame(step);
  }

  function updateBuilder(clap = true) {
    const s = svc();
    if (+qty.min !== s.min || +qty.max !== s.maks) {
      qty.min = s.min; qty.max = s.maks;
      if (+qty.value < s.min || +qty.value > s.maks) qty.value = s.min;
    }
    const n = +qty.value;
    qty.style.setProperty("--fill", ((n - s.min) / Math.max(1, s.maks - s.min)) * 100 + "%");
    qtyOut.textContent = `${n} ${s.satuan}`;
    const adds = $$('input[name="tambah"]:checked', optT).map((c) => H.tambahan.find((t) => t.id === c.value));
    const total = s.dasar + s.perUnit * (n - s.min) + adds.reduce((a, t) => a + t.harga, 0);

    $("#sLayanan").textContent = s.nama;
    $("#sQty").textContent = `${n} ${s.satuan}`;
    $("#sAdd").textContent = adds.length ? adds.map((a) => a.nama).join(", ") : "—";
    animatePrice(total);

    if (clap && !reduce) {
      slate.classList.remove("is-clap");
      void slate.offsetWidth;
      slate.classList.add("is-clap");
    }

    // susun pesan brief
    const tgl = $("#tgl").value;
    const cat = $("#cat").value.trim();
    const ref = [...picks].sort((a, b) => a - b).map(frameNo);
    const lines = [
      "Halo Aura Project, saya mau tanya jadwal & penawaran.",
      "",
      `Pekerjaan: ${s.nama}`,
      `Durasi/jumlah: ${n} ${s.satuan}`,
      adds.length ? `Tambahan: ${adds.map((a) => a.nama).join(", ")}` : null,
      tgl ? `Tanggal: ${new Date(tgl + "T00:00").toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}` : null,
      cat ? `Catatan: ${cat}` : null,
      ref.length ? `Referensi frame dari contact sheet: ${ref.join(", ")}` : null,
      `Estimasi di website: mulai ${rupiah(total)}`,
    ].filter((l) => l !== null).join("\n");

    const send = $("#sendBrief");
    if (K.whatsapp) {
      send.href = `https://wa.me/${K.whatsapp}?text=${encodeURIComponent(lines)}`;
      send.textContent = "Kirim brief via WhatsApp";
    } else {
      send.href = `mailto:${K.email}?subject=${encodeURIComponent("Brief: " + s.nama)}&body=${encodeURIComponent(lines)}`;
      send.textContent = "Kirim brief via email";
      send.removeAttribute("target");
    }
  }

  $("#builder").addEventListener("input", (e) => updateBuilder(e.target.type !== "text" && e.target.type !== "date"));
  $("#tgl").min = new Date().toISOString().slice(0, 10);
  syncPicks();
  pickCount.textContent = picks.size;

  /* ---------- PROSES: playhead mengikuti scroll ---------- */
  const steps = $(".steps");
  const stepScroll = () => {
    const r = steps.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, (innerHeight * 0.85 - r.top) / (innerHeight * 0.6)));
    steps.style.setProperty("--p", p.toFixed(3));
  };
  addEventListener("scroll", stepScroll, { passive: true });
  stepScroll();

  /* ---------- reveal ---------- */
  $$(".sec-head, .steps li, .about-fig, .about-copy, .builder, .contact > *").forEach((el) => el.classList.add("rv"));
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  $$(".rv").forEach((el) => {
    io.observe(el);
  });
})();
