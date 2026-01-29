// ============================================
// Game State & Configuration
// ============================================
const GameState = {
    currentScreen: 'mainMenu',
    currentStage: 1, // 1: Puzzle, 2: Continents, 3: Countries, 4: Cities
    score: 0,
    highScore: parseInt(localStorage.getItem('geoHighScore')) || 0,
    lives: 3,
    soundEnabled: true,
    difficulty: 20,
    startTime: null,
    elapsedTime: 0,
    timerInterval: null,
    isPaused: false,
    correctAnswers: 0,
    totalQuestions: 0,
    puzzlePieces: [],
    placedPieces: 0,
    totalPiecesCount: 0,
    currentQuestion: 0,
    hintsUsed: 0
};

// Map image URL - uses data URL of the illustrated world map
// This beautiful illustrated map includes animals, ships, and landmarks
const MAP_IMAGE_URL = 'data:image/svg+xml,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 700">
  <defs>
    <linearGradient id="ocean" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#1e6091"/>
      <stop offset="50%" style="stop-color:#2980b9"/>
      <stop offset="100%" style="stop-color:#1a5276"/>
    </linearGradient>
    <linearGradient id="land" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#52be80"/>
      <stop offset="50%" style="stop-color:#27ae60"/>
      <stop offset="100%" style="stop-color:#1e8449"/>
    </linearGradient>
    <linearGradient id="desert" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#f4d03f"/>
      <stop offset="100%" style="stop-color:#d4ac0d"/>
    </linearGradient>
    <linearGradient id="ice" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#ffffff"/>
      <stop offset="100%" style="stop-color:#d5dbdb"/>
    </linearGradient>
  </defs>

  <!-- Ocean background -->
  <rect width="1200" height="700" fill="url(#ocean)"/>

  <!-- Decorative frame -->
  <rect x="10" y="10" width="1180" height="680" fill="none" stroke="#8B4513" stroke-width="15"/>
  <rect x="25" y="25" width="1150" height="650" fill="none" stroke="#D4A574" stroke-width="3"/>

  <!-- North America -->
  <path d="M80 80 Q120 70 180 85 Q220 90 260 110 Q300 130 310 170 Q320 210 300 250 Q280 290 250 310 Q220 330 180 340 Q150 350 120 340 Q90 330 70 300 Q50 270 60 220 Q70 170 60 130 Q50 100 80 80 Z" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>
  <path d="M120 100 Q100 95 90 110 Q85 125 100 130 Q115 135 130 125 Q145 115 120 100 Z" fill="url(#ice)"/>
  <text x="180" y="200" fill="#1e8449" font-size="12" font-weight="bold">North America</text>

  <!-- Greenland -->
  <ellipse cx="320" cy="80" rx="40" ry="50" fill="url(#ice)" stroke="#d5dbdb" stroke-width="2"/>

  <!-- South America -->
  <path d="M200 360 Q230 350 260 370 Q290 390 300 430 Q310 470 290 520 Q270 570 240 600 Q210 630 180 610 Q150 590 160 540 Q170 490 160 440 Q150 390 200 360 Z" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>
  <text x="200" y="480" fill="#1e8449" font-size="10" font-weight="bold">South America</text>

  <!-- Europe -->
  <path d="M480 100 Q520 90 560 100 Q600 110 620 140 Q640 170 620 200 Q600 230 560 240 Q520 250 490 230 Q460 210 460 170 Q460 130 480 100 Z" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>
  <text x="520" y="170" fill="#1e8449" font-size="10" font-weight="bold">Europe</text>

  <!-- Africa -->
  <path d="M500 260 Q540 250 580 270 Q620 290 640 350 Q660 410 640 480 Q620 550 570 580 Q520 610 480 580 Q440 550 450 480 Q460 410 470 350 Q480 290 500 260 Z" fill="url(#desert)" stroke="#d4ac0d" stroke-width="2"/>
  <path d="M500 260 Q520 255 540 265 Q560 275 550 290 Q540 305 520 300 Q500 295 500 275 Z" fill="url(#land)"/>
  <text x="520" y="420" fill="#8B4513" font-size="12" font-weight="bold">Africa</text>
  <!-- Pyramids -->
  <polygon points="545,310 555,290 565,310" fill="#D4A574"/>
  <polygon points="555,310 565,290 575,310" fill="#C4A064"/>

  <!-- Asia -->
  <path d="M640 80 Q720 60 820 70 Q920 80 980 120 Q1040 160 1020 220 Q1000 280 940 320 Q880 360 800 370 Q720 380 660 340 Q600 300 620 220 Q640 140 640 80 Z" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>
  <text x="780" y="200" fill="#1e8449" font-size="14" font-weight="bold">Asia</text>
  <!-- Great Wall hint -->
  <path d="M850 180 Q870 175 890 180" stroke="#8B4513" stroke-width="3" fill="none"/>

  <!-- India -->
  <path d="M720 300 Q750 290 770 310 Q790 330 780 370 Q770 410 740 420 Q710 430 700 400 Q690 370 700 340 Q710 310 720 300 Z" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>

  <!-- Japan -->
  <ellipse cx="1020" cy="200" rx="20" ry="40" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>

  <!-- Australia -->
  <path d="M900 450 Q950 430 1000 450 Q1050 470 1060 520 Q1070 570 1040 600 Q1010 630 960 620 Q910 610 890 570 Q870 530 880 490 Q890 450 900 450 Z" fill="url(#desert)" stroke="#d4ac0d" stroke-width="2"/>
  <text x="940" y="530" fill="#8B4513" font-size="10" font-weight="bold">Australia</text>

  <!-- New Zealand -->
  <ellipse cx="1100" cy="580" rx="15" ry="30" fill="url(#land)" stroke="#1e8449" stroke-width="2"/>

  <!-- Antarctica -->
  <path d="M200 660 Q400 640 600 650 Q800 660 1000 650 Q1050 670 950 680 Q750 690 550 685 Q350 680 150 685 Q100 670 200 660 Z" fill="url(#ice)" stroke="#d5dbdb" stroke-width="2"/>
  <text x="550" y="670" fill="#5d6d7e" font-size="10">Antarctica</text>

  <!-- Decorative elements - Ships -->
  <g transform="translate(350, 300)">
    <path d="M0 0 L20 0 L15 15 L5 15 Z" fill="#8B4513"/>
    <line x1="10" y1="0" x2="10" y2="-20" stroke="#8B4513" stroke-width="2"/>
    <polygon points="10,-20 25,-10 10,-5" fill="#fff"/>
  </g>
  <g transform="translate(750, 450)">
    <path d="M0 0 L20 0 L15 15 L5 15 Z" fill="#8B4513"/>
    <line x1="10" y1="0" x2="10" y2="-20" stroke="#8B4513" stroke-width="2"/>
    <polygon points="10,-20 25,-10 10,-5" fill="#fff"/>
  </g>

  <!-- Compass Rose -->
  <g transform="translate(100, 580)">
    <circle cx="0" cy="0" r="40" fill="#D4A574" stroke="#8B4513" stroke-width="2"/>
    <polygon points="0,-35 5,-10 0,-15 -5,-10" fill="#8B4513"/>
    <polygon points="0,35 5,10 0,15 -5,10" fill="#D4A574" stroke="#8B4513"/>
    <polygon points="-35,0 -10,5 -15,0 -10,-5" fill="#D4A574" stroke="#8B4513"/>
    <polygon points="35,0 10,5 15,0 10,-5" fill="#D4A574" stroke="#8B4513"/>
    <text x="-4" y="-42" fill="#8B4513" font-size="10" font-weight="bold">N</text>
    <text x="-4" y="50" fill="#8B4513" font-size="10" font-weight="bold">S</text>
    <text x="-50" y="4" fill="#8B4513" font-size="10" font-weight="bold">W</text>
    <text x="42" y="4" fill="#8B4513" font-size="10" font-weight="bold">E</text>
  </g>

  <!-- Sea creatures -->
  <ellipse cx="400" cy="500" rx="25" ry="10" fill="#2c3e50" opacity="0.6"/>
  <ellipse cx="350" cy="200" rx="15" ry="6" fill="#34495e" opacity="0.5"/>

