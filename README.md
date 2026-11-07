# Kampung Gizi Ceria — Phaser v1.8

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


## v0.5 — Interactive Cooking & Character Polish

- Sprite karakter player, Bu Sari, dan Chef Bimo lebih detail: rambut, baju, sepatu, wajah, dan aksesori pixel art.
- Detail furnitur: motif selimut, keranjang sayur, panci, rak dapur, papan menu restoran dan dekorasi jendela.
- Animasi interaksi pemain/NPC dengan ikon aktivitas singkat.
- Minigame memasak:
  1. **Cuci bayam:** ketuk tombol 5 kali.
  2. **Masak nasi:** tekan dan tahan tombol hingga meter mencapai 100%.
  3. **Masak telur:** tekan tepat di area hijau dua kali.
- Mouse, touch, dan keyboard bisa digunakan pada kontrol minigame.
- Membatalkan minigame tidak menghabiskan bahan; bahan digunakan setelah seluruh tahap selesai.
- Sistem quest, progres LocalStorage, interior terbuka, dan collision lama tetap dipertahankan.
- GitHub Actions menjalankan pemeriksaan sintaks JS dan tes regresi melalui Node.js.

### Uji manual
1. Temui Bu Sari dan belanja beras, telur dan bayam di pasar.
2. Temui Chef Bimo untuk membuka resep.
3. Pergi ke kompor rumah, lalu lakukan semua minigame.
4. Antarkan hidangan ke Bu Sari untuk hadiah +50 KC.
5. Ulangi dengan menutup minigame sebelum selesai: inventori seharusnya tetap utuh.

**Batasan:** Tes logika bukan pengganti verifikasi browser end-to-end. Aset masih prosedural dan Phaser dimuat dari CDN.


## v0.6 — Perbaikan navigasi dan alur quest

- Satu sumber data koordinat di `src/world/WorldGeometry.js`, digunakan untuk collision, posisi dan interaksi.
- Nama objek muncul saat pemain dapat berinteraksi dengan pasar, Chef Bimo, Bu Sari, kompor, atau kasur.
- Petunjuk arah di atas pemain menunjuk ke lokasi berikutnya sesuai perkembangan quest.
- Deskripsi quest mengikuti status: pelajari resep → belanja bahan → memasak → serahkan kepada Bu Sari.
- Tombol **Kembali ke jalan** mengembalikan posisi karakter ke awal tanpa menghapus koin, resep, inventori atau progres quest.
- Jika penyimpanan lama menempatkan pemain di dinding atau furnitur, karakter dipindahkan ke titik aman.
- Tes baru `tests/world.test.mjs` menggunakan BFS untuk memeriksa akses pintu rumah dan kelima titik interaksi berdasarkan hitbox aktual.

**Catatan:** perubahan sistem navigasi tidak mengubah struktur Phaser dan rumah tetap memiliki interior yang terlihat langsung. Tes logika otomatis tetap harus dilengkapi pengujian browser manual.


## v0.7 — Tas, Buku Resep dan Jurnal Quest

- Tombol menu baru di atas game: **🎒 Tas**, **📖 Resep**, dan **📋 Misi**.
- Pintasan keyboard: `I` membuka tas, `R` membuka buku resep, `J` membuka jurnal, `Esc` menutup.
- Tas menampilkan emoji bahan, jumlah milik pemain, kategori bahan, dan harga pembelian.
- Buku resep menunjukkan apakah resep Nasi Telur Sayur sudah dipelajari dari Chef Bimo, bahan yang masih kurang, dan tiga tahap minigame memasak.
- Jurnal memperlihatkan empat langkah quest Bu Sari dan menandai langkah yang sudah selesai.
- Semua tampilan menggunakan data existing di `GameState` dan `CookingSystem`; tidak ada migrasi save file dan progres lama tetap digunakan.
- Panel berukuran besar dan dapat discroll di ponsel; kontrol keyboard dan mouse tetap tersedia.
- `tests/notebook.test.mjs` menambah pengujian state inventori, resep, jurnal dan konsistensi setelah bahan dipakai.

### Cara menguji
1. Buka game dan tekan `I`: semua bahan semula 0, atau sesuai save.
2. Tekan `R`: resep terkunci hingga berbicara dengan Chef Bimo.
3. Beli bahan di pasar; buka tas/buku resep untuk melihat jumlah yang berubah.
4. Tekan `J`: jurnal menandai belajar resep dan belanja bahan.
5. Masak tiga tahap lalu antarkan ke Bu Sari. Jurnal harus menampilkan semua tugas selesai.
6. Tutup panel dengan `Esc`, klik X, atau klik area luar panel.

