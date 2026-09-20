/* =========================================================
   SCORVEX G7 — ENEMIES SYSTEM
   Archivo: enemies-g7.js
   ========================================================= */

(() => {
  "use strict";

  /* ---------------------------------------------------------
     CONFIGURACIÓN DE ENEMIGOS
     --------------------------------------------------------- */

  const ENEMIES = {

    scout: {
      id: "scout",
      name: "Scout",
      type: "explorer",
      description: "Enemigo rápido especializado en persecución.",
      hp: 120,
      damage: 10,
      speed: 2.8,
      range: 220,
      fireRate: 900,
      radius: 18,
      armor: 2,
      rewardCoins: 120,
      rewardXp: 35,
      color: "#48d9ff",
      accent: "#1266ff",
      behavior: "chase",
      projectile: "energy",
      elite: false
    },

    striker: {
      id: "striker",
      name: "Striker",
      type: "assault",
      description: "Unidad equilibrada de combate.",
      hp: 220,
      damage: 18,
      speed: 2.1,
      range: 300,
      fireRate: 700,
      radius: 22,
      armor: 6,
      rewardCoins: 220,
      rewardXp: 60,
      color: "#ffb347",
      accent: "#ff6a00",
      behavior: "attack",
      projectile: "plasma",
      elite: false
    },

    tank: {
      id: "tank",
      name: "Titan Guard",
      type: "heavy",
      description: "Unidad pesada con mucha resistencia.",
      hp: 600,
      damage: 32,
      speed: 0.9,
      range: 250,
      fireRate: 1200,
      radius: 34,
      armor: 25,
      rewardCoins: 550,
      rewardXp: 130,
      color: "#ff5c5c",
      accent: "#a40000",
      behavior: "tank",
      projectile: "heavy",
      elite: false
    },

    sniper: {
      id: "sniper",
      name: "Specter Sniper",
      type: "ranged",
      description: "Unidad que mantiene distancia y dispara desde lejos.",
      hp: 180,
      damage: 42,
      speed: 1.25,
      range: 600,
      fireRate: 1700,
      radius: 20,
      armor: 4,
      rewardCoins: 400,
      rewardXp: 110,
      color: "#c28cff",
      accent: "#651fff",
      behavior: "ranged",
      projectile: "precision",
      elite: false
    },

    drone: {
      id: "drone",
      name: "Omega Drone",
      type: "air",
      description: "Dron veloz con ataques energéticos.",
      hp: 150,
      damage: 22,
      speed: 3.4,
      range: 340,
      fireRate: 850,
      radius: 17,
      armor: 3,
      rewardCoins: 300,
      rewardXp: 85,
      color: "#65ffb0",
      accent: "#00a86b",
      behavior: "orbit",
      projectile: "energy",
      elite: false
    }

  };

  /* ---------------------------------------------------------
     JEFES
     --------------------------------------------------------- */

  const BOSSES = {

    titan: {
      id: "titan",
      name: "TITAN-X",
      type: "boss",
      description: "Gigante blindado especializado en ataques pesados.",
      hp: 5000,
      damage: 75,
      speed: 0.75,
      range: 420,
      fireRate: 1300,
      radius: 65,
      armor: 45,
      rewardCoins: 15000,
      rewardXp: 1500,
      color: "#ff5252",
      accent: "#b71c1c",
      behavior: "boss_heavy",
      projectile: "mega",
      phases: 3
    },

    overlord: {
      id: "overlord",
      name: "OVERLORD",
      type: "boss",
      description: "Comandante que utiliza ataques múltiples.",
      hp: 8500,
      damage: 95,
      speed: 1.15,
      range: 500,
      fireRate: 950,
      radius: 72,
      armor: 55,
      rewardCoins: 28000,
      rewardXp: 3000,
      color: "#c77dff",
      accent: "#7209b7",
      behavior: "boss_control",
      projectile: "multi",
      phases: 4
    },

    omega: {
      id: "omega",
      name: "OMEGA CORE",
      type: "boss",
      description: "Jefe final de SCORVEX G7.",
      hp: 15000,
      damage: 130,
      speed: 1.35,
      range: 650,
      fireRate: 700,
      radius: 85,
      armor: 70,
      rewardCoins: 50000,
      rewardXp: 6000,
      color: "#ffd54f",
      accent: "#ff6f00",
      behavior: "boss_omega",
      projectile: "omega",
      phases: 5
    }

  };

  /* ---------------------------------------------------------
     UTILIDADES
     --------------------------------------------------------- */

  function randomId(prefix = "enemy") {
    return (
      prefix +
      "_" +
      Date.now().toString(36) +
      "_" +
      Math.random().toString(36).slice(2, 8)
    );
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  /* ---------------------------------------------------------
     CREAR ENEMIGO
     --------------------------------------------------------- */

  function createEnemy(type = "scout", options = {}) {

    const base = ENEMIES[type] || ENEMIES.scout;

    const enemy = {

      id: randomId("enemy"),

      templateId: base.id,

      name: base.name,

      type: base.type,

      description: base.description,

      x: Number(options.x ?? 100),

      y: Number(options.y ?? 100),

      vx: 0,

      vy: 0,

      hp: options.hp ?? base.hp,

      maxHp: options.maxHp ?? base.hp,

      damage: options.damage ?? base.damage,

      speed: options.speed ?? base.speed,

      range: options.range ?? base.range,

      fireRate: options.fireRate ?? base.fireRate,

      radius: options.radius ?? base.radius,

      armor: options.armor ?? base.armor,

      rewardCoins:
        options.rewardCoins ?? base.rewardCoins,

      rewardXp:
        options.rewardXp ?? base.rewardXp,

      color: base.color,

      accent: base.accent,

      behavior: base.behavior,

      projectile: base.projectile,

      elite: Boolean(options.elite ?? base.elite),

      alive: true,

      attackCooldown: 0,

      lastAttack: 0,

      slow: 0,

      frozen: false,

      stunned: false,

      target: null,

      rotation: 0,

      hitFlash: 0,

      status: null

    };

    if (enemy.elite) {
      enemy.hp *= 1.8;
      enemy.maxHp = enemy.hp;
      enemy.damage *= 1.35;
      enemy.rewardCoins *= 2;
      enemy.rewardXp *= 2;
      enemy.radius *= 1.08;
    }

    return enemy;
  }

  /* ---------------------------------------------------------
     CREAR JEFE
     --------------------------------------------------------- */

  function createBoss(type = "titan", options = {}) {

    const base = BOSSES[type] || BOSSES.titan;

    const boss = {

      id: randomId("boss"),

      templateId: base.id,

      name: base.name,

      type: "boss",

      description: base.description,

      x: Number(options.x ?? 500),

      y: Number(options.y ?? 300),

      vx: 0,

      vy: 0,

      hp: options.hp ?? base.hp,

      maxHp: options.maxHp ?? base.hp,

      damage: options.damage ?? base.damage,

      speed: options.speed ?? base.speed,

      range: options.range ?? base.range,

      fireRate: options.fireRate ?? base.fireRate,

      radius: options.radius ?? base.radius,

      armor: options.armor ?? base.armor,

      rewardCoins:
        options.rewardCoins ?? base.rewardCoins,

      rewardXp:
        options.rewardXp ?? base.rewardXp,

      color: base.color,

      accent: base.accent,

      behavior: base.behavior,

      projectile: base.projectile,

      isBoss: true,

      alive: true,

      phase: 1,

      maxPhases: base.phases,

      attackCooldown: 0,

      lastAttack: 0,

      specialCooldown: 0,

      lastSpecial: 0,

      slow: 0,

      frozen: false,

      stunned: false,

      target: null,

      rotation: 0,

      hitFlash: 0,

      shield: 0,

      enraged: false,

      status: null

    };

    return boss;
  }

  /* ---------------------------------------------------------
     ACTUALIZAR FASE DEL JEFE
     --------------------------------------------------------- */

  function updateBossPhase(boss) {

    if (!boss || !boss.isBoss) {
      return 1;
    }

    const percentage =
      boss.hp / Math.max(1, boss.maxHp);

    const phaseSize =
      1 / Math.max(1, boss.maxPhases);

    let phase =
      Math.ceil(percentage / phaseSize);

    phase = clamp(
      boss.maxPhases - phase + 1,
      1,
      boss.maxPhases
    );

    boss.phase = phase;

    /*
      Cuando el jefe entra en su última fase,
      aumenta su presión de ataque.
    */

    if (phase >= boss.maxPhases) {

      boss.enraged = true;

      boss.damage =
        Math.max(
          boss.damage,
          boss.damage * 1.15
        );

    }

    return boss.phase;
  }

  /* ---------------------------------------------------------
     DAÑO AL ENEMIGO
     --------------------------------------------------------- */

  function damageEnemy(enemy, amount) {

    if (!enemy || !enemy.alive) {
      return {
        damage: 0,
        defeated: false
      };
    }

    let finalDamage =
      Math.max(
        1,
        Number(amount || 0) -
        Number(enemy.armor || 0)
      );

    if (enemy.shield > 0) {

      const absorbed =
        Math.min(enemy.shield, finalDamage);

      enemy.shield -= absorbed;
      finalDamage -= absorbed;

    }

    enemy.hp -= finalDamage;

    enemy.hitFlash = 100;

    if (enemy.isBoss) {
      updateBossPhase(enemy);
    }

    if (enemy.hp <= 0) {

      enemy.hp = 0;
      enemy.alive = false;

      return {
        damage: finalDamage,
        defeated: true,
        rewardCoins: enemy.rewardCoins,
        rewardXp: enemy.rewardXp
      };

    }

    return {
      damage: finalDamage,
      defeated: false,
      remainingHp: enemy.hp
    };
  }

  /* ---------------------------------------------------------
     CURAR / RESTAURAR ENEMIGO
     --------------------------------------------------------- */

  function healEnemy(enemy, amount) {

    if (!enemy || !enemy.alive) {
      return 0;
    }

    const before = enemy.hp;

    enemy.hp = Math.min(
      enemy.maxHp,
      enemy.hp + Math.max(0, Number(amount || 0))
    );

    return enemy.hp - before;
  }

  /* ---------------------------------------------------------
     APLICAR ESTADOS
     --------------------------------------------------------- */

  function applyStatus(enemy, status, duration = 1000) {

    if (!enemy || !enemy.alive) {
      return;
    }

    enemy.status = status;

    if (status === "freeze") {

      enemy.frozen = true;

      setTimeout(() => {

        if (enemy) {
          enemy.frozen = false;
          enemy.status = null;
        }

      }, duration);

    }

    if (status === "stun") {

      enemy.stunned = true;

      setTimeout(() => {

        if (enemy) {
          enemy.stunned = false;
          enemy.status = null;
        }

      }, duration);

    }

    if (status === "slow") {

      enemy.slow = 0.5;

      setTimeout(() => {

        if (enemy) {
          enemy.slow = 0;
          enemy.status = null;
        }

      }, duration);

    }

  }

  /* ---------------------------------------------------------
     PUEDE ATACAR
     --------------------------------------------------------- */

  function canAttack(enemy, now = performance.now()) {

    if (!enemy || !enemy.alive) {
      return false;
    }

    if (enemy.frozen || enemy.stunned) {
      return false;
    }

    return (
      now - enemy.lastAttack >= enemy.fireRate
    );
  }

  /* ---------------------------------------------------------
     REGISTRAR ATAQUE
     --------------------------------------------------------- */

  function registerAttack(enemy, now = performance.now()) {

    if (!canAttack(enemy, now)) {
      return false;
    }

    enemy.lastAttack = now;

    return true;
  }

  /* ---------------------------------------------------------
     MOVIMIENTO BÁSICO
     --------------------------------------------------------- */

  function moveEnemy(enemy, targetX, targetY, delta = 1) {

    if (!enemy || !enemy.alive) {
      return;
    }

    if (enemy.frozen || enemy.stunned) {
      enemy.vx = 0;
      enemy.vy = 0;
      return;
    }

    const dx = targetX - enemy.x;
    const dy = targetY - enemy.y;

    const distance =
      Math.sqrt(dx * dx + dy * dy) || 1;

    let speed =
      enemy.speed *
      (enemy.slow > 0 ? enemy.slow : 1);

    /*
      Los enemigos a distancia intentan mantener
      una separación mínima del jugador.
    */

    if (
      enemy.behavior === "ranged" &&
      distance < enemy.range * 0.55
    ) {

      enemy.vx = (-dx / distance) * speed;
      enemy.vy = (-dy / distance) * speed;

    } else if (
      enemy.behavior === "chase" ||
      enemy.behavior === "attack" ||
      enemy.behavior === "boss_heavy" ||
      enemy.behavior === "boss_control" ||
      enemy.behavior === "boss_omega"
    ) {

      enemy.vx = (dx / distance) * speed;
      enemy.vy = (dy / distance) * speed;

    } else {

      enemy.vx = (dx / distance) * speed;
      enemy.vy = (dy / distance) * speed;

    }

    enemy.x += enemy.vx * delta;
    enemy.y += enemy.vy * delta;

    enemy.rotation =
      Math.atan2(enemy.vy, enemy.vx);

  }

  /* ---------------------------------------------------------
     OBTENER DISTANCIA
     --------------------------------------------------------- */

  function distanceTo(enemy, target) {

    if (!enemy || !target) {
      return Infinity;
    }

    const dx =
      Number(target.x || 0) -
      Number(enemy.x || 0);

    const dy =
      Number(target.y || 0) -
      Number(enemy.y || 0);

    return Math.sqrt(
      dx * dx + dy * dy
    );
  }

  /* ---------------------------------------------------------
     LISTAS
     --------------------------------------------------------- */

  function getEnemy(id) {
    return ENEMIES[id] || null;
  }

  function getBoss(id) {
    return BOSSES[id] || null;
  }

  function getAllEnemies() {
    return Object.values(ENEMIES);
  }

  function getAllBosses() {
    return Object.values(BOSSES);
  }

  /* ---------------------------------------------------------
     EXPORTAR
     --------------------------------------------------------- */

  window.SCORVEX_ENEMIES = ENEMIES;

  window.SCORVEX_BOSSES = BOSSES;

  window.createScorvexEnemy =
    createEnemy;

  window.createScorvexBoss =
    createBoss;

  window.getScorvexEnemy =
    getEnemy;

  window.getScorvexBoss =
    getBoss;

  window.getScorvexEnemies =
    getAllEnemies;

  window.getScorvexBosses =
    getAllBosses;

  window.damageScorvexEnemy =
    damageEnemy;

  window.healScorvexEnemy =
    healEnemy;

  window.applyScorvexEnemyStatus =
    applyStatus;

  window.scorvexEnemyCanAttack =
    canAttack;

  window.scorvexEnemyAttack =
    registerAttack;

  window.moveScorvexEnemy =
    moveEnemy;

  window.getScorvexEnemyDistance =
    distanceTo;

  window.updateScorvexBossPhase =
    updateBossPhase;

  /* ---------------------------------------------------------
     COMPROBACIÓN
     --------------------------------------------------------- */

  console.log(
    "SCORVEX G7 — Enemigos cargados:",
    Object.keys(ENEMIES).length
  );

  console.log(
    "SCORVEX G7 — Jefes cargados:",
    Object.keys(BOSSES).length
  );

})();
