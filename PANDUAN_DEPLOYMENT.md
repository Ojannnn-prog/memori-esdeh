# Panduan Deployment & Database (Website Kenangan)

Panduan ini berisi langkah-langkah detail untuk meng-online-kan website Anda menggunakan **GitHub Pages** dan membuat database **Firebase Firestore** agar fitur Buku Tamu (Pesan & Kesan) dapat tersimpan secara permanen dan dilihat oleh semua orang.

---

## TAHAP 1: Upload ke GitHub & Aktifkan GitHub Pages

Tahap ini bertujuan untuk membuat website Anda bisa diakses oleh publik melalui link (misal: `https://username.github.io/website-kenangan`).

### 1. Buat Repository di GitHub
1. Buka [GitHub.com](https://github.com) dan login ke akun Anda.
2. Klik tombol **New** (warna hijau) di sebelah kiri atas untuk membuat repository baru.
3. Isi **Repository name** (misal: `memori-merah-putih`).
4. Pastikan memilih **Public** agar website bisa diakses orang lain.
5. Jangan centang "Add a README file" (kosongkan saja).
6. Klik **Create repository**.

### 2. Upload File Proyek
1. Buka aplikasi **GitHub Desktop** atau terminal (Git Bash/Command Prompt) di komputer Anda.
2. Jika menggunakan Git melalui terminal, buka folder `Website_memories` Anda dan jalankan perintah berikut secara berurutan:
   ```bash
   git init
   git add .
   git commit -m "Rilis pertama website kenangan"
   git branch -M main
   git remote add origin https://github.com/USERNAME-ANDA/memori-merah-putih.git
   git push -u origin main
   ```
   *(Catatan: Ganti URL origin dengan URL repository yang baru Anda buat).*
3. Jika menggunakan GitHub Desktop, cukup *Drag & Drop* folder proyek Anda ke aplikasinya, buat commit, dan klik **Publish repository**.

### 3. Aktifkan GitHub Pages
1. Kembali ke halaman repository Anda di GitHub.com.
2. Klik tab **Settings** (ikon roda gigi) di bagian atas.
3. Di menu sebelah kiri, cari dan klik bagian **Pages**.
4. Di bagian **Build and deployment**, cari tulisan **Branch**.
5. Ubah tulisan `None` menjadi `main` (atau `master`), lalu klik **Save**.
6. Tunggu sekitar 1-3 menit. Refresh halaman, dan Anda akan melihat link website Anda di bagian atas (contoh: `Your site is live at https://...`).

---

## TAHAP 2: Membuat Database Firebase (Firestore)

Tahap ini bertujuan untuk menyediakan "penampungan data" agar fitur Pesan dari semua pengunjung bisa tersimpan permanen.

### 1. Buat Proyek Firebase
1. Buka [Firebase Console](https://console.firebase.google.com/) dan login menggunakan akun Google.
2. Klik **Add Project** (Tambah Proyek).
3. Beri nama proyek (misal: `memori-kelas-sd`).
4. Anda bisa menonaktifkan "Google Analytics" untuk proyek ini (opsional).
5. Klik **Create Project**.

### 2. Buat Database Firestore
1. Setelah proyek selesai dibuat, klik **Build** di menu kiri, lalu pilih **Firestore Database**.
2. Klik tombol **Create Database**.
3. Saat ditanya *Secure rules*, pilih **Start in test mode** (Mode pengujian). Ini sangat penting agar web Anda bisa langsung membaca dan menulis pesan tanpa harus login/autentikasi.
4. Pilih lokasi server (biarkan *default* atau pilih lokasi Asia/Jakarta).
5. Klik **Enable**. Database Anda sekarang siap!

### 3. Dapatkan Kode Konfigurasi (Config)
1. Di Firebase Console, klik ikon roda gigi (⚙️ Project settings) di menu kiri atas.
2. Scroll ke bawah ke bagian **Your apps**.
3. Klik ikon web (`</>`) untuk menambahkan aplikasi web.
4. Beri nama aplikasi (misal: `web-kenangan`), lalu klik **Register app**.
5. Anda akan melihat sebuah blok kode JavaScript yang berisi `firebaseConfig` (berisi apiKey, authDomain, projectId, dll).
6. **Salin / Copy blok kode `firebaseConfig` tersebut.**

---

## TAHAP 3: Menghubungkan Firebase ke Website

Setelah Anda menyelesaikan Tahap 2 dan mendapatkan kode konfigurasi, beritahu AI Assistant (saya) dan paste kode konfigurasi tersebut ke kolom chat. 

**Contoh kode konfigurasi yang saya butuhkan:**
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyB-xxxxxxxxx",
  authDomain: "memori-kelas-sd.firebaseapp.com",
  projectId: "memori-kelas-sd",
  storageBucket: "memori-kelas-sd.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdefg"
};
```

Nanti, saya akan langsung membantu Anda memperbarui file `index.html` dan `script.js` untuk mengganti sistem `localStorage` menjadi sistem **Firestore secara real-time**.

---
*Jika di kemudian hari Anda ingin menambahkan foto (Tahap update), cukup masukkan foto baru ke folder `assets/images/`, lalu kita akan memperbarui kode di `index.html` seperti yang kita lakukan sebelumnya.*