Visual tetap berupa pixel art prosedural; interior rumah tetap terlihat dari luar dan tidak ada loading saat masuk.

## v0.8 — Kebun Bayam Interaktif

Kebun di pojok kiri atas kampung sekarang dapat ditanami dan dipanen. Ada **3 petak**, **3 bibit awal gratis**, dan bibit tambahan seharga **5 Koin Ceria** di pasar.

Cara bermain:
1. Dekati kebun sayur di kiri atas lalu tekan **E / AKSI**.
2. Pilih **Tanam** pada petak kosong; satu bibit terpakai.
3. Pilih **Siram** pada petak yang baru ditanam.
4. Pergi ke rumah, gunakan **kasur**, dan **tidur** untuk maju ke hari berikutnya. Pertumbuhan berdasarkan hari dalam game, **bukan waktu tunggu nyata**.
5. Kembali ke kebun dan pilih **Panen**. Setiap petak memberikan **2 bayam + 1 bibit**, masuk ke inventori. Petak dapat ditanami ulang.

Bayam hasil panen bisa digunakan langsung untuk resep **Nasi Telur Sayur**, sehingga pemain tidak wajib membeli bayam di pasar. Resep, quest Bu Sari, minigame memasak, sistem koin, dan interior terbuka tetap digunakan.

Implementasi modular:
- `src/systems/GardenSystem.js`: validasi, penanaman, penyiraman, pertumbuhan harian, panen dan benih.
- `src/world/GardenArt.js`: tampilan pixel art tiga petak dengan tahap pertumbuhan.
- `src/world/WorldGeometry.js`: area interaksi kebun.
- `src/scenes/WorldScene.js` dan `src/scenes/UIScene.js`: interaksi, tombol, dan petunjuk tujuan.
- `src/ui/PlayerNotebook.js`: jumlah bibit dan status petak di tas.
- `tests/garden.test.mjs`: tes regresi benih, tahapan, panen, migrasi save, dan integrasi resep.

**Penyimpanan:** tetap menggunakan key LocalStorage yang sama seperti versi sebelumnya. Data kebun ditambahkan dengan nilai default untuk save lama. Jika membuka game setelah update, progres sebelumnya tetap tersedia.

**Catatan:** progres tumbuh baru berubah ketika hari game bertambah melalui kasur. Angka indikator gizi tetap sekadar poin permainan. Pengujian GitHub Actions mencakup sintaks dan logika; interaksi visual end-to-end tetap perlu dicoba pada perangkat.


## v0.9 — Empat Tanaman dan Empat Resep

**Tanaman:** Bayam (1 hari), Kangkung (1 hari), Wortel (2 hari), dan Tomat (2 hari). Pemain dapat memilih benih saat menanam di salah satu dari tiga petak kebun, lalu menyiram dan tidur untuk memajukan hari. Setiap panen menghasilkan dua sayuran dan mengembalikan satu bibit dari tanaman yang sama.

Bibit awal pada save baru: 3 bayam, 1 wortel, 1 tomat, 1 kangkung. Bibit tambahan tersedia di pasar dengan harga masing-masing 5, 7, 8, dan 6 KC. Bahan sayur juga bisa dibeli secara langsung.

**Resep:**
- Nasi Telur Sayur: beras + telur + bayam (quest awal Bu Sari).
- Sup Wortel Tomat: wortel + tomat.
- Tumis Kangkung: kangkung + telur.
- Nasi Sayur Pelangi: beras + wortel + tomat + kangkung.

Temui Chef Bimo untuk mempelajari resep satu per satu. Di kompor rumah, pilih resep yang sudah terbuka dan cukup bahan, lalu selesaikan tiga tahap minigame. Buku resep dan tas sekarang menampilkan seluruh bahan, bibit, dan status empat resep. Memasak menu baru memberikan poin gizi permainan tanpa menyelesaikan quest Bu Sari secara otomatis.

**Kompatibilitas:** save lama tetap memakai key LocalStorage sebelumnya, jumlah bibit bayam dan petak bayam lama dipertahankan. Saat reset, jumlah bibit seluruh tanaman dikembalikan ke awal. Tidak ada scene loading ketika masuk rumah.

