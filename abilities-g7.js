/* =========================================================
   SCORVEX G7 — 90 HABILIDADES ESPECIALES
   ========================================================= */

(() => {
  "use strict";

  const TOTAL_ABILITIES = 90;

  const rarities = [
    {
      id: "common",
      name: "Común",
      multiplier: 1.00,
      priceMin: 2500,
      priceMax: 10000
    },
    {
      id: "rare",
      name: "Raro",
      multiplier: 1.20,
      priceMin: 10000,
      priceMax: 50000
    },
    {
      id: "epic",
      name: "Épico",
      multiplier: 1.50,
      priceMin: 50000,
      priceMax: 200000
    },
    {
      id: "legendary",
      name: "Legendario",
      multiplier: 2.00,
      priceMin: 200000,
      priceMax: 1000000
    },
    {
      id: "mythic",
      name: "Mítico",
      multiplier: 2.60,
      priceMin: 1000000,
      priceMax: 5000000
    }
  ];

  const abilityTypes = [
    {
      id: "shield",
      name: "Escudo",
      description: "Reduce el daño recibido."
    },
    {
      id: "speed",
      name: "Velocidad",
      description: "Aumenta temporalmente la velocidad."
    },
    {
      id: "heal",
      name: "Regeneración",
      description: "Recupera puntos de vida."
    },
    {
      id: "damage",
      name: "Furia",
      description: "Aumenta el daño de las armas."
    },
    {
      id: "critical",
      name: "Impacto crítico",
      description: "Aumenta la posibilidad de golpes críticos."
    },
    {
      id: "energy",
      name: "Energía",
      description: "Recupera energía rápidamente."
    },
    {
      id: "stealth",
      name: "Camuflaje",
      description: "Reduce la detección durante unos segundos."
    },
    {
      id: "dash",
      name: "Impulso",
      description: "Permite realizar un desplazamiento rápido."
    },
    {
      id: "magnet",
      name: "Imán",
      description: "Atrae objetos y recompensas cercanas."
    }
  ];

  const prefixes = [
    "Solar",
    "Lunar",
    "Neon",
    "Omega",
    "Titan",
    "Phantom",
    "Cyber",
    "Infernal",
    "Quantum",
    "Void"
  ];

  const suffixes = [
    "I",
    "II",
    "III",
    "IV",
    "V",
    "X",
    "Prime",
    "Ultra",
    "Max"
  ];

  const abilities = {};

  function formatMoney(value) {
    return Number(value).toLocaleString("es-PE");
  }

  function createAbility(index) {
    const type =
      abilityTypes[index % abilityTypes.length];

    const rarity =
      rarities[
        Math.floor(index / 18) %
          rarities.length
      ];

    const prefix =
      prefixes[
        Math.floor(index / abilityTypes.length) %
          prefixes.length
      ];

    const suffix =
      suffixes[index % suffixes.length];

    const level =
      Math.floor(index / 10) + 1;

    const power = Math.round(
      (10 + index * 1.8) *
        rarity.multiplier
    );

    const cooldown = Math.max(
      2,
      Math.round(
        12 -
          rarity.multiplier * 2 -
          (index % 5) * 0.4
      )
    );

    const energy = Math.max(
      10,
      Math.round(
        35 -
          rarity.multiplier * 4 +
          (index % 7)
      )
    );

    const price = Math.round(
      rarity.priceMin +
        (rarity.priceMax -
          rarity.priceMin) *
          ((index % 18) / 17)
    );

    return {
      id:
        "ability_" +
        String(index + 1).padStart(3, "0"),

      name:
        `${prefix} ${type.name} ${suffix}`,

      type: type.id,

      rarity: rarity.id,

      rarityLabel: rarity.name,

      description: type.description,

      level,

      power,

      cooldown,

      energy,

      price,

      unlockedAt: Math.max(
        1,
        Math.ceil(level / 2)
      ),

      icon: createIcon(type.id, rarity.id),

      tags: [
        type.id,
        rarity.id,
        "special"
      ]
    };
  }

  function createIcon(type, rarity) {
    const symbols = {
      shield: "◇",
      speed: "➤",
      heal: "+",
      damage: "✦",
      critical: "◆",
      energy: "⚡",
      stealth: "◈",
      dash: "➜",
      magnet: "⌁"
    };

    const symbol =
      symbols[type] || "★";

    return `
      <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="${type}"
      >
        <circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          stroke-width="5"
        />

        <circle
          cx="50"
          cy="50"
          r="34"
          fill="currentColor"
          opacity=".12"
        />

        <text
          x="50"
          y="62"
          text-anchor="middle"
          font-size="38"
          font-family="Arial"
          fill="currentColor"
        >
          ${symbol}
        </text>
      </svg>
    `;
  }

  for (
    let i = 0;
    i < TOTAL_ABILITIES;
    i++
  ) {
    const ability = createAbility(i);

    abilities[ability.id] = ability;
  }

  function getAbility(id) {
    return abilities[id] || null;
  }

  function getAbilitiesByRarity(rarity) {
    return Object.values(abilities).filter(
      ability =>
        ability.rarity === rarity
    );
  }

  function getAbilitiesByType(type) {
    return Object.values(abilities).filter(
      ability =>
        ability.type === type
    );
  }

  function getExpensiveAbilities(
    minimum = 1000000
  ) {
    return Object.values(abilities).filter(
      ability =>
        ability.price >= minimum
    );
  }

  function useAbility(
    id,
    player
  ) {
    const ability =
      getAbility(id);

    if (!ability || !player) {
      return false;
    }

    if (
      Number(player.energy || 0) <
      ability.energy
    ) {
      return false;
    }

    player.energy -=
      ability.energy;

    switch (ability.type) {
      case "shield":
        player.shield =
          Math.max(
            Number(player.shield || 0),
            ability.power
          );
        break;

      case "speed":
        player.speedBoost =
          ability.power;
        break;

      case "heal":
        player.hp = Math.min(
          Number(player.maxHp || 100),
          Number(player.hp || 0) +
            ability.power
        );
        break;

      case "damage":
        player.damageBoost =
          ability.power;
        break;

      case "critical":
        player.criticalBoost =
          ability.power;
        break;

      case "energy":
        player.energy = Math.min(
          100,
          Number(player.energy || 0) +
            ability.power
        );
        break;

      case "stealth":
        player.stealth = true;
        break;

      case "dash":
        player.dashPower =
          ability.power;
        break;

      case "magnet":
        player.magnetPower =
          ability.power;
        break;
    }

    return true;
  }

  window.SCORVEX_ABILITIES =
    abilities;

  window.SCORVEX_ABILITY_LIST =
    Object.values(abilities);

  window.SCORVEX_ABILITY_TYPES =
    abilityTypes;

  window.getScorvexAbility =
    getAbility;

  window.getScorvexAbilitiesByRarity =
    getAbilitiesByRarity;

  window.getScorvexAbilitiesByType =
    getAbilitiesByType;

  window.getScorvexExpensiveAbilities =
    getExpensiveAbilities;

  window.useScorvexAbility =
    useAbility;

  window.formatScorvexAbilityMoney =
    formatMoney;

  console.assert(
    Object.keys(abilities).length === 90,
    "SCORVEX G7: deben existir exactamente 90 habilidades."
  );

  console.log(
    `SCORVEX G7: ${Object.keys(abilities).length} habilidades cargadas.`
  );

})();
