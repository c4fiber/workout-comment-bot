// State management
let currentTone = 'gym';
const MAX_HISTORY = 10;

// TTS Configuration - Web Speech API
const voiceConfig = {
    gym: {
        pitch: 0.8,
        rate: 1.1,
        voicePreference: ['Google 한국의', 'Korean', 'ko-KR'] // Deep male voice preference
    },
    friend: {
        pitch: 1.2,
        rate: 1.0,
        voicePreference: ['Google 한국의', 'Korean Female', 'ko-KR'] // Higher pitch for friend
    },
    master: {
        pitch: 0.9,
        rate: 0.85,
        voicePreference: ['Google 한국의', 'Korean', 'ko-KR'] // Slower, wise voice
    }
};

let availableVoices = [];
let speechSynthesis = window.speechSynthesis;

// Load available voices
function loadVoices() {
    availableVoices = speechSynthesis.getVoices();
}

// Initialize voices (Chrome loads voices asynchronously)
if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// TTS Function
function speakComment(text, tone) {
    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const config = voiceConfig[tone];

    // Find best matching voice
    let selectedVoice = availableVoices.find(voice =>
        voice.lang.includes('ko') || voice.lang.includes('KR')
    );

    // Try to find preferred voice
    for (const pref of config.voicePreference) {
        const voice = availableVoices.find(v => v.name.includes(pref));
        if (voice) {
            selectedVoice = voice;
            break;
        }
    }

    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    utterance.pitch = config.pitch;
    utterance.rate = config.rate;
    utterance.lang = 'ko-KR';

    // Error handling
    utterance.onerror = (event) => {
        console.error('TTS Error:', event);
    };

    speechSynthesis.speak(utterance);
}

// AI Comment Generation
const tonePresets = {
    gym: {
        name: '관장 모드',
        prompts: [
            (ex, cnt) => `${ex} ${cnt}? 그래, 시작은 했네. 근데 이제 진짜 시작이야.`,
            (ex, cnt) => `${ex} ${cnt} 했다고? 좋아, 근데 내일도 나와야 진짜지.`,
            (ex, cnt) => `오, ${ex} ${cnt}? 나쁘지 않은데. 근데 폼은 괜찮았어?`,
            (ex, cnt) => `${ex}을 했네. ${cnt}? 이 정도면 몸이 깨어날 만큼은 했다.`,
            (ex, cnt) => `${ex} ${cnt}? 자랑하려고 온 건 아니지? 좋아, 계속해.`,
            (ex, cnt) => `${ex} ${cnt}은 기본이지. 다음엔 더 밀어붙여봐.`,
            (ex, cnt) => `${cnt}? 제법인데. ${ex}을 이정도 하면 몸이 반응하기 시작해.`,
            (ex, cnt) => `좋아, ${ex} ${cnt}. 근데 쉬는 시간이 너무 길었던 거 아냐?`,
        ]
    },
    friend: {
        name: '친구 모드',
        prompts: [
            (ex, cnt) => `${ex} ${cnt}? 오 대박, 나보다 부지런하네 ㅋㅋ`,
            (ex, cnt) => `${ex}을 ${cnt}이나? 존경합니다~`,
            (ex, cnt) => `헐 ${cnt}? 진짜 열심히 하는구나. 나도 해야 하는데...`,
            (ex, cnt) => `${ex} ${cnt}이면 오늘 제대로 운동했네! 굿굿`,
            (ex, cnt) => `와 ${ex} ${cnt}? 근육 좀 만들어보려나보네 ㅎㅎ`,
            (ex, cnt) => `${ex} ${cnt} 완료! 내일 근육통 조심해 ㅋㅋㅋ`,
            (ex, cnt) => `오늘 ${ex} ${cnt}이나 했어? 대단한데?`,
            (ex, cnt) => `${cnt}? 오 오늘 컨디션 좋았나보네! 쵝오~`,
        ]
    },
    master: {
        name: '사부 모드',
        prompts: [
            (ex, cnt) => `${ex} ${cnt}... 수련의 길은 멀다. 하지만 오늘 한 걸음 나아갔구나.`,
            (ex, cnt) => `${ex}을 ${cnt}? 나무는 하루아침에 자라지 않는다. 꾸준함이 답이다.`,
            (ex, cnt) => `${cnt}이라... 기본은 했군. 하지만 진정한 수련은 마음에서 시작된다.`,
            (ex, cnt) => `${ex}을 했구나. 오늘의 고통은 내일의 힘이 될 것이다.`,
            (ex, cnt) => `${ex} ${cnt}. 좋다. 하지만 자만하지 마라. 산은 아직 높다.`,
            (ex, cnt) => `${cnt}... 나쁘지 않다. 몸이 기억할 때까지 반복하거라.`,
            (ex, cnt) => `${ex}을 수련했구나. 진정한 강함은 끊임없는 노력에서 온다.`,
            (ex, cnt) => `오늘 ${ex} ${cnt}을 해냈군. 작은 승리도 승리다. 내일도 정진하거라.`,
        ]
    }
};