**Pengujian:** `tests/v09.test.mjs` mengecek migrasi save lama, fase panen masing-masing tanaman, pemakaian bahan resep, dan konsistensi quest pertama. GitHub Actions menjalankan seluruh pengujian Node.js. Perilaku browser masih perlu dicoba langsung pada perangkat.


## v1.0 — Kampung yang Lebih Hidup

Peternakan ayam dan kolam ikan kini ditambahkan langsung pada `WorldScene`; rumah tetap menampilkan interior dollhouse tanpa transisi.

### Kandang ayam — kanan atas peta
- Dekati kandang ayam, tekan **E / AKSI**, beri pakan **3 Koin Ceria**.
- Setelah diberi makan, pilih **Kumpulkan 2 telur**. Maksimal satu kali per hari dalam game.
- Telur langsung masuk ke tas dan dapat dipakai pada Nasi Telur Sayur atau Tumis Kangkung.
- Setelah tidur dan memulai hari baru, ayam dapat diberi pakan kembali.

### Kolam ikan — kanan bawah peta
- Datangi dermaga kolam dan tekan **E / AKSI**.
- Pilih **Lempar Kail** tiga kali untuk memperoleh **1 ikan**. Maksimal satu kali per hari.
- Ikan masuk ke inventori dan dapat dimasak menjadi **Ikan Panggang Tomat** (ikan + tomat). Resep dipelajari dari Chef Bimo.

### Rutinitas NPC
- Bu Sari memiliki beberapa lintasan berjalan: jalan kampung, mengunjungi sisi kebun, dan mendekati area pasar.
- Chef Bimo bergerak dalam beberapa pola pendek di restoran, sehingga interaksi resep tetap tersedia.
- Fase **Pagi / Siang / Sore** berganti setiap sekitar 30 detik saat game berjalan, dan pola Bu Sari juga berbeda menurut hari. Ini adalah waktu simulasi, bukan waktu dunia nyata.
- Label fase ditampilkan dalam HUD.

### Perubahan teknis
- `src/systems/DailyLifeSystem.js`: pakan, telur, memancing dan pembatasan kegiatan per hari, disimpan dalam `GameState.activities`.
- `src/world/FarmArt.js`: kandang ayam, ayam bergerak, kolam, ikan bergerak, dan dermaga dari kode prosedural.
- `src/world/WorldGeometry.js`: dua titik interaksi baru serta hitbox kandang dan air kolam.
- `tests/daily-life.test.mjs`: tes migrasi save, perhitungan koin, telur, ikan, resep, dan keterjangkauan lokasi.
- `src/ui/PlayerNotebook.js`: ikan tersedia di inventori dan resep Ikan Panggang Tomat muncul di buku resep.

**Kompatibilitas:** Key LocalStorage lama tidak berubah. Save lama memperoleh nilai awal untuk sistem kegiatan baru; tanaman, koin, quest, dan resep yang sudah diselesaikan tetap dipertahankan. Tombol reset mengulang kegiatan harian juga.

**Catatan pengujian:** GitHub Actions menguji sintaks dan logika Node.js, termasuk akses rute berdasarkan hitbox. Tampilan aktual serta respons sentuhan/kontrol di browser tetap perlu diuji manual. Indikator gizi hanyalah poin di dalam game.


## v1.0.1 — Perbaikan visibilitas kandang dan kolam

- Kandang ayam berada di kanan atas; kolam ikan di kanan bawah. Kedua objek sekarang memakai lapisan gambar yang lebih depan, bidang lebih luas, dan label lebih besar.
- Ada tombol **🐔 Lihat Kandang Ayam** dan **🎣 Lihat Kolam Ikan** di atas game. Klik tombol untuk menampilkan penanda lingkaran besar dan nama lokasi di peta selama beberapa detik.
- Tombol hanya menunjukkan lokasi; tidak memindahkan pemain atau menghapus progres.
- Untuk berinteraksi tetap jalan mendekati bangunan dan tekan **E / AKSI**.

Jika browser masih menampilkan tampilan lama, muat ulang dengan **Cmd+Shift+R** (Mac) atau **Ctrl+Shift+R** (Windows). Pemeriksaan sintaks otomatis tidak menggantikan inspeksi visual di browser.

## v1.1 — QA Desktop/HP dan Visual Polish

