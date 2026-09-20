/* =========================================================
   SCORVEX G7 — 90 HABILIDADES
   ========================================================= */

(() => {
  "use strict";

  const RARITIES = [
    {
      id: "common",
      name: "Común",
      color: "#b8c0cc",
      multiplier: 1
    },
    {
      id: "uncommon",
      name: "Poco común",
      color: "#4ade80",
      multiplier: 1.12
    },
    {
      id: "rare",
      name: "Raro",
      color: "#60a5fa",
      multiplier: 1.28
    },
    {
      id: "epic",
      name: "Épico",
      color: "#c084fc",
      multiplier: 1.48
    },
    {
      id: "legendary",
      name: "Legendario",
      color: "#facc15",
      multiplier: 1.75
    },
    {
      id: "mythic",
      name: "Mítico",
      color: "#fb7185",
      multiplier: 2.10
    },
    {
      id: "ancient",
      name: "Ancestral",
      color: "#f97316",
      multiplier: 2.55
    },
    {
      id: "omega",
      name: "Omega",
      color: "#22d3ee",
      multiplier: 3.10
    }
  ];

  const TYPES = [
    "ataque",
    "defensa",
    "movilidad",
    "control",
    "energia",
    "super"
  ];

  /*
   * Las 10 habilidades originales.
   * Se conservan sus IDs para mantener
   * compatibilidad con versiones anteriores.
   */

  const abilities = {

    nova: {
      id: "nova",
      name: "Nova",
      description: "Libera una explosión de energía alrededor del jugador.",
      type: "ataque",
      rarity: "rare",
      rarityName: "Raro",
      rarityColor: "#60a5fa",
      energy: 25,
      cooldown: 8,
      damage: 75,
      duration: 1,
      range: 150
    },

    dash: {
      id: "dash",
      name: "Dash",
      description: "Realiza un desplazamiento rápido hacia adelante.",
      type: "movilidad",
      rarity: "common",
      rarityName: "Común",
      rarityColor: "#b8c0cc",
      energy: 15,
      cooldown: 5,
      damage: 15,
      duration: 0.5,
      range: 180
    },

    freeze: {
      id: "freeze",
      name: "Freeze",
      description: "Reduce temporalmente la velocidad de los enemigos.",
      type: "control",
      rarity: "epic",
      rarityName: "Épico",
      rarityColor: "#c084fc",
      energy: 30,
      cooldown: 12,
      damage: 25,
      duration: 4,
      range: 220
    },

    storm: {
      id: "storm",
      name: "Storm",
      description: "Genera una tormenta de energía alrededor del jugador.",
      type: "ataque",
      rarity: "legendary",
      rarityName: "Legendario",
      rarityColor: "#facc15",
      energy: 45,
      cooldown: 18,
      damage: 120,
      duration: 5,
      range: 240
    },

    shield: {
      id: "shield",
      name: "Shield",
      description: "Crea un escudo energético temporal.",
      type: "defensa",
      rarity: "rare",
      rarityName: "Raro",
      rarityColor: "#60a5fa",
      energy: 25,
      cooldown: 14,
      damage: 0,
      duration: 6,
      range: 0
    },

    meteor: {
      id: "meteor",
      name: "Meteor",
      description: "Invoca un impacto de energía desde el cielo.",
      type: "super",
      rarity: "mythic",
      rarityName: "Mítico",
      rarityColor: "#fb7185",
      energy: 60,
      cooldown: 25,
      damage: 220,
      duration: 2,
      range: 300
    },

    clone: {
      id: "clone",
      name: "Clone",
      description: "Crea un clon energético que ayuda durante unos segundos.",
      type: "super",
      rarity: "mythic",
      rarityName: "Mítico",
      rarityColor: "#fb7185",
      energy: 50,
      cooldown: 22,
      damage: 55,
      duration: 8,
      range: 0
    },

    emp: {
      id: "emp",
      name: "EMP",
      description: "Emite una descarga que afecta a los enemigos cercanos.",
      type: "control",
      rarity: "legendary",
      rarityName: "Legendario",
      rarityColor: "#facc15",
      energy: 40,
      cooldown: 18,
      damage: 80,
      duration: 3,
      range: 260
    },

    overdrive: {
      id: "overdrive",
      name: "Overdrive",
      description: "Aumenta temporalmente las capacidades de combate.",
      type: "energia",
      rarity: "ancient",
      rarityName: "Ancestral",
      rarityColor: "#f97316",
      energy: 55,
      cooldown: 28,
      damage: 35,
      duration: 10,
      range: 0
    },

    blackhole: {
      id: "blackhole",
      name: "Black Hole",
      description: "Crea un campo energético que atrae enemigos.",
      type: "super",
      rarity: "omega",
      rarityName: "Omega",
      rarityColor: "#22d3ee",
      energy: 80,
      cooldown: 35,
      damage: 300,
      duration: 6,
      range: 320
    }
  };

  /*
   * Plantillas para las habilidades restantes.
   */

  const templates = [
    ["Pulse", "ataque", "Pulso energético de corto alcance."],
    ["Barrier", "defensa", "Barrera temporal de protección."],
    ["Blink", "movilidad", "Desplazamiento instantáneo."],
    ["Gravity", "control", "Altera la movilidad de los enemigos."],
    ["Recharge", "energia", "Recupera parte de la energía."],
    ["Shockwave", "ataque", "Onda expansiva de gran alcance."],
    ["Fortress", "defensa", "Aumenta temporalmente la resistencia."],
    ["Speed", "movilidad", "Aumenta la velocidad durante unos segundos."],
    ["Gravity Trap", "control", "Crea una zona que ralentiza enemigos."],
    ["Energy Core", "energia", "Aumenta la regeneración de energía."],
    ["Plasma Burst", "ataque", "Explosión concentrada de plasma."],
    ["Guardian", "defensa", "Invoca protección energética."],
    ["Teleport", "movilidad", "Permite cambiar rápidamente de posición."],
    ["Time Lock", "control", "Reduce temporalmente la velocidad enemiga."],
    ["Energy Wave", "energia", "Libera una onda de energía."],
    ["Meteor Rain", "super", "Lanza múltiples impactos energéticos."],
    ["Phantom", "movilidad", "Reduce temporalmente la detección."],
    ["Aegis", "defensa", "Genera una defensa energética avanzada."],
    ["Rift", "control", "Abre una zona de distorsión."],
    ["Solar Beam", "ataque", "Dispara un potente rayo de energía."],
    ["Titan", "defensa", "Aumenta considerablemente la resistencia."],
    ["Flash", "movilidad", "Aumenta rápidamente la velocidad."],
    ["Void Zone", "control", "Crea una zona de energía oscura."],
    ["Overcharge", "energia", "Potencia temporalmente la energía."],
    ["Inferno", "super", "Genera una gran zona de energía."],
    ["Frost Nova", "control", "Ralentiza enemigos cercanos."],
    ["Thunder", "ataque", "Descarga energía sobre objetivos cercanos."],
    ["Mirror", "defensa", "Genera una barrera reflectante."],
    ["Warp", "movilidad", "Realiza un salto espacial."],
    ["Energy Storm", "energia", "Genera energía durante varios segundos."],
    ["Omega Ray", "super", "Rayo de energía extremadamente potente."]
  ];

  /*
   * Generamos 80 habilidades adicionales.
   * Total final = 90.
   */

  let generated = 0;

  for (let i = 0; i < 80; i++) {

    const template =
      templates[i % templates.length];

    const rarity =
      RARITIES[
        Math.floor(i / 10)
      ];

    const variant =
      Math.floor(i / templates.length) + 1;

    const number =
      String(i + 11).padStart(3, "0");

    const baseEnergy =
      20 +
      Math.floor(i * 0.75);

    const baseCooldown =
      5 +
      Math.floor(i * 0.35);

    const baseDamage =
      35 +
      Math.floor(i * 3.2);

    const multiplier =
      rarity.multiplier;

    abilities[`ability_${number}`] = {

      id: `ability_${number}`,

      name:
        `${template[0]} ${variant}`,

      description:
        template[2],

      type:
        template[1],

      rarity:
        rarity.id,

      rarityName:
        rarity.name,

      rarityColor:
        rarity.color,

      energy:
        Math.min(
          100,
          Math.round(
            baseEnergy / multiplier
          )
        ),

      cooldown:
        Math.max(
          4,
          Math.round(
            baseCooldown / Math.sqrt(multiplier)
          )
        ),

      damage:
        Math.round(
          baseDamage * multiplier
        ),

      duration:
        Number(
          (
            2 +
            (i % 8) * 0.5 +
            multiplier * 0.3
          ).toFixed(1)
        ),

      range:
        Math.round(
          120 +
          (i % 10) * 20 +
          multiplier * 25
        ),

      level:
        Math.min(
          100,
          1 + i
        ),

      price:
        Math.round(
          (
            5000 +
            i * 25000
          ) * multiplier
        )
    };

    generated++;
  }

  /*
   * Lista completa.
   */

  const SCORVEX_ABILITY_LIST =
    Object.values(abilities);

  /*
   * Buscar habilidad.
   */

  function getScorvexAbility(id) {
    return abilities[id] || null;
  }

  /*
   * Filtrar por rareza.
   */

  function getScorvexAbilitiesByRarity(
    rarity
  ) {
    return SCORVEX_ABILITY_LIST.filter(
      ability =>
        ability.rarity === rarity
    );
  }

  /*
   * Filtrar por tipo.
   */

  function getScorvexAbilitiesByType(
    type
  ) {
    return SCORVEX_ABILITY_LIST.filter(
      ability =>
        ability.type === type
    );
  }

  /*
   * Obtener habilidades caras.
   */

  function getScorvexExpensiveAbilities(
    minimumPrice = 1000000
  ) {
    return SCORVEX_ABILITY_LIST
      .filter(
        ability =>
          ability.price >= minimumPrice
      )
      .sort(
        (a, b) =>
          b.price - a.price
      );
  }

  /*
   * Exponer el sistema.
   */

  window.SCORVEX_ABILITIES =
    abilities;

  window.SCORVEX_ABILITY_LIST =
    SCORVEX_ABILITY_LIST;

  window.getScorvexAbility =
    getScorvexAbility;

  window.getScorvexAbilitiesByRarity =
    getScorvexAbilitiesByRarity;

  window.getScorvexAbilitiesByType =
    getScorvexAbilitiesByType;

  window.getScorvexExpensiveAbilities =
    getScorvexExpensiveAbilities;

  /*
   * Comprobación.
   */

  console.log(
    `SCORVEX G7: ${SCORVEX_ABILITY_LIST.length} habilidades cargadas.`
  );

  if (
    SCORVEX_ABILITY_LIST.length !== 90
  ) {
    console.error(
      "ERROR: SCORVEX G7 no tiene exactamente 90 habilidades."
    );
  }

})();