// Generate AI comment
function generateComment(exercise, count) {
    const tone = tonePresets[currentTone];
    const randomIndex = Math.floor(Math.random() * tone.prompts.length);
    const promptFn = tone.prompts[randomIndex];

    const displayCount = count || '완료';
    return promptFn(exercise, displayCount);
}

// LocalStorage management
function saveToHistory(exercise, count, comment, tone) {
    let history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');

    const record = {
        date: new Date().toISOString(),
        exercise,
        count,
        comment,
        tone,
        id: Date.now()
    };

    history.unshift(record);

    if (history.length > MAX_HISTORY) {
        history = history.slice(0, MAX_HISTORY);
    }

    localStorage.setItem('workoutHistory', JSON.stringify(history));
    renderHistory();
}

function loadHistory() {
    return JSON.parse(localStorage.getItem('workoutHistory') || '[]');
}

function clearAllHistory() {
    if (confirm('정말 모든 기록을 삭제하시겠습니까?')) {
        localStorage.removeItem('workoutHistory');
        renderHistory();
    }
}

// Render history
function renderHistory() {
    const history = loadHistory();
    const historyList = document.getElementById('historyList');
    const historyCount = document.getElementById('historyCount');
    const clearBtn = document.getElementById('clearHistory');

    historyCount.textContent = history.length;

    if (history.length === 0) {
        historyList.innerHTML = '<p class="empty-message">아직 기록이 없습니다. 운동을 완료하세요!</p>';
        clearBtn.classList.add('hidden');
        return;
    }

    clearBtn.classList.remove('hidden');

    historyList.innerHTML = history.map(record => {
        const date = new Date(record.date);
        const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
        const countStr = record.count ? ` - ${record.count}` : '';
        const toneStr = tonePresets[record.tone]?.name || record.tone;

        return `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-exercise">${record.exercise}${countStr}</span>
                    <span class="history-date">${dateStr} · ${toneStr}</span>
                </div>
                <p class="history-comment">"${record.comment}"</p>
            </div>
        `;
    }).join('');
}

// Event handlers
function handleToneChange(e) {
    if (!e.target.classList.contains('tone-btn')) return;

    document.querySelectorAll('.tone-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    e.target.classList.add('active');
    currentTone = e.target.dataset.tone;
}

function handleWorkoutComplete() {
    const exercise = document.getElementById('exercise').value;
    const count = document.getElementById('count').value.trim();

    // Generate comment
    const comment = generateComment(exercise, count);

    // Display comment
    const commentSection = document.getElementById('commentSection');
    const commentText = document.getElementById('commentText');
    const commentMeta = document.getElementById('commentMeta');

    commentText.textContent = comment;
    const toneName = tonePresets[currentTone].name;
    const countStr = count ? ` · ${count}` : '';
    commentMeta.textContent = `${exercise}${countStr} · ${toneName}`;

    commentSection.classList.remove('hidden');

    // Save to history
    saveToHistory(exercise, count, comment, currentTone);

    // Play TTS
    speakComment(comment, currentTone);

    // Optional: Clear count input for next entry
    document.getElementById('count').value = '';

    // Scroll to comment
    commentSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Tone selector
    document.querySelector('.tone-buttons').addEventListener('click', handleToneChange);

    // Complete button
    document.getElementById('completeBtn').addEventListener('click', handleWorkoutComplete);

    // Clear history button
    document.getElementById('clearHistory').addEventListener('click', clearAllHistory);

    // Load initial history
    renderHistory();

    // Allow Enter key on count input
    document.getElementById('count').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleWorkoutComplete();
        }
    });
});
