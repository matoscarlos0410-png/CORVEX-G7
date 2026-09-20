/* ============================================================
   SCORVEX G7
   GAME.JS
   Motor principal del juego
============================================================ */

"use strict";


/* ============================================================
   CONFIGURACIÓN GENERAL
============================================================ */

const SCORVEX_VERSION = "G7";

const SAVE_KEY = "SCORVEX_G7_SAVE";

const CANVAS_WIDTH = 1280;
const CANVAS_HEIGHT = 720;

const DEFAULT_PLAYER_SPEED = 260;

const $ = (id) => document.getElementById(id);


/* ============================================================
   ELEMENTOS
============================================================ */

const elements = {
  mainMenu: $("mainMenu"),
  gameScreen: $("gameScreen"),
  shopScreen: $("shopScreen"),
  inventoryScreen: $("inventoryScreen"),
  customizeScreen: $("customizeScreen"),

  canvas: $("gameCanvas"),

  menuCoins: $("menuCoins"),
  menuCrystals: $("menuCrystals"),
  menuLevel: $("menuLevel"),
  menuWeapon: $("menuWeapon"),
  menuAbility: $("menuAbility"),
  menuArmor: $("menuArmor"),
  menuScore: $("menuScore"),
  menuMission: $("menuMission"),

  shopCoins: $("shopCoins"),
  shopCrystals: $("shopCrystals"),

  healthText: $("healthText"),
  healthBar: $("healthBar"),

  shieldText: $("shieldText"),
  shieldBar: $("shieldBar"),

  gameLevel: $("gameLevel"),
  xpBar: $("xpBar"),

  sectorText: $("sectorText"),
  waveText: $("waveText"),

  hudWeapon: $("hudWeapon"),
  hudAmmo: $("hudAmmo"),
  hudAbility: $("hudAbility"),
  hudEnergy: $("hudEnergy"),
  hudArmor: $("hudArmor"),

  gameMission: $("gameMission"),
  missionProgressBar: $("missionProgressBar"),

  bossHUD: $("bossHUD"),
  bossName: $("bossName"),
  bossHealthBar: $("bossHealthBar"),

  medkitCount: $("medkitCount"),
  energyKitCount: $("energyKitCount"),
  shieldKitCount: $("shieldKitCount"),

  modal: $("modal"),
  modalIcon: $("modalIcon"),
  modalTitle: $("modalTitle"),
  modalContent: $("modalContent"),
  modalActions: $("modalActions"),

  pauseModal: $("pauseModal"),

  notifications: $("notifications"),

  reloadIndicator: $("reloadIndicator"),
  reloadBar: $("reloadBar"),

  waveAnnouncement: $("waveAnnouncement"),
  waveAnnouncementNumber: $("waveAnnouncementNumber"),

  arenaMessage: $("arenaMessage")
};


/* ============================================================
   CANVAS
============================================================ */

let ctx = null;

if (elements.canvas) {
  ctx = elements.canvas.getContext("2d");
}


/* ============================================================
   UTILIDADES
============================================================ */

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}


function random(min, max) {
  return Math.random() * (max - min) + min;
}


function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}


function distance(ax, ay, bx, by) {
  return Math.hypot(bx - ax, by - ay);
}


function formatNumber(number) {
  return Number(number || 0).toLocaleString("es-PE");
}


function deepCopy(object) {
  if (typeof structuredClone === "function") {
    return structuredClone(object);
  }

  return JSON.parse(JSON.stringify(object));
}


function safeText(element, value) {
  if (element) {
    element.textContent = value;
  }
}


function setWidth(element, percent) {
  if (element) {
    element.style.width =
      `${clamp(percent, 0, 100)}%`;
  }
}


/* ============================================================
   DATOS PREDETERMINADOS
============================================================ */

const DEFAULT_SAVE = {
  version: SCORVEX_VERSION,

  coins: 50000,
  crystals: 100,

  level: 1,
  xp: 0,
  score: 0,

  sector: 1,
  wave: 1,

  weapon: null,
  ability: "nova",
  armor: "none",
  character: "scorvex",

  ownedWeapons: [],
  ownedAbilities: ["nova"],
  ownedArmors: ["none"],
  ownedCharacters: ["scorvex"],

  medkits: 3,
  energyKits: 2,
  shieldKits: 1,
  repairKits: 0,

  inventory: [],

  musicEnabled: true,
  soundEnabled: true,

  selectedTrack: 0,

  stats: {
    enemiesDefeated: 0,
    bossesDefeated: 0,
    shots: 0,
    hits: 0,
    gamesPlayed: 0
  }
};


let saveData = deepCopy(DEFAULT_SAVE);


/* ============================================================
   GUARDADO
============================================================ */

function loadGame() {

  try {

    const raw = localStorage.getItem(SAVE_KEY);

    if (!raw) {
      saveData = deepCopy(DEFAULT_SAVE);
    } else {

      const loaded = JSON.parse(raw);

      saveData = {
        ...deepCopy(DEFAULT_SAVE),
        ...loaded,

        stats: {
          ...deepCopy(DEFAULT_SAVE.stats),
          ...(loaded.stats || {})
        }
      };
    }

  } catch (error) {

    console.warn(
      "[SCORVEX] No se pudo cargar la partida.",
      error
    );

    saveData = deepCopy(DEFAULT_SAVE);
  }

  migrateSave();

  ensureStarterEquipment();

  saveGame();
}


function saveGame() {

  try {

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(saveData)
    );

  } catch (error) {

    console.warn(
      "[SCORVEX] No se pudo guardar.",
      error
    );
  }
}


function resetSave() {

  saveData = deepCopy(DEFAULT_SAVE);

  ensureStarterEquipment();

  saveGame();

  updateAllUI();

  notify(
    "Partida reiniciada.",
    "warning"
  );
}


/* ============================================================
   MIGRACIÓN DE VERSIONES ANTIGUAS
============================================================ */

function migrateSave() {

  if (
    saveData.weapon === "nova" &&
    window.SCORVEX_STARTER_WEAPON
  ) {
    saveData.weapon =
      window.SCORVEX_STARTER_WEAPON;
  }

  if (
    !Array.isArray(saveData.ownedWeapons)
  ) {
    saveData.ownedWeapons = [];
  }

  if (
    !Array.isArray(saveData.ownedAbilities)
  ) {
    saveData.ownedAbilities = ["nova"];
  }

  if (
    !Array.isArray(saveData.ownedArmors)
  ) {
    saveData.ownedArmors = ["none"];
  }

  if (
    !Array.isArray(saveData.ownedCharacters)
  ) {
    saveData.ownedCharacters = ["scorvex"];
  }

  saveData.version = SCORVEX_VERSION;
}


/* ============================================================
   SISTEMA DE ARMAS
============================================================ */

function getWeaponsDatabase() {
  return window.SCORVEX_WEAPONS || {};
}


function getWeapon(id = saveData.weapon) {

  const database = getWeaponsDatabase();

  if (id && database[id]) {
    return normalizeWeapon(database[id], id);
  }

  const firstId =
    window.SCORVEX_STARTER_WEAPON ||
    Object.keys(database)[0];

  if (firstId && database[firstId]) {
    return normalizeWeapon(
      database[firstId],
      firstId
    );
  }

  return {
    id: "starter",
    name: "SCORVEX AR-1",
    type: "rifle",

    damage: 25,
    cooldown: 180,

    range: 700,

    magazine: 30,
    reload: 1500,

    accuracy: 90,

    rarity: "common"
  };
}


function normalizeWeapon(data, id) {

  const fireRate =
    Number(data.fireRate || 0);

  let cooldown =
    Number(data.cooldown || 0);

  if (!cooldown) {

    if (fireRate > 0) {

      if (fireRate <= 30) {
        cooldown = 1000 / fireRate;
      } else {
        cooldown = fireRate;
      }

    } else {
      cooldown = 200;
    }
  }

  return {
    ...data,

    id: data.id || id,

    name:
      data.name ||
      "Arma SCORVEX",

    damage:
      Number(data.damage) || 20,

    cooldown,

    range:
      Number(data.range) || 600,

    magazine:
      Number(
        data.magazine ||
        data.mag ||
        30
      ),

    reload:
      Number(
        data.reload ||
        data.reloadTime ||
        1600
      ),

    accuracy:
      Number(data.accuracy) || 85,

    rarity:
      data.rarity || "common"
  };
}


function ensureStarterEquipment() {

  const database = getWeaponsDatabase();

  const starterId =
    window.SCORVEX_STARTER_WEAPON ||
    Object.keys(database)[0] ||
    "starter";

  if (
    !saveData.weapon ||
    (
      Object.keys(database).length &&
      !database[saveData.weapon]
    )
  ) {
    saveData.weapon = starterId;
  }

  if (
    !saveData.ownedWeapons.includes(
      saveData.weapon
    )
  ) {
    saveData.ownedWeapons.unshift(
      saveData.weapon
    );
  }

  const abilities =
    window.SCORVEX_ABILITIES || {};

  if (
    abilities &&
    Object.keys(abilities).length &&
    !abilities[saveData.ability]
  ) {
    saveData.ability =
      abilities.nova
        ? "nova"
        : Object.keys(abilities)[0];
  }

  if (
    !saveData.ownedAbilities.includes(
      saveData.ability
    )
  ) {
    saveData.ownedAbilities.push(
      saveData.ability
    );
  }
}


/* ============================================================
   HABILIDADES
============================================================ */

function getAbilitiesDatabase() {
  return window.SCORVEX_ABILITIES || {};
}


