/* =========================================================
   SCORVEX G7
   game.js
   ========================================================= */

"use strict";

/* =========================================================
   CONFIGURACIÓN
========================================================= */

const VERSION = "G7";
const SAVE_KEY = "SCORVEX_G7_SAVE";

const WORLD = {
  width: 1100,
  height: 650
};

const MAX_HP = 100;
const MAX_ENERGY = 100;


/* =========================================================
   ARMAS G7
   weapons-g7.js debe cargarse antes
========================================================= */

const weapons = window.SCORVEX_WEAPONS || {};

console.assert(
  Object.keys(weapons).length === 1000,
  "SCORVEX G7: deben existir exactamente 1000 armas."
);


/* =========================================================
   DATOS DE RAREZAS
========================================================= */

const RARITIES = [
  "common",
  "uncommon",
  "rare",
  "epic",
  "legendary",
  "mythic",
  "ancient",
  "omega"
];

const RARITY_NAMES = {
  common: "Común",
  uncommon: "Poco común",
  rare: "Raro",
  epic: "Épico",
  legendary: "Legendario",
  mythic: "Mítico",
  ancient: "Antiguo",
  omega: "Omega"
};


/* =========================================================
   HABILIDADES
   90 habilidades generadas
========================================================= */

const abilityNames = [
  "Pulso",
  "Escudo",
  "Impacto",
  "Ráfaga",
  "Furia",
  "Velocidad",
  "Blindaje",
  "Cazador",
  "Tormenta",
  "Vórtice",
  "Impulso",
  "Descarga",
  "Núcleo",
  "Reflejo",
  "Dominio",
  "Ruptura",
  "Carga",
  "Sombra",
  "Fuego",
  "Hielo",
  "Plasma",
  "Rayo",
  "Nova",
  "Titan",
  "Aegis",
  "Vector",
  "Omega",
  "Spectra",
  "Phantom",
  "Inferno"
];

const abilityTypes = [
  "Ofensiva",
  "Defensiva",
  "Movilidad"
];

const abilities = {};

for (let i = 0; i < 90; i++) {

  const name =
    abilityNames[i % abilityNames.length] +
    " " +
    String(i + 1).padStart(2, "0");

  const rarity =
    RARITIES[
      Math.min(
        RARITIES.length - 1,
        Math.floor(i / 12)
      )
    ];

  const type =
    abilityTypes[i % abilityTypes.length];

  abilities["ability_" + String(i + 1).padStart(3, "0")] = {

    id:
      "ability_" +
      String(i + 1).padStart(3, "0"),

    name,

    type,

    rarity,

    power:
      20 + i * 2,

    cooldown:
      Math.max(2, 12 - Math.floor(i / 10)),

    energy:
      Math.max(10, 40 - Math.floor(i / 5)),

    icon:
      type === "Ofensiva"
        ? "⚡"
        : type === "Defensiva"
          ? "🛡️"
          : "💨"

  };
}

console.assert(
  Object.keys(abilities).length === 90,
  "SCORVEX G7: deben existir exactamente 90 habilidades."
);


/* =========================================================
   ARMADURAS
========================================================= */

const armors = {

  armor_001: {
    id: "armor_001",
    name: "Armadura Scout",
    rarity: "common",
    defense: 5,
    energy: 0,
    price: 3000,
    icon: "🦺"
  },

  armor_002: {
    id: "armor_002",
    name: "Armadura Táctica",
    rarity: "uncommon",
    defense: 10,
    energy: 5,
    price: 12000,
    icon: "🛡️"
  },

  armor_003: {
    id: "armor_003",
    name: "Armadura Guardian",
    rarity: "rare",
    defense: 16,
    energy: 10,
    price: 45000,
    icon: "🛡️"
  },

  armor_004: {
    id: "armor_004",
    name: "Armadura Phantom",
    rarity: "epic",
    defense: 23,
    energy: 15,
    price: 150000,
    icon: "⚔️"
  },

  armor_005: {
    id: "armor_005",
    name: "Armadura Titan",
    rarity: "legendary",
    defense: 32,
    energy: 20,
    price: 650000,
    icon: "🔰"
  },

  armor_006: {
    id: "armor_006",
    name: "Armadura Omega",
    rarity: "omega",
    defense: 45,
    energy: 30,
    price: 5000000,
    icon: "👑"
  }

};


/* =========================================================
   PERSONALIZACIÓN
========================================================= */

const customization = {

  outfit: [
    ["outfit_1", "Táctico", "🧥", "common"],
    ["outfit_2", "Comando", "🥋", "uncommon"],
    ["outfit_3", "Shadow", "🖤", "rare"],
    ["outfit_4", "Hunter", "🎽", "epic"],
    ["outfit_5", "Titan", "🛡️", "legendary"],
    ["outfit_6", "Omega", "⚡", "omega"]
  ],

  head: [
    ["head_1", "Casco Scout", "⛑️", "common"],
    ["head_2", "Casco Táctico", "🪖", "uncommon"],
    ["head_3", "Visor Shadow", "🥽", "rare"],
    ["head_4", "Visor Plasma", "🔵", "epic"],
    ["head_5", "Casco Titan", "👑", "legendary"],
    ["head_6", "Casco Omega", "💠", "omega"]
  ],

  accessories: [
    ["acc_1", "Mochila", "🎒", "common"],
    ["acc_2", "Comunicador", "📡", "uncommon"],
    ["acc_3", "Dron", "🤖", "rare"],
    ["acc_4", "Núcleo", "💎", "epic"],
    ["acc_5", "Generador", "🔋", "legendary"],
    ["acc_6", "Núcleo Omega", "☢️", "omega"]
  ],

  effects: [
    ["effect_1", "Chispa Azul", "🔵", "rare"],
    ["effect_2", "Llama", "🔥", "epic"],
    ["effect_3", "Energía", "⚡", "legendary"],
    ["effect_4", "Vórtice", "🌀", "mythic"],
    ["effect_5", "Omega", "💥", "omega"]
  ],

  colors: [
    ["blue", "Azul"],
    ["orange", "Naranja"],
    ["red", "Rojo"],
    ["green", "Verde"],
    ["purple", "Violeta"],
    ["white", "Blanco"]
  ]

};


/* =========================================================
   MÚSICA
========================================================= */

const musicTracks = [

  {
    id: "arena",
    name: "Arena",
    description: "Combate electrónico",
    bpm: 128
  },

  {
    id: "shadow",
    name: "Shadow",
    description: "Modo oscuro",
    bpm: 105
  },

  {
    id: "rush",
    name: "Rush",
    description: "Alta velocidad",
    bpm: 150
  },

  {
    id: "omega",
    name: "Omega",
    description: "Batalla final",
    bpm: 170
  }

];


/* =========================================================
   GUARDADO
========================================================= */

const defaultSave = {

  coins: 5000,

  crystals: 250,

  score: 0,

  level: 1,

  xp: 0,

  hp: MAX_HP,

  energy: MAX_ENERGY,

  medkits: 3,

  ownedWeapons: [
    "weapon_0001"
  ],

  equippedWeapon:
    "weapon_0001",

  ownedAbilities: [
    "ability_001"
  ],

  equippedAbility:
    "ability_001",

  ownedArmors: [
    "armor_001"
  ],

  equippedArmor:
    "armor_001",

  customization: {

    outfit: "outfit_1",

    head: "head_1",

    accessories: "acc_1",

    effects: "effect_1",

    color: "blue"

  },

  music: "arena",

  musicEnabled: true,

  musicVolume: 0.45,

  sector: 1,

  missions: {

    kills: 0,

    waves: 0,

    coins: 0

  }

};


function cloneObject(object) {

  return JSON.parse(
    JSON.stringify(object)
  );

}


function loadSave() {

  try {

    const raw =
      localStorage.getItem(SAVE_KEY);

    if (!raw) {

      return cloneObject(defaultSave);

    }

    const loaded =
      JSON.parse(raw);

    return {

      ...cloneObject(defaultSave),

      ...loaded,

      customization: {

        ...cloneObject(
          defaultSave.customization
        ),

        ...(loaded.customization || {})

      },

      missions: {

        ...cloneObject(
          defaultSave.missions
        ),

        ...(loaded.missions || {})

      }

    };

  } catch (error) {

    console.warn(
      "No se pudo cargar la partida.",
      error
    );

    return cloneObject(defaultSave);

  }

}