- Lapisan gambar kandang dan kolam dirender di belakang pemain; karakter tidak lagi tertutup oleh permukaan kolam.
- Jalan kecil di sisi kanan restoran memberi petunjuk visual menuju kandang. Batu pijakan menuju dermaga dan detail teratai/pantulan air ditambahkan.
- Tombol arah diperbesar ke 56 × 56 px; tombol AKSI setinggi minimal 64 px. Di layar sempit, tata letak kontrol diatur agar mudah disentuh.
- Label interaksi yang mudah dibaca tampil sebagai baris HTML di bawah game, selain petunjuk kecil di kanvas.
- Input berjalan dibersihkan setiap kali dialog terbuka sehingga karakter tidak terus bergerak setelah menu ditutup.
- Minigame telur memiliki target lebih lebar dan indikator lebih lambat.
- Bridge `?qa=1` hanya tersedia saat game dibuka pada localhost/127.0.0.1 untuk pengujian browser, tidak aktif pada GitHub Pages.

### Pengujian otomatis

GitHub Actions sekarang menjalankan dua pekerjaan:
1. **syntax** — `node --check` dan seluruh tes logika `node --test tests/*.test.mjs`.
2. **browser** — Chromium Playwright dalam dua konfigurasi: desktop 1280×850 dan perangkat seluler Pixel 7 393×852.

`tests/browser-smoke.mjs` memeriksa game berhasil dibuka, delapan lokasi interaksi, tas dan jurnal quest, pembelian bahan, belajar resep, tiga tahap memasak, penyerahan quest, memelihara ayam, memancing, dan ukuran kontrol HP. Pengujian menjalankan interaksi game sungguhan, tetapi memindahkan karakter antar lokasi melalui QA bridge supaya tidak bergantung pada waktu tempuh; tes BFS dalam `tests/world.test.mjs` memverifikasi keterjangkauan lokasi berdasarkan collision.

Tangkapan layar desktop dan HP diunggah sebagai artifact **qa-browser-screenshots** pada halaman Actions, bila run berhasil atau gagal setelah membuat gambar.

**Batas pengujian:** pengecekan Chromium headless tidak menggantikan tes pengguna langsung pada Safari iPhone, browser Android, atau semua ukuran layar. Sebelum rilis publik lebih luas, cobalah navigasi dengan kontrol sentuh di perangkat asli.

## v1.2 — Visual polish berdasarkan screenshot QA

Screenshot pengujian v1.1 pada desktop dan simulasi Pixel 7 menunjukkan beberapa masalah yang dapat diverifikasi secara visual:
- Panel quest di HP terlalu sempit dan teks menjadi kolom vertikal sangat panjang.
- Posisi ayam berdekatan dengan tulisan restoran, sehingga hierarki lokasi terlihat kurang jelas.
- Furnitur rumah masih datar, terutama kasur, meja makan, dan rak dapur.

Perbaikan:
- Panel quest ditampilkan penuh satu baris pada viewport hingga 700 px; tombol pemulihan dan reset berada di bawahnya.
- Koordinat ayam dipindah di dalam kandang agar tidak berimpit dengan label restoran.
- Kasur mendapat motif patchwork, kabinet dapur dilengkapi kendi, meja makan diberi cangkir, dan meja pasar diberi detail rotan.
- Sprite pemain memiliki tas kecil sebagai aksesori tambahan.
- Daun beterbangan dan titik kilau bergerak ringan melalui `AmbientArt.js`; air kolam diberi riak animasi.
- Pengujian browser HP menambahkan asersi lebar panel quest dan tinggi panel sehingga regresi layout mudah terdeteksi.

**Batasan:** screenshot berasal dari Chromium headless desktop dan emulasi Pixel 7. Pengujian sentuhan langsung pada perangkat fisik dan Safari belum dilakukan.

## v1.3 — Pemulihan Denah Konsep Awal

**Acuan tunggal:** [`docs/denah-konsep-awal.svg`](docs/denah-konsep-awal.svg). Susunan enam blok mengikuti SVG yang diberikan pengguna, dipetakan dari 360×270 ke kanvas Phaser 960×600.

| | Kiri | Tengah | Kanan |
|---|---|---|---|
| **Utara / atas** | Rumah Pemain + Kebun dan Ternak di sebelah rumah | Rumah Warga | Kolam Ikan |
| **Selatan / bawah** | Pasar Tradisional | Restoran Sehat | Toko Swalayan |

