/* =========================================================
   SCORVEX G7 — AUDIO SYSTEM
   Música + efectos de sonido
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CONFIGURACIÓN
     ======================================================= */

  const STORAGE_KEY = "scorvex_g7_audio";

  let audioContext = null;
  let masterGain = null;
  let musicGain = null;
  let sfxGain = null;

  let musicEnabled = true;
  let soundEnabled = true;

  let currentTrack = "menu";
  let musicTimer = null;
  let musicStep = 0;

  let initialized = false;

  /* =======================================================
     MÚSICAS
     ======================================================= */

  const TRACKS = {

    menu: {
      name: "SCORVEX Main",
      bpm: 92,
      notes: [
        220,
        277.18,
        329.63,
        415.30,
        329.63,
        277.18
      ]
    },

    battle: {
      name: "Battle Protocol",
      bpm: 128,
      notes: [
        110,
        130.81,
        146.83,
        164.81,
        146.83,
        130.81,
        110,
        164.81
      ]
    },

    boss: {
      name: "Omega Boss",
      bpm: 150,
      notes: [
        82.41,
        98,
        110,
        123.47,
        110,
        98,
        82.41,
        146.83
      ]
    },

    victory: {
      name: "Victory",
      bpm: 105,
      notes: [
        261.63,
        329.63,
        392,
        523.25,
        659.25,
        523.25,
        659.25,
        783.99
      ]
    }
  };

  /* =======================================================
     CARGAR CONFIGURACIÓN
     ======================================================= */

  function loadSettings() {
    try {
      const raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (!raw) return;

      const data =
        JSON.parse(raw);

      if (
        typeof data.musicEnabled ===
        "boolean"
      ) {
        musicEnabled =
          data.musicEnabled;
      }

      if (
        typeof data.soundEnabled ===
        "boolean"
      ) {
        soundEnabled =
          data.soundEnabled;
      }

    } catch (error) {
      console.warn(
        "SCORVEX AUDIO: no se pudo cargar la configuración."
      );
    }
  }

  function saveSettings() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          musicEnabled,
          soundEnabled
        })
      );
    } catch (error) {
      console.warn(
        "SCORVEX AUDIO: no se pudo guardar la configuración."
      );
    }
  }

  loadSettings();

  /* =======================================================
     INICIALIZAR AUDIO
     ======================================================= */

  function initAudio() {

    if (initialized) {
      if (
        audioContext &&
        audioContext.state ===
        "suspended"
      ) {
        audioContext.resume();
      }

      return;
    }

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx) {
      console.warn(
        "Este navegador no soporta Web Audio API."
      );

      return;
    }

    audioContext =
      new AudioCtx();

    masterGain =
      audioContext.createGain();

    musicGain =
      audioContext.createGain();

    sfxGain =
      audioContext.createGain();

    masterGain.gain.value =
      0.7;

    musicGain.gain.value =
      musicEnabled ? 0.25 : 0;

    sfxGain.gain.value =
      soundEnabled ? 0.7 : 0;

    musicGain.connect(
      masterGain
    );

    sfxGain.connect(
      masterGain
    );

    masterGain.connect(
      audioContext.destination
    );

    initialized = true;
  }

  /* =======================================================
     ASEGURAR AUDIO
     ======================================================= */

  function ensureAudio() {

    initAudio();

    if (
      audioContext &&
      audioContext.state ===
      "suspended"
    ) {
      audioContext.resume();
    }

    return Boolean(
      audioContext
    );
  }

  /* =======================================================
     OSCILADOR
     ======================================================= */

  function oscillator(
    frequency,
    duration,
    type = "sine",
    volume = 0.1,
    destination = null
  ) {

    if (!ensureAudio()) {
      return;
    }

    const osc =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    osc.type = type;

    osc.frequency.setValueAtTime(
      frequency,
      audioContext.currentTime
    );

    gain.gain.setValueAtTime(
      0.0001,
      audioContext.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      Math.max(
        0.0001,
        volume
      ),
      audioContext.currentTime +
        0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      audioContext.currentTime +
        duration
    );

    osc.connect(gain);

    gain.connect(
      destination || sfxGain
    );

    osc.start();

    osc.stop(
      audioContext.currentTime +
        duration +
        0.03
    );
  }

  /* =======================================================
     SONIDO CON FRECUENCIA VARIABLE
     ======================================================= */

  function sweep(
    startFrequency,
    endFrequency,
    duration,
    type = "sine",
    volume = 0.1,
    destination = null
  ) {

    if (!ensureAudio()) {
      return;
    }

    const osc =
      audioContext.createOscillator();

    const gain =
      audioContext.createGain();

    const now =
      audioContext.currentTime;

    osc.type = type;

    osc.frequency.setValueAtTime(
      startFrequency,
      now
    );

    osc.frequency.exponentialRampToValueAtTime(
      Math.max(
        1,
        endFrequency
      ),
      now + duration
    );

    gain.gain.setValueAtTime(
      0.0001,
      now
    );

    gain.gain.exponentialRampToValueAtTime(
      Math.max(
        0.0001,
        volume
      ),
      now + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + duration
    );

    osc.connect(gain);

    gain.connect(
      destination || sfxGain
    );

    osc.start(now);

    osc.stop(
      now +
      duration +
      0.03
    );
  }

  /* =======================================================
     NOTA MUSICAL
     ======================================================= */

  function playNote(
    frequency,
    duration = 0.2,
    volume = 0.05
  ) {
    oscillator(
      frequency,
      duration,
      "triangle",
      volume,
      musicGain
    );
  }

  /* =======================================================
     REPRODUCIR TRACK
     ======================================================= */

  function playMusicStep() {

    if (!musicEnabled) {
      return;
    }

    const track =
      TRACKS[currentTrack];

    if (!track) {
      return;
    }

    const note =
      track.notes[
        musicStep %
        track.notes.length
      ];

    const duration =
      60 / track.bpm;

    playNote(
      note,
      duration * 0.8,
      0.045
    );

    /* Segunda capa */

    if (
      musicStep % 2 === 0
    ) {
      playNote(
        note * 2,
        duration * 0.35,
        0.018
      );
    }

    musicStep++;
  }

  /* =======================================================
     INICIAR MÚSICA
     ======================================================= */

  function startMusic(
    trackName = "menu"
  ) {

    if (!TRACKS[trackName]) {
      trackName = "menu";
    }

    ensureAudio();

    stopMusic();

    currentTrack =
      trackName;

    musicStep = 0;

    if (!musicEnabled) {
      return;
    }

    const track =
      TRACKS[currentTrack];

    const interval =
      (60 / track.bpm) *
      1000;

    playMusicStep();

    musicTimer =
      setInterval(
        playMusicStep,
        interval
      );
  }

  /* =======================================================
     DETENER MÚSICA
     ======================================================= */

  function stopMusic() {

    if (musicTimer) {
      clearInterval(
        musicTimer
      );

      musicTimer = null;
    }
  }

  /* =======================================================
     CAMBIAR MÚSICA
     ======================================================= */

  function setMusic(
    trackName
  ) {
    startMusic(
      trackName
    );
  }

  /* =======================================================
     SONIDOS DE ARMAS
     ======================================================= */

  function weaponShot(
    weaponType = "rifle"
  ) {

    if (!soundEnabled) {
      return;
    }

    switch (
      weaponType
    ) {

      case "pistol":
        oscillator(
          180,
          0.08,
          "square",
          0.13
        );

        sweep(
          900,
          300,
          0.09,
          "sawtooth",
          0.05
        );
        break;

      case "shotgun":
        oscillator(
          90,
          0.16,
          "sawtooth",
          0.2
        );

        sweep(
          500,
          70,
          0.18,
          "square",
          0.08
        );
        break;

      case "sniper":
        sweep(
          1200,
          180,
          0.3,
          "sine",
          0.15
        );
        break;

      case "laser":
        sweep(
          700,
          1800,
          0.16,
          "sine",
          0.08
        );
        break;

      case "plasma":
        sweep(
          250,
          900,
          0.22,
          "triangle",
          0.1
        );
        break;

      case "energy":
        sweep(
          400,
          1400,
          0.18,
          "sine",
          0.09
        );
        break;

      default:
        oscillator(
          140,
          0.09,
          "square",
          0.1
        );

        sweep(
          700,
          250,
          0.08,
          "sawtooth",
          0.035
        );
    }
  }

  /* =======================================================
     SONIDO DE RECARGA
     ======================================================= */

  function reload() {

    if (!soundEnabled) {
      return;
    }

    oscillator(
      500,
      0.08,
      "square",
      0.05
    );

    setTimeout(() => {
      oscillator(
        800,
        0.08,
        "square",
        0.05
      );
    }, 100);

    setTimeout(() => {
      oscillator(
        1100,
        0.12,
        "square",
        0.06
      );
    }, 220);
  }

  /* =======================================================
     HABILIDADES
     ======================================================= */

  function ability(
    type = "energy"
  ) {

    if (!soundEnabled) {
      return;
    }

    switch (type) {

      case "dash":
        sweep(
          150,
          1200,
          0.2,
          "sine",
          0.1
        );
        break;

      case "shield":
        sweep(
          250,
          700,
          0.35,
          "triangle",
          0.08
        );
        break;

      case "freeze":
        sweep(
          1000,
          250,
          0.5,
          "sine",
          0.1
        );
        break;

      case "storm":
        oscillator(
          70,
          0.5,
          "sawtooth",
          0.12
        );

        sweep(
          300,
          1500,
          0.4,
          "square",
          0.07
        );
        break;

      case "meteor":
        sweep(
          1800,
          80,
          0.8,
          "sawtooth",
          0.15
        );
        break;

      case "blackhole":
        sweep(
          900,
          45,
          1.2,
          "sine",
          0.13
        );
        break;

      default:
        sweep(
          300,
          1200,
          0.35,
          "triangle",
          0.08
        );
    }
  }

  /* =======================================================
     DAÑO
     ======================================================= */

  function damage() {

    if (!soundEnabled) {
      return;
    }

    oscillator(
      90,
      0.12,
      "sawtooth",
      0.1
    );

    oscillator(
      55,
      0.18,
      "square",
      0.05
    );
  }

  /* =======================================================
     CURACIÓN
     ======================================================= */

  function heal() {

    if (!soundEnabled) {
      return;
    }

    playNote(
      523.25,
      0.15,
      0.06
    );

    setTimeout(() => {
      playNote(
        659.25,
        0.15,
        0.06
      );
    }, 100);

    setTimeout(() => {
      playNote(
        783.99,
        0.2,
        0.07
      );
    }, 200);
  }

  /* =======================================================
     COMPRA
     ======================================================= */

  function purchase() {

    if (!soundEnabled) {
      return;
    }

    oscillator(
      700,
      0.08,
      "square",
      0.05
    );

    setTimeout(() => {
      oscillator(
        1000,
        0.12,
        "triangle",
        0.07
      );
    }, 90);
  }

  /* =======================================================
     ERROR
     ======================================================= */

  function error() {

    if (!soundEnabled) {
      return;
    }

    oscillator(
      180,
      0.18,
      "square",
      0.07
    );

    setTimeout(() => {
      oscillator(
        110,
        0.2,
        "square",
        0.06
      );
    }, 130);
  }

  /* =======================================================
     VICTORIA
     ======================================================= */

  function victory() {

    if (!soundEnabled) {
      return;
    }

    const notes = [
      392,
      523.25,
      659.25,
      783.99
    ];

    notes.forEach(
      (frequency, index) => {

        setTimeout(() => {

          playNote(
            frequency,
            0.3,
            0.08
          );

        }, index * 150);

      }
    );
  }

  /* =======================================================
     DERROTA
     ======================================================= */

  function defeat() {

    if (!soundEnabled) {
      return;
    }

    sweep(
      400,
      80,
      0.8,
      "sawtooth",
      0.08
    );
  }

  /* =======================================================
     CLICK DE UI
     ======================================================= */

  function click() {

    if (!soundEnabled) {
      return;
    }

    oscillator(
      800,
      0.045,
      "square",
      0.035
    );
  }

  /* =======================================================
     NIVEL NUEVO
     ======================================================= */

  function levelUp() {

    if (!soundEnabled) {
      return;
    }

    const notes = [
      523.25,
      659.25,
      783.99,
      1046.50
    ];

    notes.forEach(
      (frequency, index) => {

        setTimeout(() => {

          playNote(
            frequency,
            0.2,
            0.08
          );

        }, index * 110);

      }
    );
  }

  /* =======================================================
     BOSS
     ======================================================= */

  function bossWarning() {

    if (!soundEnabled) {
      return;
    }

    oscillator(
      80,
      0.35,
      "sawtooth",
      0.1
    );

    setTimeout(() => {

      oscillator(
        100,
        0.35,
        "sawtooth",
        0.1
      );

    }, 400);

    setTimeout(() => {

      oscillator(
        130,
        0.5,
        "sawtooth",
        0.12
      );

    }, 800);
  }

  /* =======================================================
     CAMBIAR VOLUMEN
     ======================================================= */

  function setMasterVolume(
    value
  ) {

    if (!ensureAudio()) {
      return;
    }

    const volume =
      Math.max(
        0,
        Math.min(
          1,
          Number(value)
        )
      );

    masterGain.gain.value =
      volume;
  }

  function setMusicVolume(
    value
  ) {

    if (!ensureAudio()) {
      return;
    }

    musicGain.gain.value =
      Math.max(
        0,
        Math.min(
          1,
          Number(value)
        )
      );
  }

  function setSfxVolume(
    value
  ) {

    if (!ensureAudio()) {
      return;
    }

    sfxGain.gain.value =
      Math.max(
        0,
        Math.min(
          1,
          Number(value)
        )
      );
  }

  /* =======================================================
     ACTIVAR/DESACTIVAR MÚSICA
     ======================================================= */

  function setMusicEnabled(
    enabled
  ) {

    musicEnabled =
      Boolean(enabled);

    if (
      musicGain &&
      audioContext
    ) {
      musicGain.gain.value =
        musicEnabled
          ? 0.25
          : 0;
    }

    if (
      musicEnabled
    ) {
      startMusic(
        currentTrack
      );
    } else {
      stopMusic();
    }

    saveSettings();
  }

  /* =======================================================
     ACTIVAR/DESACTIVAR SONIDOS
     ======================================================= */

  function setSoundEnabled(
    enabled
  ) {

    soundEnabled =
      Boolean(enabled);

    if (
      sfxGain &&
      audioContext
    ) {
      sfxGain.gain.value =
        soundEnabled
          ? 0.7
          : 0;
    }

    saveSettings();
  }

  /* =======================================================
     GETTERS
     ======================================================= */

  function getState() {

    return {
      musicEnabled,
      soundEnabled,
      currentTrack,
      initialized
    };
  }

  /* =======================================================
     API GLOBAL
     ======================================================= */

  window.SCORVEX_AUDIO = {

    init:
      initAudio,

    tracks:
      TRACKS,

    startMusic,

    stopMusic,

    setMusic,

    setMusicEnabled,

    setSoundEnabled,

    setMasterVolume,

    setMusicVolume,

    setSfxVolume,

    weaponShot,

    reload,

    ability,

    damage,

    heal,

    purchase,

    error,

    victory,

    defeat,

    click,

    levelUp,

    bossWarning,

    getState

  };

  /* =======================================================
     EVENTOS AUTOMÁTICOS
     ======================================================= */

  window.addEventListener(
    "scorvex-audio-init",
    () => {
      initAudio();
    }
  );

  window.addEventListener(
    "scorvex-play-sound",
    event => {

      const type =
        event.detail &&
        event.detail.type;

      if (
        type &&
        typeof window
          .SCORVEX_AUDIO[type] ===
          "function"
      ) {

        window
          .SCORVEX_AUDIO[type](
            event.detail.value
          );
      }
    }
  );

  console.log(
    "SCORVEX G7: sistema de audio cargado."
  );

})();