function getAbility(id = saveData.ability) {

  const abilities =
    getAbilitiesDatabase();

  if (abilities[id]) {
    return abilities[id];
  }

  return {
    id: "nova",
    name: "Nova Pulse",
    energy: 30,
    cooldown: 5000,
    description:
      "Pulso de energía que daña a enemigos cercanos."
  };
}


/* ============================================================
   ARMADURAS
============================================================ */

const ARMORS = {

  none: {
    id: "none",
    name: "Sin armadura",
    shield: 0,
    defense: 0
  },

  tactical: {
    id: "tactical",
    name: "Armadura táctica",
    shield: 40,
    defense: 0.1
  },

  reinforced: {
    id: "reinforced",
    name: "Armadura reforzada",
    shield: 75,
    defense: 0.17
  },

  titan: {
    id: "titan",
    name: "Armadura Titán",
    shield: 120,
    defense: 0.25
  },

  omega: {
    id: "omega",
    name: "Armadura Omega",
    shield: 180,
    defense: 0.33
  }
};


function getArmor() {
  return (
    ARMORS[saveData.armor] ||
    ARMORS.none
  );
}


/* ============================================================
   ESTADO DEL JUEGO
============================================================ */

let gameRunning = false;
let paused = false;
let gameOver = false;

let lastFrame = 0;

let bullets = [];
let enemies = [];
let particles = [];
let pickups = [];

let currentBoss = null;

let enemySpawnTimer = 0;
let enemySpawnInterval = 1200;

let waveEnemiesRemaining = 0;
let waveEnemiesSpawned = 0;
let waveEnemiesDefeated = 0;

let cameraShake = 0;


/* ============================================================
   JUGADOR
============================================================ */

const player = {

  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,

  radius: 18,

  speed: DEFAULT_PLAYER_SPEED,

  maxHealth: 100,
  health: 100,

  maxEnergy: 100,
  energy: 100,

  maxShield: 0,
  shield: 0,

  angle: 0,

  ammo: 30,
  reserveAmmo: 300,

  shooting: false,

  lastShot: 0,

  reloading: false,

  abilityReady: true,

  invulnerable: 0,

  dashTimer: 0,

  damageMultiplier: 1,

  fireRateMultiplier: 1
};


/* ============================================================
   INPUT
============================================================ */

const keys = {};

const mouse = {
  x: CANVAS_WIDTH / 2,
  y: CANVAS_HEIGHT / 2,
  down: false
};


window.addEventListener(
  "keydown",
  (event) => {

    keys[event.code] = true;

    if (!gameRunning) {
      return;
    }

    if (event.code === "Escape") {
      togglePause();
    }

    if (event.code === "KeyR") {
      reloadWeapon();
    }

    if (event.code === "KeyQ") {
      useAbility();
    }

    if (
      event.code === "Space"
    ) {
      event.preventDefault();
      player.shooting = true;
    }
  }
);


window.addEventListener(
  "keyup",
  (event) => {

    keys[event.code] = false;

    if (event.code === "Space") {
      player.shooting = false;
    }
  }
);


if (elements.canvas) {

  elements.canvas.addEventListener(
    "mousemove",
    updateMousePosition
  );

  elements.canvas.addEventListener(
    "mousedown",
    (event) => {

      if (event.button === 0) {
        mouse.down = true;
        player.shooting = true;
      }
    }
  );

  window.addEventListener(
    "mouseup",
    () => {

      mouse.down = false;
      player.shooting = false;
    }
  );

  elements.canvas.addEventListener(
    "contextmenu",
    (event) => {
      event.preventDefault();
    }
  );
}


function updateMousePosition(event) {

  if (!elements.canvas) {
    return;
  }

  const rect =
    elements.canvas.getBoundingClientRect();

  mouse.x =
    (
      (event.clientX - rect.left) /
      rect.width
    ) * CANVAS_WIDTH;

  mouse.y =
    (
      (event.clientY - rect.top) /
      rect.height
    ) * CANVAS_HEIGHT;
}


/* ============================================================
   INICIAR JUEGO
============================================================ */

function startGame() {

  showScreen("gameScreen");

  gameRunning = true;
  paused = false;
  gameOver = false;

  saveData.stats.gamesPlayed++;

  const armor = getArmor();

  player.x = CANVAS_WIDTH / 2;
  player.y = CANVAS_HEIGHT / 2;

  player.health = player.maxHealth;

  player.energy = player.maxEnergy;

  player.maxShield = armor.shield;
  player.shield = armor.shield;

  player.invulnerable = 1000;

  player.damageMultiplier = 1;
  player.fireRateMultiplier = 1;

  const weapon = getWeapon();

  player.ammo = weapon.magazine;

  player.reserveAmmo =
    weapon.magazine * 10;

  player.reloading = false;

  player.abilityReady = true;

  bullets = [];
  enemies = [];
  particles = [];
  pickups = [];

  currentBoss = null;

  saveData.wave =
    Math.max(1, saveData.wave || 1);

  saveData.sector =
    Math.max(1, saveData.sector || 1);

  startWave();

  saveGame();

  updateAllUI();

  notify(
    `Sector ${saveData.sector} iniciado`,
    "success"
  );

  callAudio("playGameMusic");

  lastFrame = performance.now();

  requestAnimationFrame(gameLoop);
}


/* ============================================================
   LOOP
============================================================ */

function gameLoop(timestamp) {

  if (!gameRunning) {
    return;
  }

  const delta =
    Math.min(
      (timestamp - lastFrame) / 1000,
      0.05
    );

  lastFrame = timestamp;

  if (!paused && !gameOver) {

    updateGame(delta, timestamp);

    renderGame();
  }

  requestAnimationFrame(gameLoop);
}


/* ============================================================
   UPDATE
============================================================ */

function updateGame(delta, timestamp) {

  updatePlayer(delta);

  updateShooting(timestamp);

  updateBullets(delta);

  updateEnemies(delta);

  updateParticles(delta);

  updatePickups(delta);

  updateEnemySpawner(delta);

  regenerateEnergy(delta);

  if (player.invulnerable > 0) {
    player.invulnerable -= delta * 1000;
  }

  if (cameraShake > 0) {
    cameraShake -= delta * 25;
  }

  checkWaveCompletion();

  updateHUD();
}


/* ============================================================
   MOVIMIENTO
============================================================ */

function updatePlayer(delta) {

  let moveX = 0;
  let moveY = 0;

  if (
    keys.KeyW ||
    keys.ArrowUp
  ) {
    moveY -= 1;
  }

  if (
    keys.KeyS ||
    keys.ArrowDown
  ) {
    moveY += 1;
  }

  if (
    keys.KeyA ||
    keys.ArrowLeft
  ) {
    moveX -= 1;
  }

  if (
    keys.KeyD ||
    keys.ArrowRight
  ) {
    moveX += 1;
  }

  const magnitude =
    Math.hypot(moveX, moveY);

  if (magnitude > 0) {

    moveX /= magnitude;
    moveY /= magnitude;
  }

  let speed =
    player.speed;

  if (player.dashTimer > 0) {

    speed *= 2.4;

    player.dashTimer -=
      delta * 1000;
  }

  player.x +=
    moveX *
    speed *
    delta;

  player.y +=
    moveY *
    speed *
    delta;

  player.x =
    clamp(
      player.x,
      player.radius,
      CANVAS_WIDTH -
      player.radius
    );

  player.y =
    clamp(
      player.y,
      player.radius,
      CANVAS_HEIGHT -
      player.radius
    );

  player.angle =
    Math.atan2(
      mouse.y - player.y,
      mouse.x - player.x
    );
}


/* ============================================================
   DISPARO
============================================================ */

function updateShooting(timestamp) {

  if (!player.shooting) {
    return;
  }

  shoot(timestamp);
}


function shoot(timestamp = performance.now()) {

  if (
    !gameRunning ||
    paused ||
    gameOver ||
    player.reloading
  ) {
    return;
  }

  const weapon = getWeapon();

  const cooldown =
    weapon.cooldown /
    player.fireRateMultiplier;

  if (
    timestamp -
    player.lastShot <
    cooldown
  ) {
    return;
  }

  if (player.ammo <= 0) {

    reloadWeapon();

    return;
  }

  player.lastShot = timestamp;

  player.ammo--;

  saveData.stats.shots++;

  const accuracy =
    clamp(
      weapon.accuracy,
      5,
      100
    );

  const spread =
    (
      (100 - accuracy) /
      100
    ) * 0.22;

  const angle =
    player.angle +
    random(
      -spread,
      spread
    );

  const speed =
    weapon.type === "sniper"
      ? 1250
      : 900;

  bullets.push({
    x:
      player.x +
      Math.cos(angle) * 24,

    y:
      player.y +
      Math.sin(angle) * 24,

    vx:
      Math.cos(angle) * speed,

    vy:
      Math.sin(angle) * speed,

    radius:
      weapon.type === "plasma"
        ? 6
        : 3,

    damage:
      weapon.damage *
      player.damageMultiplier,

    range:
      weapon.range,

    traveled: 0,

    color:
      getRarityColor(
        weapon.rarity
      )
  });

  createMuzzleParticles();

  callAudio("shoot");

  updateHUD();
}


/* ============================================================
   RECARGA
============================================================ */