</svg>
`);

// Audio context and sounds
let audioContext = null;
let sounds = {};

// ============================================
// Geography Data - Coordinates match the SVG map
// ============================================
// Geography Data - Coordinates calibrated for the illustrated world map (1408x768)
// IMPORTANT: Coordinates are normalized (0-1) relative to the CONTENT AREA
// The map has a decorative wooden frame (~2% on each side)
// Content area starts at approximately x=0.02, y=0.02 and ends at x=0.98, y=0.98
//
// Calibration based on visual analysis of world_map.png:
// - Map uses Mercator-style projection
// - Greenland is large white area at top center
// - Compass rose is at bottom left
// - Antarctica is white strip at very bottom
const GeoData = {
    // PIXEL MEASUREMENTS from world_map.png (1408x768) using sharp pixel analysis
    // All coordinates are normalized (0-1) relative to the full image
    // Verified: all city positions confirmed on LAND via pixel color analysis

    continents: [
        // North America: pixels left=15, right=519, top=20, bottom=419
        { name: 'צפון אמריקה', nameEn: 'North America', bounds: { x: 0.011, y: 0.026, width: 0.358, height: 0.520 } },

        // South America: pixels left=150, right=419, top=340, bottom=718
        { name: 'דרום אמריקה', nameEn: 'South America', bounds: { x: 0.107, y: 0.443, width: 0.191, height: 0.492 } },

        // Europe: pixels left=520, right=779, top=40, bottom=279
        { name: 'אירופה', nameEn: 'Europe', bounds: { x: 0.369, y: 0.052, width: 0.184, height: 0.311 } },

        // Africa: pixels left=520, right=849, top=210, bottom=639
        { name: 'אפריקה', nameEn: 'Africa', bounds: { x: 0.369, y: 0.273, width: 0.234, height: 0.559 } },

        // Asia: pixels left=700, right=1379, top=30, bottom=499
        { name: 'אסיה', nameEn: 'Asia', bounds: { x: 0.497, y: 0.039, width: 0.482, height: 0.611 } },

        // Australia: pixels left=1050, right=1367, top=430, bottom=659
        { name: 'אוסטרליה', nameEn: 'Australia', bounds: { x: 0.746, y: 0.560, width: 0.225, height: 0.298 } },

        // Antarctica: pixels left=15, right=1392, top=690, bottom=759
        { name: 'אנטארקטיקה', nameEn: 'Antarctica', bounds: { x: 0.011, y: 0.898, width: 0.978, height: 0.090 } }
    ],
    countries: [
        // Brazil - large eastern South America
        { name: 'ברזיל', continent: 'דרום אמריקה', bounds: { x: 0.170, y: 0.470, width: 0.120, height: 0.230 } },

        // Egypt - northeast Africa, Nile delta area
        { name: 'מצרים', continent: 'אפריקה', bounds: { x: 0.480, y: 0.310, width: 0.060, height: 0.090 } },

        // India - triangular peninsula south of Asia mainland
        { name: 'הודו', continent: 'אסיה', bounds: { x: 0.580, y: 0.360, width: 0.090, height: 0.200 } },

        // China - large eastern Asian country
        { name: 'סין', continent: 'אסיה', bounds: { x: 0.740, y: 0.200, width: 0.160, height: 0.200 } },

        // USA - between Canada and Mexico
        { name: 'ארה"ב', continent: 'צפון אמריקה', bounds: { x: 0.040, y: 0.250, width: 0.220, height: 0.200 } },

        // Russia - massive northern landmass spanning Europe and Asia
        { name: 'רוסיה', continent: 'אסיה', bounds: { x: 0.500, y: 0.050, width: 0.470, height: 0.200 } },

        // Australia - same as continent
        { name: 'אוסטרליה', continent: 'אוסטרליה', bounds: { x: 0.746, y: 0.560, width: 0.225, height: 0.298 } },

        // Canada - northern North America
        { name: 'קנדה', continent: 'צפון אמריקה', bounds: { x: 0.011, y: 0.026, width: 0.280, height: 0.230 } },

        // Argentina - southern South America
        { name: 'ארגנטינה', continent: 'דרום אמריקה', bounds: { x: 0.150, y: 0.700, width: 0.080, height: 0.230 } },

        // Japan - island chain east of Korea
        { name: 'יפן', continent: 'אסיה', bounds: { x: 0.860, y: 0.250, width: 0.060, height: 0.120 } }
    ],
    cities: [
        // New York - US east coast, pixel (350, 310) LAND ✓
        { name: 'ניו יורק', country: 'ארה"ב', position: { x: 0.249, y: 0.404 } },

        // London - British Isles, pixel (659, 227) LAND ✓
        { name: 'לונדון', country: 'בריטניה', position: { x: 0.468, y: 0.296 } },

        // Tokyo - Japan Honshu island, pixel (1248, 232) LAND ✓
        { name: 'טוקיו', country: 'יפן', position: { x: 0.886, y: 0.302 } },

        // Paris - France, pixel (690, 237) LAND ✓ [USER CONFIRMED]
        { name: 'פריז', country: 'צרפת', position: { x: 0.490, y: 0.309 } },

        // Sydney - SE Australia coast, pixel (1292, 575) LAND ✓
        { name: 'סידני', country: 'אוסטרליה', position: { x: 0.918, y: 0.749 } },

        // Cairo - Egypt Nile delta, pixel (711, 270) LAND ✓
        { name: 'קהיר', country: 'מצרים', position: { x: 0.505, y: 0.352 } },

        // Mumbai - India west coast, pixel (850, 375) LAND ✓
        { name: 'מומביי', country: 'הודו', position: { x: 0.604, y: 0.488 } },

        // Rio de Janeiro - Brazil SE coast, pixel (420, 494) LAND ✓
        { name: 'ריו דה ז\'נרו', country: 'ברזיל', position: { x: 0.298, y: 0.643 } },

        // Moscow - western Russia, pixel (756, 171) LAND ✓
        { name: 'מוסקבה', country: 'רוסיה', position: { x: 0.537, y: 0.223 } },

        // Beijing - northern China, pixel (1182, 245) LAND ✓
        { name: 'בייג\'ינג', country: 'סין', position: { x: 0.839, y: 0.319 } }
    ]
};

// ============================================
// Audio System - Violin-style Orchestral Music
// ============================================
function initAudio() {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        generateSounds();
    } catch (e) {
        console.log('Audio not supported');
    }
}

function generateSounds() {
    // Success sound - Mario coin sound
    sounds.success = () => {
        if (!GameState.soundEnabled || !audioContext) return;
        playCoinSound();
    };

    // Fail sound - Mario style "boop" (wrong answer)
    sounds.fail = () => {
        if (!GameState.soundEnabled || !audioContext) return;
        playWrongSound();
    };

    // Snap sound - quick click when piece snaps
    sounds.snap = () => {
        if (!GameState.soundEnabled || !audioContext) return;
        playSnapSound();
    };

    // Complete sound - Mario coin sound (same as success)
    sounds.complete = () => {
        if (!GameState.soundEnabled || !audioContext) return;
        playCoinSound();
    };

    sounds.bgMusic = null;
}

// Create violin-like sound with multiple harmonics and vibrato
function playViolinNote(frequency, duration, volume) {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(volume, now + 0.05);
    masterGain.gain.setValueAtTime(volume, now + duration - 0.1);
    masterGain.gain.linearRampToValueAtTime(0, now + duration);

    // Fundamental frequency
    const osc1 = audioContext.createOscillator();
    osc1.type = 'sawtooth';
    osc1.frequency.value = frequency;

    // Second harmonic
    const osc2 = audioContext.createOscillator();
    osc2.type = 'triangle';
    osc2.frequency.value = frequency * 2;

    // Third harmonic (softer)
    const osc3 = audioContext.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = frequency * 3;

    // Vibrato LFO
    const vibrato = audioContext.createOscillator();
    vibrato.type = 'sine';
    vibrato.frequency.value = 5.5; // Vibrato rate

    const vibratoGain = audioContext.createGain();
    vibratoGain.gain.value = frequency * 0.015; // Vibrato depth

    vibrato.connect(vibratoGain);
    vibratoGain.connect(osc1.frequency);
    vibratoGain.connect(osc2.frequency);

    // Gain nodes for mixing harmonics
    const gain1 = audioContext.createGain();
    gain1.gain.value = 0.5;
    const gain2 = audioContext.createGain();
    gain2.gain.value = 0.25;
    const gain3 = audioContext.createGain();
    gain3.gain.value = 0.1;

    // Low-pass filter for warmth
    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 3000;
    filter.Q.value = 1;

    osc1.connect(gain1);
    osc2.connect(gain2);
    osc3.connect(gain3);

    gain1.connect(filter);
    gain2.connect(filter);
    gain3.connect(filter);

    filter.connect(masterGain);

    osc1.start(now);
    osc2.start(now);
    osc3.start(now);
    vibrato.start(now);

    osc1.stop(now + duration + 0.1);
    osc2.stop(now + duration + 0.1);
    osc3.stop(now + duration + 0.1);
    vibrato.stop(now + duration + 0.1);
}

// Super Mario style coin sound
function playCoinSound() {
    if (!audioContext) return;

    const now = audioContext.currentTime;

    // First note (B5 - 987.77 Hz)
    const osc1 = audioContext.createOscillator();
    osc1.type = 'square';
    osc1.frequency.setValueAtTime(987.77, now);

    const gain1 = audioContext.createGain();
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc1.connect(gain1);
    gain1.connect(audioContext.destination);
    osc1.start(now);
    osc1.stop(now + 0.08);

    // Second note (E6 - 1318.51 Hz) - the classic Mario coin "ding"
    const osc2 = audioContext.createOscillator();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(1318.51, now + 0.08);

    const gain2 = audioContext.createGain();
    gain2.gain.setValueAtTime(0, now);
    gain2.gain.setValueAtTime(0.2, now + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc2.connect(gain2);
    gain2.connect(audioContext.destination);
    osc2.start(now + 0.08);
    osc2.stop(now + 0.4);
}

// Mario style wrong answer sound
function playWrongSound() {
    if (!audioContext) return;

    const now = audioContext.currentTime;

    // Low descending tone
    const osc = audioContext.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.3);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.35);
}

// Quick snap/click sound when puzzle piece snaps
function playSnapSound() {
    if (!audioContext) return;

    const now = audioContext.currentTime;

    // Quick high pitched click
    const osc = audioContext.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);

    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(audioContext.destination);
    osc.start(now);
    osc.stop(now + 0.06);
}

// Pizzicato (plucked string) sound
function playPizzicato(frequency, volume) {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    const osc = audioContext.createOscillator();
    osc.type = 'triangle';
    osc.frequency.value = frequency;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    const filter = audioContext.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2000, now);
    filter.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    osc.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + 0.2);
}

function playTone(frequencies, duration, type, volume) {
    if (!audioContext) return;

    const now = audioContext.currentTime;
    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.type = type;
        oscillator.frequency.value = freq;

        gainNode.gain.setValueAtTime(0, now + i * duration);
        gainNode.gain.linearRampToValueAtTime(volume, now + i * duration + 0.02);
        gainNode.gain.linearRampToValueAtTime(0, now + (i + 1) * duration);

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(now + i * duration);
        oscillator.stop(now + (i + 1) * duration + 0.1);
    });
}

// Background music - using actual MP3 file
let bgMusicAudio = null;

function startBackgroundMusic() {
    if (!GameState.soundEnabled) return;

    stopBackgroundMusic();

    // Create audio element for background music
    bgMusicAudio = new Audio('background_music.mp3');
    bgMusicAudio.loop = true;
    bgMusicAudio.volume = 0.3; // 30% volume for background

    bgMusicAudio.play().catch(e => {
        console.log('Background music autoplay blocked, will play on interaction');
    });
}

function stopBackgroundMusic() {
    if (bgMusicAudio) {
        bgMusicAudio.pause();
        bgMusicAudio.currentTime = 0;
        bgMusicAudio = null;
    }
}

function toggleSound() {
    GameState.soundEnabled = !GameState.soundEnabled;
    const icon = document.getElementById('soundIcon');
    const text = document.getElementById('soundText');

    if (GameState.soundEnabled) {
        icon.textContent = '🔊';
        text.textContent = 'כבה צלילים';
        if (audioContext && audioContext.state === 'suspended') {
            audioContext.resume();
        }
    } else {
        icon.textContent = '🔇';
        text.textContent = 'הפעל צלילים';
        stopBackgroundMusic();
    }
}

// ============================================
// Screen Management
// ============================================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
    GameState.currentScreen = screenId;
}

function showModal(modalId) {
    document.getElementById(modalId).classList.add('active');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

function showInstructions() {
    showModal('instructionsModal');
}

function hideInstructions() {
    hideModal('instructionsModal');
}

function showLoading() {
    document.getElementById('loadingScreen').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingScreen').classList.remove('active');
}

// ============================================
// Game Flow
// ============================================
function startGame() {
    // Initialize audio on first user interaction
    if (!audioContext) {
        initAudio();
    }
    showScreen('difficultyScreen');
}

function selectDifficulty(pieces) {
    GameState.difficulty = pieces;
    GameState.score = 0;
    GameState.lives = 3;
    GameState.currentStage = 1;
    GameState.correctAnswers = 0;
    GameState.totalQuestions = 0;
    GameState.hintsUsed = 0;

    showLoading();
    startPuzzleStage();
}

function backToMenu() {
    stopTimer();
    stopBackgroundMusic();
    hideModal('pauseModal');
    GameState.isPaused = false;
    showScreen('mainMenu');
    document.getElementById('highScoreDisplay').textContent = GameState.highScore;
}

function pauseGame() {
    if (!GameState.isPaused) {
        GameState.isPaused = true;
        stopTimer();
        showModal('pauseModal');
    }
}

function resumeGame() {
    GameState.isPaused = false;
    hideModal('pauseModal');
    startTimer();
}

function restartGame() {
    hideModal('pauseModal');
    stopTimer();
    stopBackgroundMusic();
    startGame();
}

// ============================================
// Timer
// ============================================
function startTimer() {
    if (!GameState.startTime) {
        GameState.startTime = Date.now() - GameState.elapsedTime;
    }

    GameState.timerInterval = setInterval(() => {
        if (!GameState.isPaused) {
            GameState.elapsedTime = Date.now() - GameState.startTime;
            updateTimerDisplay();
        }
    }, 1000);
}

function stopTimer() {
    if (GameState.timerInterval) {
        clearInterval(GameState.timerInterval);
        GameState.timerInterval = null;
    }
}

function updateTimerDisplay() {
    const seconds = Math.floor(GameState.elapsedTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    const timeString = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;

    const timerEl = document.getElementById('timerDisplay');
    if (timerEl) timerEl.textContent = timeString;
}

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const displaySeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
}

// ============================================
// Score System
// ============================================
function addScore(points) {
    GameState.score += points;
    updateScoreDisplay();
}

function updateScoreDisplay() {
    const scoreEl = document.getElementById('currentScore');
    const quizScoreEl = document.getElementById('quizScore');
    if (scoreEl) scoreEl.textContent = GameState.score;
    if (quizScoreEl) quizScoreEl.textContent = GameState.score;
}

// ============================================
// Puzzle Stage
// ============================================
let puzzleImage = null;
let canvas = null;
let ctx = null;
let pieces = [];
let selectedPiece = null;
let dragOffset = { x: 0, y: 0 };
let puzzleConfig = {
    cols: 5,
    rows: 4,
    pieceWidth: 0,
    pieceHeight: 0,
    imageX: 0,
    imageY: 0,
    imageWidth: 0,
    imageHeight: 0,
    tabSize: 0
};

function startPuzzleStage() {
    puzzleImage = new Image();
    puzzleImage.crossOrigin = 'anonymous';

    puzzleImage.onload = () => {
        hideLoading();
        showScreen('puzzleScreen');
        initPuzzle();
        startTimer();
        startBackgroundMusic();
    };

    puzzleImage.onerror = () => {
        // Use SVG fallback
        puzzleImage.src = MAP_IMAGE_URL;
    };

    // Try to load external image first, fallback to SVG
    const externalImage = new Image();
    externalImage.crossOrigin = 'anonymous';
    externalImage.onload = () => {
        puzzleImage = externalImage;
        hideLoading();
        showScreen('puzzleScreen');
        initPuzzle();
        startTimer();
        startBackgroundMusic();
    };
    externalImage.onerror = () => {
        // Use built-in SVG map
        puzzleImage.src = MAP_IMAGE_URL;
    };

    // Try external image (world_map.png) first
    externalImage.src = 'world_map.png';
}

function createFallbackMap() {
    // Create a canvas-based map if image fails to load
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = 1200;
    tempCanvas.height = 700;
    const tempCtx = tempCanvas.getContext('2d');

    // Draw ocean
    tempCtx.fillStyle = '#1e5799';
    tempCtx.fillRect(0, 0, 1200, 700);

    // Draw simplified continents
    tempCtx.fillStyle = '#4a7c4e';

    // North America
    tempCtx.beginPath();
    tempCtx.ellipse(180, 180, 140, 100, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // South America
    tempCtx.beginPath();
    tempCtx.ellipse(240, 450, 70, 120, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Europe
    tempCtx.beginPath();
    tempCtx.ellipse(550, 150, 60, 50, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Africa
    tempCtx.beginPath();
    tempCtx.ellipse(560, 380, 80, 120, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Asia
    tempCtx.beginPath();
    tempCtx.ellipse(800, 200, 180, 100, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Australia
    tempCtx.beginPath();
    tempCtx.ellipse(950, 480, 70, 50, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Antarctica
    tempCtx.fillStyle = '#ffffff';
    tempCtx.beginPath();
    tempCtx.ellipse(600, 670, 200, 30, 0, 0, Math.PI * 2);
    tempCtx.fill();

    // Create image from canvas
    puzzleImage = new Image();
    puzzleImage.onload = () => {
        hideLoading();
        showScreen('puzzleScreen');
        initPuzzle();
        startTimer();
        startBackgroundMusic();
    };
    puzzleImage.src = tempCanvas.toDataURL();
}

function initPuzzle() {
    canvas = document.getElementById('puzzleCanvas');
    ctx = canvas.getContext('2d');

    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Calculate puzzle configuration based on difficulty
    calculatePuzzleConfig();

    // Create puzzle pieces
    createPuzzlePieces();

    // Set up event listeners
    setupPuzzleEvents();

    // Initial render
    renderPuzzle();

    // Update UI
    document.getElementById('totalPieces').textContent = pieces.length;
    document.getElementById('piecesPlaced').textContent = '0';
    GameState.totalPiecesCount = pieces.length;
    GameState.placedPieces = 0;
}

function resizeCanvas() {
    const container = document.querySelector('.puzzle-container');

    // Use full container size for canvas
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;

    // Ensure minimum size
    if (canvas.width < 300) canvas.width = 300;
    if (canvas.height < 300) canvas.height = 300;

    // Update canvas style to match
    canvas.style.width = canvas.width + 'px';
    canvas.style.height = canvas.height + 'px';

    console.log('Resized canvas to:', canvas.width, 'x', canvas.height);

    if (puzzleImage && puzzleImage.complete) {
        calculatePuzzleConfig();
        renderPuzzle();
    }
}

function calculatePuzzleConfig() {
    // Determine grid size based on difficulty
    // 12 pieces = 4x3, 20 pieces = 5x4, 30 pieces = 6x5
    switch (GameState.difficulty) {
        case 12:
            puzzleConfig.cols = 4;
            puzzleConfig.rows = 3;
            break;
        case 20:
            puzzleConfig.cols = 5;
            puzzleConfig.rows = 4;
            break;
        case 30:
            puzzleConfig.cols = 6;
            puzzleConfig.rows = 5;
            break;
        default:
            puzzleConfig.cols = 4;
            puzzleConfig.rows = 3;
    }

    // Calculate image dimensions to fit canvas while maintaining aspect ratio
    // Use most of the canvas for the puzzle target area
    const paddingX = 20;
    const paddingY = 20;
    const availableWidth = canvas.width - paddingX * 2;
    const availableHeight = canvas.height - paddingY * 2;

    const imageAspect = puzzleImage.width / puzzleImage.height;
    const canvasAspect = availableWidth / availableHeight;

    if (imageAspect > canvasAspect) {
        // Image is wider than canvas - fit to width
        puzzleConfig.imageWidth = availableWidth;
        puzzleConfig.imageHeight = availableWidth / imageAspect;
    } else {
        // Image is taller than canvas - fit to height
        puzzleConfig.imageHeight = availableHeight;
        puzzleConfig.imageWidth = availableHeight * imageAspect;
    }

    // Center the puzzle target area in the canvas
    puzzleConfig.imageX = (canvas.width - puzzleConfig.imageWidth) / 2;
    puzzleConfig.imageY = (canvas.height - puzzleConfig.imageHeight) / 2;

    console.log('Canvas:', canvas.width, 'x', canvas.height);
    console.log('Image config:', puzzleConfig.imageWidth, 'x', puzzleConfig.imageHeight, 'at', puzzleConfig.imageX, puzzleConfig.imageY);

    puzzleConfig.pieceWidth = puzzleConfig.imageWidth / puzzleConfig.cols;
    puzzleConfig.pieceHeight = puzzleConfig.imageHeight / puzzleConfig.rows;
    puzzleConfig.tabSize = Math.min(puzzleConfig.pieceWidth, puzzleConfig.pieceHeight) * 0.2;
}

function createPuzzlePieces() {
    pieces = [];

    for (let row = 0; row < puzzleConfig.rows; row++) {
        for (let col = 0; col < puzzleConfig.cols; col++) {
            const piece = {
                id: row * puzzleConfig.cols + col,
                row: row,
                col: col,
                // Correct position
                correctX: puzzleConfig.imageX + col * puzzleConfig.pieceWidth,
                correctY: puzzleConfig.imageY + row * puzzleConfig.pieceHeight,
                // Current position (will be randomized)
                x: 0,
                y: 0,
                // Source position in image
                srcX: col * (puzzleImage.width / puzzleConfig.cols),
                srcY: row * (puzzleImage.height / puzzleConfig.rows),
                srcWidth: puzzleImage.width / puzzleConfig.cols,
                srcHeight: puzzleImage.height / puzzleConfig.rows,
                // Tab configuration for jigsaw shape
                tabs: {
                    top: row === 0 ? 0 : (Math.random() > 0.5 ? 1 : -1),
                    right: col === puzzleConfig.cols - 1 ? 0 : (Math.random() > 0.5 ? 1 : -1),
                    bottom: row === puzzleConfig.rows - 1 ? 0 : 0, // Will be set based on piece below
                    left: col === 0 ? 0 : 0 // Will be set based on piece to the left
                },
                isPlaced: false,
                groupId: null
            };

            // Set complementary tabs
            if (col > 0) {
                piece.tabs.left = -pieces[pieces.length - 1].tabs.right;
            }
            if (row > 0) {
                const pieceAbove = pieces[(row - 1) * puzzleConfig.cols + col];
                piece.tabs.top = -pieceAbove.tabs.bottom;
            }

            // Set bottom tab for the next row
            if (row < puzzleConfig.rows - 1) {
                piece.tabs.bottom = Math.random() > 0.5 ? 1 : -1;
            }

            pieces.push(piece);
        }
    }

    console.log('Created', pieces.length, 'pieces for difficulty', GameState.difficulty);
    console.log('Grid:', puzzleConfig.cols, 'x', puzzleConfig.rows);

    // Shuffle pieces
    shufflePieces();
}

function shufflePieces() {
    const margin = puzzleConfig.tabSize + 10;
    const pw = puzzleConfig.pieceWidth;
    const ph = puzzleConfig.pieceHeight;

    // Get unplaced pieces and shuffle their order randomly
    const unplacedPieces = pieces.filter(p => !p.isPlaced);

    // Fisher-Yates shuffle to randomize order
    for (let i = unplacedPieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unplacedPieces[i], unplacedPieces[j]] = [unplacedPieces[j], unplacedPieces[i]];
    }

    // Scatter pieces randomly across the entire canvas
    // Pieces will overlap with the puzzle area - that's fine, player will move them
    unplacedPieces.forEach((piece) => {
        // Random position anywhere on the canvas (with margin for piece size)
        let newX = margin + Math.random() * (canvas.width - pw - margin * 2);
        let newY = margin + Math.random() * (canvas.height - ph - margin * 2);

        // Final bounds check
        newX = Math.max(margin, Math.min(newX, canvas.width - pw - margin));
        newY = Math.max(margin, Math.min(newY, canvas.height - ph - margin));

        piece.x = newX;
        piece.y = newY;
    });

    renderPuzzle();
}

function setupPuzzleEvents() {
    // Mouse events
    canvas.addEventListener('mousedown', handlePuzzleMouseDown);
    canvas.addEventListener('mousemove', handlePuzzleMouseMove);
    canvas.addEventListener('mouseup', handlePuzzleMouseUp);
    canvas.addEventListener('mouseleave', handlePuzzleMouseUp);

    // Touch events
    canvas.addEventListener('touchstart', handlePuzzleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handlePuzzleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handlePuzzleTouchEnd);
}

function handlePuzzleMouseDown(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    selectPieceAt(x, y);
}

function handlePuzzleMouseMove(e) {
    if (!selectedPiece) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    movePieceTo(x, y);
}

function handlePuzzleMouseUp(e) {
    if (selectedPiece) {
        dropPiece();
    }
}

function handlePuzzleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    selectPieceAt(x, y);
}

function handlePuzzleTouchMove(e) {
    e.preventDefault();
    if (!selectedPiece) return;
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    movePieceTo(x, y);
}

function handlePuzzleTouchEnd(e) {
    if (selectedPiece) {
        dropPiece();
    }
}

function selectPieceAt(x, y) {
    // Find piece at position (from top - last rendered - to bottom)
    for (let i = pieces.length - 1; i >= 0; i--) {
        const piece = pieces[i];
        if (piece.isPlaced) continue;

        const pw = puzzleConfig.pieceWidth + puzzleConfig.tabSize * 2;
        const ph = puzzleConfig.pieceHeight + puzzleConfig.tabSize * 2;

        if (x >= piece.x - puzzleConfig.tabSize &&
            x <= piece.x + puzzleConfig.pieceWidth + puzzleConfig.tabSize &&
            y >= piece.y - puzzleConfig.tabSize &&
            y <= piece.y + puzzleConfig.pieceHeight + puzzleConfig.tabSize) {

            selectedPiece = piece;
            dragOffset.x = x - piece.x;
            dragOffset.y = y - piece.y;

            // Move to top of render order
            pieces.splice(i, 1);
            pieces.push(piece);

            renderPuzzle();
            return;
        }
    }
}

function movePieceTo(x, y) {
    if (!selectedPiece) return;

    selectedPiece.x = x - dragOffset.x;
    selectedPiece.y = y - dragOffset.y;

    renderPuzzle();
}

function dropPiece() {
    if (!selectedPiece) return;

    const snapDistance = puzzleConfig.pieceWidth * 0.25;

    // Check if close to correct position
    const dx = Math.abs(selectedPiece.x - selectedPiece.correctX);
    const dy = Math.abs(selectedPiece.y - selectedPiece.correctY);

    if (dx < snapDistance && dy < snapDistance) {
        // Snap to correct position
        selectedPiece.x = selectedPiece.correctX;
        selectedPiece.y = selectedPiece.correctY;
        selectedPiece.isPlaced = true;
        GameState.placedPieces++;

        sounds.snap();
        addScore(10);

        document.getElementById('piecesPlaced').textContent = GameState.placedPieces;

        // Check if puzzle is complete
        if (GameState.placedPieces === pieces.length) {
            completePuzzleStage();
        }
    } else {
        // Check for snapping to adjacent pieces
        checkAdjacentSnap(selectedPiece);
    }

    selectedPiece = null;
    renderPuzzle();
}

function checkAdjacentSnap(piece) {
    const snapDistance = puzzleConfig.pieceWidth * 0.3;

    pieces.forEach(other => {
        if (other === piece || other.isPlaced) return;

        // Check if pieces are adjacent in the grid
        const rowDiff = Math.abs(piece.row - other.row);
        const colDiff = Math.abs(piece.col - other.col);

        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            // Calculate expected offset
            const expectedDx = (piece.col - other.col) * puzzleConfig.pieceWidth;
            const expectedDy = (piece.row - other.row) * puzzleConfig.pieceHeight;

            // Current offset
            const actualDx = piece.x - other.x;
            const actualDy = piece.y - other.y;

            // Check if close enough to snap
            const diffX = Math.abs(actualDx - expectedDx);
            const diffY = Math.abs(actualDy - expectedDy);

            if (diffX < snapDistance && diffY < snapDistance) {
                // Snap pieces together
                piece.x = other.x + expectedDx;
                piece.y = other.y + expectedDy;
                sounds.snap();
            }
        }
    });
}

function renderPuzzle() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw puzzle outline/guide
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 2;
    ctx.strokeRect(
        puzzleConfig.imageX - 5,
        puzzleConfig.imageY - 5,
        puzzleConfig.imageWidth + 10,
        puzzleConfig.imageHeight + 10
    );

    // Draw grid guide
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 1; i < puzzleConfig.cols; i++) {
        const x = puzzleConfig.imageX + i * puzzleConfig.pieceWidth;
        ctx.beginPath();
        ctx.moveTo(x, puzzleConfig.imageY);
        ctx.lineTo(x, puzzleConfig.imageY + puzzleConfig.imageHeight);
        ctx.stroke();
    }
    for (let i = 1; i < puzzleConfig.rows; i++) {
        const y = puzzleConfig.imageY + i * puzzleConfig.pieceHeight;
        ctx.beginPath();
        ctx.moveTo(puzzleConfig.imageX, y);
        ctx.lineTo(puzzleConfig.imageX + puzzleConfig.imageWidth, y);
        ctx.stroke();
    }

    // Draw pieces
    pieces.forEach(piece => {
        drawPuzzlePiece(piece, piece === selectedPiece);
    });
}

function drawPuzzlePiece(piece, isSelected) {
    ctx.save();

    const pw = puzzleConfig.pieceWidth;
    const ph = puzzleConfig.pieceHeight;
    const x = piece.x;
    const y = piece.y;

    // Simple rectangular pieces - no jigsaw tabs for cleaner look
    // Draw shadow
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = isSelected ? 15 : 8;
    ctx.shadowOffsetX = 3;
    ctx.shadowOffsetY = 3;

    // Draw the piece as a simple rectangle
    ctx.beginPath();
    ctx.rect(x, y, pw, ph);
    ctx.clip();

    // Draw the exact portion of the original image
    // srcX, srcY = position in original image
    // srcWidth, srcHeight = size of portion in original image
    // x, y = position on canvas
    // pw, ph = size on canvas
    ctx.drawImage(
        puzzleImage,
        piece.srcX,              // source X in original image
        piece.srcY,              // source Y in original image
        piece.srcWidth,          // source width in original image
        piece.srcHeight,         // source height in original image
        x,                       // destination X on canvas
        y,                       // destination Y on canvas
        pw,                      // destination width on canvas
        ph                       // destination height on canvas
    );

    ctx.restore();

    // Draw piece border - simple rectangle
    ctx.save();
    ctx.strokeStyle = isSelected ? '#fff' : 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = isSelected ? 3 : 1;
    ctx.strokeRect(x, y, pw, ph);

    // Highlight if placed correctly
    if (piece.isPlaced) {
        ctx.strokeStyle = 'rgba(92, 184, 92, 0.8)';
        ctx.lineWidth = 3;
        ctx.strokeRect(x, y, pw, ph);
    }

    ctx.restore();
}

function showHint() {
    // Find an unplaced piece and briefly show its correct position
    const unplacedPiece = pieces.find(p => !p.isPlaced);
    if (!unplacedPiece) return;

    GameState.hintsUsed++;
    addScore(-5); // Penalty for using hint

    // Highlight correct position
    ctx.save();
    ctx.fillStyle = 'rgba(92, 184, 92, 0.5)';
    ctx.fillRect(
        unplacedPiece.correctX,
        unplacedPiece.correctY,
        puzzleConfig.pieceWidth,
        puzzleConfig.pieceHeight
    );
    ctx.restore();

    // Animate the piece briefly
    const originalX = unplacedPiece.x;
    const originalY = unplacedPiece.y;

    unplacedPiece.x = unplacedPiece.correctX;
    unplacedPiece.y = unplacedPiece.correctY;
    renderPuzzle();

    setTimeout(() => {
        unplacedPiece.x = originalX;
        unplacedPiece.y = originalY;
        renderPuzzle();
    }, 500);
}

function completePuzzleStage() {
    sounds.complete();
    addScore(100); // Bonus for completing puzzle

    // Brief celebration
    setTimeout(() => {
        GameState.currentStage = 2;
        startQuizStage('continents');
    }, 1500);
}

// ============================================
// Quiz Stages
// ============================================
let quizData = [];
let currentQuizIndex = 0;
let quizQuestions = [];
let isAnswering = false;

function startQuizStage(type) {
    showScreen('quizScreen');

    // Update stage indicator
    const stageLabel = document.getElementById('quizStageLabel');
    const stageName = document.getElementById('quizStageName');
    const questionEl = document.getElementById('quizQuestion');

    switch (type) {
        case 'continents':
            stageLabel.textContent = 'שלב 2';
            stageName.textContent = 'יבשות';
            questionEl.textContent = 'מהי היבשת המהבהבת?';
            quizData = [...GeoData.continents];
            break;
        case 'countries':
            stageLabel.textContent = 'שלב 3';
            stageName.textContent = 'מדינות';
            questionEl.textContent = 'מהי המדינה המהבהבת?';
            quizData = [...GeoData.countries];
            break;
        case 'cities':
            stageLabel.textContent = 'שלב 4';
            stageName.textContent = 'ערים';
            questionEl.textContent = 'מהי העיר המסומנת?';
            quizData = [...GeoData.cities];
            break;
    }

    // Shuffle and pick 5 questions
    shuffleArray(quizData);
    quizQuestions = quizData.slice(0, 5);
    currentQuizIndex = 0;

    document.getElementById('totalQuestions').textContent = quizQuestions.length;
    document.getElementById('questionNum').textContent = '1';
    updateLivesDisplay();
    updateScoreDisplay();

    // Load map image for quiz
    const mapImg = document.getElementById('quizMapImage');
    mapImg.src = puzzleImage ? puzzleImage.src : MAP_IMAGE_URL;
    mapImg.onload = () => {
        showQuizQuestion(type);
    };
}

function showQuizQuestion(type) {
    if (currentQuizIndex >= quizQuestions.length) {
        // Stage complete
        completeQuizStage(type);
        return;
    }

    isAnswering = false;
    const question = quizQuestions[currentQuizIndex];
    document.getElementById('questionNum').textContent = currentQuizIndex + 1;

    // Generate options (correct + 2 wrong)
    const options = generateOptions(question, type);

    // Display options
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';

    options.forEach(option => {
        const btn = document.createElement('button');
        btn.className = 'quiz-option';
        btn.textContent = option.name;
        btn.onclick = () => checkAnswer(option, question, type);
        optionsContainer.appendChild(btn);
    });

    // Highlight the area on the map
    highlightMapArea(question, type);
}

function generateOptions(correct, type) {
    const options = [{ ...correct, isCorrect: true }];
    let pool;

    switch (type) {
        case 'continents':
            pool = GeoData.continents;
            break;
        case 'countries':
            pool = GeoData.countries;
            break;
        case 'cities':
            pool = GeoData.cities;
            break;
    }

    // Get 2 random wrong answers
    const wrongOptions = pool.filter(item => item.name !== correct.name);
    shuffleArray(wrongOptions);
    options.push({ ...wrongOptions[0], isCorrect: false });
    options.push({ ...wrongOptions[1], isCorrect: false });

    shuffleArray(options);
    return options;
}

function positionOverlayOnImage() {
    // Position the overlay and city-marker container exactly on top of the rendered image
    const mapImg = document.getElementById('quizMapImage');
    const overlay = document.getElementById('highlightOverlay');
    const cityMarker = document.getElementById('cityMarker');
    const wrapper = document.getElementById('quizMapWrapper');

    const imgRect = mapImg.getBoundingClientRect();
    const wrapperRect = wrapper.getBoundingClientRect();

    // Offset from wrapper to the actual rendered image
    const offsetX = imgRect.left - wrapperRect.left;
    const offsetY = imgRect.top - wrapperRect.top;

    // Position overlay exactly on top of the image
    overlay.style.left = offsetX + 'px';
    overlay.style.top = offsetY + 'px';
    overlay.style.width = imgRect.width + 'px';
    overlay.style.height = imgRect.height + 'px';
    // Reset right/bottom since we're using explicit width/height
    overlay.style.right = 'auto';
    overlay.style.bottom = 'auto';
}

function highlightMapArea(item, type) {
    const mapImg = document.getElementById('quizMapImage');
    const overlay = document.getElementById('highlightOverlay');
    const cityMarker = document.getElementById('cityMarker');

    // Wait for image to be fully loaded
    if (!mapImg.complete || mapImg.naturalWidth === 0) {
        setTimeout(() => highlightMapArea(item, type), 100);
        return;
    }

    // First, position overlay exactly on the image
    positionOverlayOnImage();

    if (type === 'cities') {
        // Show city marker as a child of overlay using percentage positioning
        overlay.innerHTML = '';
        cityMarker.style.display = 'none';

        // Create a marker inside the overlay using percentages
        const marker = document.createElement('div');
        marker.style.cssText = `
            position: absolute;
            left: ${item.position.x * 100}%;
            top: ${item.position.y * 100}%;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: radial-gradient(circle, #ff6b6b 0%, #ff0000 70%);
            border: 3px solid #ffffff;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.8), 0 0 30px rgba(255, 0, 0, 0.4);
            transform: translate(-50%, -50%);
            animation: flashHighlight 0.8s ease-in-out infinite;
            pointer-events: none;
        `;
        overlay.appendChild(marker);
    } else {
        // Show flashing area for continents/countries using percentages
        cityMarker.style.display = 'none';

        const highlightDiv = document.createElement('div');
        highlightDiv.className = 'area-highlight';
        highlightDiv.style.cssText = `
            position: absolute;
            left: ${item.bounds.x * 100}%;
            top: ${item.bounds.y * 100}%;
            width: ${item.bounds.width * 100}%;
            height: ${item.bounds.height * 100}%;
            background: rgba(255, 0, 0, 0.3);
            border: 3px solid #ff0000;
            border-radius: 10px;
            animation: flashHighlight 0.8s ease-in-out infinite;
            pointer-events: none;
            box-sizing: border-box;
        `;

        overlay.innerHTML = '';
        overlay.appendChild(highlightDiv);
    }

    // Add animation keyframes if not exists
    if (!document.getElementById('flashAnimation')) {
        const style = document.createElement('style');
        style.id = 'flashAnimation';
        style.textContent = `
            @keyframes flashHighlight {
                0%, 100% { opacity: 0.3; transform: scale(1); }
                50% { opacity: 0.7; transform: scale(1.02); }
            }
        `;
        document.head.appendChild(style);
    }
}

function checkAnswer(selected, correct, type) {
    if (isAnswering) return;
    isAnswering = true;

    GameState.totalQuestions++;
    const buttons = document.querySelectorAll('.quiz-option');

    buttons.forEach(btn => {
        btn.disabled = true;
        if (btn.textContent === correct.name) {
            btn.classList.add('correct');
        } else if (btn.textContent === selected.name && !selected.isCorrect) {
            btn.classList.add('wrong');
        }
    });

    if (selected.isCorrect) {
        sounds.success();
        addScore(20);
        GameState.correctAnswers++;
    } else {
        sounds.fail();
        GameState.lives--;
        updateLivesDisplay();

        if (GameState.lives <= 0) {
            // Game over
            setTimeout(() => showResults(), 1500);
            return;
        }
    }

    // Next question
    setTimeout(() => {
        currentQuizIndex++;
        document.getElementById('highlightOverlay').innerHTML = '';
        document.getElementById('cityMarker').style.display = 'none';
        showQuizQuestion(type);
    }, 1500);
}

function updateLivesDisplay() {
    const livesEl = document.getElementById('livesDisplay');
    livesEl.textContent = '❤️'.repeat(GameState.lives) + '🖤'.repeat(3 - GameState.lives);
}

function completeQuizStage(type) {
    sounds.complete();
    addScore(50); // Stage completion bonus

    setTimeout(() => {
        if (type === 'continents') {
            GameState.currentStage = 3;
            startQuizStage('countries');
        } else if (type === 'countries') {
            GameState.currentStage = 4;
            startQuizStage('cities');
        } else {
            // Game complete!
            showResults();
        }
    }, 1000);
}

// ============================================
// Results Screen
// ============================================
function showResults() {
    stopTimer();
    stopBackgroundMusic();

    showScreen('resultsScreen');

    // Update stats
    document.getElementById('finalScore').textContent = GameState.score;
    document.getElementById('finalTime').textContent = formatTime(GameState.elapsedTime);
    document.getElementById('correctAnswers').textContent = GameState.correctAnswers;

    // Check for high score
    if (GameState.score > GameState.highScore) {
        GameState.highScore = GameState.score;
        localStorage.setItem('geoHighScore', GameState.highScore);
        document.getElementById('newHighScore').style.display = 'block';
    } else {
        document.getElementById('newHighScore').style.display = 'none';
    }

    // Create confetti
    createConfetti();

    sounds.complete();
}

function createConfetti() {
    const container = document.getElementById('confetti');
    container.innerHTML = '';

    // Create fireworks effect
    createFireworks(container);
}

function createFireworks(container) {
    // Add firework animation styles first
    if (!document.getElementById('fireworkStyles')) {
        const style = document.createElement('style');
        style.id = 'fireworkStyles';
        style.textContent = `
            @keyframes fireworkExplode {
                0% {
                    transform: translate(0, 0) scale(1);
                    opacity: 1;
                }
                50% {
                    opacity: 1;
                }
                100% {
                    transform: translate(var(--dx), var(--dy)) scale(0.3);
                    opacity: 0;
                }
            }
            @keyframes fireworkGlow {
                0%, 100% { filter: brightness(1); }
                50% { filter: brightness(1.5); }
            }
        `;
        document.head.appendChild(style);
    }

    const colors = ['#ff3333', '#ffdd33', '#33ff33', '#33ddff', '#ff33ff', '#ff9933', '#ffffff', '#ffaa00'];

    // Create multiple firework bursts across the screen
    for (let burst = 0; burst < 8; burst++) {
        setTimeout(() => {
            // Random position across the screen
            const centerX = 10 + Math.random() * 80;
            const centerY = 10 + Math.random() * 60;

            // Create particles for each burst
            const particleCount = 40;
            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                particle.className = 'firework-particle';

                const angle = (i / particleCount) * Math.PI * 2 + (Math.random() * 0.3);
                const velocity = 80 + Math.random() * 120;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const size = 4 + Math.random() * 6;

                particle.style.cssText = `
                    position: absolute;
                    left: ${centerX}%;
                    top: ${centerY}%;
                    width: ${size}px;
                    height: ${size}px;
                    border-radius: 50%;
                    background: ${color};
                    box-shadow: 0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color};
                    pointer-events: none;
                    animation: fireworkExplode 1.8s ease-out forwards;
                    --dx: ${Math.cos(angle) * velocity}px;
                    --dy: ${Math.sin(angle) * velocity}px;
                `;

                container.appendChild(particle);
            }

            // Play coin sound for first few bursts
            if (burst < 4 && GameState.soundEnabled) {
                playCoinSound();
            }
        }, burst * 350);
    }

    // Clear after animation
    setTimeout(() => {
        container.innerHTML = '';
    }, 5000);
}

// ============================================
// Utility Functions
// ============================================
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ============================================
// Initialization
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Display high score
    document.getElementById('highScoreDisplay').textContent = GameState.highScore;

    // Prevent zoom on double tap for mobile
    document.addEventListener('touchstart', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
});