let saveData = loadSave();


function saveGame() {

  try {

    localStorage.setItem(
      SAVE_KEY,
      JSON.stringify(saveData)
    );

  } catch (error) {

    console.warn(
      "No se pudo guardar la partida.",
      error
    );

  }

}


/* =========================================================
   DOM
========================================================= */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  [...document.querySelectorAll(selector)];


/* =========================================================
   ELEMENTOS
========================================================= */

const boot =
  $("#boot");

const app =
  $("#app");

const menu =
  $("#menu");

const shop =
  $("#shop");

const inventory =
  $("#inventory");

const character =
  $("#character");

const musicScreen =
  $("#music");

const missionsScreen =
  $("#missions");

const mapScreen =
  $("#map");

const gameScreen =
  $("#game");

const canvas =
  $("#canvas");

const ctx =
  canvas
    ? canvas.getContext("2d")
    : null;


/* =========================================================
   ESTADO DEL JUEGO
========================================================= */

let gameRunning = false;

let gamePaused = false;

let animationId = null;

let lastTime = 0;

let gameTime = 0;

let mouseX =
  WORLD.width / 2;

let mouseY =
  WORLD.height / 2;

let mouseDown = false;

let wave = 1;

let waveEnemies = 0;

let score = 0;

let combo = 0;

let comboTimer = 0;

let enemies = [];

let projectiles = [];

let particles = [];

let floatingTexts = [];

let pickups = [];

let obstacles = [];

let keys = {};

let boss = null;

let spawnTimer = 0;

let fireCooldown = 0;

let abilityCooldown = 0;

let damageFlash = 0;


/* =========================================================
   JUGADOR
========================================================= */

const player = {

  x: WORLD.width / 2,

  y: WORLD.height / 2,

  radius: 19,

  speed: 230,

  hp: MAX_HP,

  energy: MAX_ENERGY,

  angle: 0,

  ammo: 30,

  reserve: 120,

  medkits: 3,

  defense: 0,

  color: "#008cff",

  alive: true

};


/* =========================================================
   UTILIDADES
========================================================= */

function clamp(
  value,
  min,
  max
) {

  return Math.max(
    min,
    Math.min(max, value)
  );

}


function random(
  min,
  max
) {

  return Math.random() *
    (max - min) +
    min;

}


function randomInt(
  min,
  max
) {

  return Math.floor(
    random(min, max + 1)
  );

}


function distance(
  a,
  b
) {

  return Math.hypot(
    a.x - b.x,
    a.y - b.y
  );

}


function getCurrentWeapon() {

  return weapons[
    saveData.equippedWeapon
  ] || weapons.weapon_0001;

}


function getCurrentAbility() {

  return abilities[
    saveData.equippedAbility
  ] || abilities.ability_001;

}


function getCurrentArmor() {

  return armors[
    saveData.equippedArmor
  ] || armors.armor_001;

}


/* =========================================================
   XP Y NIVELES
========================================================= */

function xpNeeded(level) {

  return 100 +
    (level - 1) * 75;

}


function addXP(amount) {

  saveData.xp += amount;

  while (
    saveData.xp >=
    xpNeeded(saveData.level)
  ) {

    saveData.xp -=
      xpNeeded(saveData.level);

    saveData.level++;

    saveData.coins +=
      1000 + saveData.level * 250;

    saveData.crystals += 10;

    notify(
      "¡Subiste al nivel " +
      saveData.level +
      "!"
    );

  }

  saveGame();

  updateMenuHUD();

}


/* =========================================================
   MONEDAS
========================================================= */

function addCoins(amount) {

  saveData.coins +=
    Math.max(0, Math.floor(amount));

  saveData.missions.coins +=
    Math.max(0, Math.floor(amount));

  saveGame();

  updateMenuHUD();

}


function spendCoins(amount) {

  amount =
    Math.max(0, Math.floor(amount));

  if (
    saveData.coins < amount
  ) {

    notify(
      "No tienes suficientes monedas."
    );

    return false;

  }

  saveData.coins -= amount;

  saveGame();

  updateMenuHUD();

  return true;

}


/* =========================================================
   HUD DEL MENÚ
========================================================= */

function updateMenuHUD() {

  if ($("#coins"))
    $("#coins").textContent =
      saveData.coins.toLocaleString();

  if ($("#crystals"))
    $("#crystals").textContent =
      saveData.crystals.toLocaleString();

  if ($("#level"))
    $("#level").textContent =
      saveData.level;

}


/* =========================================================
   NOTIFICACIONES
========================================================= */

function notify(message) {

  const container =
    $("#notes");

  if (!container) return;

  const note =
    document.createElement("div");

  note.className =
    "note";

  note.textContent =
    message;

  container.appendChild(note);

  setTimeout(() => {

    note.remove();

  }, 2600);

}


/* =========================================================
   NAVEGACIÓN
========================================================= */

function showScreen(id) {

  $$(".screen").forEach(
    screen => {

      screen.classList.add(
        "hidden"
      );

    }
  );

  const target =
    document.getElementById(id);

  if (target) {

    target.classList.remove(
      "hidden"
    );

  }

}


$$("[data-open]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        const id =
          button.dataset.open;

        showScreen(id);

        if (id === "shop")
          renderShop();

        if (id === "inventory")
          renderInventory();

        if (id === "character")
          renderCustomization();

        if (id === "music")
          renderMusic();

        if (id === "missions")
          renderMissions();

      }
    );

  }
);


$$("[data-back]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        showScreen(
          button.dataset.back
        );

      }
    );

  }
);


/* =========================================================
   TIENDA
========================================================= */

function renderShop() {

  const grid =
    $("#shopGrid");

  if (!grid) return;

  const search =
    (
      $("#search")?.value ||
      ""
    ).toLowerCase();

  const rarity =
    $("#rarity")?.value ||
    "all";

  const type =
    $("#type")?.value ||
    "all";

  const list =
    Object.values(weapons)
      .filter(weapon => {

        if (
          rarity !== "all" &&
          weapon.rarity !== rarity
        ) {
          return false;
        }

        if (
          type !== "all" &&
          weapon.type !== type
        ) {
          return false;
        }

        return (
          weapon.name
            .toLowerCase()
            .includes(search)
        );

      });

  $("#count").textContent =
    list.length.toLocaleString();

  grid.innerHTML = "";

  const fragment =
    document.createDocumentFragment();

  list.forEach(
    weapon => {

      const card =
        document.createElement("article");

      card.className =
        "card";

      const owned =
        saveData.ownedWeapons
          .includes(weapon.id);

      const icon =
        weapon.icon || "🔫";

      card.innerHTML = `

        <div class="icon">
          ${icon}
        </div>

        <h3 class="rarity-${weapon.rarity}">
          ${escapeHTML(weapon.name)}
        </h3>

        <small>
          ${RARITY_NAMES[weapon.rarity] || weapon.rarity}
          · ${escapeHTML(weapon.type)}
        </small>

        <div class="stats">

          <div>
            <small>DAÑO</small>
            <b>${weapon.damage ?? 0}</b>
          </div>

          <div>
            <small>CADENCIA</small>
            <b>${weapon.fireRate ?? 0}</b>
          </div>

          <div>
            <small>PRECISIÓN</small>
            <b>${weapon.accuracy ?? 0}</b>
          </div>

        </div>

        <div class="bottom">

          <span class="price">
            ◈ ${Number(
              weapon.price || 0
            ).toLocaleString()}
          </span>

          <button
            class="${owned ? "buy owned" : "buy"}"
            data-buy="${weapon.id}"
          >
            ${
              owned
                ? "EQUIPAR"
                : "COMPRAR"
            }
          </button>

        </div>

      `;

      fragment.appendChild(card);

    }
  );

  grid.appendChild(fragment);

  grid
    .querySelectorAll("[data-buy]")
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          buyOrEquipWeapon(
            button.dataset.buy
          );

        }
      );

    });

}


function buyOrEquipWeapon(id) {

  const weapon =
    weapons[id];

  if (!weapon) {

    notify(
      "Arma no encontrada."
    );

    return;

  }

  const owned =
    saveData.ownedWeapons
      .includes(id);

  if (!owned) {

    if (
      !spendCoins(
        weapon.price
      )
    ) {

      return;

    }

    saveData.ownedWeapons.push(id);

    notify(
      "Compraste " +
      weapon.name
    );

  }

  saveData.equippedWeapon =
    id;

  saveGame();

  updateWeaponHUD();

  renderShop();

  notify(
    "Equipaste " +
    weapon.name
  );

}