function reloadWeapon() {

  if (
    player.reloading ||
    player.reserveAmmo <= 0
  ) {
    return;
  }

  const weapon = getWeapon();

  if (
    player.ammo >=
    weapon.magazine
  ) {
    return;
  }

  player.reloading = true;

  if (elements.reloadIndicator) {
    elements.reloadIndicator.classList.remove(
      "hidden"
    );
  }

  let elapsed = 0;

  const duration =
    weapon.reload;

  const interval =
    setInterval(
      () => {

        if (
          !gameRunning
        ) {
          clearInterval(interval);
          return;
        }

        if (paused) {
          return;
        }

        elapsed += 50;

        setWidth(
          elements.reloadBar,
          (
            elapsed /
            duration
          ) * 100
        );

        if (
          elapsed >=
          duration
        ) {

          clearInterval(interval);

          const needed =
            weapon.magazine -
            player.ammo;

          const amount =
            Math.min(
              needed,
              player.reserveAmmo
            );

          player.ammo += amount;

          player.reserveAmmo -= amount;

          player.reloading = false;

          if (
            elements.reloadIndicator
          ) {
            elements.reloadIndicator.classList.add(
              "hidden"
            );
          }

          setWidth(
            elements.reloadBar,
            0
          );

          callAudio("reload");

          updateHUD();
        }

      },
      50
    );
}


/* ============================================================
   BALAS
============================================================ */

function updateBullets(delta) {

  for (
    let i =
      bullets.length - 1;
    i >= 0;
    i--
  ) {

    const bullet = bullets[i];

    const dx =
      bullet.vx * delta;

    const dy =
      bullet.vy * delta;

    bullet.x += dx;
    bullet.y += dy;

    bullet.traveled +=
      Math.hypot(dx, dy);

    let remove = false;

    for (
      let j =
        enemies.length - 1;
      j >= 0;
      j--
    ) {

      const enemy =
        enemies[j];

      if (
        distance(
          bullet.x,
          bullet.y,
          enemy.x,
          enemy.y
        ) <
        bullet.radius +
        enemy.radius
      ) {

        enemy.health -=
          bullet.damage;

        saveData.stats.hits++;

        createHitParticles(
          enemy.x,
          enemy.y
        );

        remove = true;

        if (
          enemy.health <= 0
        ) {
          defeatEnemy(j);
        }

        break;
      }
    }

    if (
      currentBoss &&
      !remove
    ) {

      if (
        distance(
          bullet.x,
          bullet.y,
          currentBoss.x,
          currentBoss.y
        ) <
        bullet.radius +
        currentBoss.radius
      ) {

        currentBoss.health -=
          bullet.damage;

        saveData.stats.hits++;

        createHitParticles(
          currentBoss.x,
          currentBoss.y
        );

        remove = true;

        updateBossHUD();

        if (
          currentBoss.health <= 0
        ) {
          defeatBoss();
        }
      }
    }

    if (
      bullet.traveled >
      bullet.range
    ) {
      remove = true;
    }

    if (
      bullet.x < -50 ||
      bullet.y < -50 ||
      bullet.x > CANVAS_WIDTH + 50 ||
      bullet.y > CANVAS_HEIGHT + 50
    ) {
      remove = true;
    }

    if (remove) {
      bullets.splice(i, 1);
    }
  }
}


/* ============================================================
   OLEADAS
============================================================ */

function startWave() {

  waveEnemiesSpawned = 0;
  waveEnemiesDefeated = 0;

  waveEnemiesRemaining =
    6 +
    saveData.wave * 2 +
    saveData.sector;

  enemySpawnInterval =
    Math.max(
      350,
      1200 -
      saveData.wave * 45
    );

  enemySpawnTimer = 300;

  showWaveAnnouncement();

  updateHUD();
}


function updateEnemySpawner(delta) {

  if (
    waveEnemiesSpawned >=
    waveEnemiesRemaining
  ) {
    return;
  }

  enemySpawnTimer -=
    delta * 1000;

  if (
    enemySpawnTimer <= 0
  ) {

    spawnEnemy();

    waveEnemiesSpawned++;

    enemySpawnTimer =
      enemySpawnInterval;
  }
}


function checkWaveCompletion() {

  if (
    waveEnemiesSpawned <
    waveEnemiesRemaining
  ) {
    return;
  }

  if (
    enemies.length > 0 ||
    currentBoss
  ) {
    return;
  }

  if (
    waveEnemiesDefeated <
    waveEnemiesRemaining
  ) {
    return;
  }

  completeWave();
}


function completeWave() {

  saveData.coins +=
    700 +
    saveData.wave * 150;

  saveData.xp +=
    120 +
    saveData.wave * 30;

  saveData.score +=
    1000 *
    saveData.wave;

  levelCheck();

  notify(
    `Oleada ${saveData.wave} superada`,
    "success"
  );

  saveData.wave++;

  if (
    saveData.wave % 5 === 0
  ) {

    setTimeout(
      () => {
        spawnBoss();
      },
      1200
    );

  } else if (
    saveData.wave > 10
  ) {

    saveData.wave = 1;
    saveData.sector++;

    notify(
      `Nuevo sector desbloqueado: ${saveData.sector}`,
      "success"
    );

    setTimeout(
      startWave,
      1200
    );

  } else {

    setTimeout(
      startWave,
      1200
    );
  }

  saveGame();

  updateAllUI();
}


/* ============================================================
   ENEMIGOS
============================================================ */

function spawnEnemy() {

  let enemy;

  if (
    window.SCORVEX_ENEMIES &&
    typeof window.SCORVEX_ENEMIES.createEnemy === "function"
  ) {

    enemy =
      window.SCORVEX_ENEMIES.createEnemy(
        saveData.wave,
        saveData.sector
      );
  }

  if (!enemy) {

    const scale =
      1 +
      saveData.wave * 0.09 +
      saveData.sector * 0.12;

    enemy = {
      health:
        55 * scale,

      maxHealth:
        55 * scale,

      speed:
        random(70, 120) *
        Math.min(
          1.7,
          scale
        ),

      damage:
        8 +
        saveData.wave * 1.2,

      radius:
        random(15, 22),

      reward:
        randomInt(70, 160),

      color:
        "#ff556b"
    };
  }

  const point =
    getSpawnPoint();

  enemy.x =
    Number(enemy.x) ||
    point.x;

  enemy.y =
    Number(enemy.y) ||
    point.y;

  enemy.maxHealth =
    Number(
      enemy.maxHealth ||
      enemy.health
    );

  enemy.health =
    Number(enemy.health) ||
    enemy.maxHealth;

  enemy.radius =
    Number(enemy.radius) ||
    18;

  enemy.speed =
    Number(enemy.speed) ||
    100;

  enemy.damage =
    Number(enemy.damage) ||
    10;

  enemy.reward =
    Number(enemy.reward) ||
    100;

  enemy.attackCooldown =
    Number(
      enemy.attackCooldown
    ) ||
    800;

  enemy.lastAttack = 0;

  enemies.push(enemy);
}


function getSpawnPoint() {

  const side =
    randomInt(0, 3);

  switch (side) {

    case 0:
      return {
        x: random(0, CANVAS_WIDTH),
        y: -30
      };

    case 1:
      return {
        x: CANVAS_WIDTH + 30,
        y: random(0, CANVAS_HEIGHT)
      };

    case 2:
      return {
        x: random(0, CANVAS_WIDTH),
        y: CANVAS_HEIGHT + 30
      };

    default:
      return {
        x: -30,
        y: random(0, CANVAS_HEIGHT)
      };
  }
}


function updateEnemies(delta) {

  const now =
    performance.now();

  for (
    let i =
      enemies.length - 1;
    i >= 0;
    i--
  ) {

    const enemy =
      enemies[i];

    const dx =
      player.x - enemy.x;

    const dy =
      player.y - enemy.y;

    const length =
      Math.hypot(dx, dy) || 1;

    enemy.x +=
      (
        dx /
        length
      ) *
      enemy.speed *
      delta;

    enemy.y +=
      (
        dy /
        length
      ) *
      enemy.speed *
      delta;

    if (
      length <
      player.radius +
      enemy.radius +
      5
    ) {

      if (
        now -
        enemy.lastAttack >
        enemy.attackCooldown
      ) {

        enemy.lastAttack =
          now;

        damagePlayer(
          enemy.damage
        );
      }
    }
  }

  updateBoss(delta);
}


/* ============================================================
   DERROTAR ENEMIGO
============================================================ */

function defeatEnemy(index) {

  const enemy =
    enemies[index];

  if (!enemy) {
    return;
  }

  enemies.splice(
    index,
    1
  );

  waveEnemiesDefeated++;

  saveData.stats.enemiesDefeated++;

  const coins =
    Math.round(
      enemy.reward ||
      random(70, 160)
    );

  saveData.coins += coins;

  saveData.score +=
    100 +
    saveData.wave * 25;

  saveData.xp +=
    20 +
    saveData.wave * 4;

  levelCheck();

  createExplosion(
    enemy.x,
    enemy.y,
    "#ff556b"
  );

  maybeDropPickup(
    enemy.x,
    enemy.y
  );

  updateMissionProgress(
    "kill",
    1
  );

  callAudio("enemyDown");

  saveGame();
}


/* ============================================================
   JEFE
============================================================ */

function spawnBoss() {

  let boss;

  if (
    window.SCORVEX_ENEMIES &&
    typeof window.SCORVEX_ENEMIES.createBoss === "function"
  ) {

    boss =
      window.SCORVEX_ENEMIES.createBoss(
        saveData.wave,
        saveData.sector
      );
  }

  const bossHealth =
    1200 +
    saveData.wave * 180 +
    saveData.sector * 300;

  currentBoss =
    boss || {
      name: "TITÁN SCORVEX",
      x: CANVAS_WIDTH / 2,
      y: 100,
      radius: 45,
      health: bossHealth,
      maxHealth: bossHealth,
      speed: 60,
      damage: 24,
      attackCooldown: 700,
      reward: 5000,
      color: "#ff3055"
    };

  currentBoss.x =
    Number(currentBoss.x) ||
    CANVAS_WIDTH / 2;

  currentBoss.y =
    Number(currentBoss.y) ||
    100;

  currentBoss.maxHealth =
    Number(
      currentBoss.maxHealth ||
      currentBoss.health
    );

  currentBoss.health =
    Number(
      currentBoss.health
    ) ||
    currentBoss.maxHealth;

  currentBoss.radius =
    Number(
      currentBoss.radius
    ) ||
    45;

  currentBoss.speed =
    Number(
      currentBoss.speed
    ) ||
    65;

  currentBoss.damage =
    Number(
      currentBoss.damage
    ) ||
    25;

  currentBoss.attackCooldown =
    Number(
      currentBoss.attackCooldown
    ) ||
    700;

  currentBoss.lastAttack = 0;

  if (elements.bossHUD) {
    elements.bossHUD.classList.remove(
      "hidden"
    );
  }

  safeText(
    elements.bossName,
    currentBoss.name ||
    "JEFE"
  );

  updateBossHUD();

  showArenaMessage(
    "⚠ JEFE DETECTADO",
    1800
  );
}


