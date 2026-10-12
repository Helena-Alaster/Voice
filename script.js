document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            e.preventDefault(); // Отключаем стандартный прыжок браузера

            // Получаем высоту фиксированной шапки (если она есть), иначе 0
            const headerOffset = document.querySelector('.header')?.offsetHeight || 0; 
            
            // Координата верха элемента относительно документа
            const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
            
            // Вычисляем точку остановки: центр экрана минус половина высоты блока и высота шапки
            const offsetPosition = elementPosition - (window.innerHeight / 2) + (targetElement.offsetHeight / 2) - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });

            // Добавляем временный класс для нашей звездочки-индикатора
            targetElement.classList.add('active-highlight');
            
            // Убираем класс через пару секунд
            setTimeout(() => {
                targetElement.classList.remove('active-highlight');
            }, 3000);
        }
    });
});

// Отключаем контекстное меню (правая кнопка мыши)
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Отключаем копирование по Ctrl+C / Cmd+C
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey || event.metaKey) && (event.key === 'c' || event.key === 'C')) {
        event.preventDefault(); // Предотвращаем стандартную реакцию
    }
});

const audio = document.getElementById('myAudio');
const playPauseBtn = document.getElementById('playPauseBtn');
const seekSlider = document.getElementById('seekSlider');
const volumeSlider = document.getElementById('volumeSlider');
const currentTimeSpan = document.getElementById('currentTime');
const durationSpan = document.getElementById('duration');

// Переключение воспроизведения и паузы
playPauseBtn.addEventListener('click', function() {
    if (audio.paused) {
        audio.play();
        playPauseBtn.textContent = '⏸️';
    } else {
        audio.pause();
        playPauseBtn.textContent = '▶️';
    }
});

// Обновление ползунка перемотки и времени
audio.addEventListener('timeupdate', function() {
    const time = audio.currentTime;
    const duration = audio.duration;
    
    if (duration) {
        const percent = (time / duration) * 100;
        seekSlider.value = percent;
        
        // Форматирование времени в мм:сс
        currentTimeSpan.textContent = formatTime(time);
        if (!durationSpan.textContent || durationSpan.textContent === '0:00') {
            durationSpan.textContent = formatTime(duration);
        }
    }
});

// Перемотка при движении ползунка
seekSlider.addEventListener('input', function() {
    const duration = audio.duration;
    if (duration) {
        const time = (seekSlider.value / 100) * duration;
        audio.currentTime = time;
    }
});

// Изменение громкости
volumeSlider.addEventListener('input', function() {
    audio.volume = volumeSlider.value;
});

// Форматирование секунд в мм:сс
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

// Если нужно, чтобы ползунок max у seekSlider был в секундах, а не в процентах,
// его можно пересчитывать после загрузки метаданных:
audio.addEventListener('loadedmetadata', function() {
    // seekSlider.max = Math.floor(audio.duration); // если ползунок работает в секундах
});