/* =========================================================
   BUSCADOR DE TIENDA
========================================================= */

$("#search")?.addEventListener(
  "input",
  renderShop
);

$("#rarity")?.addEventListener(
  "change",
  renderShop
);

$("#type")?.addEventListener(
  "change",
  renderShop
);


/* =========================================================
   INVENTARIO
========================================================= */

let inventoryTab =
  "weapons";


$$("[data-tab]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        inventoryTab =
          button.dataset.tab;

        renderInventory();

      }
    );

  }
);


function renderInventory() {

  const grid =
    $("#inventoryGrid");

  if (!grid) return;

  grid.innerHTML = "";

  if (
    inventoryTab ===
    "weapons"
  ) {

    saveData.ownedWeapons
      .forEach(id => {

        const weapon =
          weapons[id];

        if (!weapon) return;

        grid.appendChild(
          createInventoryCard(
            weapon,
            weapon.id ===
            saveData.equippedWeapon,
            () => {

              saveData.equippedWeapon =
                weapon.id;

              saveGame();

              updateWeaponHUD();

              renderInventory();

              notify(
                "Arma equipada."
              );

            }
          )
        );

      });

    return;
  }


  if (
    inventoryTab ===
    "abilities"
  ) {

    saveData.ownedAbilities
      .forEach(id => {

        const ability =
          abilities[id];

        if (!ability) return;

        grid.appendChild(
          createInventoryCard(
            ability,
            ability.id ===
            saveData.equippedAbility,
            () => {

              saveData.equippedAbility =
                ability.id;

              saveGame();

              renderInventory();

              notify(
                "Habilidad equipada."
              );

            }
          )
        );

      });

    return;
  }


  if (
    inventoryTab ===
    "armor"
  ) {

    Object.values(armors)
      .forEach(armor => {

        const owned =
          saveData.ownedArmors
            .includes(armor.id);

        if (!owned) return;

        grid.appendChild(
          createInventoryCard(
            armor,
            armor.id ===
            saveData.equippedArmor,
            () => {

              saveData.equippedArmor =
                armor.id;

              saveGame();

              renderInventory();

              notify(
                "Armadura equipada."
              );

            }
          )
        );

      });

    return;
  }


  if (
    inventoryTab ===
    "items"
  ) {

    const card =
      document.createElement("article");

    card.className =
      "card";

    card.innerHTML = `

      <div class="icon">
        🩹
      </div>

      <h3>
        Botiquines
      </h3>

      <small>
        Recupera vida durante la batalla.
      </small>

      <div class="bottom">

        <span class="price">
          x${saveData.medkits}
        </span>

        <button
          class="buy"
          id="buyMedkit"
        >
          COMPRAR
        </button>

      </div>

    `;

    grid.appendChild(card);

    $("#buyMedkit")
      ?.addEventListener(
        "click",
        buyMedkit
      );

  }

}


function createInventoryCard(
  item,
  equipped,
  action
) {

  const card =
    document.createElement("article");

  card.className =
    "card";

  const icon =
    item.icon || "🎯";

  card.innerHTML = `

    <div class="icon">
      ${icon}
    </div>

    <h3 class="
      rarity-${
        item.rarity || "common"
      }
    ">
      ${escapeHTML(item.name)}
    </h3>

    <small>
      ${
        RARITY_NAMES[
          item.rarity
        ] ||
        item.type ||
        ""
      }
    </small>

    <div class="bottom">

      <span class="price">
        ${
          equipped
            ? "EQUIPADO"
            : ""
        }
      </span>

      <button class="equip">
        ${
          equipped
            ? "EQUIPADO"
            : "EQUIPAR"
        }
      </button>

    </div>

  `;

  card
    .querySelector("button")
    .addEventListener(
      "click",
      action
    );

  return card;

}


/* =========================================================
   BOTIQUINES
========================================================= */

function buyMedkit() {

  const price =
    500;

  if (
    !spendCoins(price)
  ) return;

  saveData.medkits++;

  saveGame();

  notify(
    "Botiquín comprado."
  );

  renderInventory();

}


function useMedkit() {

  if (
    player.hp >= MAX_HP
  ) {

    notify(
      "Tu vida ya está completa."
    );

    return;

  }

  if (
    player.medkits <= 0
  ) {

    notify(
      "No tienes botiquines."
    );

    return;

  }

  player.medkits--;

  player.hp =
    clamp(
      player.hp + 45,
      0,
      MAX_HP
    );

  saveData.medkits =
    player.medkits;

  createFloatingText(
    player.x,
    player.y - 30,
    "+45 HP",
    "#42e58a"
  );

  saveGame();

}


/* =========================================================
   PERSONALIZACIÓN
========================================================= */

let customTab =
  "outfit";


$$("[data-custom]").forEach(
  button => {

    button.addEventListener(
      "click",
      () => {

        customTab =
          button.dataset.custom;

        renderCustomization();

      }
    );

  }
);


function renderCustomization() {

  const grid =
    $("#customGrid");

  if (!grid) return;

  grid.innerHTML = "";

  const list =
    customization[
      customTab
    ] || [];

  list.forEach(item => {

    const card =
      document.createElement("article");

    card.className =
      "card customization-item";

    if (
      customTab ===
      "colors"
    ) {

      const [
        id,
        name
      ] = item;

      card.innerHTML = `

        <div class="icon">
          🎨
        </div>

        <h3>
          ${escapeHTML(name)}
        </h3>

        <button
          class="equip"
          data-custom-id="${id}"
        >
          USAR
        </button>

      `;

    } else {

      const [
        id,
        name,
        icon,
        rarity
      ] = item;

      card.innerHTML = `

        <div class="icon">
          ${icon}
        </div>

        <h3 class="rarity-${rarity}">
          ${escapeHTML(name)}
        </h3>

        <small>
          ${
            RARITY_NAMES[rarity]
          }
        </small>

        <button
          class="equip"
          data-custom-id="${id}"
        >
          ${
            saveData.customization[
              customTab
            ] === id
              ? "EQUIPADO"
              : "USAR"
          }
        </button>

      `;

    }

    grid.appendChild(card);

  });


  grid
    .querySelectorAll(
      "[data-custom-id]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          saveData.customization[
            customTab
          ] =
            button.dataset.customId;

          saveGame();

          updateCharacterPreview();

          renderCustomization();

          notify(
            "Personalización aplicada."
          );

        }
      );

    });

}


function updateCharacterPreview() {

  const colorMap = {

    blue: "#008cff",

    orange: "#ff5b00",

    red: "#ff304f",

    green: "#35db83",

    purple: "#9b5cff",

    white: "#e9f4ff"

  };

  player.color =
    colorMap[
      saveData.customization.color
    ] || "#008cff";

  const preview =
    $(".charPreview");

  if (!preview) return;

  preview.style.setProperty(
    "--player-color",
    player.color
  );

}


$("#random")?.addEventListener(
  "click",
  () => {

    const categories = [
      "outfit",
      "head",
      "accessories",
      "effects",
      "colors"
    ];

    categories.forEach(
      category => {

        const list =
          customization[category];

        if (!list?.length)
          return;

        const item =
          list[
            randomInt(
              0,
              list.length - 1
            )
          ];

        saveData.customization[
          category
        ] =
          item[0];

      }
    );

    saveGame();

    updateCharacterPreview();

    renderCustomization();

    notify(
      "Personaje aleatorio creado."
    );

  }
);


/* =========================================================
   MÚSICA
========================================================= */

let audioContext = null;

let musicTimer = null;

let musicStep = 0;


function getAudioContext() {

  if (!audioContext) {

    const AudioCtx =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioCtx)
      return null;

    audioContext =
      new AudioCtx();

  }

  return audioContext;

}