function updateBoss(delta) {

  if (!currentBoss) {
    return;
  }

  const dx =
    player.x -
    currentBoss.x;

  const dy =
    player.y -
    currentBoss.y;

  const length =
    Math.hypot(dx, dy) || 1;

  currentBoss.x +=
    (
      dx /
      length
    ) *
    currentBoss.speed *
    delta;

  currentBoss.y +=
    (
      dy /
      length
    ) *
    currentBoss.speed *
    delta;

  const now =
    performance.now();

  if (
    length <
    currentBoss.radius +
    player.radius +
    10
  ) {

    if (
      now -
      currentBoss.lastAttack >
      currentBoss.attackCooldown
    ) {

      currentBoss.lastAttack =
        now;

      damagePlayer(
        currentBoss.damage
      );
    }
  }
}


function defeatBoss() {

  if (!currentBoss) {
    return;
  }

  createExplosion(
    currentBoss.x,
    currentBoss.y,
    "#ff2454",
    45
  );

  saveData.stats.bossesDefeated++;

  saveData.coins +=
    Number(
      currentBoss.reward
    ) ||
    5000;

  saveData.crystals += 5;

  saveData.score += 10000;

  saveData.xp += 500;

  levelCheck();

  updateMissionProgress(
    "boss",
    1
  );

  currentBoss = null;

  if (elements.bossHUD) {
    elements.bossHUD.classList.add(
      "hidden"
    );
  }

  notify(
    "¡Jefe derrotado! +5 cristales",
    "success"
  );

  saveGame();

  setTimeout(
    startWave,
    1600
  );
}


function updateBossHUD() {

  if (!currentBoss) {
    return;
  }

  setWidth(
    elements.bossHealthBar,
    (
      currentBoss.health /
      currentBoss.maxHealth
    ) *
    100
  );
}


/* ============================================================
   DAÑO AL JUGADOR
============================================================ */

function damagePlayer(amount) {

  if (
    player.invulnerable > 0 ||
    gameOver
  ) {
    return;
  }

  const armor =
    getArmor();

  let damage =
    amount *
    (
      1 -
      armor.defense
    );

  if (player.shield > 0) {

    const absorbed =
      Math.min(
        player.shield,
        damage
      );

    player.shield -=
      absorbed;

    damage -=
      absorbed;
  }

  if (damage > 0) {

    player.health -=
      damage;
  }

  player.health =
    Math.max(
      0,
      player.health
    );

  player.invulnerable = 250;

  cameraShake = 8;

  callAudio("playerHit");

  if (
    player.health <= 0
  ) {
    endGame(false);
  }

  updateHUD();
}


/* ============================================================
   HABILIDAD
============================================================ */

function useAbility() {

  if (
    !gameRunning ||
    paused ||
    gameOver
  ) {
    return;
  }

  if (
    !player.abilityReady
  ) {

    notify(
      "La habilidad está recargando.",
      "warning"
    );

    return;
  }

  const ability =
    getAbility();

  const energyCost =
    Number(
      ability.energy ||
      ability.energyCost ||
      30
    );

  if (
    player.energy <
    energyCost
  ) {

    notify(
      "Energía insuficiente.",
      "warning"
    );

    return;
  }

  player.energy -=
    energyCost;

  player.abilityReady =
    false;

  activateAbility(
    saveData.ability,
    ability
  );

  const cooldown =
    Number(
      ability.cooldown
    ) ||
    5000;

  setTimeout(
    () => {

      player.abilityReady =
        true;

      updateHUD();

    },
    cooldown
  );

  callAudio("ability");

  updateHUD();
}


/* ============================================================
   EFECTOS DE HABILIDADES
============================================================ */

function activateAbility(
  id,
  ability
) {

  switch (id) {

    case "dash":
      abilityDash();
      break;

    case "freeze":
      abilityFreeze();
      break;

    case "storm":
      abilityStorm();
      break;

    case "shield":
      abilityShield();
      break;

    case "meteor":
      abilityMeteor();
      break;

    case "clone":
      abilityClone();
      break;

    case "emp":
      abilityEMP();
      break;

    case "overdrive":
      abilityOverdrive();
      break;

    case "blackhole":
      abilityBlackHole();
      break;

    case "nova":
      abilityNova();
      break;

    default:
      genericAbility(
        ability
      );
      break;
  }
}


function abilityNova() {

  const radius = 260;

  enemies.forEach(
    (enemy) => {

      if (
        distance(
          player.x,
          player.y,
          enemy.x,
          enemy.y
        ) <= radius
      ) {
        enemy.health -= 80;
      }
    }
  );

  cleanDeadEnemies();

  if (
    currentBoss &&
    distance(
      player.x,
      player.y,
      currentBoss.x,
      currentBoss.y
    ) <= radius
  ) {

    currentBoss.health -= 120;

    if (
      currentBoss.health <= 0
    ) {
      defeatBoss();
    }
  }

  createExplosion(
    player.x,
    player.y,
    "#00e5ff",
    35
  );

  showArenaMessage(
    "NOVA PULSE",
    750
  );
}


function abilityDash() {

  player.dashTimer =
    900;

  player.invulnerable =
    400;

  showArenaMessage(
    "PHASE DASH",
    600
  );
}


function abilityFreeze() {

  enemies.forEach(
    (enemy) => {

      enemy.originalSpeed =
        enemy.originalSpeed ||
        enemy.speed;

      enemy.speed *= 0.2;
    }
  );

  if (currentBoss) {
    currentBoss.speed *= 0.5;
  }

  setTimeout(
    () => {

      enemies.forEach(
        (enemy) => {

          if (
            enemy.originalSpeed
          ) {
            enemy.speed =
              enemy.originalSpeed;
          }
        }
      );

    },
    3000
  );

  showArenaMessage(
    "CRYO FIELD",
    750
  );
}


function abilityStorm() {

  enemies.forEach(
    (enemy) => {
      enemy.health -= 50;
    }
  );

  cleanDeadEnemies();

  if (currentBoss) {

    currentBoss.health -= 90;

    if (
      currentBoss.health <= 0
    ) {
      defeatBoss();
    }
  }

  showArenaMessage(
    "ION STORM",
    750
  );
}


function abilityShield() {

  player.maxShield =
    Math.max(
      player.maxShield,
      120
    );

  player.shield =
    Math.min(
      player.maxShield,
      player.shield + 100
    );

  showArenaMessage(
    "ENERGY SHIELD",
    750
  );
}


function abilityMeteor() {

  enemies.forEach(
    (enemy) => {

      enemy.health -=
        random(80, 130);
    }
  );

  cleanDeadEnemies();

  if (currentBoss) {

    currentBoss.health -= 180;

    if (
      currentBoss.health <= 0
    ) {
      defeatBoss();
    }
  }

  cameraShake = 15;

  showArenaMessage(
    "METEOR STRIKE",
    750
  );
}


function abilityClone() {

  player.invulnerable =
    1800;

  showArenaMessage(
    "HOLO CLONE",
    750
  );
}


function abilityEMP() {

  enemies.forEach(
    (enemy) => {

      enemy.stunned = true;

      enemy.oldSpeed =
        enemy.speed;

      enemy.speed = 0;
    }
  );

  setTimeout(
    () => {

      enemies.forEach(
        (enemy) => {

          if (
            enemy.stunned
          ) {
            enemy.speed =
              enemy.oldSpeed ||
              80;

            enemy.stunned =
              false;
          }
        }
      );

    },
    2300
  );

  showArenaMessage(
    "EMP BLAST",
    750
  );
}


function abilityOverdrive() {

  player.damageMultiplier =
    1.8;

  player.fireRateMultiplier =
    1.7;

  setTimeout(
    () => {

      player.damageMultiplier =
        1;

      player.fireRateMultiplier =
        1;

    },
    5000
  );

  showArenaMessage(
    "OVERDRIVE",
    750
  );
}


function abilityBlackHole() {

  enemies.forEach(
    (enemy) => {

      const dx =
        player.x -
        enemy.x;

      const dy =
        player.y -
        enemy.y;

      enemy.x += dx * 0.45;
      enemy.y += dy * 0.45;

      enemy.health -= 75;
    }
  );

  cleanDeadEnemies();

  showArenaMessage(
    "BLACK HOLE",
    750
  );
}


function genericAbility(
  ability
) {

  const type =
    String(
      ability.type || ""
    ).toLowerCase();

  const power =
    Number(
      ability.power ||
      ability.damage ||
      65
    );

  if (
    type.includes("heal")
  ) {

    player.health =
      Math.min(
        player.maxHealth,
        player.health + power
      );

  } else if (
    type.includes("shield")
  ) {

    player.maxShield =
      Math.max(
        player.maxShield,
        power
      );

    player.shield =
      Math.min(
        player.maxShield,
        player.shield + power
      );

  } else if (
    type.includes("speed")
  ) {

    player.dashTimer = 1200;

  } else {

    enemies.forEach(
      (enemy) => {
        enemy.health -= power;
      }
    );

    cleanDeadEnemies();

    if (currentBoss) {
      currentBoss.health -=
        power * 1.3;
    }
  }

  showArenaMessage(
    String(
      ability.name ||
      "SPECIAL ABILITY"
    ).toUpperCase(),
    800
  );
}


