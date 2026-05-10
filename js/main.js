// Efecto de cambio de tamaño y sombra en la barra de navegación al hacer scroll
window.addEventListener('scroll', function () {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('py-2');
        navbar.classList.remove('py-3');
        navbar.style.boxShadow = '0 8px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.classList.add('py-3');
        navbar.classList.remove('py-2');
        navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.05)';
    }
});

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== "#" && href !== "#donarModal" && href !== "#visitaModal" && !href.includes("javascript")) {
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

// Animación botón de Instagram (Página de Inicio)
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

// Animación de pétalos cayendo (Página Multimedia)
const canvas = document.getElementById('miCanvas');
const ctx = canvas.getContext('2d');
let petals = [];
for (let i = 0; i < 40; i++) {
    petals.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        speed: 0.8 + Math.random() * 2,
        size: 3 + Math.random() * 4
    });
}

function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#8b2c2c";
    petals.forEach(p => {
        ctx.beginPath();
        ctx.ellipse(p.x, p.y, p.size / 2, p.size / 3, 0, 0, 2 * Math.PI);
        ctx.fill();
        p.y += p.speed;
        if (p.y > canvas.height) {
            p.y = 0;
            p.x = Math.random() * canvas.width;
        }
    });
    requestAnimationFrame(drawPetals);
}
drawPetals();

// ============================================
// REPRODUCTOR DE AUDIO PERSONALIZADO
// ============================================

document.addEventListener('DOMContentLoaded', function () {
    const audio = document.getElementById('marchaAudio');

    // Si no existe el elemento de audio, salir
    if (!audio) return;

    // Elementos del DOM
    const btnPlayPause = document.getElementById('btnPlayPause');
    const playIcon = document.getElementById('playIcon');
    const btnBackward = document.getElementById('btnBackward');
    const btnForward = document.getElementById('btnForward');
    const btnMute = document.getElementById('btnMute');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeControl = document.getElementById('volumeControl');
    const progressContainer = document.querySelector('.audio-progress-container');
    const progressBar = document.getElementById('progressBar');
    const currentTimeSpan = document.getElementById('currentTime');
    const durationSpan = document.getElementById('duration');

    let isDragging = false;

    // Formatear tiempo (segundos a MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Actualizar barra de progreso y tiempo actual
    function updateProgress() {
        if (!isDragging) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = percent + '%';
            currentTimeSpan.textContent = formatTime(audio.currentTime);
        }
    }

    // Cargar duración cuando esté disponible
    function updateDuration() {
        durationSpan.textContent = formatTime(audio.duration);
    }

    // Play/Pause
    function togglePlayPause() {
        if (audio.paused) {
            audio.play();
            playIcon.className = 'bi bi-pause-fill';
        } else {
            audio.pause();
            playIcon.className = 'bi bi-play-fill';
        }
    }

    // Retroceder 10 segundos
    function backward() {
        audio.currentTime = Math.max(0, audio.currentTime - 10);
    }

    // Adelantar 10 segundos
    function forward() {
        audio.currentTime = Math.min(audio.duration, audio.currentTime + 10);
    }

    // Silenciar/Activar volumen
    function toggleMute() {
        if (audio.muted) {
            audio.muted = false;
            volumeIcon.className = 'bi bi-volume-up-fill';
            volumeControl.value = audio.volume;
        } else {
            audio.muted = true;
            volumeIcon.className = 'bi bi-volume-mute-fill';
        }
    }

    // Cambiar volumen
    function setVolume() {
        audio.volume = parseFloat(volumeControl.value);
        audio.muted = false;
        volumeIcon.className = audio.volume === 0 ? 'bi bi-volume-mute-fill' : 'bi bi-volume-up-fill';
    }

    // Click en barra de progreso (cambiar posición)
    function seek(e) {
        const rect = progressContainer.getBoundingClientRect();
        let clickX = e.clientX - rect.left;
        let width = rect.width;
        let percent = clickX / width;
        audio.currentTime = percent * audio.duration;
        progressBar.style.width = percent * 100 + '%';
    }

    // Arrastrar barra de progreso
    function startDrag() {
        isDragging = true;
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', stopDrag);
    }

    function drag(e) {
        const rect = progressContainer.getBoundingClientRect();
        let clickX = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        let percent = clickX / rect.width;
        audio.currentTime = percent * audio.duration;
        progressBar.style.width = percent * 100 + '%';
        currentTimeSpan.textContent = formatTime(audio.currentTime);
    }

    function stopDrag() {
        isDragging = false;
        document.removeEventListener('mousemove', drag);
        document.removeEventListener('mouseup', stopDrag);
    }

    // Event Listeners
    btnPlayPause.addEventListener('click', togglePlayPause);
    btnBackward.addEventListener('click', backward);
    btnForward.addEventListener('click', forward);
    btnMute.addEventListener('click', toggleMute);
    volumeControl.addEventListener('input', setVolume);
    progressContainer.addEventListener('click', seek);
    progressContainer.addEventListener('mousedown', startDrag);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', function () {
        playIcon.className = 'bi bi-play-fill';
        progressBar.style.width = '0%';
        audio.currentTime = 0;
    });

    // Inicializar valores
    audio.volume = 0.8;
    volumeControl.value = 0.8;
});