function playTone(
  frequency,
  duration,
  volume = 0.05,
  type = "sine"
) {

  const audio =
    getAudioContext();

  if (!audio) return;

  const oscillator =
    audio.createOscillator();

  const gain =
    audio.createGain();

  oscillator.type =
    type;

  oscillator.frequency.value =
    frequency;

  gain.gain.setValueAtTime(
    0,
    audio.currentTime
  );

  gain.gain.linearRampToValueAtTime(
    volume *
    saveData.musicVolume,
    audio.currentTime + .01
  );

  gain.gain.exponentialRampToValueAtTime(
    0.001,
    audio.currentTime + duration
  );

  oscillator.connect(gain);

  gain.connect(
    audio.destination
  );

  oscillator.start();

  oscillator.stop(
    audio.currentTime +
    duration
  );

}


function startMusic() {

  stopMusic();

  if (
    !saveData.musicEnabled
  ) return;

  const track =
    musicTracks.find(
      item =>
        item.id ===
        saveData.music
    ) ||
    musicTracks[0];

  const interval =
    60000 /
    track.bpm;

  musicStep = 0;

  musicTimer =
    setInterval(
      () => {

        if (
          !saveData.musicEnabled ||
          gamePaused
        ) return;

        const notes = {

          arena: [
            110,
            164.81,
            220,
            164.81
          ],

          shadow: [
            82.41,
            123.47,
            146.83,
            123.47
          ],

          rush: [
            146.83,
            220,
            293.66,
            220
          ],

          omega: [
            73.42,
            110,
            146.83,
            220
          ]

        };

        const sequence =
          notes[
            track.id
          ] || notes.arena;

        const note =
          sequence[
            musicStep %
            sequence.length
          ];

        playTone(
          note,
          .18,
          .035,
          "sawtooth"
        );

        musicStep++;

      },
      interval
    );

}


function stopMusic() {

  if (musicTimer) {

    clearInterval(
      musicTimer
    );

    musicTimer = null;

  }

}


function renderMusic() {

  const list =
    $("#musicList");

  if (!list) return;

  list.innerHTML = "";

  musicTracks.forEach(
    track => {

      const button =
        document.createElement(
          "button"
        );

      button.innerHTML = `

        <b>
          🎵 ${track.name}
        </b>

        <small>
          ${track.description}
          · ${track.bpm} BPM
        </small>

      `;

      if (
        saveData.music ===
        track.id
      ) {

        button.style.borderColor =
          "var(--blue)";

      }

      button.addEventListener(
        "click",
        () => {

          saveData.music =
            track.id;

          saveGame();

          startMusic();

          renderMusic();

          notify(
            "Música seleccionada: " +
            track.name
          );

        }
      );

      list.appendChild(
        button
      );

    }
  );

}


$("#musicToggle")
  ?.addEventListener(
    "click",
    () => {

      saveData.musicEnabled =
        !saveData.musicEnabled;

      saveGame();

      if (
        saveData.musicEnabled
      ) {

        startMusic();

      } else {

        stopMusic();

      }

      $("#musicToggle")
        .textContent =
          saveData.musicEnabled
            ? "🔊 MÚSICA"
            : "🔇 MÚSICA";

    }
  );


$("#volume")
  ?.addEventListener(
    "input",
    event => {

      saveData.musicVolume =
        Number(
          event.target.value
        ) / 100;

      saveGame();

    }
  );


/* =========================================================
   MISIONES
========================================================= */

function renderMissions() {

  const list =
    $("#missionsList");

  if (!list) return;

  const missions = [

    {
      name: "Primer combate",
      description:
        "Elimina 10 enemigos.",
      current:
        saveData.missions.kills,
      target: 10,
      reward: 1500
    },

    {
      name: "Superviviente",
      description:
        "Completa 5 oleadas.",
      current:
        saveData.missions.waves,
      target: 5,
      reward: 5000
    },

    {
      name: "Cazador G7",
      description:
        "Elimina 50 enemigos.",
      current:
        saveData.missions.kills,
      target: 50,
      reward: 15000
    },

    {
      name: "Dominio de la arena",
      description:
        "Completa 15 oleadas.",
      current:
        saveData.missions.waves,
      target: 15,
      reward: 50000
    }

  ];

  list.innerHTML = "";

  missions.forEach(
    mission => {

      const progress =
        clamp(
          mission.current /
          mission.target *
          100,
          0,
          100
        );

      const card =
        document.createElement(
          "article"
        );

      card.className =
        "mission";

      card.innerHTML = `

        <h3>
          ${mission.name}
        </h3>

        <p>
          ${mission.description}
        </p>

        <small>
          ${Math.min(
            mission.current,
            mission.target
          )}
          /
          ${mission.target}
          · Recompensa:
          ${mission.reward.toLocaleString()}
          monedas
        </small>

        <div class="bar">
          <i
            style="
              display:block;
              width:${progress}%;
              height:100%;
              background:var(--blue);
            "
          ></i>
        </div>

      `;

      list.appendChild(card);

    }
  );

}


/* =========================================================
   CREACIÓN DE ENEMIGOS
========================================================= */

function createEnemy(
  type = "normal"
) {

  const side =
    randomInt(0, 3);

  let x;
  let y;

  if (side === 0) {

    x = random(30, WORLD.width - 30);
    y = 25;

  } else if (side === 1) {

    x = WORLD.width - 25;
    y = random(30, WORLD.height - 30);

  } else if (side === 2) {

    x = random(30, WORLD.width - 30);
    y = WORLD.height - 25;

  } else {

    x = 25;
    y = random(30, WORLD.height - 30);

  }

  const scale =
    1 + wave * 0.055;

  const bossEnemy =
    type === "boss";

  const enemy = {

    x,

    y,

    radius:
      bossEnemy ? 34 : 17,

    speed:
      bossEnemy
        ? 50 + wave * 2
        : 70 + wave * 4,

    hp:
      bossEnemy
        ? 900 + wave * 150
        : 65 + wave * 22,

    maxHp:
      bossEnemy
        ? 900 + wave * 150
        : 65 + wave * 22,

    damage:
      bossEnemy
        ? 18 + wave
        : 7 + wave * .7,

    type,

    color:
      bossEnemy
        ? "#ff4c20"
        : type === "fast"
          ? "#ffbf30"
          : "#e94c62",

    attackCooldown:
      random(.2, 1),

    shootCooldown:
      random(1, 3),

    hitFlash: 0

  };

  return enemy;

}


/* =========================================================
   GENERAR OLEADA
========================================================= */

function spawnWave() {

  enemies = [];

  projectiles = [];

  waveEnemies =
    5 +
    wave * 2;

  for (
    let i = 0;
    i < waveEnemies;
    i++
  ) {

    let type =
      "normal";

    if (
      wave >= 3 &&
      i % 5 === 0
    ) {

      type = "fast";

    }

    enemies.push(
      createEnemy(type)
    );

  }

  if (
    wave >= 5 &&
    wave % 5 === 0
  ) {

    boss =
      createEnemy("boss");

    enemies.push(boss);

    notify(
      "⚠ JEFE DE OLEADA"
    );

  } else {

    boss = null;

  }

  notify(
    "OLEADA " +
    wave
  );

}


/* =========================================================
   PROYECTILES
========================================================= */

function createProjectile(
  x,
  y,
  angle,
  speed,
  damage,
  owner = "player",
  color = "#00baff"
) {

  projectiles.push({

    x,

    y,

    vx:
      Math.cos(angle) *
      speed,

    vy:
      Math.sin(angle) *
      speed,

    radius:
      owner === "player"
        ? 5
        : 6,

    damage,

    owner,

    color,

    life: 2

  });

}


/* =========================================================
   DISPARAR
========================================================= */

function fireWeapon() {

  if (!gameRunning)
    return;

  if (gamePaused)
    return;

  if (
    fireCooldown > 0
  )
    return;

  const weapon =
    getCurrentWeapon();

  if (!weapon)
    return;

  if (
    player.ammo <= 0
  ) {

    reloadWeapon();

    return;

  }

  const angle =
    Math.atan2(
      mouseY - player.y,
      mouseX - player.x
    );

  const damage =
    Number(
      weapon.damage || 20
    );

  const speed =
    620 +
    Number(
      weapon.projectileSpeed || 0
    );

  const spread =
    Number(
      weapon.spread || 0
    ) *
    Math.PI /
    180;

  const bullets =
    Number(
      weapon.pellets ||
      weapon.shots ||
      1
    );

  for (
    let i = 0;
    i < bullets;
    i++
  ) {

    const randomSpread =
      bullets > 1
        ? random(
            -spread,
            spread
          )
        : random(
            -spread * .25,
            spread * .25
          );

    createProjectile(
      player.x,
      player.y,
      angle + randomSpread,
      speed,
      damage,
      "player",
      player.color
    );

  }

  player.ammo--;

  fireCooldown =
    Math.max(
      .04,
      Number(
        weapon.fireDelay ||
        weapon.fireRate ||
        .15
      ) / 100
    );

  playShotSound();

}