/* ============================================================
   LIMPIAR ENEMIGOS DERROTADOS POR HABILIDAD
============================================================ */

function cleanDeadEnemies() {

  for (
    let i =
      enemies.length - 1;
    i >= 0;
    i--
  ) {

    if (
      enemies[i].health <= 0
    ) {
      defeatEnemy(i);
    }
  }
}


/* ============================================================
   ENERGÍA
============================================================ */

function regenerateEnergy(delta) {

  player.energy +=
    7 * delta;

  player.energy =
    Math.min(
      player.maxEnergy,
      player.energy
    );
}


/* ============================================================
   CONSUMIBLES
============================================================ */

function useMedkit() {

  if (!gameRunning) {
    return;
  }

  if (
    saveData.medkits <= 0
  ) {

    notify(
      "No tienes medkits.",
      "warning"
    );

    return;
  }

  if (
    player.health >=
    player.maxHealth
  ) {

    notify(
      "Tu vida ya está completa.",
      "warning"
    );

    return;
  }

  saveData.medkits--;

  player.health =
    Math.min(
      player.maxHealth,
      player.health + 55
    );

  callAudio("heal");

  saveGame();

  updateHUD();
}


function useEnergyKit() {

  if (
    saveData.energyKits <= 0
  ) {

    notify(
      "No tienes kits de energía.",
      "warning"
    );

    return;
  }

  if (
    player.energy >=
    player.maxEnergy
  ) {
    return;
  }

  saveData.energyKits--;

  player.energy =
    Math.min(
      player.maxEnergy,
      player.energy + 65
    );

  saveGame();

  updateHUD();
}


function useShieldKit() {

  if (
    saveData.shieldKits <= 0
  ) {

    notify(
      "No tienes kits de escudo.",
      "warning"
    );

    return;
  }

  saveData.shieldKits--;

  player.maxShield =
    Math.max(
      player.maxShield,
      75
    );

  player.shield =
    Math.min(
      player.maxShield,
      player.shield + 60
    );

  saveGame();

  updateHUD();
}


/* ============================================================
   PICKUPS
============================================================ */

function maybeDropPickup(
  x,
  y
) {

  const roll =
    Math.random();

  if (roll > 0.18) {
    return;
  }

  let type;

  if (roll < 0.06) {
    type = "medkit";
  } else if (
    roll < 0.12
  ) {
    type = "energy";
  } else {
    type = "coins";
  }

  pickups.push({
    x,
    y,
    type,
    radius: 10,
    life: 15000
  });
}


function updatePickups(delta) {

  for (
    let i =
      pickups.length - 1;
    i >= 0;
    i--
  ) {

    const pickup =
      pickups[i];

    pickup.life -=
      delta * 1000;

    if (
      distance(
        player.x,
        player.y,
        pickup.x,
        pickup.y
      ) <
      player.radius +
      pickup.radius +
      10
    ) {

      collectPickup(
        pickup
      );

      pickups.splice(i, 1);

      continue;
    }

    if (
      pickup.life <= 0
    ) {
      pickups.splice(i, 1);
    }
  }
}


function collectPickup(
  pickup
) {

  switch (
    pickup.type
  ) {

    case "medkit":
      saveData.medkits++;
      notify(
        "+1 Medkit",
        "success"
      );
      break;

    case "energy":
      saveData.energyKits++;
      notify(
        "+1 Kit de energía",
        "success"
      );
      break;

    default:
      saveData.coins += 250;
      notify(
        "+250 monedas",
        "success"
      );
      break;
  }

  saveGame();
}


/* ============================================================
   PARTÍCULAS
============================================================ */

function createParticle(
  x,
  y,
  color,
  speed = 140
) {

  const angle =
    random(
      0,
      Math.PI * 2
    );

  particles.push({
    x,
    y,

    vx:
      Math.cos(angle) *
      random(30, speed),

    vy:
      Math.sin(angle) *
      random(30, speed),

    size:
      random(2, 5),

    life:
      random(250, 700),

    maxLife: 700,

    color
  });
}


function createHitParticles(
  x,
  y
) {

  for (
    let i = 0;
    i < 6;
    i++
  ) {
    createParticle(
      x,
      y,
      "#ff6075",
      110
    );
  }
}


function createMuzzleParticles() {

  const x =
    player.x +
    Math.cos(
      player.angle
    ) * 28;

  const y =
    player.y +
    Math.sin(
      player.angle
    ) * 28;

  for (
    let i = 0;
    i < 4;
    i++
  ) {
    createParticle(
      x,
      y,
      "#00e5ff",
      70
    );
  }
}


function createExplosion(
  x,
  y,
  color,
  amount = 20
) {

  for (
    let i = 0;
    i < amount;
    i++
  ) {
    createParticle(
      x,
      y,
      color,
      220
    );
  }
}


function updateParticles(delta) {

  for (
    let i =
      particles.length - 1;
    i >= 0;
    i--
  ) {

    const particle =
      particles[i];

    particle.x +=
      particle.vx * delta;

    particle.y +=
      particle.vy * delta;

    particle.vx *=
      0.97;

    particle.vy *=
      0.97;

    particle.life -=
      delta * 1000;

    if (
      particle.life <= 0
    ) {
      particles.splice(
        i,
        1
      );
    }
  }
}


/* ============================================================
   RENDER
============================================================ */

function renderGame() {

  if (!ctx) {
    return;
  }

  ctx.save();

  ctx.clearRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  let shakeX = 0;
  let shakeY = 0;

  if (
    cameraShake > 0
  ) {

    shakeX =
      random(
        -cameraShake,
        cameraShake
      );

    shakeY =
      random(
        -cameraShake,
        cameraShake
      );

    ctx.translate(
      shakeX,
      shakeY
    );
  }

  drawArena();

  drawPickups();

  drawBullets();

  drawEnemies();

  drawBoss();

  drawPlayer();

  drawParticles();

  ctx.restore();
}


/* ============================================================
   ARENA
============================================================ */

function drawArena() {

  const gradient =
    ctx.createRadialGradient(
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      50,
      CANVAS_WIDTH / 2,
      CANVAS_HEIGHT / 2,
      700
    );

  gradient.addColorStop(
    0,
    "#102235"
  );

  gradient.addColorStop(
    1,
    "#050b13"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    CANVAS_WIDTH,
    CANVAS_HEIGHT
  );

  ctx.strokeStyle =
    "rgba(0,229,255,0.055)";

  ctx.lineWidth = 1;

  const grid = 60;

  for (
    let x = 0;
    x < CANVAS_WIDTH;
    x += grid
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x,
      CANVAS_HEIGHT
    );

    ctx.stroke();
  }

  for (
    let y = 0;
    y < CANVAS_HEIGHT;
    y += grid
  ) {

    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      CANVAS_WIDTH,
      y
    );

    ctx.stroke();
  }

  ctx.strokeStyle =
    "rgba(0,229,255,0.15)";

  ctx.lineWidth = 4;

  ctx.strokeRect(
    5,
    5,
    CANVAS_WIDTH - 10,
    CANVAS_HEIGHT - 10
  );
}


/* ============================================================
   DIBUJAR JUGADOR
============================================================ */

