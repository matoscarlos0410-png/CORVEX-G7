/* =========================================================
   SCORVEX G7 — WEAPONS SYSTEM
   1000 armas
   8 rarezas
   10 tipos
   Solo moneda virtual del juego
   ========================================================= */

(() => {
  "use strict";

  const RARITIES = [
    {
      id: "common",
      name: "Común",
      minPrice: 5000,
      maxPrice: 15000,
      power: 1.00,
      color: "#b8c0cc"
    },
    {
      id: "uncommon",
      name: "Poco común",
      minPrice: 15000,
      maxPrice: 50000,
      power: 1.12,
      color: "#4ade80"
    },
    {
      id: "rare",
      name: "Raro",
      minPrice: 50000,
      maxPrice: 150000,
      power: 1.28,
      color: "#60a5fa"
    },
    {
      id: "epic",
      name: "Épico",
      minPrice: 150000,
      maxPrice: 500000,
      power: 1.48,
      color: "#c084fc"
    },
    {
      id: "legendary",
      name: "Legendario",
      minPrice: 500000,
      maxPrice: 1500000,
      power: 1.75,
      color: "#facc15"
    },
    {
      id: "mythic",
      name: "Mítico",
      minPrice: 1500000,
      maxPrice: 5000000,
      power: 2.10,
      color: "#fb7185"
    },
    {
      id: "ancient",
      name: "Ancestral",
      minPrice: 5000000,
      maxPrice: 15000000,
      power: 2.55,
      color: "#f97316"
    },
    {
      id: "omega",
      name: "Omega",
      minPrice: 15000000,
      maxPrice: 50000000,
      power: 3.10,
      color: "#22d3ee"
    }
  ];

  const TYPES = [
    {
      id: "rifle",
      name: "Rifle",
      damage: 34,
      fireRate: 8,
      range: 85,
      magazine: 30,
      accuracy: 82,
      reload: 2.1
    },
    {
      id: "smg",
      name: "SMG",
      damage: 24,
      fireRate: 14,
      range: 55,
      magazine: 36,
      accuracy: 74,
      reload: 1.7
    },
    {
      id: "shotgun",
      name: "Escopeta",
      damage: 72,
      fireRate: 2.4,
      range: 35,
      magazine: 8,
      accuracy: 58,
      reload: 2.5
    },
    {
      id: "sniper",
      name: "Francotirador",
      damage: 105,
      fireRate: 1.2,
      range: 100,
      magazine: 5,
      accuracy: 96,
      reload: 2.8
    },
    {
      id: "pistol",
      name: "Pistola",
      damage: 27,
      fireRate: 7,
      range: 60,
      magazine: 15,
      accuracy: 80,
      reload: 1.5
    },
    {
      id: "laser",
      name: "Láser",
      damage: 31,
      fireRate: 11,
      range: 90,
      magazine: 28,
      accuracy: 94,
      reload: 2.0
    },
    {
      id: "plasma",
      name: "Plasma",
      damage: 43,
      fireRate: 7,
      range: 82,
      magazine: 24,
      accuracy: 88,
      reload: 2.2
    },
    {
      id: "energy",
      name: "Energía",
      damage: 38,
      fireRate: 10,
      range: 78,
      magazine: 32,
      accuracy: 90,
      reload: 1.9
    },
    {
      id: "arc",
      name: "Arco",
      damage: 61,
      fireRate: 3.2,
      range: 92,
      magazine: 12,
      accuracy: 91,
      reload: 2.4
    },
    {
      id: "vortex",
      name: "Vórtice",
      damage: 52,
      fireRate: 5.5,
      range: 88,
      magazine: 18,
      accuracy: 86,
      reload: 2.3
    }
  ];

  const PREFIXES = [
    "Nova",
    "Titan",
    "Shadow",
    "Phantom",
    "Inferno",
    "Frost",
    "Storm",
    "Viper",
    "Raptor",
    "Spectral",
    "Quantum",
    "Solar",
    "Lunar",
    "Void",
    "Apex",
    "Omega",
    "Cyber",
    "Thunder",
    "Venom",
    "Crimson",
    "Neon",
    "Obsidian",
    "Eclipse",
    "Galaxy",
    "Pulse",
    "Hyper",
    "Atomic",
    "Vector",
    "Zero",
    "Delta",
    "Alpha",
    "Sigma",
    "Phantom-X",
    "Titan-X",
    "Nightfall",
    "Starfall",
    "Darkstar",
    "Iron",
    "Royal",
    "Ultimate"
  ];

  const SUFFIXES = [
    "X",
    "Prime",
    "Mk-II",
    "Mk-III",
    "Elite",
    "Ultra",
    "Pro",
    "Max",
    "EX",
    "Zero",
    "Core",
    "Edge",
    "Force",
    "Burst",
    "Strike",
    "Hunter",
    "Breaker",
    "Reaper",
    "Rage",
    "Guardian",
    "Destroyer",
    "Sentinel",
    "Overdrive",
    "Infinity",
    "Genesis"
  ];

  /*
   * Icono SVG interno.
   * No utiliza imágenes externas.
   */
  function createWeaponIcon(type, rarityColor) {
    const color = rarityColor || "#60a5fa";

    const shapes = {
      rifle: `
        <path d="M12 30h72"/>
        <path d="M26 24h30l12 6h20v8H62l-12 6H34v-8H20z"/>
        <path d="M42 44l-7 14h14l7-14"/>
        <path d="M72 30v-9"/>
      `,

      smg: `
        <path d="M14 31h58l13 7-13 7H45l-8 10H25l5-10H14z"/>
        <path d="M49 45l-5 17h12l5-17"/>
        <path d="M70 31v-9"/>
      `,

      shotgun: `
        <path d="M10 28h72v11H45l-11 7H22l6-7H10z"/>
        <path d="M38 39l-4 20h13l5-20"/>
        <path d="M74 28v-10"/>
      `,

      sniper: `
        <path d="M10 31h70l10 6-10 6H52l-12 7H25l5-7H10z"/>
        <path d="M47 43l-6 17h13l5-17"/>
        <circle cx="60" cy="25" r="6"/>
        <path d="M66 25h16"/>
      `,

      pistol: `
        <path d="M18 29h57l10 7-10 7H49l-7 8H28l5-8H18z"/>
        <path d="M45 43l-4 18h13l5-18"/>
      `,

      laser: `
        <path d="M12 34h58l18-8"/>
        <path d="M12 34l18-8h40"/>
        <path d="M45 34l-7 25h14l6-25"/>
        <circle cx="82" cy="25" r="5"/>
      `,

      plasma: `
        <path d="M10 32h62l15 7-15 7H46l-8 10H25l6-10H10z"/>
        <circle cx="66" cy="39" r="8"/>
        <path d="M47 46l-5 15h13l5-15"/>
      `,

      energy: `
        <path d="M10 34h62l16 6-16 6H46l-8 10H25l6-10H10z"/>
        <path d="M62 26l-7 12h10l-7 14"/>
        <path d="M48 46l-5 15h12l5-15"/>
      `,

      arc: `
        <path d="M14 34h62l10 6-10 6H48l-9 10H26l6-10H14z"/>
        <path d="M60 22c8 5 8 14 0 19"/>
        <path d="M70 18c13 8 13 23 0 31"/>
      `,

      vortex: `
        <path d="M12 34h62l12 6-12 6H47l-8 11H25l6-11H12z"/>
        <circle cx="66" cy="40" r="12"/>
        <circle cx="66" cy="40" r="5"/>
        <path d="M48 46l-5 15h12l5-15"/>
      `
    };

    return `
      <svg
        viewBox="0 0 100 80"
        width="70"
        height="56"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g
          fill="none"
          stroke="${color}"
          stroke-width="4"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          ${shapes[type] || shapes.rifle}
        </g>
      </svg>
    `;
  }

  function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function rarityForIndex(index) {
    const block = Math.floor(index / 125);
    return RARITIES[Math.min(block, RARITIES.length - 1)];
  }

  function typeForIndex(index) {
    return TYPES[index % TYPES.length];
  }

  function createWeapon(index) {
    const rarity = rarityForIndex(index);
    const type = typeForIndex(index);

    const prefix =
      PREFIXES[index % PREFIXES.length];

    const suffix =
      SUFFIXES[Math.floor(index / PREFIXES.length) % SUFFIXES.length];

    const number =
      String(index + 1).padStart(4, "0");

    const price =
      randomBetween(rarity.minPrice, rarity.maxPrice);

    const powerMultiplier = rarity.power;

    const damage = Math.round(
      type.damage * powerMultiplier
    );

    const fireRate = Number(
      (type.fireRate * (1 + (powerMultiplier - 1) * 0.15))
      .toFixed(2)
    );

    const range = Math.min(
      100,
      Math.round(type.range * (1 + (powerMultiplier - 1) * 0.08))
    );

    const magazine = Math.round(
      type.magazine * (1 + (powerMultiplier - 1) * 0.12)
    );

    const accuracy = Math.min(
      100,
      Math.round(type.accuracy + (powerMultiplier - 1) * 8)
    );

    const reload = Number(
      Math.max(
        0.9,
        type.reload / (1 + (powerMultiplier - 1) * 0.12)
      ).toFixed(2)
    );

    const unlockLevel = Math.min(
      100,
      Math.max(
        1,
        Math.floor((index + 1) / 10)
      )
    );

    const exclusive =
      rarity.id === "omega" ||
      rarity.id === "ancient";

    return {
      id: `weapon_${number}`,

      name: `${prefix} ${type.name} ${suffix}`,

      icon: createWeaponIcon(
        type.id,
        rarity.color
      ),

      price,

      damage,

      fireRate,

      range,

      magazine,

      accuracy,

      reload,

      power: Number(
        powerMultiplier.toFixed(2)
      ),

      type: type.id,

      typeName: type.name,

      rarity: rarity.id,

      rarityName: rarity.name,

      rarityColor: rarity.color,

      unlockLevel,

      exclusive,

      skinSlots:
        rarity.id === "common"
          ? 1
          : rarity.id === "uncommon"
            ? 2
            : rarity.id === "rare"
              ? 2
              : rarity.id === "epic"
                ? 3
                : 4,

      tags: [
        rarity.name,
        type.name,
        exclusive
          ? "Exclusiva"
          : "Estándar"
      ]
    };
  }

  /*
   * Generamos exactamente 1000 armas.
   */
  const SCORVEX_WEAPONS = {};

  for (let i = 0; i < 1000; i++) {
    const weapon = createWeapon(i);

    SCORVEX_WEAPONS[weapon.id] = weapon;
  }

  /*
   * Arma inicial.
   */
  const SCORVEX_STARTER_WEAPON =
    "weapon_0001";

  /*
   * Buscar arma por ID.
   */
  function getScorvexWeapon(id) {
    return SCORVEX_WEAPONS[id] || null;
  }

  /*
   * Filtrar por rareza.
   */
  function getScorvexWeaponsByRarity(rarity) {
    return Object.values(SCORVEX_WEAPONS)
      .filter(
        weapon => weapon.rarity === rarity
      );
  }

  /*
   * Filtrar por tipo.
   */
  function getScorvexWeaponsByType(type) {
    return Object.values(SCORVEX_WEAPONS)
      .filter(
        weapon => weapon.type === type
      );
  }

  /*
   * Obtener armas muy caras.
   */
  function getScorvexExpensiveWeapons(
    minimumPrice = 1000000
  ) {
    return Object.values(SCORVEX_WEAPONS)
      .filter(
        weapon => weapon.price >= minimumPrice
      )
      .sort(
        (a, b) => b.price - a.price
      );
  }

  /*
   * Formato de monedas virtuales.
   */
  function formatScorvexMoney(value) {
    const amount = Number(value) || 0;

    return amount.toLocaleString(
      "es-PE"
    );
  }

  /*
   * Estadísticas generales.
   */
  const SCORVEX_WEAPON_STATS = {
    total: Object.keys(SCORVEX_WEAPONS).length,

    rarities: RARITIES.map(
      rarity => rarity.id
    ),

    types: TYPES.map(
      type => type.id
    ),

    highestPrice: Math.max(
      ...Object.values(SCORVEX_WEAPONS)
        .map(weapon => weapon.price)
    ),

    highestDamage: Math.max(
      ...Object.values(SCORVEX_WEAPONS)
        .map(weapon => weapon.damage)
    )
  };

  /*
   * Exponer al juego.
   */
  window.SCORVEX_WEAPONS =
    SCORVEX_WEAPONS;

  window.SCORVEX_STARTER_WEAPON =
    SCORVEX_STARTER_WEAPON;

  window.SCORVEX_WEAPON_STATS =
    SCORVEX_WEAPON_STATS;

  window.SCORVEX_WEAPON_RARITIES =
    RARITIES;

  window.SCORVEX_WEAPON_TYPES =
    TYPES;

  window.getScorvexWeapon =
    getScorvexWeapon;

  window.getScorvexWeaponsByRarity =
    getScorvexWeaponsByRarity;

  window.getScorvexWeaponsByType =
    getScorvexWeaponsByType;

  window.getScorvexExpensiveWeapons =
    getScorvexExpensiveWeapons;

  window.formatScorvexMoney =
    formatScorvexMoney;

  /*
   * Comprobación.
   */
  console.log(
    `SCORVEX G7: ${Object.keys(SCORVEX_WEAPONS).length} armas cargadas.`
  );

  if (
    Object.keys(SCORVEX_WEAPONS).length !== 1000
  ) {
    console.error(
      "ERROR: SCORVEX G7 no tiene exactamente 1000 armas."
    );
  }

})();