/* =========================================================
   RECARGAR
========================================================= */

function reloadWeapon() {

  const missing =
    30 -
    player.ammo;

  if (
    missing <= 0
  ) return;

  if (
    player.reserve <= 0
  ) {

    notify(
      "Sin munición."
    );

    return;

  }

  const amount =
    Math.min(
      missing,
      player.reserve
    );

  player.ammo += amount;

  player.reserve -= amount;

  playTone(
    260,
    .12,
    .04,
    "square"
  );

}


/* =========================================================
   HABILIDAD
========================================================= */

function useAbility() {

  if (!gameRunning)
    return;

  if (
    abilityCooldown > 0
  )
    return;

  const ability =
    getCurrentAbility();

  if (!ability)
    return;

  if (
    player.energy <
    ability.energy
  ) {

    notify(
      "No tienes suficiente energía."
    );

    return;

  }

  player.energy -=
    ability.energy;

  abilityCooldown =
    ability.cooldown;

  if (
    ability.type ===
    "Ofensiva"
  ) {

    const radius =
      130;

    enemies.forEach(
      enemy => {

        const d =
          distance(
            player,
            enemy
          );

        if (d <= radius) {

          enemy.hp -=
            ability.power;

          enemy.hitFlash =
            .15;

          createExplosion(
            enemy.x,
            enemy.y,
            "#00baff"
          );

        }

      }
    );

    createExplosion(
      player.x,
      player.y,
      "#00baff"
    );

  }


  if (
    ability.type ===
    "Defensiva"
  ) {

    player.hp =
      clamp(
        player.hp +
        ability.power * .7,
        0,
        MAX_HP
      );

    player.defense =
      20;

    setTimeout(
      () => {
        player.defense = 0;
      },
      3000
    );

    createFloatingText(
      player.x,
      player.y - 35,
      "ESCUDO",
      "#58c7ff"
    );

  }


  if (
    ability.type ===
    "Movilidad"
  ) {

    const angle =
      Math.atan2(
        mouseY - player.y,
        mouseX - player.x
      );

    player.x +=
      Math.cos(angle) *
      140;

    player.y +=
      Math.sin(angle) *
      140;

    player.x =
      clamp(
        player.x,
        25,
        WORLD.width - 25
      );

    player.y =
      clamp(
        player.y,
        25,
        WORLD.height - 25
      );

    createExplosion(
      player.x,
      player.y,
      "#8b5cff"
    );

  }

  playAbilitySound();

}


/* =========================================================
   DAÑO AL JUGADOR
========================================================= */

function damagePlayer(
  amount
) {

  const reduction =
    player.defense;

  const armor =
    getCurrentArmor();

  const armorDefense =
    armor?.defense || 0;

  const finalDamage =
    Math.max(
      1,
      amount -
      armorDefense * .25 -
      reduction
    );

  player.hp -=
    finalDamage;

  damageFlash =
    .18;

  createFloatingText(
    player.x,
    player.y - 25,
    "-" +
    Math.round(finalDamage),
    "#ff5368"
  );

  if (
    player.hp <= 0
  ) {

    player.hp = 0;

    player.alive = false;

    endGame();

  }

}


/* =========================================================
   ACTUALIZAR JUGADOR
========================================================= */

function updatePlayer(dt) {

  let dx = 0;
  let dy = 0;

  if (
    keys.w ||
    keys.ArrowUp
  )
    dy--;

  if (
    keys.s ||
    keys.ArrowDown
  )
    dy++;

  if (
    keys.a ||
    keys.ArrowLeft
  )
    dx--;

  if (
    keys.d ||
    keys.ArrowRight
  )
    dx++;

  if (
    dx !== 0 ||
    dy !== 0
  ) {

    const length =
      Math.hypot(
        dx,
        dy
      );

    dx /= length;
    dy /= length;

    player.x +=
      dx *
      player.speed *
      dt;

    player.y +=
      dy *
      player.speed *
      dt;

  }

  player.x =
    clamp(
      player.x,
      25,
      WORLD.width - 25
    );

  player.y =
    clamp(
      player.y,
      25,
      WORLD.height - 25
    );

  player.angle =
    Math.atan2(
      mouseY - player.y,
      mouseX - player.x
    );

}


/* =========================================================
   ACTUALIZAR ENEMIGOS
========================================================= */

function updateEnemies(dt) {

  enemies.forEach(
    enemy => {

      if (
        enemy.hp <= 0
      )
        return;

      const angle =
        Math.atan2(
          player.y - enemy.y,
          player.x - enemy.x
        );

      const d =
        distance(
          enemy,
          player
        );

      if (
        d > 75
      ) {

        enemy.x +=
          Math.cos(angle) *
          enemy.speed *
          dt;

        enemy.y +=
          Math.sin(angle) *
          enemy.speed *
          dt;

      } else {

        enemy.attackCooldown -=
          dt;

        if (
          enemy.attackCooldown <= 0
        ) {

          damagePlayer(
            enemy.damage
          );

          enemy.attackCooldown =
            .8;

        }

      }


      if (
        enemy.type ===
        "boss"
      ) {

        enemy.shootCooldown -=
          dt;

        if (
          enemy.shootCooldown <= 0
        ) {

          const bulletAngle =
            Math.atan2(
              player.y - enemy.y,
              player.x - enemy.x
            );

          createProjectile(
            enemy.x,
            enemy.y,
            bulletAngle,
            270,
            enemy.damage,
            "enemy",
            "#ff4b30"
          );

          enemy.shootCooldown =
            1.5;

        }

      }

      enemy.hitFlash =
        Math.max(
          0,
          enemy.hitFlash - dt
        );

    }
  );

}


/* =========================================================
   ACTUALIZAR PROYECTILES
========================================================= */

function updateProjectiles(dt) {

  for (
    let i =
      projectiles.length - 1;
    i >= 0;
    i--
  ) {

    const projectile =
      projectiles[i];

    projectile.x +=
      projectile.vx *
      dt;

    projectile.y +=
      projectile.vy *
      dt;

    projectile.life -=
      dt;

    let remove = false;


    if (
      projectile.x < -30 ||
      projectile.x >
        WORLD.width + 30 ||
      projectile.y < -30 ||
      projectile.y >
        WORLD.height + 30 ||
      projectile.life <= 0
    ) {

      remove = true;

    }


    if (
      !remove &&
      projectile.owner ===
      "player"
    ) {

      for (
        let j =
          enemies.length - 1;
        j >= 0;
        j--
      ) {

        const enemy =
          enemies[j];

        if (
          enemy.hp <= 0
        )
          continue;

        const d =
          distance(
            projectile,
            enemy
          );

        if (
          d <=
          projectile.radius +
          enemy.radius
        ) {

          enemy.hp -=
            projectile.damage;

          enemy.hitFlash =
            .12;

          createFloatingText(
            enemy.x,
            enemy.y - 20,
            Math.round(
              projectile.damage
            ),
            "#ffffff"
          );

          createParticles(
            enemy.x,
            enemy.y,
            projectile.color,
            4
          );

          remove = true;

          if (
            enemy.hp <= 0
          ) {

            killEnemy(
              enemy
            );

          }

          break;

        }

      }

    }


    if (
      !remove &&
      projectile.owner ===
      "enemy"
    ) {

      const d =
        distance(
          projectile,
          player
        );

      if (
        d <=
        projectile.radius +
        player.radius
      ) {

        damagePlayer(
          projectile.damage
        );

        remove = true;

      }

    }


    if (remove) {

      projectiles.splice(
        i,
        1
      );

    }

  }

}


/* =========================================================
   MUERTE DE ENEMIGO
========================================================= */