Jalan horizontal melintasi peta pada y sekitar 282. Jalan vertikal membatasi blok pada x sekitar 448 dan 760. Tidak ada bangunan yang memotong jalur. Rumah pemain, rumah warga, pasar, restoran, dan toko swalayan tetap memakai interior potongan/dollhouse yang terlihat dari peta; **tidak perlu scene lain untuk masuk**.

Perubahan utama:
- Rumah pemain dipindah ke **kiri atas**, kebun dan kandang ditempatkan bersebelahan dengan rumah; kolam ikan dipindah ke **kanan atas**.
- Rumah warga dan toko swalayan kini benar-benar dirender beserta furnitur. Toko swalayan menyediakan pembelian bahan; rumah warga memiliki dialog.
- Pasar tradisional **kiri bawah** dan restoran sehat **tengah bawah**.
- Pintu, dinding, furnitur, titik interaksi, titik awal pemain, penunjuk arah, posisi NPC dan rute jalan dikalibrasi ulang di `WorldGeometry.js` dan `WorldScene.js`.
- Tombol **Kembali ke jalan**, reset, penanda kandang/kolam, dan instruksi quest merujuk lokasi baru.
- Save lama tetap menggunakan `kampung-gizi-pixel-v02`: koin, resep, inventori, kebun, peternakan dan quest tidak dibuang; hanya posisi pemain yang dipulihkan bila tersimpan di dinding baru.
- Tes `tests/world.test.mjs` memeriksa **urutan blok asli, lima pintu, interior, seluruh 10 titik interaksi, dan jalur menuju lokasi tanpa menerobos dinding/air**. Tes browser `tests/browser-smoke.mjs` diperbarui ke koordinat baru.

**Catatan:** gambar SVG berukuran 360×270 sementara dunia game berukuran 960×600, sehingga denah diproyeksikan dengan skala sumbu berbeda, dengan posisi relatif dan susunan enam blok tetap dipertahankan. Grafik dan interaksi masih berbasis Phaser dan tidak memerlukan instalasi ulang.


## v1.4 — Chibi & Character Activity Animation

Versi ini **tidak mengubah** denah v1.3, `WorldGeometry.js`, titik interaksi, jalan, atau collision. Rumah pemain/kebun/ternak kiri atas, rumah warga tengah atas, kolam kanan atas, pasar kiri bawah, restoran tengah bawah, dan swalayan kanan bawah tetap mengikuti `docs/denah-konsep-awal.svg`.

Perubahan visual:
- Karakter pemain, Bu Sari, dan Chef Bimo digambar ulang sebagai **sprite chibi prosedural 42×48**: kepala besar, wajah lebih ekspresif, bayangan, kerah, tas, celemek, dan detail langkah.
- Berjalan empat arah (atas, bawah, kiri dan kanan) dengan tiga pose per orientasi; orientasi samping dicerminkan untuk arah kiri/kanan, dengan bob dan debu langkah yang hanya memengaruhi gambar (bukan koordinat collision).
- Enam set pose kegiatan, masing-masing tiga frame: **tidur, menanam, menyiram, memanen, memasak, dan memancing**. `ActionAnimator` menampilkan pose serta partikel (percikan air, hasil panen, Zzz, panas, dan riak).
- Pose kegiatan hanya diputar **setelah aksi benar-benar dipilih dan berhasil**, bukan ketika sekadar membuka menu tempat.
- Animasi kegiatan berlangsung singkat via jam internal Phaser dan tidak mengubah nilai inventori, hari, koin, posisi pemain, data NPC, atau save lama.

Teknis:
- `src/world/WorldArt.js`: generator tekstur 42×48 untuk karakter dan enam aktivitas.
- `src/entities/Player.js`: gerak 4 arah, langkah halus dan debu tanpa modifikasi hitbox.
- `src/systems/ActionAnimator.js`: frame action, durasi, dan efek yang dibersihkan otomatis setelah animasi.
- `src/scenes/WorldScene.js` dan `src/scenes/UIScene.js`: integrasi animasi pada aksi interaktif.
- `tests/animation.test.mjs`: tes pose yang dibuat, pemanggilan aktivitas, dan ketetapan koordinat denah.
- `tests/browser-smoke.mjs`: simulasi tindakan tanam, siram, panen, tidur, masak dan pancing, serta pengecekan pose aktif pada browser.

Batasan: animasi berjalan dan kegiatan diuji dengan Chromium headless pada konfigurasi desktop dan emulasi HP; kualitas visual di perangkat fisik iOS/Android tetap perlu divalidasi secara manual.


