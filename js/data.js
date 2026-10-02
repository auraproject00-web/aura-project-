/*
 * ===========================================================
 *  AURA PROJECT — semua konten yang sering diubah ada di sini.
 *  Tidak perlu menyentuh index.html / main.js untuk:
 *  kontak, daftar karya, foto contact sheet, harga paket.
 * ===========================================================
 */

window.AURA = {
  kontak: {
    email: "aura.project00@gmail.com",
    instagram: "hndr.adjie", // tanpa @
    // Nomor WhatsApp format internasional tanpa + / spasi, contoh "6281234567890".
    // Kosongkan ("") kalau belum mau dipakai — tombol otomatis pindah ke email.
    whatsapp: "",
    kota: "Indonesia",
  },

  /*
   * INDEKS KARYA
   * jenis: "foto" | "video"
   * gambar: path gambar, atau null → tampil sebagai bingkai kosong.
   * contoh: true → muncul label "CONTOH". Hapus / ganti ke false
   *         setelah diisi karya asli. Jangan tayangkan karya fiktif ke klien.
   */
  karya: [
    {
      judul: "Garis Senja",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/senja.jpg",
      ringkas: "Siluet di ambang gelap. Slow shutter, tanpa flash — biar gerak yang bercerita.",
      kredit: ["Foto & edit: Aura Project"],
      contoh: false,
    },
    {
      judul: "Jalan Belum Jadi",
      klien: "Personal",
      jenis: "video",
      tahun: 2025,
      gambar: "assets/img/jalan.jpg",
      ringkas: "Ride log di jalan yang belum diresmikan. Action cam, ultra-wide, grading hangat.",
      kredit: ["Kamera & edit: Aura Project"],
      contoh: false,
    },
    {
      judul: "Peluncuran Produk",
      klien: "Nama Klien",
      jenis: "video",
      tahun: 2026,
      gambar: null,
      ringkas: "Video teaser 30 detik + 6 potongan vertikal untuk Reels/TikTok.",
      kredit: ["Sutradara & DOP", "Editor & colorist"],
      contoh: true,
    },
    {
      judul: "Katalog Musim Hujan",
      klien: "Nama Brand",
      jenis: "foto",
      tahun: 2026,
      gambar: null,
      ringkas: "40 foto produk di studio dan lokasi, siap pakai untuk marketplace.",
      kredit: ["Fotografer", "Retoucher"],
      contoh: true,
    },
    {
      judul: "Resepsi R & D",
      klien: "Pasangan",
      jenis: "video",
      tahun: 2026,
      gambar: null,
      ringkas: "Film pernikahan 4 menit dan same-day edit diputar di malam acara.",
      kredit: ["2 kamera", "Drone"],
      contoh: true,
    },
    {
      judul: "Potret Tim",
      klien: "Nama Perusahaan",
      jenis: "foto",
      tahun: 2026,
      gambar: null,
      ringkas: "Headshot 25 orang dalam satu hari, latar dan cahaya konsisten.",
      kredit: ["Fotografer", "Lighting"],
      contoh: true,
    },
  ],

  /*
   * CONTACT SHEET (galeri film-strip).
   * gambar: null → frame kosong. Ganti dengan path foto kamu.
   */
  contactSheet: [
    { gambar: "assets/img/senja.jpg", ket: "Senja, slow shutter" },
    { gambar: "assets/img/jalan.jpg", ket: "Ride log, action cam" },
    { gambar: null, ket: "Frame kosong" },
    { gambar: null, ket: "Frame kosong" },
    { gambar: null, ket: "Frame kosong" },
    { gambar: null, ket: "Frame kosong" },
    { gambar: null, ket: "Frame kosong" },
    { gambar: null, ket: "Frame kosong" },
  ],

  /*
   * HARGA — CONTOH, WAJIB DISESUAIKAN sebelum website dipublikasikan.
   * Semua angka dalam Rupiah. Estimator menampilkan rentang "mulai dari".
   */
  harga: {
    layanan: [
      { id: "event", nama: "Dokumentasi Acara", satuan: "jam", dasar: 750000, perUnit: 350000, min: 2, maks: 12 },
      { id: "produk", nama: "Foto Produk", satuan: "produk", dasar: 500000, perUnit: 75000, min: 5, maks: 100 },
      { id: "wedding", nama: "Prewedding / Wedding", satuan: "jam", dasar: 2500000, perUnit: 450000, min: 3, maks: 12 },
      { id: "compro", nama: "Video Profil / Iklan", satuan: "hari syuting", dasar: 4000000, perUnit: 2500000, min: 1, maks: 5 },
      { id: "konten", nama: "Konten Sosmed", satuan: "video", dasar: 600000, perUnit: 400000, min: 3, maks: 30 },
    ],
    tambahan: [
      { id: "drone", nama: "Drone", harga: 1000000 },
      { id: "sde", nama: "Same-day edit", harga: 1500000 },
      { id: "grade", nama: "Color grading sinematik", harga: 750000 },
      { id: "raw", nama: "File RAW / footage mentah", harga: 300000 },
      { id: "kru", nama: "Kamera kedua", harga: 900000 },
    ],
  },
};