function killEnemy(enemy) {

  const index =
    enemies.indexOf(
      enemy
    );

  if (
    index !== -1
  ) {

    enemies.splice(
      index,
      1
    );

  }

  combo++;

  comboTimer =
    3;

  const reward =
    enemy.type === "boss"
      ? 5000 + wave * 500
      : 150 + wave * 20;

  const xp =
    enemy.type === "boss"
      ? 500
      : 50 + wave * 5;

  score +=
    reward;

  addCoins(
    reward
  );

  addXP(
    xp
  );

  saveData.missions.kills++;

  if (
    enemy.type === "boss"
  ) {

    notify(
      "¡JEFE DERROTADO!"
    );

    saveData.crystals +=
      50;

  }

  createExplosion(
    enemy.x,
    enemy.y,
    enemy.color
  );

  if (
    Math.random() <
    .08
  ) {

    pickups.push({

      x: enemy.x,

      y: enemy.y,

      type:
        Math.random() < .5
          ? "medkit"
          : "ammo",

      life: 12

    });

  }

}


/* =========================================================
   PICKUPS
========================================================= */

function updatePickups(dt) {

  for (
    let i =
      pickups.length - 1;
    i >= 0;
    i--
  ) {

    const pickup =
      pickups[i];

    pickup.life -=
      dt;

    if (
      pickup.life <= 0
    ) {

      pickups.splice(
        i,
        1
      );

      continue;

    }

    if (
      distance(
        pickup,
        player
      ) <
      35
    ) {

      if (
        pickup.type ===
        "medkit"
      ) {

        player.medkits++;

        saveData.medkits =
          player.medkits;

        notify(
          "+1 Botiquín"
        );

      } else {

        player.reserve +=
          45;

        notify(
          "+45 Munición"
        );

      }

      saveGame();

      pickups.splice(
        i,
        1
      );

    }

  }

}


/* =========================================================
   OLEADAS
========================================================= */

function checkWave() {

  if (
    enemies.length === 0 &&
    gameRunning
  ) {

    saveData.missions.waves++;

    addXP(
      100 +
      wave * 20
    );

    wave++;

    player.hp =
      clamp(
        player.hp + 10,
        0,
        MAX_HP
      );

    player.energy =
      clamp(
        player.energy + 20,
        0,
        MAX_ENERGY
      );

    player.reserve +=
      30;

    setTimeout(
      () => {

        if (gameRunning)
          spawnWave();

      },
      1200
    );

  }

}


/* =========================================================
   PARTÍCULAS
========================================================= */

function createParticles(
  x,
  y,
  color,
  amount = 10
) {

  for (
    let i = 0;
    i < amount;
    i++
  ) {

    const angle =
      random(
        0,
        Math.PI * 2
      );

    const speed =
      random(
        40,
        180
      );

    particles.push({

      x,

      y,

      vx:
        Math.cos(angle) *
        speed,

      vy:
        Math.sin(angle) *
        speed,

      life:
        random(
          .25,
          .7
        ),

      maxLife:
        .7,

      color,

      size:
        random(
          2,
          5
        )

    });

  }

}


function createExplosion(
  x,
  y,
  color
) {

  createParticles(
    x,
    y,
    color,
    24
  );

}


function updateParticles(dt) {

  for (
    let i =
      particles.length - 1;
    i >= 0;
    i--
  ) {

    const p =
      particles[i];

    p.x +=
      p.vx *
      dt;

    p.y +=
      p.vy *
      dt;

    p.vx *=
      .97;

    p.vy *=
      .97;

    p.life -=
      dt;

    if (
      p.life <= 0
    ) {

      particles.splice(
        i,
        1
      );

    }

  }

}


/* =========================================================
   TEXTOS FLOTANTES
========================================================= */

function createFloatingText(
  x,
  y,
  text,
  color
) {

  floatingTexts.push({

    x,

    y,

    text,

    color,

    life: 1,

    maxLife: 1

  });

}


function updateFloatingTexts(dt) {

  for (
    let i =
      floatingTexts.length - 1;
    i >= 0;
    i--
  ) {

    const item =
      floatingTexts[i];

    item.y -=
      35 *
      dt;

    item.life -=
      dt;

    if (
      item.life <= 0
    ) {

      floatingTexts.splice(
        i,
        1
      );

    }

  }

}


/* =========================================================
   DIBUJAR FONDO
========================================================= */

function drawBackground() {

  if (!ctx)
    return;

  ctx.fillStyle =
    "#07111b";

  ctx.fillRect(
    0,
    0,
    WORLD.width,
    WORLD.height
  );


  /* GRID */

  ctx.strokeStyle =
    "#ffffff08";

  ctx.lineWidth =
    1;

  const size =
    50;

  for (
    let x = 0;
    x <= WORLD.width;
    x += size
  ) {

    ctx.beginPath();

    ctx.moveTo(
      x,
      0
    );

    ctx.lineTo(
      x,
      WORLD.height
    );

    ctx.stroke();

  }

  for (
    let y = 0;
    y <= WORLD.height;
    y += size
  ) {

    ctx.beginPath();

    ctx.moveTo(
      0,
      y
    );

    ctx.lineTo(
      WORLD.width,
      y
    );

    ctx.stroke();

  }


  /* ZONA CENTRAL */

  const gradient =
    ctx.createRadialGradient(
      WORLD.width / 2,
      WORLD.height / 2,
      40,
      WORLD.width / 2,
      WORLD.height / 2,
      500
    );

  gradient.addColorStop(
    0,
    "#083d5a55"
  );

  gradient.addColorStop(
    1,
    "#00000000"
  );

  ctx.fillStyle =
    gradient;

  ctx.fillRect(
    0,
    0,
    WORLD.width,
    WORLD.height
  );


  /* EDIFICIOS */

  ctx.fillStyle =
    "#0b1724";

  for (
    let i = 0;
    i < 12;
    i++
  ) {

    const x =
      (i * 91) % WORLD.width;

    const y =
      i % 2 === 0
        ? 70
        : 500;

    const w =
      45 +
      (i % 3) * 25;

    const h =
      50 +
      (i % 4) * 20;

    ctx.fillRect(
      x,
      y,
      w,
      h
    );

  }

}


/* =========================================================
   DIBUJAR JUGADOR
========================================================= */

