/* =========================================================
   SCORVEX G7 — INVENTORY SYSTEM
   Archivo: inventory-g7.js
   ========================================================= */

(() => {
  "use strict";

  const SAVE_KEY = "SCORVEX_G7_SAVE";

  /* ---------------------------------------------------------
     GUARDADO
     --------------------------------------------------------- */

  function getSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);

      if (!raw) {
        return {};
      }

      return JSON.parse(raw);

    } catch (error) {
      console.warn(
        "SCORVEX G7: error leyendo inventario.",
        error
      );

      return {};
    }
  }

  function saveGame(data) {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
      );

      return true;

    } catch (error) {
      console.warn(
        "SCORVEX G7: error guardando inventario.",
        error
      );

      return false;
    }
  }

  /* ---------------------------------------------------------
     ASEGURAR ESTRUCTURA
     --------------------------------------------------------- */

  function ensureInventory(save = getSave()) {

    if (!Array.isArray(save.ownedWeapons)) {
      save.ownedWeapons = [];
    }

    if (!Array.isArray(save.ownedArmors)) {
      save.ownedArmors = ["none"];
    }

    if (!Array.isArray(save.inventory)) {
      save.inventory = [];
    }

    if (!Array.isArray(save.ownedAbilities)) {
      save.ownedAbilities = [];
    }

    if (typeof save.weapon !== "string") {
      save.weapon =
        window.SCORVEX_STARTER_WEAPON ||
        "weapon_0001";
    }

    if (typeof save.armor !== "string") {
      save.armor = "none";
    }

    save.medkits =
      Math.max(0, Number(save.medkits || 0));

    save.energyKits =
      Math.max(0, Number(save.energyKits || 0));

    save.shieldKits =
      Math.max(0, Number(save.shieldKits || 0));

    save.repairKits =
      Math.max(0, Number(save.repairKits || 0));

    /*
      Garantizar arma inicial.
    */

    if (
      save.ownedWeapons.length === 0
    ) {
      save.ownedWeapons.push(
        window.SCORVEX_STARTER_WEAPON ||
        "weapon_0001"
      );
    }

    return save;
  }

  /* ---------------------------------------------------------
     OBTENER ARMA
     --------------------------------------------------------- */

  function getWeapon(id) {

    if (
      window.getScorvexWeapon
    ) {
      return window.getScorvexWeapon(id);
    }

    if (
      window.SCORVEX_WEAPONS
    ) {
      return window.SCORVEX_WEAPONS[id] || null;
    }

    return null;
  }

  /* ---------------------------------------------------------
     EQUIPAR ARMA
     --------------------------------------------------------- */

  function equipWeapon(id) {

    const weapon = getWeapon(id);

    if (!weapon) {

      return {
        success: false,
        message: "Arma no encontrada."
      };

    }

    const save =
      ensureInventory();

    if (
      !save.ownedWeapons.includes(id)
    ) {

      return {
        success: false,
        message: "No tienes esta arma."
      };

    }

    save.weapon = id;

    saveGame(save);

    window.dispatchEvent(
      new CustomEvent(
        "scorvex-inventory-updated",
        {
          detail: {
            type: "weapon",
            id
          }
        }
      )
    );

    return {
      success: true,
      weapon
    };
  }

  /* ---------------------------------------------------------
     ARMADURA
     --------------------------------------------------------- */

  const ARMORS = {

    none: {
      id: "none",
      name: "Sin armadura",
      defense: 0,
      durability: 0,
      price: 0
    },

    light: {
      id: "light",
      name: "Armadura ligera",
      defense: 8,
      durability: 100,
      price: 5000
    },

    tactical: {
      id: "tactical",
      name: "Armadura táctica",
      defense: 16,
      durability: 140,
      price: 15000
    },

    heavy: {
      id: "heavy",
      name: "Armadura pesada",
      defense: 28,
      durability: 190,
      price: 40000
    },

    quantum: {
      id: "quantum",
      name: "Armadura cuántica",
      defense: 42,
      durability: 250,
      price: 100000
    },

    omega: {
      id: "omega",
      name: "Armadura Omega",
      defense: 60,
      durability: 350,
      price: 250000
    }

  };

  /* ---------------------------------------------------------
     OBTENER ARMADURA
     --------------------------------------------------------- */

  function getArmor(id) {
    return ARMORS[id] || ARMORS.none;
  }

  /* ---------------------------------------------------------
     EQUIPAR ARMADURA
     --------------------------------------------------------- */

  function equipArmor(id) {

    const armor =
      getArmor(id);

    const save =
      ensureInventory();

    if (
      !save.ownedArmors.includes(id)
    ) {

      return {
        success: false,
        message: "No tienes esta armadura."
      };

    }

    save.armor = id;

    saveGame(save);

    window.dispatchEvent(
      new CustomEvent(
        "scorvex-inventory-updated",
        {
          detail: {
            type: "armor",
            id
          }
        }
      )
    );

    return {
      success: true,
      armor
    };
  }

  /* ---------------------------------------------------------
     COMPRAR ARMADURA CON MONEDAS VIRTUALES
     --------------------------------------------------------- */

  function buyArmor(id) {

    const armor =
      getArmor(id);

    if (
      !armor ||
      id === "none"
    ) {

      return {
        success: false,
        message: "Armadura no válida."
      };

    }

    const save =
      ensureInventory();

    if (
      save.ownedArmors.includes(id)
    ) {

      return {
        success: false,
        message: "Ya tienes esta armadura."
      };

    }

    const price =
      Number(armor.price || 0);

    if (
      Number(save.coins || 0) < price
    ) {

      return {
        success: false,
        message: "No tienes suficientes monedas."
      };

    }

    save.coins -= price;

    save.ownedArmors.push(id);

    saveGame(save);

    if (
      window.SCORVEX_AUDIO
    ) {
      window.SCORVEX_AUDIO.purchase();
    }

    return {
      success: true,
      armor
    };
  }

  /* ---------------------------------------------------------
     MEDKITS
     --------------------------------------------------------- */

  function addMedkits(amount = 1) {

    const save =
      ensureInventory();

    save.medkits +=
      Math.max(0, Number(amount));

    saveGame(save);

    return save.medkits;
  }

  function useMedkit(player) {

    const save =
      ensureInventory();

    if (
      save.medkits <= 0
    ) {

      return {
        success: false,
        message: "No tienes medkits."
      };

    }

    if (!player) {

      return {
        success: false,
        message: "Jugador no encontrado."
      };

    }

    const maxHp =
      Number(player.maxHp || 100);

    const currentHp =
      Number(player.hp || 0);

    if (
      currentHp >= maxHp
    ) {

      return {
        success: false,
        message: "Tu vida ya está completa."
      };

    }

    const healAmount =
      Math.min(
        50,
        maxHp - currentHp
      );

    player.hp += healAmount;

    save.medkits--;

    saveGame(save);

    if (
      window.SCORVEX_AUDIO
    ) {
      window.SCORVEX_AUDIO.heal();
    }

    window.dispatchEvent(
      new CustomEvent(
        "scorvex-player-healed",
        {
          detail: {
            amount: healAmount,
            hp: player.hp
          }
        }
      )
    );

    return {
      success: true,
      amount: healAmount,
      hp: player.hp
    };
  }

  /* ---------------------------------------------------------
     KIT DE ENERGÍA
     --------------------------------------------------------- */

  function addEnergyKits(amount = 1) {

    const save =
      ensureInventory();

    save.energyKits +=
      Math.max(0, Number(amount));

    saveGame(save);

    return save.energyKits;
  }

  function useEnergyKit(player) {

    const save =
      ensureInventory();

    if (
      save.energyKits <= 0
    ) {

      return {
        success: false,
        message: "No tienes kits de energía."
      };

    }

    if (!player) {
      return {
        success: false,
        message: "Jugador no encontrado."
      };
    }

    const maxEnergy =
      Number(player.maxEnergy || 100);

    const currentEnergy =
      Number(player.energy || 0);

    if (
      currentEnergy >= maxEnergy
    ) {

      return {
        success: false,
        message: "Tu energía ya está completa."
      };

    }

    const amount =
      Math.min(
        40,
        maxEnergy - currentEnergy
      );

    player.energy += amount;

    save.energyKits--;

    saveGame(save);

    return {
      success: true,
      amount,
      energy: player.energy
    };
  }

  /* ---------------------------------------------------------
     KIT DE ESCUDO
     --------------------------------------------------------- */

  function addShieldKits(amount = 1) {

    const save =
      ensureInventory();

    save.shieldKits +=
      Math.max(0, Number(amount));

    saveGame(save);

    return save.shieldKits;
  }

  function useShieldKit(player) {

    const save =
      ensureInventory();

    if (
      save.shieldKits <= 0
    ) {

      return {
        success: false,
        message: "No tienes kits de escudo."
      };

    }

    if (!player) {

      return {
        success: false,
        message: "Jugador no encontrado."
      };

    }

    player.shield =
      Math.max(
        Number(player.shield || 0),
        50
      );

    save.shieldKits--;

    saveGame(save);

    return {
      success: true,
      shield: player.shield
    };
  }

  /* ---------------------------------------------------------
     KIT DE REPARACIÓN
     --------------------------------------------------------- */

  function addRepairKits(amount = 1) {

    const save =
      ensureInventory();

    save.repairKits +=
      Math.max(0, Number(amount));

    saveGame(save);

    return save.repairKits;
  }

  function useRepairKit(player) {

    const save =
      ensureInventory();

    if (
      save.repairKits <= 0
    ) {

      return {
        success: false,
        message: "No tienes kits de reparación."
      };

    }

    if (!player) {

      return {
        success: false,
        message: "Jugador no encontrado."
      };

    }

    player.armorDurability =
      Math.min(
        Number(player.maxArmorDurability || 100),
        Number(player.armorDurability || 0) + 40
      );

    save.repairKits--;

    saveGame(save);

    return {
      success: true,
      armorDurability:
        player.armorDurability
    };
  }

  /* ---------------------------------------------------------
     AÑADIR ARMA AL INVENTARIO
     --------------------------------------------------------- */

  function addWeapon(id) {

    const weapon =
      getWeapon(id);

    if (!weapon) {

      return {
        success: false,
        message: "Arma no encontrada."
      };

    }

    const save =
      ensureInventory();

    if (
      save.ownedWeapons.includes(id)
    ) {

      return {
        success: false,
        message: "Ya tienes esta arma."
      };

    }

    save.ownedWeapons.push(id);

    saveGame(save);

    return {
      success: true,
      weapon
    };
  }

  /* ---------------------------------------------------------
     COMPROBAR PROPIEDAD
     --------------------------------------------------------- */

  function ownsWeapon(id) {

    const save =
      ensureInventory();

    return save.ownedWeapons.includes(id);
  }

  function ownsArmor(id) {

    const save =
      ensureInventory();

    return save.ownedArmors.includes(id);
  }

  /* ---------------------------------------------------------
     OBTENER INVENTARIO COMPLETO
     --------------------------------------------------------- */

  function getInventory() {

    const save =
      ensureInventory();

    return {

      weapon:
        getWeapon(save.weapon),

      armor:
        getArmor(save.armor),

      weapons:
        save.ownedWeapons
          .map(getWeapon)
          .filter(Boolean),

      armors:
        save.ownedArmors
          .map(getArmor)
          .filter(Boolean),

      medkits:
        save.medkits,

      energyKits:
        save.energyKits,

      shieldKits:
        save.shieldKits,

      repairKits:
        save.repairKits

    };
  }

  /* ---------------------------------------------------------
     RESUMEN DEL INVENTARIO
     --------------------------------------------------------- */

  function getSummary() {

    const save =
      ensureInventory();

    return {

      equippedWeapon:
        save.weapon,

      equippedArmor:
        save.armor,

      totalWeapons:
        save.ownedWeapons.length,

      totalArmors:
        save.ownedArmors.length,

      medkits:
        save.medkits,

      energyKits:
        save.energyKits,

      shieldKits:
        save.shieldKits,

      repairKits:
        save.repairKits

    };
  }

  /* ---------------------------------------------------------
     EXPORTAR
     --------------------------------------------------------- */

  window.SCORVEX_INVENTORY = {

    SAVE_KEY,

    ARMORS,

    getSave,
    saveGame,

    ensureInventory,

    getWeapon,

    equipWeapon,

    getArmor,
    equipArmor,
    buyArmor,

    addWeapon,
    ownsWeapon,
    ownsArmor,

    addMedkits,
    useMedkit,

    addEnergyKits,
    useEnergyKit,

    addShieldKits,
    useShieldKit,

    addRepairKits,
    useRepairKit,

    getInventory,
    getSummary

  };

  /* ---------------------------------------------------------
     INICIALIZAR
     --------------------------------------------------------- */

  const save =
    ensureInventory();

  saveGame(save);

  console.log(
    "SCORVEX G7 — Inventario cargado."
  );

})();
