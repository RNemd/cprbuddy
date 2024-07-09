let timer = 0;
let progress = 0;
let adrenalineProgress = 0;
let interval;
let metronomeInterval;
let isRunning = false;
let isMetronomeOn = true;
let actions = [];
let startTime = null;

const timerElement = document.getElementById('timer');
const rhythmControlBar = document.getElementById('rhythm-control-bar');
const adrenalineBar = document.getElementById('adrenaline-bar');
const startButton = document.getElementById('start-button');
const defibrillationButton = document.getElementById('defibrillation-button');
const adrenalinButton = document.getElementById('adrenalin-button');
const metronomeButton = document.getElementById('metronome-button');
const endButton = document.getElementById('end-button');
const resetButton = document.getElementById('reset-button');

const metronomeSound = new Audio('sounds/metronome.mp3');
const twoMinSound = new Audio('sounds/2min.mp3');
const threeMinSound = new Audio('sounds/3min.mp3');

timerElement.textContent = formatTime(timer);

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function updateProgressBars() {
    rhythmControlBar.style.width = `${(progress / 120) * 100}%`;
    adrenalineBar.style.width = `${(adrenalineProgress / 180) * 100}%`;
}

function playSound(audio) {
    audio.currentTime = 0;
    audio.play().then(() => {
        console.log(`${audio.src} played successfully`);
    }).catch(error => {
        console.error(`Error playing ${audio.src}:`, error);
    });
}

function startTimer() {
    interval = setInterval(() => {
        timer++;
        progress++;
        adrenalineProgress++;
        timerElement.textContent = formatTime(timer);

        if (progress >= 120) {
            playSound(twoMinSound);
            progress = 0;
        }

        if (adrenalineProgress >= 180) {
            playSound(threeMinSound);
            adrenalineProgress = 0;
        }

        updateProgressBars();
    }, 1000);

    if (isMetronomeOn) {
        metronomeInterval = setInterval(() => {
            playSound(metronomeSound);
        }, 571);
    }
}

function stopTimer() {
    clearInterval(interval);
    clearInterval(metronomeInterval);
}

startButton.addEventListener('click', () => {
    isRunning = !isRunning;
    startButton.textContent = isRunning ? 'Pause' : 'Start';

    if (isRunning) {
        if (!startTime) {
            startTime = new Date();
            localStorage.setItem('startTime', startTime.toLocaleTimeString());
        }
        startTimer();
    } else {
        stopTimer();
    }

    triggerButtonAnimation(startButton);
});

function getCurrentTimeString() {
    const now = new Date();
    return now.toLocaleTimeString();
}

defibrillationButton.addEventListener('click', () => {
    progress = 0;
    actions.push({ action: 'Defibrillation', time: formatTime(timer), realTime: getCurrentTimeString() });
    updateProgressBars();
    triggerButtonAnimation(defibrillationButton);
});

adrenalinButton.addEventListener('click', () => {
    adrenalineProgress = 0;
    actions.push({ action: 'Adrenalin', time: formatTime(timer), realTime: getCurrentTimeString() });
    updateProgressBars();
    triggerButtonAnimation(adrenalinButton);
});

metronomeButton.addEventListener('click', () => {
    isMetronomeOn = !isMetronomeOn;
    metronomeButton.textContent = isMetronomeOn ? 'Metronom ist an' : 'Metronom ist aus';
    metronomeButton.classList.toggle('metronome-on', isMetronomeOn);
    metronomeButton.classList.toggle('metronome-off', !isMetronomeOn);
    
    if (isRunning) {
        clearInterval(metronomeInterval);
        if (isMetronomeOn) {
            metronomeInterval = setInterval(() => {
                playSound(metronomeSound);
            }, 571);
        }
    }

    triggerButtonAnimation(metronomeButton);
});

endButton.addEventListener('click', () => {
    isRunning = false;
    stopTimer();
    localStorage.setItem('actions', JSON.stringify(actions));
    localStorage.setItem('totalTime', formatTime(timer));
    window.location.href = 'summary.html';
    triggerButtonAnimation(endButton);
});

resetButton.addEventListener('click', () => {
    isRunning = false;
    timer = 0;
    progress = 0;
    adrenalineProgress = 0;
    actions = [];
    startTime = null;
    localStorage.removeItem('startTime');
    timerElement.textContent = formatTime(timer);
    updateProgressBars();
    stopTimer();
    startButton.textContent = 'Start';
    triggerButtonAnimation(resetButton);
});

function triggerButtonAnimation(button) {
    button.classList.add('button-click-animation');
    setTimeout(() => {
        button.classList.remove('button-click-animation');
    }, 200);
}