function drawPlayer() {

  ctx.save();

  ctx.translate(
    player.x,
    player.y
  );

  ctx.rotate(
    player.angle
  );

  if (
    player.invulnerable > 0 &&
    Math.floor(
      player.invulnerable / 70
    ) % 2 === 0
  ) {
    ctx.globalAlpha = 0.5;
  }

  ctx.shadowBlur = 20;
  ctx.shadowColor =
    "#00e5ff";

  ctx.fillStyle =
    "#00d7ff";

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    player.radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.fillStyle =
    "#0b1825";

  ctx.fillRect(
    5,
    -5,
    32,
    10
  );

  ctx.fillStyle =
    "#ffffff";

  ctx.beginPath();

  ctx.arc(
    4,
    -5,
    3,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.restore();

  if (
    player.shield > 0
  ) {

    ctx.strokeStyle =
      "rgba(80,170,255,0.55)";

    ctx.lineWidth = 2;

    ctx.beginPath();

    ctx.arc(
      player.x,
      player.y,
      player.radius + 7,
      0,
      Math.PI * 2
    );

    ctx.stroke();
  }
}


/* ============================================================
   DIBUJAR BALAS
============================================================ */

function drawBullets() {

  for (
    const bullet
    of bullets
  ) {

    ctx.fillStyle =
      bullet.color ||
      "#ffffff";

    ctx.shadowBlur = 12;

    ctx.shadowColor =
      bullet.color ||
      "#ffffff";

    ctx.beginPath();

    ctx.arc(
      bullet.x,
      bullet.y,
      bullet.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.shadowBlur = 0;
  }
}


/* ============================================================
   DIBUJAR ENEMIGOS
============================================================ */

function drawEnemies() {

  for (
    const enemy
    of enemies
  ) {

    const ratio =
      enemy.health /
      enemy.maxHealth;

    ctx.fillStyle =
      enemy.color ||
      "#ff5169";

    ctx.beginPath();

    ctx.arc(
      enemy.x,
      enemy.y,
      enemy.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      "rgba(0,0,0,0.65)";

    ctx.fillRect(
      enemy.x - 20,
      enemy.y -
      enemy.radius -
      12,
      40,
      5
    );

    ctx.fillStyle =
      "#ff5169";

    ctx.fillRect(
      enemy.x - 20,
      enemy.y -
      enemy.radius -
      12,
      40 *
      clamp(
        ratio,
        0,
        1
      ),
      5
    );
  }
}


/* ============================================================
   DIBUJAR JEFE
============================================================ */

function drawBoss() {

  if (!currentBoss) {
    return;
  }

  ctx.shadowBlur = 25;

  ctx.shadowColor =
    currentBoss.color ||
    "#ff2454";

  ctx.fillStyle =
    currentBoss.color ||
    "#ff2454";

  ctx.beginPath();

  ctx.arc(
    currentBoss.x,
    currentBoss.y,
    currentBoss.radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.shadowBlur = 0;

  ctx.strokeStyle =
    "#ff9bad";

  ctx.lineWidth = 4;

  ctx.beginPath();

  ctx.arc(
    currentBoss.x,
    currentBoss.y,
    currentBoss.radius + 8,
    0,
    Math.PI * 2
  );

  ctx.stroke();
}


/* ============================================================
   DIBUJAR PICKUPS
============================================================ */

function drawPickups() {

  for (
    const pickup
    of pickups
  ) {

    let color =
      "#ffcc33";

    let icon = "◉";

    if (
      pickup.type ===
      "medkit"
    ) {
      color = "#35e58b";
      icon = "+";
    }

    if (
      pickup.type ===
      "energy"
    ) {
      color = "#00e5ff";
      icon = "⚡";
    }

    ctx.fillStyle =
      color;

    ctx.beginPath();

    ctx.arc(
      pickup.x,
      pickup.y,
      pickup.radius,
      0,
      Math.PI * 2
    );

    ctx.fill();

    ctx.fillStyle =
      "#071019";

    ctx.font =
      "bold 11px Arial";

    ctx.textAlign =
      "center";

    ctx.textBaseline =
      "middle";

    ctx.fillText(
      icon,
      pickup.x,
      pickup.y
    );
  }
}


/* ============================================================
   DIBUJAR PARTÍCULAS
============================================================ */

function drawParticles() {

  for (
    const particle
    of particles
  ) {

    ctx.globalAlpha =
      clamp(
        particle.life /
        particle.maxLife,
        0,
        1
      );

    ctx.fillStyle =
      particle.color;

    ctx.fillRect(
      particle.x,
      particle.y,
      particle.size,
      particle.size
    );
  }

  ctx.globalAlpha = 1;
}


/* ============================================================
   XP Y NIVELES
============================================================ */

function getRequiredXP(
  level = saveData.level
) {

  return (
    500 +
    (level - 1) *
    220
  );
}


function levelCheck() {

  let required =
    getRequiredXP();

  while (
    saveData.xp >=
    required
  ) {

    saveData.xp -=
      required;

    saveData.level++;

    saveData.coins +=
      1000 *
      saveData.level;

    saveData.crystals += 2;

    notify(
      `¡Nivel ${saveData.level}!`,
      "success"
    );

    required =
      getRequiredXP();
  }
}


/* ============================================================
   MISIONES
============================================================ */

function updateMissionProgress(
  type,
  value
) {

  if (
    window.SCORVEX_MISSIONS &&
    typeof window.SCORVEX_MISSIONS.update === "function"
  ) {

    window.SCORVEX_MISSIONS.update(
      type,
      value,
      saveData
    );
  }
}


function getMissionText() {

  if (
    window.SCORVEX_MISSIONS &&
    typeof window.SCORVEX_MISSIONS.getCurrent === "function"
  ) {

    const mission =
      window.SCORVEX_MISSIONS.getCurrent(
        saveData
      );

    if (mission) {

      if (
        typeof mission ===
        "string"
      ) {
        return mission;
      }

      return (
        mission.description ||
        mission.name ||
        "Misión activa"
      );
    }
  }

  return (
    `Derrota enemigos: ` +
    `${saveData.stats.enemiesDefeated}`
  );
}


/* ============================================================
   HUD
============================================================ */

function updateHUD() {

  const weapon =
    getWeapon();

  const ability =
    getAbility();

  const armor =
    getArmor();

  safeText(
    elements.healthText,
    `${Math.ceil(player.health)} / ${player.maxHealth}`
  );

  setWidth(
    elements.healthBar,
    (
      player.health /
      player.maxHealth
    ) *
    100
  );

  safeText(
    elements.shieldText,
    Math.ceil(
      player.shield
    )
  );

  setWidth(
    elements.shieldBar,
    player.maxShield > 0
      ? (
          player.shield /
          player.maxShield
        ) * 100
      : 0
  );

  safeText(
    elements.gameLevel,
    saveData.level
  );

  setWidth(
    elements.xpBar,
    (
      saveData.xp /
      getRequiredXP()
    ) *
    100
  );

  safeText(
    elements.sectorText,
    saveData.sector
  );

  safeText(
    elements.waveText,
    saveData.wave
  );

  safeText(
    elements.hudWeapon,
    weapon.name
  );

  safeText(
    elements.hudAmmo,
    `${player.ammo} / ${player.reserveAmmo}`
  );

  safeText(
    elements.hudAbility,
    ability.name ||
    "Habilidad"
  );

  safeText(
    elements.hudEnergy,
    player.abilityReady
      ? `ENERGÍA ${Math.floor(player.energy)}`
      : `RECARGANDO · ${Math.floor(player.energy)}`
  );

  safeText(
    elements.hudArmor,
    armor.name
  );

  safeText(
    elements.medkitCount,
    saveData.medkits
  );

  safeText(
    elements.energyKitCount,
    saveData.energyKits
  );

  safeText(
    elements.shieldKitCount,
    saveData.shieldKits
  );

  safeText(
    elements.gameMission,
    getMissionText()
  );

  updateBossHUD();
}


/* ============================================================
   UI GENERAL
============================================================ */

function updateMenuUI() {

  const weapon =
    getWeapon();

  const ability =
    getAbility();

  const armor =
    getArmor();

  safeText(
    elements.menuCoins,
    formatNumber(
      saveData.coins
    )
  );

  safeText(
    elements.menuCrystals,
    formatNumber(
      saveData.crystals
    )
  );

  safeText(
    elements.menuLevel,
    saveData.level
  );

  safeText(
    elements.menuWeapon,
    weapon.name
  );

  safeText(
    elements.menuAbility,
    ability.name ||
    "Habilidad"
  );

  safeText(
    elements.menuArmor,
    armor.name
  );

  safeText(
    elements.menuScore,
    formatNumber(
      saveData.score
    )
  );

  safeText(
    elements.menuMission,
    getMissionText()
  );

  safeText(
    elements.shopCoins,
    formatNumber(
      saveData.coins
    )
  );

  safeText(
    elements.shopCrystals,
    formatNumber(
      saveData.crystals
    )
  );
}


function updateAllUI() {

  updateMenuUI();

  updateHUD();

  if (
    window.SCORVEX_SHOP &&
    typeof window.SCORVEX_SHOP.render === "function"
  ) {
    window.SCORVEX_SHOP.render(
      saveData
    );
  }

  if (
    window.SCORVEX_INVENTORY &&
    typeof window.SCORVEX_INVENTORY.render === "function"
  ) {
    window.SCORVEX_INVENTORY.render(
      saveData
    );
  }
}


/* ============================================================
   PANTALLAS
============================================================ */

function showScreen(
  id
) {

  document
    .querySelectorAll(
      ".screen"
    )
    .forEach(
      (screen) => {
        screen.classList.remove(
          "active"
        );
      }
    );

  const screen =
    $(id);

  if (screen) {
    screen.classList.add(
      "active"
    );
  }
}


function showMainMenu() {

  gameRunning = false;
  paused = false;
  gameOver = false;

  showScreen(
    "mainMenu"
  );

  if (
    elements.pauseModal
  ) {
    elements.pauseModal.classList.add(
      "hidden"
    );
  }

  callAudio("playMenuMusic");

  updateAllUI();
}


/* ============================================================
   PAUSA
============================================================ */

function togglePause() {

  if (!gameRunning) {
    return;
  }

  paused =
    !paused;

  if (
    elements.pauseModal
  ) {

    elements.pauseModal.classList.toggle(
      "hidden",
      !paused
    );
  }
}


function resumeGame() {

  paused = false;

  if (
    elements.pauseModal
  ) {
    elements.pauseModal.classList.add(
      "hidden"
    );
  }

  lastFrame =
    performance.now();
}


/* ============================================================
   FIN DE PARTIDA
============================================================ */

function endGame(
  victory = false
) {

  gameOver = true;

  player.shooting = false;

  saveGame();

  openModal({
    icon:
      victory
        ? "🏆"
        : "⚠",

    title:
      victory
        ? "VICTORIA"
        : "MISIÓN FALLIDA",

    content:
      `
        <div class="result-card">

          <div class="result-title ${
            victory
              ? "victory"
              : "defeat"
          }">

            ${
              victory
                ? "SECTOR COMPLETADO"
                : "HAS CAÍDO"
            }

          </div>

          <div class="result-stats">

            <div class="result-stat">
              <span>PUNTUACIÓN</span>
              <strong>
                ${formatNumber(saveData.score)}
              </strong>
            </div>

            <div class="result-stat">
              <span>ENEMIGOS</span>
              <strong>
                ${formatNumber(saveData.stats.enemiesDefeated)}
              </strong>
            </div>

            <div class="result-stat">
              <span>NIVEL</span>
              <strong>
                ${saveData.level}
              </strong>
            </div>

            <div class="result-stat">
              <span>SECTOR</span>
              <strong>
                ${saveData.sector}
              </strong>
            </div>

          </div>

        </div>
      `,

    actions: [
      {
        text:
          "↻ JUGAR DE NUEVO",

        className:
          "btn btn-primary",

        callback() {
          closeModal();
          startGame();
        }
      },

      {
        text:
          "← MENÚ",

        className:
          "btn btn-secondary",

        callback() {
          closeModal();
          showMainMenu();
        }
      }
    ]
  });
}


/* ============================================================
   MODAL
============================================================ */

function openModal({
  icon = "⚡",
  title = "SCORVEX",
  content = "",
  actions = []
}) {

  if (
    !elements.modal
  ) {
    return;
  }

  elements.modal.classList.remove(
    "hidden"
  );

  safeText(
    elements.modalIcon,
    icon
  );

  safeText(
    elements.modalTitle,
    title
  );

  if (
    elements.modalContent
  ) {
    elements.modalContent.innerHTML =
      content;
  }

  if (
    elements.modalActions
  ) {

    elements.modalActions.innerHTML =
      "";

    for (
      const action
      of actions
    ) {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        action.className ||
        "btn btn-secondary";

      button.textContent =
        action.text ||
        "ACEPTAR";

      button.addEventListener(
        "click",
        action.callback
      );

      elements.modalActions.appendChild(
        button
      );
    }
  }
}


function closeModal() {

  if (
    elements.modal
  ) {
    elements.modal.classList.add(
      "hidden"
    );
  }
}


/* ============================================================
   NOTIFICACIONES
============================================================ */

function notify(
  message,
  type = ""
) {

  if (
    !elements.notifications
  ) {
    return;
  }

  const notification =
    document.createElement(
      "div"
    );

  notification.className =
    `notification ${type}`;

  notification.textContent =
    message;

  elements.notifications.appendChild(
    notification
  );

  setTimeout(
    () => {

      notification.style.opacity =
        "0";

      notification.style.transform =
        "translateX(25px)";

      setTimeout(
        () => {
          notification.remove();
        },
        300
      );

    },
    2600
  );
}


/* ============================================================
   MENSAJE DE OLEADA
============================================================ */

function showWaveAnnouncement() {

  if (
    !elements.waveAnnouncement
  ) {
    return;
  }

  safeText(
    elements.waveAnnouncementNumber,
    saveData.wave
  );

  elements.waveAnnouncement.classList.remove(
    "hidden"
  );

  setTimeout(
    () => {

      elements.waveAnnouncement.classList.add(
        "hidden"
      );

    },
    1200
  );
}


function showArenaMessage(
  message,
  duration = 1000
) {

  if (
    !elements.arenaMessage
  ) {
    return;
  }

  safeText(
    elements.arenaMessage,
    message
  );

  elements.arenaMessage.classList.remove(
    "hidden"
  );

  setTimeout(
    () => {

      elements.arenaMessage.classList.add(
        "hidden"
      );

    },
    duration
  );
}


/* ============================================================
   COLORES DE RAREZA
============================================================ */

function getRarityColor(
  rarity
) {

  const colors = {
    common: "#b9c1cf",
    uncommon: "#35e58b",
    rare: "#4a90ff",
    epic: "#a65dff",
    legendary: "#ffb547",
    mythic: "#ff4c96",
    ancient: "#ff5932",
    omega: "#00e5ff"
  };

  return (
    colors[
      String(
        rarity ||
        "common"
      ).toLowerCase()
    ] ||
    "#ffffff"
  );
}


/* ============================================================
   AUDIO
============================================================ */

function callAudio(
  method,
  ...args
) {

  try {

    const audio =
      window.SCORVEX_AUDIO;

    if (
      audio &&
      typeof audio[method] ===
      "function"
    ) {

      audio[method](
        ...args
      );
    }

  } catch (error) {

    console.warn(
      "[SCORVEX AUDIO]",
      error
    );
  }
}


function toggleMusic() {

  saveData.musicEnabled =
    !saveData.musicEnabled;

  saveGame();

  if (
    window.SCORVEX_AUDIO
  ) {

    if (
      typeof window.SCORVEX_AUDIO.setMusicEnabled ===
      "function"
    ) {

      window.SCORVEX_AUDIO.setMusicEnabled(
        saveData.musicEnabled
      );

    } else if (
      saveData.musicEnabled
    ) {

      callAudio(
        "playMenuMusic"
      );

    } else {

      callAudio(
        "stopMusic"
      );
    }
  }

  updateMusicButtons();
}


function toggleSound() {

  saveData.soundEnabled =
    !saveData.soundEnabled;

  saveGame();

  if (
    window.SCORVEX_AUDIO &&
    typeof window.SCORVEX_AUDIO.setSoundEnabled ===
    "function"
  ) {

    window.SCORVEX_AUDIO.setSoundEnabled(
      saveData.soundEnabled
    );
  }

  updateMusicButtons();
}


function selectMusicTrack(
  index
) {

  saveData.selectedTrack =
    Number(index) || 0;

  saveGame();

  document
    .querySelectorAll(
      ".music-btn"
    )
    .forEach(
      (button) => {

        button.classList.toggle(
          "active",
          Number(
            button.dataset.track
          ) ===
          saveData.selectedTrack
        );
      }
    );

  if (
    window.SCORVEX_AUDIO &&
    typeof window.SCORVEX_AUDIO.selectTrack ===
    "function"
  ) {

    window.SCORVEX_AUDIO.selectTrack(
      saveData.selectedTrack
    );
  }
}


function updateMusicButtons() {

  const music =
    $("btnMusic");

  const sound =
    $("btnSound");

  if (music) {

    music.textContent =
      saveData.musicEnabled
        ? "♫ MÚSICA: ON"
        : "♫ MÚSICA: OFF";
  }

  if (sound) {

    sound.textContent =
      saveData.soundEnabled
        ? "🔊 SONIDO: ON"
        : "🔇 SONIDO: OFF";
  }
}


/* ============================================================
   CONTROLES MÓVILES
============================================================ */

let joystickActive = false;

let joystickOrigin = {
  x: 0,
  y: 0
};


function setupMobileControls() {

  const joystick =
    $("joystick");

  const knob =
    $("joystickKnob");

  if (
    joystick &&
    knob
  ) {

    joystick.addEventListener(
      "touchstart",
      (event) => {

        event.preventDefault();

        const touch =
          event.touches[0];

        const rect =
          joystick.getBoundingClientRect();

        joystickOrigin.x =
          rect.left +
          rect.width / 2;

        joystickOrigin.y =
          rect.top +
          rect.height / 2;

        joystickActive =
          true;

        updateJoystick(
          touch,
          knob
        );

      },
      {
        passive: false
      }
    );


    joystick.addEventListener(
      "touchmove",
      (event) => {

        event.preventDefault();

        if (
          !joystickActive
        ) {
          return;
        }

        updateJoystick(
          event.touches[0],
          knob
        );

      },
      {
        passive: false
      }
    );


    joystick.addEventListener(
      "touchend",
      () => {

        joystickActive =
          false;

        knob.style.transform =
          "translate(-50%, -50%)";

        keys.KeyW = false;
        keys.KeyA = false;
        keys.KeyS = false;
        keys.KeyD = false;
      }
    );
  }


  const shoot =
    $("mobileShoot");

  if (shoot) {

    shoot.addEventListener(
      "touchstart",
      (event) => {

        event.preventDefault();

        player.shooting =
          true;

      },
      {
        passive: false
      }
    );

    shoot.addEventListener(
      "touchend",
      () => {
        player.shooting =
          false;
      }
    );
  }


  const ability =
    $("mobileAbility");

  if (ability) {
    ability.addEventListener(
      "click",
      useAbility
    );
  }


  const reload =
    $("mobileReload");

  if (reload) {
    reload.addEventListener(
      "click",
      reloadWeapon
    );
  }
}


function updateJoystick(
  touch,
  knob
) {

  let dx =
    touch.clientX -
    joystickOrigin.x;

  let dy =
    touch.clientY -
    joystickOrigin.y;

  const max = 35;

  const length =
    Math.hypot(dx, dy);

  if (
    length > max
  ) {

    dx =
      (
        dx /
        length
      ) *
      max;

    dy =
      (
        dy /
        length
      ) *
      max;
  }

  knob.style.transform =
    `translate(
      calc(-50% + ${dx}px),
      calc(-50% + ${dy}px)
    )`;

  const deadZone = 8;

  keys.KeyA =
    dx < -deadZone;

  keys.KeyD =
    dx > deadZone;

  keys.KeyW =
    dy < -deadZone;

  keys.KeyS =
    dy > deadZone;

  if (
    Math.abs(dx) >
    deadZone ||
    Math.abs(dy) >
    deadZone
  ) {

    player.angle =
      Math.atan2(
        dy,
        dx
      );
  }
}


/* ============================================================
   TIENDA
============================================================ */

function openShop() {

  showScreen(
    "shopScreen"
  );

  updateAllUI();

  if (
    window.SCORVEX_SHOP &&
    typeof window.SCORVEX_SHOP.render ===
    "function"
  ) {

    window.SCORVEX_SHOP.render(
      saveData
    );
  }
}


/* ============================================================
   INVENTARIO
============================================================ */

function openInventory() {

  showScreen(
    "inventoryScreen"
  );

  updateAllUI();

  if (
    window.SCORVEX_INVENTORY &&
    typeof window.SCORVEX_INVENTORY.render ===
    "function"
  ) {

    window.SCORVEX_INVENTORY.render(
      saveData
    );
  }
}


/* ============================================================
   PERSONALIZACIÓN
============================================================ */

function openCustomize() {

  showScreen(
    "customizeScreen"
  );

  if (
    window.SCORVEX_CHARACTERS &&
    typeof window.SCORVEX_CHARACTERS.render ===
    "function"
  ) {

    window.SCORVEX_CHARACTERS.render(
      saveData
    );
  }
}


/* ============================================================
   EVENTOS
============================================================ */

function setupButtons() {

  $("btnPlay")?.addEventListener(
    "click",
    startGame
  );

  $("btnShop")?.addEventListener(
    "click",
    openShop
  );

  $("btnInventory")?.addEventListener(
    "click",
    openInventory
  );

  $("btnCustomize")?.addEventListener(
    "click",
    openCustomize
  );


  $("btnBackShop")?.addEventListener(
    "click",
    () => {
      showScreen(
        "mainMenu"
      );

      updateAllUI();
    }
  );


  $("btnBackInventory")?.addEventListener(
    "click",
    () => {
      showScreen(
        "mainMenu"
      );

      updateAllUI();
    }
  );


  $("btnBackCustomize")?.addEventListener(
    "click",
    () => {
      showScreen(
        "mainMenu"
      );

      updateAllUI();
    }
  );


  $("btnPause")?.addEventListener(
    "click",
    togglePause
  );


  $("btnResume")?.addEventListener(
    "click",
    resumeGame
  );


  $("btnPauseRestart")?.addEventListener(
    "click",
    () => {

      resumeGame();

      startGame();
    }
  );


  $("btnPauseExit")?.addEventListener(
    "click",
    showMainMenu
  );


  $("btnLeaveGame")?.addEventListener(
    "click",
    () => {

      paused = true;

      openModal({
        icon: "⚠",
        title: "SALIR DE LA ARENA",
        content:
          "¿Quieres volver al menú principal?",

        actions: [
          {
            text: "SALIR",
            className:
              "btn btn-danger",

            callback() {
              closeModal();
              showMainMenu();
            }
          },

          {
            text: "CANCELAR",
            className:
              "btn btn-secondary",

            callback() {
              closeModal();
              paused = false;
              lastFrame =
                performance.now();
            }
          }
        ]
      });
    }
  );


  $("btnUseMedkit")?.addEventListener(
    "click",
    useMedkit
  );

  $("btnUseEnergy")?.addEventListener(
    "click",
    useEnergyKit
  );

  $("btnUseShield")?.addEventListener(
    "click",
    useShieldKit
  );


  $("modalClose")?.addEventListener(
    "click",
    closeModal
  );


  $("btnMusic")?.addEventListener(
    "click",
    toggleMusic
  );


  $("btnSound")?.addEventListener(
    "click",
    toggleSound
  );


  document
    .querySelectorAll(
      ".music-btn"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            selectMusicTrack(
              button.dataset.track
            );
          }
        );
      }
    );
}


/* ============================================================
   FILTROS DE TIENDA
============================================================ */

function setupShopFilters() {

  document
    .querySelectorAll(
      ".shop-filter"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".shop-filter"
              )
              .forEach(
                (item) => {
                  item.classList.remove(
                    "active"
                  );
                }
              );

            button.classList.add(
              "active"
            );

            if (
              window.SCORVEX_SHOP &&
              typeof window.SCORVEX_SHOP.setFilter ===
              "function"
            ) {

              window.SCORVEX_SHOP.setFilter(
                button.dataset.filter,
                saveData
              );
            }
          }
        );
      }
    );
}


