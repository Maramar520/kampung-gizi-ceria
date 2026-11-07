# Kampung Gizi Ceria — Phaser v0.3.1

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

## v0.3.1
- Karakter dan NPC mendapatkan sprite pose 3 arah dengan dua frame langkah (dibuat langsung lewat kode), bukan sekadar sprite diam yang digeser.
- GitHub Actions memeriksa sintaks JavaScript dan file utama saat push/PR.

## Batasan saat ini
Grafik masih pixel art prosedural sederhana, bukan spritesheet profesional. Proyek belum memiliki tes otomatis end-to-end di browser dan perlu diuji secara manual di Pages. Angka indikator gizi adalah poin permainan, bukan rekomendasi asupan nutrisi medis.
