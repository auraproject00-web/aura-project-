# Aura Project — Portofolio Video & Fotografi

Website statis (HTML, CSS, JS biasa). Tanpa build, tanpa npm, tanpa framework.

## Jalankan di laptop
```
python3 -m http.server 8000
```
Buka http://localhost:8000

## Edit konten — cukup buka `js/data.js`
- `kontak` — email, Instagram, nomor WhatsApp (kalau diisi, tombol "Kirim brief" pindah ke WhatsApp).
- `karya` — daftar di Indeks Karya (urutan = urutan tampil). `jenis`: `foto` atau `video`.
- `contactSheet` — frame di film strip.
- `brief` — pilihan layanan & tambahan di form brief. Sengaja tanpa harga: harga dibahas lewat kontak.

Foto taruh di `assets/img/`. Sebaiknya lebar maks. 2000px dan ukuran di bawah 400 KB.

## Bagian halaman
1. Hero viewfinder: area tajam mengikuti kursor, angka ISO/shutter/f berubah.
2. Indeks karya: filter Foto/Video, pratinjau melayang saat hover, detail di lightbox.
3. Contact sheet: film strip yang bisa diseret, frame ditandai lingkaran grease pencil.
   Frame yang ditandai ikut masuk ke pesan brief.
4. Susun brief: pilih layanan, durasi, tambahan, tanggal; pesan tersusun otomatis
   di papan slate lalu terkirim ke email/WhatsApp. Tanpa harga.
5. Proses, Tentang, Kontak.

Mengikuti `prefers-reduced-motion`, bisa dipakai dengan keyboard, dan responsif sampai 360px.

## Hosting (GitHub Pages)
Settings → Pages → Source: *Deploy from a branch* → `main` / `(root)`.
