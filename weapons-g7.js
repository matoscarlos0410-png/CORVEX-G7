/* =========================================================
   SCORVEX G7 — SISTEMA DE 1000 ARMAS
   ========================================================= */

(() => {
  "use strict";

  const TOTAL_WEAPONS = 1000;

  /* =========================
     RAREZAS
  ========================= */

  const RARITIES = [
    {
      id: "common",
      name: "Común",
      minPrice: 5000,
      maxPrice: 15000,
      power: 1.00
    },
    {
      id: "uncommon",
      name: "Poco común",
      minPrice: 15000,
      maxPrice: 50000,
      power: 1.12
    },
    {
      id: "rare",
      name: "Raro",
      minPrice: 50000,
      maxPrice: 150000,
      power: 1.28
    },
    {
      id: "epic",
      name: "Épico",
      minPrice: 150000,
      maxPrice: 500000,
      power: 1.48
    },
    {
      id: "legendary",
      name: "Legendario",
      minPrice: 500000,
      maxPrice: 1500000,
      power: 1.75
    },
    {
      id: "mythic",
      name: "Mítico",
      minPrice: 1500000,
      maxPrice: 5000000,
      power: 2.10
    },
    {
      id: "ancient",
      name: "Ancestral",
      minPrice: 5000000,
      maxPrice: 15000000,
      power: 2.55
    },
    {
      id: "omega",
      name: "Omega",
      minPrice: 15000000,
      maxPrice: 50000000,
      power: 3.10
    }
  ];

  /* =========================
     TIPOS DE ARMAS
  ========================= */

  const TYPES = [
    {
      id: "rifle",
      name: "Rifle",
      damage: 42,
      fireRate: 8,
      range: 85,
      magazine: 30
    },
    {
      id: "smg",
      name: "Subfusil",
      damage: 28,
      fireRate: 14,
      range: 55,
      magazine: 40
    },
    {
      id: "shotgun",
      name: "Escopeta",
      damage: 85,
      fireRate: 3,
      range: 32,
      magazine: 8
    },
    {
      id: "sniper",
      name: "Francotirador",
      damage: 125,
      fireRate: 1,
      range: 100,
      magazine: 5
    },
    {
      id: "pistol",
      name: "Pistola",
      damage: 35,
      fireRate: 7,
      range: 60,
      magazine: 15
    },
    {
      id: "laser",
      name: "Láser",
      damage: 50,
      fireRate: 10,
      range: 90,
      magazine: 25
    },
    {
      id: "plasma",
      name: "Plasma",
      damage: 65,
      fireRate: 7,
      range: 80,
      magazine: 20
    },
    {
      id: "energy",
      name: "Energía",
      damage: 58,
      fireRate: 9,
      range: 88,
      magazine: 28
    },
    {
      id: "arc",
      name: "Arco",
      damage: 105,
      fireRate: 2,
      range: 95,
      magazine: 6
    },
    {
      id: "vortex",
      name: "Vórtice",
      damage: 90,
      fireRate: 4,
      range: 75,
      magazine: 12
    }
  ];

  /* =========================
     NOMBRES
  ========================= */

  const PREFIXES = [
    "Sombra",
    "Titán",
    "Fénix",
    "Cobra",
    "Nébula",
    "Vórtice",
    "Trueno",
    "Dragón",
    "Fantasma",
    "Inferno",
    "Centella",
    "Halcón",
    "León",
    "Raptor",
    "Guardián",
    "Destructor",
    "Cazador",
    "Tormenta",
    "Avalancha",
    "Cometa",
    " Eclipse",
    "Nova",
    "Ares",
    "Atlas",
    "Zeus",
    "Kraken",
    "Lobo",
    "Pantera",
    "Escorpión",
    "Serpiente",
    "Demonio",
    "Coloso",
    "Imperial",
    "Supremo",
    "Radiante",
    "Oscuro",
    "Solar",
    "Lunar",
    "Quantum",
    "Omega"
  ];

  const SUFFIXES = [
    "X",
    "Alpha",
    "Beta",
    "Zero",
    "Prime",
    "Pro",
    "Elite",
    "Max",
    "Ultra",
    "One",
    "Two",
    "V7",
    "V8",
    "V9",
    "G7",
    "G8",
    "MK-I",
    "MK-II",
    "MK-III",
    "EX",
    "RX",
    "ZX",
    "NX",
    "DX",
    "Core",
    "Infinity"
  ];

  /* =========================
     COLORES DE RAREZA
  ========================= */

  const RARITY_COLORS = {
    common: "#9aa4b2",
    uncommon: "#42d66b",
    rare: "#42a5ff",
    epic: "#b45cff",
    legendary: "#ff9f32",
    mythic: "#ff3d81",
    ancient: "#00e5ff",
    omega: "#ffe600"
  };

  /* =========================
     UTILIDADES
  ========================= */

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomRange(min, max) {
    return Math.floor(
      Math.random() * (max - min + 1)
    ) + min;
  }

  function roundPrice(value) {
    if (value < 10000) {
      return Math.round(value / 500) * 500;
    }

    if (value < 100000) {
      return Math.round(value / 1000) * 1000;
    }

    if (value < 1000000) {
      return Math.round(value / 10000) * 10000;
    }

    return Math.round(value / 100000) * 100000;
  }

  function formatMoney(value) {
    return Number(value).toLocaleString("es-PE");
  }

  /* =========================
     ICONO SVG
  ========================= */

  function createWeaponIcon(type, rarity) {
    const color =
      RARITY_COLORS[rarity] || "#ffffff";

    let shape = "";

    switch (type) {

      case "rifle":
        shape = `
          <rect x="12" y="27" width="38" height="10" rx="4"/>
          <rect x="46" y="24" width="16" height="7" rx="2"/>
          <rect x="20" y="37" width="9" height="15" rx="2"/>
          <rect x="5" y="29" width="12" height="5" rx="2"/>
        `;
        break;

      case "smg":
        shape = `
          <rect x="13" y="28" width="40" height="10" rx="4"/>
          <rect x="45" y="24" width="14" height="6" rx="2"/>
          <path d="M24 38 L35 38 L30 52 L22 52 Z"/>
          <rect x="7" y="30" width="10" height="4"/>
        `;
        break;

      case "shotgun":
        shape = `
          <rect x="10" y="28" width="48" height="8" rx="3"/>
          <rect x="49" y="24" width="12" height="5"/>
          <path d="M23 36 L35 36 L31 51 L20 51 Z"/>
          <rect x="6" y="30" width="12" height="4"/>
        `;
        break;

      case "sniper":
        shape = `
          <rect x="8" y="30" width="48" height="7" rx="3"/>
          <rect x="43" y="25" width="20" height="5" rx="2"/>
          <circle cx="37" cy="27" r="6"/>
          <rect x="20" y="37" width="8" height="15"/>
          <rect x="3" y="31" width="12" height="4"/>
        `;
        break;

      case "pistol":
        shape = `
          <rect x="17" y="24" width="35" height="10" rx="3"/>
          <path d="M29 34 L43 34 L37 52 L27 52 Z"/>
          <rect x="50" y="27" width="10" height="5"/>
        `;
        break;

      case "laser":
        shape = `
          <rect x="10" y="29" width="42" height="8" rx="4"/>
          <rect x="47" y="25" width="16" height="5"/>
          <circle cx="56" cy="33" r="7"/>
          <rect x="22" y="37" width="8" height="14"/>
        `;
        break;

      case "plasma":
        shape = `
          <rect x="8" y="27" width="44" height="13" rx="6"/>
          <circle cx="54" cy="33" r="10"/>
          <path d="M24 40 L36 40 L31 54 L21 54 Z"/>
        `;
        break;

      case "energy":
        shape = `
          <path d="M7 33 L20 22 L52 27 L62 33 L52 39 L20 44 Z"/>
          <circle cx="51" cy="33" r="5"/>
          <path d="M27 42 L38 42 L33 55 L24 55 Z"/>
        `;
        break;

      case "arc":
        shape = `
          <path d="M8 45 Q30 8 58 25" fill="none" stroke="${color}" stroke-width="6"/>
          <line x1="17" y1="42" x2="56" y2="26"
                stroke="${color}" stroke-width="2"/>
          <circle cx="13" cy="47" r="4"/>
        `;
        break;

      case "vortex":
        shape = `
          <circle cx="33" cy="33" r="20"
                  fill="none"
                  stroke="${color}"
                  stroke-width="7"/>
          <circle cx="33" cy="33" r="9"
                  fill="none"
                  stroke="${color}"
                  stroke-width="4"/>
          <path d="M33 13 L43 20 L33 24"/>
        `;
        break;
    }

    return `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 68 68"
        width="68"
        height="68"
        aria-hidden="true"
      >

        <defs>
          <filter id="glow-${type}-${rarity}">
            <feGaussianBlur
              stdDeviation="2.5"
              result="blur"
            />
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="34"
          cy="34"
          r="30"
          fill="rgba(10,15,25,.92)"
          stroke="${color}"
          stroke-width="2"
        />

        <g
          fill="${color}"
          stroke="${color}"
          filter="url(#glow-${type}-${rarity})"
        >
          ${shape}
        </g>

      </svg>
    `;
  }

  /* =========================
     RAREZA POR POSICIÓN
  ========================= */

  function getRarityByIndex(index) {

    const percentage =
      index / TOTAL_WEAPONS;

    if (percentage < 0.18) {
      return RARITIES[0];
    }

    if (percentage < 0.34) {
      return RARITIES[1];
    }

    if (percentage < 0.50) {
      return RARITIES[2];
    }

    if (percentage < 0.67) {
      return RARITIES[3];
    }

    if (percentage < 0.81) {
      return RARITIES[4];
    }

    if (percentage < 0.92) {
      return RARITIES[5];
    }

    if (percentage < 0.98) {
      return RARITIES[6];
    }

    return RARITIES[7];
  }

  /* =========================
     CREAR NOMBRE
  ========================= */

  function createWeaponName(index, type) {

    const prefix =
      PREFIXES[
        index % PREFIXES.length
      ].trim();

    const suffix =
      SUFFIXES[
        Math.floor(index / PREFIXES.length)
        % SUFFIXES.length
      ];

    const typeName =
      TYPES.find(t => t.id === type)?.name ||
      "Arma";

    return `${prefix} ${typeName} ${suffix}`;
  }

  /* =========================
     GENERADOR
  ========================= */

  function generate1000Weapons() {

    const result = {};

    for (
      let index = 1;
      index <= TOTAL_WEAPONS;
      index++
    ) {

      const type =
        TYPES[
          (index - 1) % TYPES.length
        ];

      const rarity =
        getRarityByIndex(index - 1);

      const power =
        rarity.power;

      const damage = Math.round(
        type.damage * power
      );

      const fireRate = Number(
        (
          type.fireRate *
          (0.90 + power * 0.08)
        ).toFixed(2)
      );

      const range = Math.round(
        clamp(
          type.range * (0.92 + power * 0.06),
          20,
          120
        )
      );

      const magazine = Math.round(
        type.magazine *
        (0.95 + power * 0.05)
      );

      const accuracy = Math.round(
        clamp(
          58 +
          power * 12 +
          (index % 13),
          55,
          99
        )
      );

      const reload = Number(
        clamp(
          2.8 -
          power * 0.25 -
          (index % 4) * 0.08,
          0.8,
          3
        ).toFixed(2)
      );

      const basePrice =
        rarity.minPrice +
        (
          (
            index * 7919
          ) %
          (
            rarity.maxPrice -
            rarity.minPrice +
            1
          )
        );

      const price =
        roundPrice(
          basePrice
        );

      const id =
        `weapon_${String(index).padStart(4, "0")}`;

      result[id] = {

        id,

        number: index,

        name:
          createWeaponName(
            index,
            type.id
          ),

        type:
          type.id,

        typeName:
          type.name,

        rarity:
          rarity.id,

        rarityName:
          rarity.name,

        rarityColor:
          RARITY_COLORS[
            rarity.id
          ],

        price,

        currency:
          "coins",

        icon:
          createWeaponIcon(
            type.id,
            rarity.id
          ),

        stats: {

          damage,

          fireRate,

          range,

          magazine,

          accuracy,

          reload,

          power:
            Number(power.toFixed(2))

        },

        description:
          `${rarity.name} ${type.name} de la colección SCORVEX G7.`,

        unlockLevel:
          Math.max(
            1,
            Math.floor(
              index / 18
            )
          ),

        exclusive:
          rarity.id === "omega" ||
          rarity.id === "ancient",

        skinSlots:
          rarity.id === "common"
            ? 1
            : rarity.id === "uncommon"
              ? 2
              : rarity.id === "rare"
                ? 3
                : 4,

        tags: [
          rarity.id,
          type.id,
          `g7-${index}`
        ]

      };
    }

    return result;
  }

  /* =========================
     CREAR LAS 1000 ARMAS
  ========================= */

  const weapons =
    generate1000Weapons();

  /* =========================
     COMPROBACIÓN
  ========================= */

  console.assert(
    Object.keys(weapons).length === 1000,
    "SCORVEX G7: deben existir exactamente 1000 armas."
  );

  console.assert(
    weapons.weapon_0001,
    "SCORVEX G7: falta weapon_0001."
  );

  console.assert(
    weapons.weapon_1000,
    "SCORVEX G7: falta weapon_1000."
  );

  /* =========================
     ARMAS INICIALES
  ========================= */

  const starterWeapon =
    weapons.weapon_0001;

  /* =========================
     FUNCIONES PÚBLICAS
  ========================= */

  window.SCORVEX_WEAPONS =
    weapons;

  window.SCORVEX_STARTER_WEAPON =
    starterWeapon;

  window.getScorvexWeapon =
    function(id) {
      return weapons[id] || null;
    };

  window.getScorvexWeaponsByRarity =
    function(rarity) {

      return Object.values(
        weapons
      ).filter(
        weapon =>
          weapon.rarity === rarity
      );
    };

  window.getScorvexWeaponsByType =
    function(type) {

      return Object.values(
        weapons
      ).filter(
        weapon =>
          weapon.type === type
      );
    };

  window.getScorvexExpensiveWeapons =
    function(minPrice = 1000000) {

      return Object.values(
        weapons
      ).filter(
        weapon =>
          weapon.price >= minPrice
      );
    };

  window.formatScorvexMoney =
    formatMoney;

  /* =========================
     INFORMACIÓN EN CONSOLA
  ========================= */

  console.log(
    "======================================"
  );

  console.log(
    "       SCORVEX G7 — ARMAS"
  );

  console.log(
    "======================================"
  );

  console.log(
    `Armas creadas: ${Object.keys(weapons).length}`
  );

  console.log(
    "Arma inicial:",
    starterWeapon.name
  );

  console.log(
    "Precio inicial:",
    formatMoney(
      starterWeapon.price
    )
  );

  console.log(
    "======================================"
  );

})();