/* ============================================================
   TABS DE INVENTARIO
============================================================ */

function setupInventoryTabs() {

  document
    .querySelectorAll(
      ".inventory-tab"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".inventory-tab"
              )
              .forEach(
                (tab) => {
                  tab.classList.remove(
                    "active"
                  );
                }
              );

            button.classList.add(
              "active"
            );

            if (
              window.SCORVEX_INVENTORY &&
              typeof window.SCORVEX_INVENTORY.setTab ===
              "function"
            ) {

              window.SCORVEX_INVENTORY.setTab(
                button.dataset.inventoryTab,
                saveData
              );
            }
          }
        );
      }
    );
}


/* ============================================================
   TABS DE PERSONAJE
============================================================ */

function setupCustomizeTabs() {

  document
    .querySelectorAll(
      ".customize-tab"
    )
    .forEach(
      (button) => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                ".customize-tab"
              )
              .forEach(
                (tab) => {

                  tab.classList.remove(
                    "active"
                  );
                }
              );

            button.classList.add(
              "active"
            );

            if (
              window.SCORVEX_CHARACTERS &&
              typeof window.SCORVEX_CHARACTERS.setTab ===
              "function"
            ) {

              window.SCORVEX_CHARACTERS.setTab(
                button.dataset.customTab,
                saveData
              );
            }
          }
        );
      }
    );
}


