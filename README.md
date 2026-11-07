# Kampung Gizi Ceria — Phaser v0.3

Vertical slice game edukasi gizi 2D cozy berbasis Phaser 3, JavaScript ES Modules, dan HTML5.

**Mainkan:** setelah GitHub Pages diaktifkan, buka https://maramar520.github.io/kampung-gizi-ceria/

## Fitur
- Peta kampung dalam satu WorldScene, rumah dengan interior terlihat langsung tanpa loading
- Pasar tradisional, restoran, Chef Bimo dan NPC Bu Sari yang bergerak
- Membeli beras, telur, bayam; mempelajari resep; memasak Nasi Telur Sayur dalam tiga tahap
- Quest Bu Sari, hadiah koin, indikator energi dan gizi, autosave melalui localStorage
- Gerak WASD/panah, E untuk interaksi, tombol sentuh pada layar kecil

## Jalankan di komputer
Jalankan `python3 -m http.server 8000` dari direktori proyek, lalu buka http://localhost:8000.
Jangan membuka file langsung lewat `file://` karena menggunakan ES Modules.
Membutuhkan internet untuk Phaser 3.90.0 dari CDN.

## Struktur
```
index.html
src/
  main.js
  scenes/WorldScene.js
  scenes/UIScene.js
  entities/Player.js
  entities/NPC.js
  systems/GameState.js
  systems/QuestSystem.js
  systems/CookingSystem.js
  world/WorldArt.js
```

## Aktifkan GitHub Pages
Buka **Settings → Pages → Build and deployment**, pilih **Deploy from a branch**.
Pilih `main` dan `/(root)`, kemudian **Save**.

Prototipe modular awal. Aset visual masih prosedural; pengujian browser dan peningkatan animasi masih diperlukan.
