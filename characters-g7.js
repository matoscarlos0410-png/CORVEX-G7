/* =========================================================
   SCORVEX G7 — CHARACTER CUSTOMIZATION
   Personajes, trajes, cascos, accesorios y efectos
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     CATEGORÍAS
     ======================================================= */

  const CATEGORIES = {
    characters: "Personajes",
    outfits: "Trajes",
    helmets: "Cascos",
    accessories: "Accesorios",
    effects: "Efectos",
    colors: "Colores"
  };

  /* =======================================================
     PERSONAJES
     ======================================================= */

  const characters = [
    {
      id: "scorvex",
      name: "SCORVEX",
      description: "Operador principal de la unidad SCORVEX.",
      rarity: "legendary",
      color: "#facc15",
      bonus: {
        health: 10,
        energy: 5,
        speed: 2
      },
      price: 0,
      starter: true
    },

    {
      id: "vanguard",
      name: "Vanguard",
      description: "Especialista en combate defensivo.",
      rarity: "rare",
      color: "#60a5fa",
      bonus: {
        health: 15,
        energy: 0,
        speed: 0
      },
      price: 75000
    },

    {
      id: "phantom",
      name: "Phantom",
      description: "Operador especializado en movilidad.",
      rarity: "epic",
      color: "#c084fc",
      bonus: {
        health: 0,
        energy: 10,
        speed: 8
      },
      price: 150000
    },

    {
      id: "titan",
      name: "Titan",
      description: "Especialista de resistencia.",
      rarity: "legendary",
      color: "#facc15",
      bonus: {
        health: 30,
        energy: -5,
        speed: -2
      },
      price: 500000
    },

    {
      id: "specter",
      name: "Specter",
      description: "Operador avanzado de tecnología energética.",
      rarity: "mythic",
      color: "#fb7185",
      bonus: {
        health: 12,
        energy: 18,
        speed: 5
      },
      price: 1500000
    },

    {
      id: "omega",
      name: "Omega",
      description: "Unidad experimental de máximo nivel.",
      rarity: "omega",
      color: "#22d3ee",
      bonus: {
        health: 25,
        energy: 25,
        speed: 10
      },
      price: 10000000
    }
  ];

  /* =======================================================
     TRAJES
     ======================================================= */

  const outfits = [
    {
      id: "outfit_default",
      name: "Operador estándar",
      rarity: "common",
      color: "#9ca3af",
      price: 0
    },

    {
      id: "outfit_tactical",
      name: "Táctico",
      rarity: "uncommon",
      color: "#4ade80",
      price: 25000
    },

    {
      id: "outfit_shadow",
      name: "Shadow",
      rarity: "rare",
      color: "#60a5fa",
      price: 75000
    },

    {
      id: "outfit_phantom",
      name: "Phantom",
      rarity: "epic",
      color: "#c084fc",
      price: 150000
    },

    {
      id: "outfit_inferno",
      name: "Inferno",
      rarity: "legendary",
      color: "#f97316",
      price: 500000
    },

    {
      id: "outfit_cosmic",
      name: "Cosmic",
      rarity: "mythic",
      color: "#fb7185",
      price: 1500000
    },

    {
      id: "outfit_ancient",
      name: "Ancient",
      rarity: "ancient",
      color: "#f97316",
      price: 5000000
    },

    {
      id: "outfit_omega",
      name: "Omega Armor",
      rarity: "omega",
      color: "#22d3ee",
      price: 15000000
    }
  ];

  /* =======================================================
     CASCOS
     ======================================================= */

  const helmets = [
    {
      id: "helmet_none",
      name: "Sin casco",
      rarity: "common",
      color: "#9ca3af",
      price: 0,
      armor: 0
    },

    {
      id: "helmet_light",
      name: "Casco ligero",
      rarity: "common",
      color: "#b8c0cc",
      price: 10000,
      armor: 5
    },

    {
      id: "helmet_tactical",
      name: "Casco táctico",
      rarity: "uncommon",
      color: "#4ade80",
      price: 35000,
      armor: 10
    },

    {
      id: "helmet_recon",
      name: "Casco Recon",
      rarity: "rare",
      color: "#60a5fa",
      price: 80000,
      armor: 15
    },

    {
      id: "helmet_shadow",
      name: "Casco Shadow",
      rarity: "epic",
      color: "#c084fc",
      price: 200000,
      armor: 22
    },

    {
      id: "helmet_legend",
      name: "Casco Legend",
      rarity: "legendary",
      color: "#facc15",
      price: 750000,
      armor: 30
    },

    {
      id: "helmet_omega",
      name: "Casco Omega",
      rarity: "omega",
      color: "#22d3ee",
      price: 12000000,
      armor: 50
    }
  ];

  /* =======================================================
     ACCESORIOS
     ======================================================= */

  const accessories = [
    {
      id: "accessory_none",
      name: "Ninguno",
      rarity: "common",
      price: 0
    },

    {
      id: "accessory_radio",
      name: "Radio táctica",
      rarity: "common",
      price: 5000
    },

    {
      id: "accessory_scanner",
      name: "Escáner",
      rarity: "uncommon",
      price: 25000
    },

    {
      id: "accessory_drone",
      name: "Mini dron",
      rarity: "rare",
      price: 100000
    },

    {
      id: "accessory_energy",
      name: "Núcleo energético",
      rarity: "epic",
      price: 250000
    },

    {
      id: "accessory_hologram",
      name: "Holograma",
      rarity: "legendary",
      price: 750000
    },

    {
      id: "accessory_quantum",
      name: "Núcleo cuántico",
      rarity: "mythic",
      price: 2500000
    },

    {
      id: "accessory_omega_core",
      name: "Núcleo Omega",
      rarity: "omega",
      price: 20000000
    }
  ];

  /* =======================================================
     EFECTOS
     ======================================================= */

  const effects = [
    {
      id: "effect_none",
      name: "Sin efecto",
      rarity: "common",
      price: 0
    },

    {
      id: "effect_blue",
      name: "Energía azul",
      rarity: "uncommon",
      color: "#60a5fa",
      price: 15000
    },

    {
      id: "effect_green",
      name: "Pulso verde",
      rarity: "rare",
      color: "#4ade80",
      price: 50000
    },

    {
      id: "effect_purple",
      name: "Energía púrpura",
      rarity: "epic",
      color: "#c084fc",
      price: 125000
    },

    {
      id: "effect_fire",
      name: "Aura de fuego",
      rarity: "legendary",
      color: "#f97316",
      price: 500000
    },

    {
      id: "effect_cosmic",
      name: "Aura cósmica",
      rarity: "mythic",
      color: "#fb7185",
      price: 2000000
    },

    {
      id: "effect_ancient",
      name: "Energía ancestral",
      rarity: "ancient",
      color: "#f97316",
      price: 7500000
    },

    {
      id: "effect_omega",
      name: "Aura Omega",
      rarity: "omega",
      color: "#22d3ee",
      price: 25000000
    }
  ];

  /* =======================================================
     COLORES DEL PERSONAJE
     ======================================================= */

  const colors = [
    {
      id: "color_default",
      name: "Predeterminado",
      value: "#64748b",
      price: 0
    },

    {
      id: "color_red",
      name: "Rojo",
      value: "#ef4444",
      price: 5000
    },

    {
      id: "color_blue",
      name: "Azul",
      value: "#3b82f6",
      price: 5000
    },

    {
      id: "color_green",
      name: "Verde",
      value: "#22c55e",
      price: 5000
    },

    {
      id: "color_purple",
      name: "Púrpura",
      value: "#a855f7",
      price: 10000
    },

    {
      id: "color_gold",
      name: "Dorado",
      value: "#eab308",
      price: 25000
    },

    {
      id: "color_cyan",
      name: "Cian",
      value: "#06b6d4",
      price: 50000
    },

    {
      id: "color_omega",
      name: "Omega",
      value: "#22d3ee",
      price: 250000
    }
  ];

  /* =======================================================
     OBJETO GENERAL
     ======================================================= */

  const SCORVEX_CHARACTERS = {
    characters,
    outfits,
    helmets,
    accessories,
    effects,
    colors
  };

  /* =======================================================
     BUSCAR ELEMENTO
     ======================================================= */

  function getScorvexCharacterItem(
    category,
    id
  ) {
    if (
      !SCORVEX_CHARACTERS[category]
    ) {
      return null;
    }

    return SCORVEX_CHARACTERS[category]
      .find(item => item.id === id) || null;
  }

  /* =======================================================
     FILTRAR POR RAREZA
     ======================================================= */

  function getScorvexCharacterItemsByRarity(
    category,
    rarity
  ) {
    if (
      !SCORVEX_CHARACTERS[category]
    ) {
      return [];
    }

    return SCORVEX_CHARACTERS[category]
      .filter(
        item => item.rarity === rarity
      );
  }

  /* =======================================================
     PRECIO
     ======================================================= */

  function getScorvexCharacterPrice(
    category,
    id
  ) {
    const item =
      getScorvexCharacterItem(
        category,
        id
      );

    return item
      ? Number(item.price) || 0
      : 0;
  }

  /* =======================================================
     CONFIGURACIÓN PREDETERMINADA
     ======================================================= */

  const SCORVEX_DEFAULT_CUSTOMIZATION = {
    character: "scorvex",
    outfit: "outfit_default",
    helmet: "helmet_none",
    accessory: "accessory_none",
    effect: "effect_none",
    color: "color_default"
  };

  /* =======================================================
     INVENTARIO INICIAL
     ======================================================= */

  const SCORVEX_STARTER_CUSTOMIZATION = {
    characters: [
      "scorvex"
    ],

    outfits: [
      "outfit_default"
    ],

    helmets: [
      "helmet_none"
    ],

    accessories: [
      "accessory_none"
    ],

    effects: [
      "effect_none"
    ],

    colors: [
      "color_default"
    ]
  };

  /* =======================================================
     CALCULAR BONIFICACIONES
     ======================================================= */

  function getScorvexCharacterBonuses(
    customization
  ) {
    const result = {
      health: 0,
      energy: 0,
      speed: 0,
      armor: 0
    };

    if (!customization) {
      return result;
    }

    const character =
      getScorvexCharacterItem(
        "characters",
        customization.character
      );

    if (character && character.bonus) {
      result.health +=
        character.bonus.health || 0;

      result.energy +=
        character.bonus.energy || 0;

      result.speed +=
        character.bonus.speed || 0;
    }

    const helmet =
      getScorvexCharacterItem(
        "helmets",
        customization.helmet
      );

    if (helmet) {
      result.armor +=
        helmet.armor || 0;
    }

    return result;
  }

  /* =======================================================
     EXPONER SISTEMA
     ======================================================= */

  window.SCORVEX_CHARACTERS =
    SCORVEX_CHARACTERS;

  window.SCORVEX_CHARACTER_CATEGORIES =
    CATEGORIES;

  window.SCORVEX_DEFAULT_CUSTOMIZATION =
    SCORVEX_DEFAULT_CUSTOMIZATION;

  window.SCORVEX_STARTER_CUSTOMIZATION =
    SCORVEX_STARTER_CUSTOMIZATION;

  window.getScorvexCharacterItem =
    getScorvexCharacterItem;

  window.getScorvexCharacterItemsByRarity =
    getScorvexCharacterItemsByRarity;

  window.getScorvexCharacterPrice =
    getScorvexCharacterPrice;

  window.getScorvexCharacterBonuses =
    getScorvexCharacterBonuses;

  /* =======================================================
     COMPROBACIÓN
     ======================================================= */

  const totalItems =
    Object.values(SCORVEX_CHARACTERS)
      .reduce(
        (total, list) =>
          total + list.length,
        0
      );

  console.log(
    `SCORVEX G7: ${totalItems} elementos de personalización cargados.`
  );

})();
