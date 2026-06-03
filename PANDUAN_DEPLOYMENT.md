# Panduan Deployment & Update — Website Kenangan

---

## ✅ TAHAP 1: Aktifkan Firestore di Firebase Console

Sebelum deploy, pastikan database sudah aktif dengan pengaturan benar.

1. Buka [Firebase Console](https://console.firebase.google.com/) → pilih proyek `memori-sd-sukaasih-5621f`
2. Di menu kiri, klik **Build → Firestore Database**
3. Klik **Rules** (tab di bagian atas)
4. Pastikan isinya seperti ini (agar semua orang bisa membaca & menulis pesan):
   ```
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /pesan/{docId} {
         allow read, write: if true;
       }
     }
   }
   ```
5. Klik **Publish**

---

## 🚀 TAHAP 2: Deploy Pertama ke GitHub Pages

### Langkah 2.1 — Buat Repository di GitHub
1. Buka [github.com](https://github.com) → Login
2. Klik tombol **New** (hijau)
3. Nama repository: `memori-merah-putih` (atau nama lain)
4. Pilih **Public**
5. Klik **Create repository** (jangan centang README)

### Langkah 2.2 — Upload via Terminal (PowerShell/Git Bash)

Buka terminal di dalam folder `Website_memories`, lalu jalankan perintah ini **satu per satu**:

```bash
# 1. Inisialisasi Git (hanya sekali di awal)
git init

# 2. Tambahkan semua file ke staging
git add .

# 3. Buat commit pertama
git commit -m "Rilis pertama website kenangan"

# 4. Buat branch utama bernama main
git branch -M main

# 5. Hubungkan ke repository GitHub (ganti URL dengan milik Anda)
git remote add origin https://github.com/USERNAME-ANDA/memori-merah-putih.git

# 6. Push ke GitHub
git push -u origin main
```

> **Catatan:** Ganti `USERNAME-ANDA` dan `memori-merah-putih` dengan username dan nama repo GitHub Anda.

### Langkah 2.3 — Aktifkan GitHub Pages
1. Buka repository di GitHub
2. Klik **Settings** → pilih **Pages** di menu kiri
3. Di bagian **Branch**, ubah dari `None` menjadi `main` → klik **Save**
4. Tunggu 1-3 menit → link website akan muncul di bagian atas

---

## 🔄 TAHAP 3: Cara Update Website (Setelah Deploy Pertama)

Setiap kali Anda menambahkan foto baru, mengubah teks, atau memperbarui kode, cukup jalankan **3 perintah ini** di terminal:

```bash
# 1. Tambahkan semua perubahan
git add .

# 2. Buat commit dengan keterangan perubahan
git commit -m "Tambah foto baru dan update galeri"

# 3. Kirim ke GitHub (otomatis update GitHub Pages)
git push
```

> 💡 **Tips:** Sesuaikan pesan commit dengan apa yang Anda ubah, misal:
> - `"Tambah 10 foto baru ke galeri"`
> - `"Perbaiki tampilan timeline 2026"`
> - `"Update musik playlist"`

Setelah `git push` selesai, website Anda di GitHub Pages akan **otomatis diperbarui** dalam 1-2 menit.

---

## 📁 Struktur File Proyek

```
Website_memories/
├── index.html          ← Halaman utama
├── style.css           ← Semua gaya tampilan
├── script.js           ← Logika musik, lightbox, dark mode
├── firebase.js         ← Koneksi Firestore (pesan/guestbook)
├── PANDUAN_DEPLOYMENT.md
└── assets/
    ├── images/         ← Letakkan foto-foto di sini
    └── music/          ← Letakkan file .mp3 di sini
```

---

## ⚠️ Penting: Firestore Security Rules

Saat ini rules diset `allow read, write: if true` (mode terbuka untuk testing).  
Jika website sudah aktif dan ramai, pertimbangkan untuk mengubahnya agar hanya mengizinkan `write` yang valid.

---

*Panduan ini dibuat untuk kemudahan pengembangan dan deployment proyek Website Kenangan SD Sukaasih.*
