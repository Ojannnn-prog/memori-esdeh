// ================================================
// firebase.js — Integrasi Firebase Firestore
// Menggantikan sistem localStorage untuk pesan
// ================================================

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-analytics.js";
import {
    getFirestore,
    collection,
    addDoc,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

// === Konfigurasi Firebase ===
const firebaseConfig = {
    apiKey: "AIzaSyAvksal1MYvKREppoSzThhysNQz6vIn1PE",
    authDomain: "memori-sd-sukaasih-5621f.firebaseapp.com",
    projectId: "memori-sd-sukaasih-5621f",
    storageBucket: "memori-sd-sukaasih-5621f.firebasestorage.app",
    messagingSenderId: "455739963422",
    appId: "1:455739963422:web:2dc6047f8bc950c72e160f",
    measurementId: "G-QVSX6PTENR"
};

// === Inisialisasi ===
const app       = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db        = getFirestore(app);

// === Referensi koleksi pesan ===
const messagesRef = collection(db, "pesan");

// === Render satu kartu pesan ===
function renderCard(data) {
    const date = data.timestamp
        ? data.timestamp.toDate().toLocaleDateString('id-ID', {
              year: 'numeric', month: 'long', day: 'numeric'
          })
        : '—';

    return `
        <div class="message-card">
            <h4>${escapeHtml(data.name)}</h4>
            <div class="message-date">${date}</div>
            <p>${escapeHtml(data.text)}</p>
        </div>`;
}

// Mencegah XSS sederhana
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

// === Listener real-time (otomatis update saat ada pesan baru) ===
const messagesList = document.getElementById('messages-list');

if (messagesList) {
    const q = query(messagesRef, orderBy("timestamp", "desc"));

    onSnapshot(q, (snapshot) => {
        if (snapshot.empty) {
            messagesList.innerHTML = '<p style="text-align:center; color:var(--sepia-light);">Belum ada pesan. Jadilah yang pertama!</p>';
            return;
        }
        messagesList.innerHTML = snapshot.docs.map(doc => renderCard(doc.data())).join('');
    }, (err) => {
        console.error("Gagal memuat pesan:", err);
        messagesList.innerHTML = '<p style="text-align:center; color:red;">Gagal memuat pesan. Cek koneksi internet.</p>';
    });
}

// === Submit pesan ke Firestore ===
const messageForm  = document.getElementById('message-form');
const senderName   = document.getElementById('sender-name');
const senderMessage = document.getElementById('sender-message');
const submitBtn    = messageForm ? messageForm.querySelector('button[type="submit"]') : null;

if (messageForm) {
    messageForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = senderName.value.trim();
        const text = senderMessage.value.trim();

        if (!name || !text) return;

        // Nonaktifkan tombol sementara
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        }

        try {
            await addDoc(messagesRef, {
                name,
                text,
                timestamp: serverTimestamp()
            });

            // Reset form
            senderName.value = '';
            senderMessage.value = '';

        } catch (err) {
            console.error("Gagal kirim pesan:", err);
            alert("Gagal mengirim pesan. Coba lagi.");
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Pesan';
            }
        }
    });
}