function drawPlayer() {

  if (!ctx)
    return;

  ctx.save();

  ctx.translate(
    player.x,
    player.y
  );

  ctx.rotate(
    player.angle
  );


  /* SOMBRA */

  ctx.fillStyle =
    "#0008";

  ctx.beginPath();

  ctx.ellipse(
    0,
    15,
    25,
    10,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* CUERPO */

  ctx.fillStyle =
    "#17293a";

  ctx.strokeStyle =
    player.color;

  ctx.lineWidth =
    3;

  ctx.beginPath();

  ctx.roundRect(
    -16,
    -10,
    32,
    40,
    8
  );

  ctx.fill();

  ctx.stroke();


  /* CABEZA */

  ctx.fillStyle =
    "#293c50";

  ctx.beginPath();

  ctx.arc(
    0,
    -22,
    13,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.stroke();


  /* VISOR */

  ctx.fillStyle =
    player.color;

  ctx.fillRect(
    -10,
    -25,
    20,
    6
  );


  /* BRAZO */

  ctx.strokeStyle =
    "#70869a";

  ctx.lineWidth =
    8;

  ctx.beginPath();

  ctx.moveTo(
    8,
    0
  );

  ctx.lineTo(
    27,
    0
  );

  ctx.stroke();


  /* ARMA */

  ctx.strokeStyle =
    "#11161c";

  ctx.lineWidth =
    7;

  ctx.beginPath();

  ctx.moveTo(
    20,
    0
  );

  ctx.lineTo(
    48,
    0
  );

  ctx.stroke();

  ctx.strokeStyle =
    player.color;

  ctx.lineWidth =
    2;

  ctx.beginPath();

  ctx.moveTo(
    26,
    0
  );

  ctx.lineTo(
    48,
    0
  );

  ctx.stroke();


  ctx.restore();

}


/* =========================================================
   DIBUJAR ENEMIGOS
========================================================= */

function drawEnemy(
  enemy
) {

  if (!ctx)
    return;

  ctx.save();

  ctx.translate(
    enemy.x,
    enemy.y
  );

  const color =
    enemy.hitFlash > 0
      ? "#ffffff"
      : enemy.color;


  /* sombra */

  ctx.fillStyle =
    "#0008";

  ctx.beginPath();

  ctx.ellipse(
    0,
    enemy.radius * .8,
    enemy.radius * 1.2,
    enemy.radius * .45,
    0,
    0,
    Math.PI * 2
  );

  ctx.fill();


  /* cuerpo */

  ctx.fillStyle =
    "#17212d";

  ctx.strokeStyle =
    color;

  ctx.lineWidth =
    enemy.type === "boss"
      ? 4
      : 2;

  ctx.beginPath();

  ctx.arc(
    0,
    0,
    enemy.radius,
    0,
    Math.PI * 2
  );

  ctx.fill();

  ctx.stroke();


  /* visor */

  ctx.fillStyle =
    color;

  ctx.fillRect(
    -enemy.radius * .6,
    -3,
    enemy.radius * 1.2,
    6
  );


  /* barra HP */

  const barWidth =
    enemy.radius * 2.4;

  const hpPercent =
    clamp(
      enemy.hp /
      enemy.maxHp,
      0,
      1
    );

  ctx.fillStyle =
    "#000b";

  ctx.fillRect(
    -barWidth / 2,
    -enemy.radius - 12,
    barWidth,
    5
  );

  ctx.fillStyle =
    color;

  ctx.fillRect(
    -barWidth / 2,
    -enemy.radius - 12,
    barWidth *
      hpPercent,
    5
  );


  ctx.restore();

}


/* =========================================================
   DIBUJAR PROYECTILES
========================================================= */

function drawProjectiles() {

  if (!ctx)
    return;

  projectiles.forEach(
    projectile => {

      ctx.save();

      ctx.translate(
        projectile.x,
        projectile.y
      );

      ctx.rotate(
        Math.atan2(
          projectile.vy,
          projectile.vx
        )
      );

      ctx.fillStyle =
        projectile.color;

      ctx.shadowBlur =
        15;

      ctx.shadowColor =
        projectile.color;

      ctx.fillRect(
        -7,
        -2,
        14,
        4
      );

      ctx.restore();

    }
  );

}


/* =========================================================
   DIBUJAR PARTÍCULAS
========================================================= */

function drawParticles() {

  if (!ctx)
    return;

  particles.forEach(
    particle => {

      ctx.globalAlpha =
        clamp(
          particle.life /
          particle.maxLife,
          0,
          1
        );

      ctx.fillStyle =
        particle.color;

      ctx.beginPath();

      ctx.arc(
        particle.x,
        particle.y,
        particle.size,
        0,
        Math.PI * 2
      );

      ctx.fill();

    }
  );

  ctx.globalAlpha = 1;

}


/* =========================================================
   DIBUJAR PICKUPS
========================================================= */

function drawPickups() {

  if (!ctx)
    return;

  pickups.forEach(
    pickup => {

      ctx.save();

      ctx.translate(
        pickup.x,
        pickup.y
      );

      ctx.fillStyle =
        pickup.type ===
        "medkit"
          ? "#36dc83"
          : "#ffd23f";

      ctx.shadowBlur =
        15;

      ctx.shadowColor =
        ctx.fillStyle;

      ctx.fillRect(
        -10,
        -10,
        20,
        20
      );

      ctx.fillStyle =
        "#07111b";

      ctx.font =
        "bold 14px Arial";

      ctx.textAlign =
        "center";

      ctx.textBaseline =
        "middle";

      ctx.fillText(
        pickup.type ===
          "medkit"
          ? "+"
          : "A",
        0,
        0
      );

      ctx.restore();

    }
  );

}


/* =========================================================
   DIBUJAR TEXTOS
========================================================= */

function drawFloatingTexts() {

  if (!ctx)
    return;

  floatingTexts.forEach(
    item => {

      ctx.globalAlpha =
        clamp(
          item.life,
          0,
          1
        );

      ctx.fillStyle =
        item.color;

      ctx.font =
        "bold 14px Arial";

      ctx.textAlign =
        "center";

      ctx.fillText(
        item.text,
        item.x,
        item.y
      );

    }
  );

  ctx.globalAlpha = 1;

}


/* =========================================================
   LOOP DE JUEGO
========================================================= */

function update(dt) {

  if (!gameRunning)
    return;

  if (gamePaused)
    return;

  gameTime +=
    dt;

  fireCooldown =
    Math.max(
      0,
      fireCooldown - dt
    );

  abilityCooldown =
    Math.max(
      0,
      abilityCooldown - dt
    );

  comboTimer =
    Math.max(
      0,
      comboTimer - dt
    );

  if (
    comboTimer <= 0
  ) {

    combo = 0;

  }

  player.energy =
    clamp(
      player.energy +
      12 * dt,
      0,
      MAX_ENERGY
    );

  updatePlayer(dt);

  if (
    mouseDown
  ) {

    fireWeapon();

  }

  updateEnemies(dt);

  updateProjectiles(dt);

  updateParticles(dt);

  updateFloatingTexts(dt);

  updatePickups(dt);

  checkWave();

  updateGameHUD();

}


/* =========================================================
   RENDER
========================================================= */

function render() {

  if (!ctx)
    return;

  ctx.save();

  drawBackground();

  drawPickups();

  drawProjectiles();

  enemies.forEach(
    drawEnemy
  );

  drawPlayer();

  drawParticles();

  drawFloatingTexts();

  ctx.restore();


  if (
    damageFlash > 0
  ) {

    ctx.fillStyle =
      `rgba(255,0,30,${damageFlash})`;

    ctx.fillRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    damageFlash =
      Math.max(
        0,
        damageFlash -
        .01
      );

  }

}


/* =========================================================
   ANIMACIÓN
========================================================= */

function gameLoop(
  timestamp
) {

  if (!gameRunning)
    return;

  if (!lastTime)
    lastTime =
      timestamp;

  const dt =
    Math.min(
      .033,
      (timestamp -
        lastTime) /
        1000
    );

  lastTime =
    timestamp;

  update(dt);

  render();

  animationId =
    requestAnimationFrame(
      gameLoop
    );

}


/* =========================================================
   INICIAR JUEGO
========================================================= */

function startGame() {

  if (gameRunning)
    return;

  gameRunning =
    true;

  gamePaused =
    false;

  player.alive =
    true;

  player.hp =
    MAX_HP;

  player.energy =
    MAX_ENERGY;

  player.medkits =
    saveData.medkits;

  player.x =
    WORLD.width / 2;

  player.y =
    WORLD.height / 2;

  player.ammo =
    30;

  player.reserve =
    120;

  player.defense =
    0;

  wave =
    1;

  score =
    0;

  combo =
    0;

  enemies = [];

  projectiles = [];

  particles = [];

  floatingTexts = [];

  pickups = [];

  boss = null;

  lastTime = 0;

  showScreen("game");

  spawnWave();

  updateWeaponHUD();

  updateGameHUD();

  startMusic();

  animationId =
    requestAnimationFrame(
      gameLoop
    );

}


/* =========================================================
   FINALIZAR JUEGO
========================================================= */

function endGame() {

  gameRunning =
    false;

  gamePaused =
    false;

  if (animationId) {

    cancelAnimationFrame(
      animationId
    );

    animationId =
      null;

  }

  saveData.score =
    Math.max(
      saveData.score,
      score
    );

  saveGame();

  notify(
    "Partida terminada · Puntos: " +
    score.toLocaleString()
  );

  setTimeout(
    () => {

      showScreen("menu");

      updateMenuHUD();

    },
    1200
  );

}


/* =========================================================
   HUD DEL JUEGO
========================================================= */

function updateGameHUD() {

  if ($("#hp"))
    $("#hp").textContent =
      Math.ceil(player.hp);

  if ($("#energy"))
    $("#energy").textContent =
      Math.ceil(player.energy);

  if ($("#wave"))
    $("#wave").textContent =
      wave;

  if ($("#score"))
    $("#score").textContent =
      score.toLocaleString();

  if ($("#hpbar"))
    $("#hpbar").style.width =
      clamp(
        player.hp /
        MAX_HP *
        100,
        0,
        100
      ) + "%";

  if ($("#energybar"))
    $("#energybar").style.width =
      clamp(
        player.energy /
        MAX_ENERGY *
        100,
        0,
        100
      ) + "%";

  if ($("#ammo"))
    $("#ammo").textContent =
      player.ammo;

  if ($("#reserve"))
    $("#reserve").textContent =
      player.reserve;

}


/* =========================================================
   HUD DEL ARMA
========================================================= */

function updateWeaponHUD() {

  const weapon =
    getCurrentWeapon();

  if (!weapon)
    return;

  if ($("#weaponName"))
    $("#weaponName").textContent =
      weapon.name;

  if ($("#weaponIcon"))
    $("#weaponIcon").innerHTML =
      weapon.icon ||
      "🔫";

}


/* =========================================================
   PAUSA
========================================================= */

function pauseGame() {

  if (!gameRunning)
    return;

  gamePaused =
    true;

  $("#pauseModal")
    ?.classList
    .remove("hidden");

}


function resumeGame() {

  gamePaused =
    false;

  $("#pauseModal")
    ?.classList
    .add("hidden");

  lastTime = 0;

}


$("#pause")
  ?.addEventListener(
    "click",
    pauseGame
  );


$("#resume")
  ?.addEventListener(
    "click",
    resumeGame
  );


$("#quit")
  ?.addEventListener(
    "click",
    () => {

      $("#pauseModal")
        ?.classList
        .add("hidden");

      endGame();

    }
  );


/* =========================================================
   BOTONES
========================================================= */

$("#play")
  ?.addEventListener(
    "click",
    () => {

      getAudioContext()
        ?.resume();

      startGame();

    }
  );


$("#ability")
  ?.addEventListener(
    "click",
    useAbility
  );


$("#medkit")
  ?.addEventListener(
    "click",
    useMedkit
  );


$("#reload")
  ?.addEventListener(
    "click",
    reloadWeapon
  );


$("#fire")
  ?.addEventListener(
    "pointerdown",
    event => {

      event.preventDefault();

      fireWeapon();

    }
  );


$("#exit")
  ?.addEventListener(
    "click",
    () => {

      endGame();

    }
  );


$("#gameMusic")
  ?.addEventListener(
    "click",
    () => {

      saveData.musicEnabled =
        !saveData.musicEnabled;

      if (
        saveData.musicEnabled
      ) {

        startMusic();

      } else {

        stopMusic();

      }

      saveGame();

    }
  );


$("#gameInventory")
  ?.addEventListener(
    "click",
    () => {

      pauseGame();

      showScreen(
        "inventory"
      );

      renderInventory();

    }
  );


/* =========================================================
   TECLADO
========================================================= */

window.addEventListener(
  "keydown",
  event => {

    keys[
      event.key
    ] = true;

    const key =
      event.key.toLowerCase();

    keys[key] = true;


    if (
      key === " "
    ) {

      event.preventDefault();

      useAbility();

    }


    if (
      key === "q"
    ) {

      useAbility();

    }


    if (
      key === "h"
    ) {

      useMedkit();

    }


    if (
      key === "r"
    ) {

      reloadWeapon();

    }


    if (
      key === "escape"
    ) {

      if (
        gameRunning &&
        !gamePaused
      ) {

        pauseGame();

      } else if (
        gameRunning &&
        gamePaused
      ) {

        resumeGame();

      }

    }

  }
);


window.addEventListener(
  "keyup",
  event => {

    keys[
      event.key
    ] = false;

    keys[
      event.key.toLowerCase()
    ] = false;

  }
);


/* =========================================================
   RATÓN
========================================================= */

canvas?.addEventListener(
  "mousemove",
  event => {

    const rect =
      canvas.getBoundingClientRect();

    mouseX =
      (
        event.clientX -
        rect.left
      ) *
      WORLD.width /
      rect.width;

    mouseY =
      (
        event.clientY -
        rect.top
      ) *
      WORLD.height /
      rect.height;

  }
);


canvas?.addEventListener(
  "mousedown",
  event => {

    if (
      event.button === 0
    ) {

      mouseDown =
        true;

      fireWeapon();

    }

  }
);


window.addEventListener(
  "mouseup",
  event => {

    if (
      event.button === 0
    ) {

      mouseDown =
        false;

    }

  }
);


/* =========================================================
   CONTROLES TÁCTILES
========================================================= */

$$("[data-key]").forEach(
  button => {

    const key =
      button.dataset.key;

    const press =
      event => {

        event.preventDefault();

        keys[key] =
          true;

      };

    const release =
      event => {

        event.preventDefault();

        keys[key] =
          false;

      };

    button.addEventListener(
      "pointerdown",
      press
    );

    button.addEventListener(
      "pointerup",
      release
    );

    button.addEventListener(
      "pointercancel",
      release
    );

    button.addEventListener(
      "pointerleave",
      release
    );

  }
);


/* =========================================================
   SONIDOS
========================================================= */

function playShotSound() {

  playTone(
    180 +
    random(0, 80),
    .07,
    .06,
    "square"
  );

}


function playAbilitySound() {

  playTone(
    480,
    .1,
    .05,
    "sine"
  );

  setTimeout(
    () => {

      playTone(
        720,
        .15,
        .04,
        "triangle"
      );

    },
    60
  );

}


/* =========================================================
   ESCAPAR HTML
========================================================= */

function escapeHTML(
  value
) {

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


/* =========================================================
   PANTALLA DE CARGA
========================================================= */

function bootGame() {

  let progress = 0;

  const bar =
    $("#progress");

  const text =
    $("#bootText");

  const messages = [

    "Cargando SCORVEX...",

    "Preparando arsenal...",

    "Inicializando 1000 armas...",

    "Preparando habilidades...",

    "Preparando arena...",

    "Iniciando G7..."

  ];

  const timer =
    setInterval(
      () => {

        progress +=
          randomInt(
            7,
            15
          );

        progress =
          Math.min(
            progress,
            100
          );

        if (bar)
          bar.style.width =
            progress + "%";

        if (text) {

          const index =
            Math.min(
              messages.length - 1,
              Math.floor(
                progress /
                20
              )
            );

          text.textContent =
            messages[index];

        }

        if (
          progress >= 100
        ) {

          clearInterval(timer);

          setTimeout(
            () => {

              boot?.classList
                .add("hidden");

              app?.classList
                .remove("hidden");

              updateMenuHUD();

              updateCharacterPreview();

            },
            350
          );

        }

      },
      120
    );

}


/* =========================================================
   COMPATIBILIDAD DE ARMAS
========================================================= */

function normalizeWeaponData() {

  const first =
    weapons.weapon_0001;

  if (!first) {

    console.error(
      "No se encontró weapon_0001."
    );

    return;

  }

  Object.values(weapons)
    .forEach(
      weapon => {

        if (
          typeof weapon.price !==
          "number"
        ) {

          weapon.price =
            5000;

        }

        if (
          typeof weapon.damage !==
          "number"
        ) {

          weapon.damage =
            20;

        }

        if (
          typeof weapon.fireRate !==
          "number"
        ) {

          weapon.fireRate =
            60;

        }

        if (
          typeof weapon.accuracy !==
          "number"
        ) {

          weapon.accuracy =
            70;

        }

        if (!weapon.type) {

          weapon.type =
            "rifle";

        }

        if (!weapon.rarity) {

          weapon.rarity =
            "common";

        }

      }
    );

}


/* =========================================================
   INICIALIZACIÓN
========================================================= */

function initializeGame() {

  normalizeWeaponData();

  updateMenuHUD();

  updateCharacterPreview();

  renderMusic();

  renderMissions();

  console.log(
    `%cSCORVEX ${VERSION} iniciado`,
    "color:#00aaff;font-weight:bold"
  );

  console.log(
    "Armas:",
    Object.keys(weapons).length
  );

  console.log(
    "Habilidades:",
    Object.keys(abilities).length
  );

  console.log(
    "Armaduras:",
    Object.keys(armors).length
  );

  console.assert(
    Object.keys(weapons).length === 1000,
    "ERROR: no hay 1000 armas."
  );

  console.assert(
    Object.keys(abilities).length === 90,
    "ERROR: no hay 90 habilidades."
  );

}


document.addEventListener(
  "DOMContentLoaded",
  () => {

    initializeGame();

    bootGame();

  }
);


/* =========================================================
   EVITAR PÉRDIDA DE PARTIDA
========================================================= */

window.addEventListener(
  "beforeunload",
  () => {

    saveGame();

  }
);


/* =========================================================
   ATAJOS G7
========================================================= */

window.SCORVEX = {

  version: VERSION,

  weapons,

  abilities,

  armors,

  saveData,

  startGame,

  endGame,

  saveGame,

  loadSave,

  buyOrEquipWeapon,

  useAbility,

  useMedkit,

  reloadWeapon

};


/* =========================================================
   FIN DE GAME.JS
========================================================= */
