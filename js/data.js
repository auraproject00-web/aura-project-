/*
 * ===========================================================
 *  AURA PROJECT — semua konten yang sering diubah ada di sini.
 *  Tidak perlu menyentuh index.html / main.js untuk:
 *  kontak, daftar karya, foto contact sheet, pilihan form brief.
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
   * INDEKS KARYA (urutan di sini = urutan di website)
   * jenis: "foto" | "video"
   * gambar: path gambar di assets/img/, atau null → bingkai kosong.
   */
  karya: [
    {
      judul: "Lampu Jalan",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/malam.jpg",
      ringkas: "Blue hour di depan bangunan lama. Langit tinggal ungu, satu lampu jalan yang mengambil alih warna.",
      kredit: ["Foto & edit: Aura Project"],
    },
    {
      judul: "Jembatan Pakis",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/hutan.jpg",
      ringkas: "Cahaya pagi tembus kanopi pinus. Jalur bata membawa mata langsung ke lengkung jembatan.",
      kredit: ["Foto & edit: Aura Project"],
    },
    {
      judul: "Sinyal Masuk",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/rel.jpg",
      ringkas: "Kamera sejajar rel, titik hilang tepat di tengah. Warna sore dibiarkan pucat dan hangat.",
      kredit: ["Foto & edit: Aura Project"],
    },
    {
      judul: "Musim Kering",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/bukit.jpg",
      ringkas: "Air surut, padang rumput mengambil alih. Bukit karst berlapis kabut di kejauhan.",
      kredit: ["Foto & edit: Aura Project"],
    },
    {
      judul: "Tanggul",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/waduk.jpg",
      ringkas: "Ultra-wide dari atas bendungan. Awan siang hari jadi setengah frame.",
      kredit: ["Foto: Aura Project"],
    },
    {
      judul: "Garis Senja",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/senja.jpg",
      ringkas: "Siluet di ambang gelap. Slow shutter, tanpa flash, biar gerak yang bercerita.",
      kredit: ["Foto & edit: Aura Project"],
    },
    {
      judul: "Jalan Belum Jadi",
      klien: "Personal",
      jenis: "foto",
      tahun: 2025,
      gambar: "assets/img/jalan.jpg",
      ringkas: "Ride log di jalan yang belum diresmikan. Action cam, ultra-wide, grading hangat.",
      kredit: ["Foto & edit: Aura Project"],
    },
  ],

  /*
   * CONTACT SHEET (galeri film-strip).
   */
  contactSheet: [
    { gambar: "assets/img/malam.jpg", ket: "Blue hour" },
    { gambar: "assets/img/hutan.jpg", ket: "Kanopi pinus" },
    { gambar: "assets/img/rel.jpg", ket: "Titik hilang" },
    { gambar: "assets/img/bukit.jpg", ket: "Karst & kabut" },
    { gambar: "assets/img/waduk.jpg", ket: "Ultra-wide" },
    { gambar: "assets/img/senja.jpg", ket: "Slow shutter" },
    { gambar: "assets/img/jalan.jpg", ket: "Action cam" },
  ],

  /*
   * PILIHAN DI FORM BRIEF (tanpa harga, harga lewat kontak).
   */
  brief: {
    layanan: [
      { id: "event", nama: "Dokumentasi Acara", satuan: "jam", min: 2, maks: 12, awal: 4 },
      { id: "produk", nama: "Foto Produk", satuan: "produk", min: 1, maks: 100, awal: 10 },
      { id: "wedding", nama: "Prewedding / Wedding", satuan: "jam", min: 2, maks: 12, awal: 6 },
      { id: "compro", nama: "Video Profil / Iklan", satuan: "hari syuting", min: 1, maks: 5, awal: 1 },
      { id: "konten", nama: "Konten Sosmed", satuan: "video", min: 1, maks: 30, awal: 4 },
      { id: "lain", nama: "Lainnya", satuan: "jam", min: 1, maks: 12, awal: 2 },
    ],
    tambahan: [
      { id: "drone", nama: "Drone" },
      { id: "sde", nama: "Same-day edit" },
      { id: "grade", nama: "Color grading sinematik" },
      { id: "raw", nama: "File RAW / footage mentah" },
      { id: "kru", nama: "Kamera kedua" },
      { id: "vertikal", nama: "Versi vertikal 9:16" },
    ],
  },
};