## v1.5 — NPC, Dialog Harian dan Pertemanan

Kampung memiliki **empat warga yang bisa diajak bicara**: Bu Sari, Chef Bimo, Pak Tani, dan Nia. Dua karakter tambahan dibuat menggunakan sprite chibi prosedural, tanpa aset eksternal.

- **Pak Tani** berjalan di jalan setapak antara kebun dan kandang ayam. Ia memberi tips tanaman, pengairan, bibit, dan waktu panen.
- **Nia** berjalan antara area pasar dan sisi rumah warga. Ia bercerita tentang pilihan makanan, sayuran, dan aktivitas kampung.
- **Bu Sari** tetap memberi quest utama Nasi Telur Sayur. Berbicara dengannya sekarang juga meningkatkan pertemanan.
- **Chef Bimo** tetap mengajar semua resep; dialog hariannya muncul saat pemain membuka menu belajar resep.

**Dialog berubah** antara pagi, siang, dan sore serta berganti variasi di hari berikutnya.

**Sistem pertemanan:** berbicara dengan satu warga untuk pertama kalinya dalam satu hari menambah **1 hati**, sampai **5 hati** per warga. Sapaan berikutnya pada hari yang sama tidak menambah hati. Tidur di kasur memulai hari berikutnya, sehingga pemain bisa menyapa lagi. Pertemanan tidak memerlukan koin dan tidak menghambat quest atau resep.

**Menu 🤝 Teman (tombol F):** menampilkan empat warga, lokasi rutinitas, dan hati pertemanan. Menu responsif di HP dan tidak membocorkan data pemain.

**Penyimpanan:** sistem `src/systems/SocialSystem.js` menyimpan progres dalam `GameState.data.social`. **Key LocalStorage lama tidak berubah.** Save lama otomatis mendapat profil pertemanan tanpa menghapus koin, resep, kebun, inventori, quest, atau posisi pemain. Reset progres juga mengembalikan seluruh hati ke nol.

**Denah:** `docs/denah-konsep-awal.svg`, ukuran, pintu, interior, collision dan seluruh enam blok tetap mengikuti v1.3. Dua NPC baru hanya menggunakan ruang berjalan yang sudah ada; tidak menambah atau memindahkan bangunan.

**Pengujian:** `tests/social.test.mjs` memverifikasi migrasi save lama, batas lima hati, satu peningkatan per hari, variasi dialog, reset, dan posisi rute. `tests/browser-smoke.mjs` menguji dialog dan hati lewat interaksi browser desktop, serta menu Teman di simulasi HP Pixel 7.


## v1.6 — Edukasi Gizi Interaktif dan Isi Piringku

Tanpa memindahkan keenam blok peta atau mengganti key penyimpanan, versi ini menambah:
- **🧠 Kuis Gizi:** tiga pertanyaan pilihan ganda per sesi tentang nasi, lauk berprotein, sayur, kebiasaan sebelum makan, dan makan beragam. Jawaban salah menjelaskan alasannya dan boleh dicoba lagi tanpa penalti. Pertanyaan bergilir menurut hari permainan.
- **🍽️ Tantangan Isi Piringku:** pilih makanan pokok, lauk, sayur dan buah melalui empat tahap; setiap pilihan langsung divisualisasikan dalam enam bagian piring (2 makanan pokok, 1 lauk, 2 sayur, 1 buah) sesuai penyederhanaan proporsi Kemenkes.
- **NPC pembimbing:** Bu Sari menawarkan Isi Piringku, Chef Bimo menawarkan kuis kelompok makanan, Pak Tani mengajak mengenal sayur, dan Nia memberi tantangan bekal bergizi. Quest dan kegiatan NPC lama tetap berfungsi.
- **Hadiah belajar:** kuis selesai memberi **3 ⭐ dan 15 Koin Ceria**, tantangan piring memberi **2 ⭐ dan 10 Koin Ceria**. Setiap jenis hadiah hanya dapat diperoleh **sekali per hari dalam game**. Bermain ulang diperbolehkan tanpa hadiah tambahan; menjawab salah tidak mengurangi uang.
- **HUD dan menu:** tombol **⭐ Belajar** atau pintasan **G**, tampilan piring responsif untuk HP, dan jumlah bintang di HUD.
- **Penyimpanan:** `GameState.data.learning` menyimpan bintang dan waktu klaim hadiah. Save lama tetap menggunakan `kampung-gizi-pixel-v02`; reset mengulang progres belajar beserta progres game lainnya.

