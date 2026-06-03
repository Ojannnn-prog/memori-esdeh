document.addEventListener('DOMContentLoaded', () => {
    // === UI Elements ===
    const startBtn = document.getElementById('start-btn');
    const introOverlay = document.getElementById('intro-overlay');
    const ornaments = document.querySelectorAll('.ornament');
    
    // === Audio Elements ===
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const progress = document.getElementById('progress');
    const progressContainer = document.getElementById('progress-container');
    const trackTitle = document.getElementById('track-title');
    const vinyl = document.getElementById('vinyl');

    // === Playlist Setup ===
    // Anda bisa menambahkan lebih banyak lagu ke dalam array ini.
    // Pastikan file .mp3 tersedia di folder assets/music/
    const songs = [
        { title: 'Monokrom - Tulus', src: 'assets/music/TULUS - Monokrom (Official Lyric Video) - Tulus.mp3' },
        { title: 'Tujuh Belas - Tulus', src: 'assets/music/TULUS - Tujuh Belas (Official Music Video) - Tulus.mp3' }
    ];
    let songIndex = 0;
    let isPlaying = false;

    // Load initial song
    loadSong(songs[songIndex]);

    function loadSong(song) {
        trackTitle.innerText = song.title;
        audio.src = song.src;
    }

    // === Player Controls ===
    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        vinyl.classList.add('spin');
        
        // Error handling if file not found
        audio.play().catch(e => {
            console.log("Audio file not found or autoplay blocked:", e);
            alert("Gagal memutar musik. Pastikan file " + songs[songIndex].src + " ada di folder Anda!");
            pauseSong();
        });
    }

    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        vinyl.classList.remove('spin');
        audio.pause();
    }

    function prevSong() {
        songIndex--;
        if (songIndex < 0) {
            songIndex = songs.length - 1;
        }
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    }

    function nextSong() {
        songIndex++;
        if (songIndex > songs.length - 1) {
            songIndex = 0;
        }
        loadSong(songs[songIndex]);
        if (isPlaying) playSong();
    }

    // === Progress Bar Update ===
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
        }
    }

    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        if(duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    }

    // === Intro Button Event (Handles Autoplay Policy & Entrance Animation) ===
    startBtn.addEventListener('click', () => {
        // 1. Fade out the intro overlay
        introOverlay.style.opacity = '0';
        setTimeout(() => {
            introOverlay.style.visibility = 'hidden';
        }, 1000); // 1s match with CSS transition

        // 2. Play the music bypassing autoplay block
        playSong();

        // 3. Trigger Antigravity Animation for ornaments
        ornaments.forEach(ornament => {
            ornament.classList.add('active');
        });
    });

    // === Event Listeners for Player ===
    playBtn.addEventListener('click', () => {
        if (isPlaying) {
            pauseSong();
        } else {
            playSong();
        }
    });

    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    audio.addEventListener('timeupdate', updateProgress);
    progressContainer.addEventListener('click', setProgress);
    
    // Auto play next song when current finishes
    audio.addEventListener('ended', nextSong);

    // === Navbar Sticky Effect enhancement ===
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.boxShadow = '0 4px 15px rgba(0,0,0,0.05)';
        }
    });

    // === Theme Toggle Logic ===
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlEl = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Check localStorage
    const savedTheme = localStorage.getItem('school_memories_theme');
    if (savedTheme === 'dark') {
        htmlEl.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }

    themeToggleBtn.addEventListener('click', () => {
        if (htmlEl.getAttribute('data-theme') === 'dark') {
            htmlEl.removeAttribute('data-theme');
            localStorage.setItem('school_memories_theme', 'light');
            themeIcon.classList.replace('fa-sun', 'fa-moon');
        } else {
            htmlEl.setAttribute('data-theme', 'dark');
            localStorage.setItem('school_memories_theme', 'dark');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
        }
    });

    // === Guestbook / Messages Logic ===
    const messageForm = document.getElementById('message-form');
    const messagesList = document.getElementById('messages-list');
    const senderName = document.getElementById('sender-name');
    const senderMessage = document.getElementById('sender-message');

    // Load messages
    function loadMessages() {
        const messages = JSON.parse(localStorage.getItem('school_memories_messages') || '[]');
        messagesList.innerHTML = '';
        if (messages.length === 0) {
            messagesList.innerHTML = '<p style="text-align:center; color:var(--sepia-light);">Belum ada pesan. Jadilah yang pertama!</p>';
            return;
        }
        
        // Reverse to show newest first
        const reversedMessages = [...messages].reverse();
        reversedMessages.forEach(msg => {
            const card = document.createElement('div');
            card.className = 'message-card';
            card.innerHTML = `
                <h4>${msg.name}</h4>
                <div class="message-date">${msg.date}</div>
                <p>${msg.text}</p>
            `;
            messagesList.appendChild(card);
        });
    }

    // Only load if element exists (safety check)
    if (messageForm) {
        loadMessages();

        messageForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newMsg = {
                name: senderName.value.trim(),
                text: senderMessage.value.trim(),
                date: new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
            };
            
            if (newMsg.name && newMsg.text) {
                const messages = JSON.parse(localStorage.getItem('school_memories_messages') || '[]');
                messages.push(newMsg);
                localStorage.setItem('school_memories_messages', JSON.stringify(messages));
                
                // Reset form
                senderName.value = '';
                senderMessage.value = '';
                
                // Reload list
                loadMessages();
            }
        });
    }

    // ============================================
    // LIGHTBOX - Zoom foto galeri
    // ============================================
    const lightbox      = document.getElementById('lightbox');
    const lightboxImg   = document.getElementById('lightbox-img');
    const lightboxCap   = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev  = document.getElementById('lightbox-prev');
    const lightboxNext  = document.getElementById('lightbox-next');

    // Kumpulkan semua gambar di galeri
    const galleryImgs = Array.from(document.querySelectorAll('.masonry-grid .grid-item img'));
    let currentIndex  = 0;

    function openLightbox(index) {
        currentIndex = index;
        const img = galleryImgs[index];
        lightboxImg.src = img.src;
        lightboxCap.textContent = `${index + 1} / ${galleryImgs.length}`;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        // Reset src setelah animasi selesai
        setTimeout(() => { lightboxImg.src = ''; }, 350);
    }

    function showPrev() {
        currentIndex = (currentIndex - 1 + galleryImgs.length) % galleryImgs.length;
        // Animasi slide: reset, ganti src, lalu aktifkan kembali
        lightboxImg.style.transition = 'none';
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9) translateX(30px)';
        setTimeout(() => {
            lightboxImg.src = galleryImgs[currentIndex].src;
            lightboxCap.textContent = `${currentIndex + 1} / ${galleryImgs.length}`;
            lightboxImg.style.transition = '';
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1) translateX(0)';
        }, 80);
    }

    function showNext() {
        currentIndex = (currentIndex + 1) % galleryImgs.length;
        lightboxImg.style.transition = 'none';
        lightboxImg.style.opacity = '0';
        lightboxImg.style.transform = 'scale(0.9) translateX(-30px)';
        setTimeout(() => {
            lightboxImg.src = galleryImgs[currentIndex].src;
            lightboxCap.textContent = `${currentIndex + 1} / ${galleryImgs.length}`;
            lightboxImg.style.transition = '';
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1) translateX(0)';
        }, 80);
    }

    // Event: klik foto di galeri
    galleryImgs.forEach((img, i) => {
        img.addEventListener('click', () => openLightbox(i));
    });

    // Event: tombol close
    lightboxClose.addEventListener('click', closeLightbox);

    // Event: klik di luar foto (backdrop)
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Event: tombol navigasi
    lightboxPrev.addEventListener('click', showPrev);
    lightboxNext.addEventListener('click', showNext);

    // Event: keyboard (Esc, panah kiri/kanan)
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape')      closeLightbox();
        if (e.key === 'ArrowLeft')   showPrev();
        if (e.key === 'ArrowRight')  showNext();
    });

    // Swipe support untuk mobile
    let touchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; });
    lightbox.addEventListener('touchend', (e) => {
        const diff = touchStartX - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) diff > 0 ? showNext() : showPrev();
    });
});