/* ============================================================
   RESIZE
============================================================ */

function resizeCanvas() {

  if (!elements.canvas) {
    return;
  }

  elements.canvas.width =
    CANVAS_WIDTH;

  elements.canvas.height =
    CANVAS_HEIGHT;
}


/* ============================================================
   API PARA LOS OTROS ARCHIVOS
============================================================ */

window.SCORVEX_GAME = {

  initialized: false,


  initialize() {

    if (
      this.initialized
    ) {
      return;
    }

    this.initialized = true;

    console.log(
      `%cSCORVEX ${SCORVEX_VERSION}`,
      "color:#00e5ff;font-size:20px;font-weight:bold;"
    );

    console.log(
      "[SCORVEX] Inicializando sistemas..."
    );

    loadGame();

    resizeCanvas();

    setupButtons();

    setupShopFilters();

    setupInventoryTabs();

    setupCustomizeTabs();

    setupMobileControls();

    selectMusicTrack(
      saveData.selectedTrack
    );

    updateMusicButtons();

    updateAllUI();

    showScreen(
      "mainMenu"
    );

    callAudio(
      "initialize",
      {
        musicEnabled:
          saveData.musicEnabled,

        soundEnabled:
          saveData.soundEnabled,

        track:
          saveData.selectedTrack
      }
    );

    if (
      saveData.musicEnabled
    ) {
      callAudio(
        "playMenuMusic"
      );
    }

    console.log(
      "[SCORVEX] Sistema listo."
    );
  },


  getSave() {
    return saveData;
  },


  save() {
    saveGame();
  },


  updateUI() {
    updateAllUI();
  },


  notify(
    message,
    type
  ) {
    notify(
      message,
      type
    );
  },


  equipWeapon(
    weaponId
  ) {

    const weapons =
      getWeaponsDatabase();

    if (
      !weapons[weaponId]
    ) {
      return false;
    }

    if (
      !saveData.ownedWeapons.includes(
        weaponId
      )
    ) {
      return false;
    }

    saveData.weapon =
      weaponId;

    const weapon =
      getWeapon();

    player.ammo =
      weapon.magazine;

    saveGame();

    updateAllUI();

    notify(
      `${weapon.name} equipado`,
      "success"
    );

    return true;
  },


  equipAbility(
    abilityId
  ) {

    const abilities =
      getAbilitiesDatabase();

    if (
      !abilities[abilityId]
    ) {
      return false;
    }

    if (
      !saveData.ownedAbilities.includes(
        abilityId
      )
    ) {
      return false;
    }

    saveData.ability =
      abilityId;

    saveGame();

    updateAllUI();

    notify(
      `${abilities[abilityId].name} equipada`,
      "success"
    );

    return true;
  },


  equipArmor(
    armorId
  ) {

    if (
      !ARMORS[armorId]
    ) {
      return false;
    }

    if (
      !saveData.ownedArmors.includes(
        armorId
      )
    ) {
      return false;
    }

    saveData.armor =
      armorId;

    saveGame();

    updateAllUI();

    return true;
  },


  spendCoins(
    amount
  ) {

    const price =
      Math.max(
        0,
        Number(amount) || 0
      );

    if (
      saveData.coins <
      price
    ) {
      return false;
    }

    saveData.coins -=
      price;

    saveGame();

    updateAllUI();

    return true;
  },


  addCoins(
    amount
  ) {

    saveData.coins +=
      Math.max(
        0,
        Number(amount) || 0
      );

    saveGame();

    updateAllUI();
  },


  addCrystals(
    amount
  ) {

    saveData.crystals +=
      Math.max(
        0,
        Number(amount) || 0
      );

    saveGame();

    updateAllUI();
  },


  ownWeapon(
    weaponId
  ) {

    if (
      !saveData.ownedWeapons.includes(
        weaponId
      )
    ) {

      saveData.ownedWeapons.push(
        weaponId
      );

      saveGame();
    }
  },


  ownAbility(
    abilityId
  ) {

    if (
      !saveData.ownedAbilities.includes(
        abilityId
      )
    ) {

      saveData.ownedAbilities.push(
        abilityId
      );

      saveGame();
    }
  },


  ownArmor(
    armorId
  ) {

    if (
      !saveData.ownedArmors.includes(
        armorId
      )
    ) {

      saveData.ownedArmors.push(
        armorId
      );

      saveGame();
    }
  },


  useMedkit,

  useEnergyKit,

  useShieldKit,

  resetSave,

  startGame,

  showMainMenu
};


/* ============================================================
   AUTO INICIO DE SEGURIDAD

   index.html también llama initialize().
   La comprobación "initialized" evita duplicarlo.
============================================================ */

window.addEventListener(
  "load",
  () => {

    setTimeout(
      () => {

        if (
          window.SCORVEX_GAME &&
          !window.SCORVEX_GAME.initialized
        ) {

          window.SCORVEX_GAME.initialize();
        }

      },
      1800
    );
  }
);


/* ============================================================
   FIN DE SCORVEX G7 GAME.JS
============================================================ */