**Dasar materi gizi:**
- [Kemenkes RI — Isi Piringku](https://ayosehat.kemkes.go.id/isi-piringku-kebutuhan-gizi-harian-seimbang): 50% sayur dan buah, 50% makanan pokok dan lauk; lebih rinci per kelompok adalah 2/3 setengah piring untuk makanan pokok dan sayur, 1/3 setengah piring untuk lauk dan buah.
- [Kemendikdasmen — Isi Piringku dengan Menu Gizi Seimbang](https://ditsd.kemendikdasmen.go.id/artikel/detail/isi-piringku-dengan-menu-gizi-seimbang): penjelasan untuk siswa SD tentang pentingnya variasi makanan.
- Piring enam bagian dalam permainan hanyalah media belajar proporsi, **bukan** takaran individual, nasihat medis, atau alat evaluasi kesehatan.

**Pengujian:** `tests/learning.test.mjs` mencakup kategori makanan, soal, pilihan yang keliru, pembatasan hadiah, penyimpanan lama dan reset. `tests/browser-smoke.mjs` menjalankan kuis, pengulangan soal, konstruksi piring, pemeriksaan reward, lalu mengetes tombol sentuh menu belajar pada emulasi Pixel 7.


## v1.7 — Siklus Waktu, Malam dan Cuaca Kampung

Denah enam blok `docs/denah-konsep-awal.svg`, interior dollhouse terbuka, koordinat karakter, collision, dan seluruh gameplay v1.6 dipertahankan. Tidak ada bangunan yang ditambah, dipindah, atau dihapus.

- **Fase kampung:** Pagi → Siang → Sore → Malam. Setiap fase siang berjalan selama sekitar **35 detik saat bermain**, berhenti sewaktu dialog terbuka. Malam bertahan sampai pemain tidur di kasur; tidur mengisi energi, menambah hari, dan mengembalikan suasana pagi.
- **Visual:** cahaya keemasan pagi, siang terang, sore hangat, malam biru gelap dengan cahaya lampu dan bintang, awan bergerak, serta percikan hujan. Dibuat dengan grafis Phaser prosedural melalui `src/world/WeatherArt.js`; tanpa gambar eksternal dan tanpa scene tambahan.
- **Cuaca:** cerah, hujan, berawan menurut hari permainan (jadwal deterministik agar progres save konsisten). Hujan muncul pada hari kedua, misalnya. **Petak berkebun yang ditanam saat hujan otomatis tersiram**, termasuk bibit yang baru ditanam pada hari hujan. Hujan tidak mengubah koin atau inventori.
- **NPC:** Bu Sari, Chef Bimo, Pak Tani, dan Nia punya rute fase pagi–siang–sore–malam. Mereka berjalan lebih dekat area berteduh saat hujan, dan beraktivitas lebih terbatas saat malam. Dialog malam tersedia untuk keempat warga.
- **HUD:** panel baru menunjukkan ikon cuaca, fase, dan kondisi kampung, responsif untuk HP dan desktop.
- **Penyimpanan:** `GameState.data.timeWeather` memuat fase dan cuaca. Save lama `kampung-gizi-pixel-v02` tetap digunakan; belum ada fitur yang perlu dipasang ulang. Cuaca di dalam game **bukan prakiraan cuaca nyata**.

Pengujian otomatis `tests/time-weather.test.mjs` memeriksa urutan fase, hujan, persistensi, reset, integrasi dengan pertanian, dan keterjagaan denah; `tests/browser-smoke.mjs` memeriksa siang/malam, waktu setelah tidur, serta HUD di desktop dan emulasi HP.


## v1.8 — Misi Harian, Lencana, dan Perpustakaan Gizi

Versi ini mempertahankan **denah enam blok** pada `docs/denah-konsep-awal.svg`: Rumah Pemain (kebun dan peternakan), Rumah Warga, Kolam Ikan, Pasar Tradisional, Restoran Sehat, dan Toko Swalayan. Perpustakaan ditempatkan sebagai **ruang baca terbuka di dalam Rumah Warga (blok tengah atas)**, sehingga tidak menambah blok baru, menggeser jalan, atau mengubah dinding/collision.

### Perpustakaan & Kak Rani
- Rak dan buku gizi, karpet baca, serta **Kak Rani**, pustakawan baru dengan sprite dan rute harian.
- Pemain mendekati rak buku lalu tekan **E/AKSI** untuk mengakses kuis makanan bergizi, Isi Piringku, dan buku ringkas tentang kelompok makanan.
- Kak Rani dapat disapa, memperoleh hati pertemanan seperti warga lain, mengantar pemain ke aktivitas perpustakaan, dan meminta bantuan menaruh buku sayuran ke rak yang benar. Pilihan keliru bisa dicoba ulang.
- Tombol **📚 Perpustakaan (G)** dan penanda lokasi mengarahkan ke ruang baca; pembelajaran berlangsung di dalam perpustakaan, bukan di menu global. Dialog edukasi NPC lain menjadi petunjuk menuju perpustakaan. Chef Bimo tetap mengajarkan resep masakan.
- Materi sederhana tentang kelompok makanan dan Isi Piringku yang dibuat pada v1.6 tetap dipertahankan.

### Misi harian
- Enam kegiatan: **tanam bibit, panen sayur, masak hidangan, sapa warga, membantu Kak Rani merapikan buku, belajar gizi**.
- Setiap jenis misi memiliki hadiah bintang dan Koin Ceria. Kemajuan dihitung dari aksi berhasil, bukan dari tombol yang hanya dibuka.
- Pemain membuka **🏅 Misi (M)** untuk melihat progres dan mengklaim hadiah. Hadiah tidak dapat diklaim lagi pada hari yang sama.
- Tidur memulai hari baru dan mereset hanya progres misi harian; total aktivitas dan lencana tetap tersimpan.

### Lencana pencapaian
- Tujuh lencana: Sahabat Kebun, Panen Ceria, Koki Kecil, Teman Baik, Penolong Perpustakaan, Pembaca Gizi, dan Bintang Kampung.
- Pencapaian terbuka berdasarkan aktivitas sepanjang permainan dan dapat diklaim **satu kali saja**, termasuk setelah ganti hari.

### Kompatibilitas dan QA
- `src/systems/MissionSystem.js` menyimpan tugas, progres, klaim, total aktivitas, serta lencana di `GameState.data.missions`; `src/systems/SocialSystem.js` menambah teman `rani`. Key `kampung-gizi-pixel-v02` tidak berubah.
- Save v1.7 dan lebih lama dilengkapi data baru secara aman; inventori, resep, hati lama, waktu dan cuaca, serta quest Bu Sari tetap dipertahankan.
- `tests/missions.test.mjs` menguji batas klaim, hadiah, perpindahan hari, kompatibilitas save, serta ruang perpustakaan dan rute Kak Rani. Tes browser `tests/browser-smoke.mjs` kini memeriksa pembelajaran dari perpustakaan, menu misi, klaim lencana, dan kontrol HP.


## Pembaruan lokasi rumah keluarga & perlindungan saat hujan

Blok **kanan bawah** yang sebelumnya merupakan **Toko Swalayan** sekarang menjadi **Rumah Pak Tani & Bu Sari**. Posisi dan pintu bangunan sama seperti sebelumnya, tetapi bagian dalamnya menjadi rumah cozy dengan tempat tidur, meja, dan tanaman. Fitur jual-beli bahan dan bibit tetap tersedia di **Pasar Tradisional kiri bawah**; progres inventori, koin, misi, relasi NPC, dan key simpan lama tidak berubah.

- **Cuaca hujan:** Pak Tani dan Bu Sari **berjalan melalui jalan kampung dan pintu depan** ke rumah keluarga di kanan bawah; **Nia berjalan ke dalam Pasar Tradisional** untuk berteduh.
- Setelah mencapai tujuannya, ketiganya **berhenti dan tetap berada di dalam** sampai hujan selesai. Pergantian fase siang/sore/malam saat masih hujan tidak membuat mereka keluar.
- **Sesudah hujan selesai:** NPC kembali melalui pintu bangunan menuju jalan kampung.
- Jalur shelter didefinisikan di `src/world/ShelterRoutes.js`, memakai rute non-looping di `src/entities/NPC.js` agar NPC benar-benar mencapai interior.
- `tests/shelters.test.mjs` menguji jalur yang ditempuh dan collision pintu/interior; `tests/browser-smoke.mjs` menguji kepindahan tiga NPC dan keluarnya setelah hujan, termasuk simulasi HP.
- **Tidak ada pemasangan ulang atau perubahan denah, jalur luar, atau penyimpanan**; perubahan ini merupakan penggantian fungsi satu blok yang sudah ada.
