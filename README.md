# Kampung Gizi Ceria — Phaser v0.4

Game edukasi gizi 2D cozy untuk anak SD, dibuat dengan Phaser 3 dan JavaScript ES Modules.

## Jalankan
- **GitHub Pages:** https://maramar520.github.io/kampung-gizi-ceria/ (setelah Pages diaktifkan).
- **Lokal:** jalankan `python3 -m http.server 8000`, lalu buka http://localhost:8000.
- Koneksi internet diperlukan untuk memuat Phaser 3.90.0 dari CDN.

## Isi vertical slice
- Kampung kecil dalam satu scene: rumah dengan interior dollhouse terbuka, pasar, restoran dan kebun dekoratif.
- Kontrol WASD / panah untuk jalan dan E untuk berinteraksi; ada tombol sentuh untuk HP.
- Bu Sari berpatroli di beberapa titik; Chef Bimo mengajarkan resep.
- Beli beras (12 KC), telur (15 KC), bayam (10 KC) di pasar.
- Masak Nasi Telur Sayur dalam tiga animasi pendek, lalu serahkan untuk quest (+50 KC).
- Koin, energi, indikator gizi, resep, inventori, dan quest tersimpan lewat localStorage.

## Modul
```
index.html
src/
  main.js
  scenes/WorldScene.js
  scenes/UIScene.js
  entities/Player.js
  entities/NPC.js
  systems/GameState.js
  systems/CookingSystem.js
  systems/QuestSystem.js
  world/WorldArt.js
.github/workflows/check.yml
```

## GitHub Pages
Buka **Settings → Pages → Build and deployment → Deploy from a branch → main → /(root) → Save**.

## v0.4
- Karakter dan NPC mendapatkan sprite pose 3 arah dengan dua frame langkah (dibuat langsung lewat kode), bukan sekadar sprite diam yang digeser.
- GitHub Actions memeriksa sintaks JavaScript dan file utama saat push/PR.

## Batasan saat ini
Grafik masih pixel art prosedural sederhana, bukan spritesheet profesional. Proyek belum memiliki tes otomatis end-to-end di browser dan perlu diuji secara manual di Pages. Angka indikator gizi adalah poin permainan, bukan rekomendasi asupan nutrisi medis.

## v0.4 — Cozy Village Visual Pass

- Rumah bergaya dollhouse dengan lantai ubin, area tidur, kompor, meja makan, rak, jendela dan tanaman.
- Pasar tradisional dilengkapi kanopi dua warna, rak, sayuran dan meja jualan.
- Restoran dengan counter, piring makanan, rak dan karpet.
- Kebun sayur mini, pagar, pohon, semak, bunga, batu, dan lampu jalan.
- Warna pastel serta dekorasi pixel art digambar secara prosedural melalui `WorldArt.js`.
- **Tidak ada loading interior**: seluruh bangunan tetap bagian dari `WorldScene`.
- Posisi karakter, NPC, area interaksi, dinding dan hitbox furnitur dipertahankan dari v0.3.1.

### Uji manual setelah deploy
1. Masuk rumah melalui bukaan tengah bagian bawah dan dekati kompor.
2. Pergi ke pasar di kiri, beli beras, telur dan bayam.
3. Datangi Chef Bimo di restoran kanan, pelajari resep.
4. Kembali ke kompor dan selesaikan 3 tahap memasak.
5. Cari Bu Sari di jalan kampung dan serahkan hidangan.

**Status:** perubahan kode dan tes sintaks dapat diperiksa lewat GitHub Actions, sedangkan tampilan aktual browser perlu diverifikasi di perangkat.
