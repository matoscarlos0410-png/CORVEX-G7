/* =========================================================
   SCORVEX G7 — SHOP SYSTEM
   Tienda con moneda virtual del juego
   ========================================================= */

(() => {
  "use strict";

  const SAVE_KEY = "scorvex_g7_save";

  /* =======================================================
     UTILIDADES
     ======================================================= */

  function getSave() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);

      if (!raw) {
        return null;
      }

      return JSON.parse(raw);
    } catch (error) {
      console.error(
        "SCORVEX SHOP: error leyendo guardado",
        error
      );

      return null;
    }
  }

  function saveGame(data) {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify(data)
      );

      window.dispatchEvent(
        new CustomEvent("scorvex-save-updated", {
          detail: data
        })
      );

      return true;
    } catch (error) {
      console.error(
        "SCORVEX SHOP: error guardando",
        error
      );

      return false;
    }
  }

  function ensureArray(object, key) {
    if (!Array.isArray(object[key])) {
      object[key] = [];
    }

    return object[key];
  }

  function formatMoney(value) {
    if (
      typeof window.formatScorvexMoney ===
      "function"
    ) {
      return window.formatScorvexMoney(value);
    }

    return Number(value || 0)
      .toLocaleString("es-PE");
  }

  function notify(message) {
    window.dispatchEvent(
      new CustomEvent("scorvex-notification", {
        detail: {
          message
        }
      })
    );

    const container =
      document.getElementById(
        "notifications"
      );

    if (!container) {
      return;
    }

    const element =
      document.createElement("div");

    element.className =
      "notification";

    element.textContent =
      message;

    container.appendChild(element);

    setTimeout(() => {
      element.remove();
    }, 3000);
  }

  /* =======================================================
     CATEGORÍAS
     ======================================================= */

  const SHOP_CATEGORIES = {
    weapons: {
      name: "Armas",
      icon: "⚔️"
    },

    characters: {
      name: "Personajes",
      icon: "👤"
    },

    outfits: {
      name: "Trajes",
      icon: "🛡️"
    },

    helmets: {
      name: "Cascos",
      icon: "⛑️"
    },

    accessories: {
      name: "Accesorios",
      icon: "🎒"
    },

    effects: {
      name: "Efectos",
      icon: "✨"
    },

    colors: {
      name: "Colores",
      icon: "🎨"
    }
  };

  /* =======================================================
     OBTENER ITEM
     ======================================================= */

  function getShopItem(
    category,
    id
  ) {
    if (
      category === "weapons"
    ) {
      if (
        typeof window.getScorvexWeapon ===
        "function"
      ) {
        return window.getScorvexWeapon(id);
      }

      return (
        window.SCORVEX_WEAPONS &&
        window.SCORVEX_WEAPONS[id]
      ) || null;
    }

    if (
      typeof window.getScorvexCharacterItem ===
      "function"
    ) {
      return window.getScorvexCharacterItem(
        category,
        id
      );
    }

    return null;
  }

  /* =======================================================
     OBTENER PRECIO
     ======================================================= */

  function getPrice(
    category,
    item
  ) {
    if (!item) {
      return 0;
    }

    return Math.max(
      0,
      Number(item.price) || 0
    );
  }

  /* =======================================================
     PROPIEDAD DEL OBJETO
     ======================================================= */

  function getOwnershipKey(
    category
  ) {
    const keys = {
      weapons: "ownedWeapons",
      characters: "ownedCharacters",
      outfits: "ownedOutfits",
      helmets: "ownedHelmets",
      accessories: "ownedAccessories",
      effects: "ownedEffects",
      colors: "ownedColors"
    };

    return keys[category];
  }

  /* =======================================================
     COMPROBAR PROPIEDAD
     ======================================================= */

  function ownsItem(
    save,
    category,
    id
  ) {
    const key =
      getOwnershipKey(category);

    if (!key) {
      return false;
    }

    const list =
      ensureArray(save, key);

    return list.includes(id);
  }

  /* =======================================================
     AÑADIR AL INVENTARIO
     ======================================================= */

  function addItem(
    save,
    category,
    id
  ) {
    const key =
      getOwnershipKey(category);

    if (!key) {
      return false;
    }

    const list =
      ensureArray(save, key);

    if (!list.includes(id)) {
      list.push(id);
    }

    return true;
  }

  /* =======================================================
     COMPRAR
     ======================================================= */

  function buy(
    category,
    id
  ) {
    const save = getSave();

    if (!save) {
      notify(
        "No se encontró la partida."
      );

      return {
        success: false,
        reason: "NO_SAVE"
      };
    }

    const item =
      getShopItem(
        category,
        id
      );

    if (!item) {
      notify(
        "Objeto no encontrado."
      );

      return {
        success: false,
        reason: "NOT_FOUND"
      };
    }

    if (
      ownsItem(
        save,
        category,
        id
      )
    ) {
      notify(
        "Ya tienes este objeto."
      );

      return {
        success: false,
        reason: "OWNED"
      };
    }

    const price =
      getPrice(
        category,
        item
      );

    const coins =
      Number(save.coins) || 0;

    if (coins < price) {
      notify(
        `Necesitas ${formatMoney(price)} monedas.`
      );

      return {
        success: false,
        reason: "NOT_ENOUGH_COINS",
        required: price,
        current: coins
      };
    }

    save.coins =
      coins - price;

    addItem(
      save,
      category,
      id
    );

    saveGame(save);

    notify(
      `${item.name} comprado.`
    );

    return {
      success: true,
      item,
      save
    };
  }

  /* =======================================================
     EQUIPAR
     ======================================================= */

  function equip(
    category,
    id
  ) {
    const save = getSave();

    if (!save) {
      return {
        success: false,
        reason: "NO_SAVE"
      };
    }

    const item =
      getShopItem(
        category,
        id
      );

    if (!item) {
      return {
        success: false,
        reason: "NOT_FOUND"
      };
    }

    if (
      !ownsItem(
        save,
        category,
        id
      )
    ) {
      notify(
        "Primero debes conseguir este objeto."
      );

      return {
        success: false,
        reason: "NOT_OWNED"
      };
    }

    const equipKeys = {
      weapons: "weapon",
      characters: "character",
      outfits: "outfit",
      helmets: "helmet",
      accessories: "accessory",
      effects: "effect",
      colors: "color"
    };

    const key =
      equipKeys[category];

    if (!key) {
      return {
        success: false,
        reason: "INVALID_CATEGORY"
      };
    }

    save[key] = id;

    saveGame(save);

    notify(
      `${item.name} equipado.`
    );

    return {
      success: true,
      item,
      save
    };
  }

  /* =======================================================
     COMPRAR Y EQUIPAR
     ======================================================= */

  function buyAndEquip(
    category,
    id
  ) {
    const save =
      getSave();

    if (
      save &&
      ownsItem(
        save,
        category,
        id
      )
    ) {
      return equip(
        category,
        id
      );
    }

    const result =
      buy(
        category,
        id
      );

    if (!result.success) {
      return result;
    }

    return equip(
      category,
      id
    );
  }

  /* =======================================================
     ARMAR LISTA DE TIENDA
     ======================================================= */

  function getItems(
    category
  ) {
    if (
      category === "weapons"
    ) {
      return Object.values(
        window.SCORVEX_WEAPONS || {}
      );
    }

    const database =
      window.SCORVEX_CHARACTERS;

    if (
      !database ||
      !Array.isArray(
        database[category]
      )
    ) {
      return [];
    }

    return database[category];
  }

  /* =======================================================
     FILTRO DE TIENDA
     ======================================================= */

  function filterItems(
    category,
    options = {}
  ) {
    let items =
      getItems(category);

    if (
      options.rarity
    ) {
      items =
        items.filter(
          item =>
            item.rarity ===
            options.rarity
        );
    }

    if (
      options.search
    ) {
      const search =
        String(
          options.search
        ).toLowerCase();

      items =
        items.filter(
          item =>
            String(
              item.name || ""
            )
              .toLowerCase()
              .includes(search)
        );
    }

    if (
      Number.isFinite(
        options.minPrice
      )
    ) {
      items =
        items.filter(
          item =>
            Number(item.price || 0) >=
            options.minPrice
        );
    }

    if (
      Number.isFinite(
        options.maxPrice
      )
    ) {
      items =
        items.filter(
          item =>
            Number(item.price || 0) <=
            options.maxPrice
        );
    }

    if (
      options.sort === "price_asc"
    ) {
      items.sort(
        (a, b) =>
          (a.price || 0) -
          (b.price || 0)
      );
    }

    if (
      options.sort === "price_desc"
    ) {
      items.sort(
        (a, b) =>
          (b.price || 0) -
          (a.price || 0)
      );
    }

    return items;
  }

  /* =======================================================
     RENDERIZAR TARJETA
     ======================================================= */

  function createCard(
    category,
    item,
    save
  ) {
    const card =
      document.createElement(
        "article"
      );

    card.className =
      "shop-item-card";

    const owned =
      ownsItem(
        save,
        category,
        item.id
      );

    const equipped =
      save[
        {
          weapons: "weapon",
          characters: "character",
          outfits: "outfit",
          helmets: "helmet",
          accessories: "accessory",
          effects: "effect",
          colors: "color"
        }[category]
      ] === item.id;

    const rarity =
      item.rarity || "common";

    const price =
      getPrice(
        category,
        item
      );

    card.innerHTML = `
      <div class="shop-item-icon">
        ${
          item.icon ||
          (
            item.color
              ? `<span
                   style="
                     display:block;
                     width:48px;
                     height:48px;
                     border-radius:50%;
                     background:${item.color};
                     box-shadow:0 0 25px ${item.color};
                   "
                 ></span>`
              : `<span class="shop-generic-icon">
                   ✦
                 </span>`
          )
        }
      </div>

      <div class="shop-item-info">

        <div
          class="shop-item-rarity ${rarity}"
        >
          ${
            item.rarityName ||
            rarity.toUpperCase()
          }
        </div>

        <h3>
          ${item.name}
        </h3>

        ${
          item.description
            ? `<p>${item.description}</p>`
            : ""
        }

        ${
          category === "weapons"
            ? `
              <div class="shop-stats">
                <span>⚡ ${item.damage}</span>
                <span>🎯 ${item.accuracy}</span>
                <span>📦 ${item.magazine}</span>
              </div>
            `
            : ""
        }

        <div class="shop-price">
          ${
            price === 0
              ? "GRATIS"
              : `🪙 ${formatMoney(price)}`
          }
        </div>

        <div class="shop-actions">

          ${
            equipped
              ? `
                <button
                  class="shop-button equipped"
                  disabled
                >
                  EQUIPADO
                </button>
              `
              : owned
                ? `
                  <button
                    class="shop-button equip"
                    data-shop-action="equip"
                    data-shop-category="${category}"
                    data-shop-id="${item.id}"
                  >
                    EQUIPAR
                  </button>
                `
                : `
                  <button
                    class="shop-button buy"
                    data-shop-action="buy"
                    data-shop-category="${category}"
                    data-shop-id="${item.id}"
                  >
                    COMPRAR
                  </button>
                `
          }

        </div>

      </div>
    `;

    return card;
  }

  /* =======================================================
     RENDERIZAR TIENDA
     ======================================================= */

  function render(
    container,
    category = "weapons",
    options = {}
  ) {
    if (!container) {
      return;
    }

    const save =
      getSave() || {
        coins: 0
      };

    const items =
      filterItems(
        category,
        options
      );

    container.innerHTML = "";

    const fragment =
      document.createDocumentFragment();

    items.forEach(
      item => {
        fragment.appendChild(
          createCard(
            category,
            item,
            save
          )
        );
      }
    );

    container.appendChild(
      fragment
    );

    bindButtons(
      container
    );
  }

  /* =======================================================
     BOTONES
     ======================================================= */

  function bindButtons(
    container
  ) {
    container
      .querySelectorAll(
        "[data-shop-action]"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const action =
              button.dataset.shopAction;

            const category =
              button.dataset.shopCategory;

            const id =
              button.dataset.shopId;

            let result;

            if (
              action === "buy"
            ) {
              result =
                buyAndEquip(
                  category,
                  id
                );
            }

            if (
              action === "equip"
            ) {
              result =
                equip(
                  category,
                  id
                );
            }

            if (
              result &&
              result.success
            ) {
              render(
                container,
                category
              );
            }

          }
        );

      });
  }

  /* =======================================================
     OBTENER BALANCE
     ======================================================= */

  function getBalance() {
    const save =
      getSave();

    if (!save) {
      return {
        coins: 0,
        crystals: 0
      };
    }

    return {
      coins:
        Number(save.coins) || 0,

      crystals:
        Number(save.crystals) || 0
    };
  }

  /* =======================================================
     EVENTOS
     ======================================================= */

  window.addEventListener(
    "scorvex-save-updated",
    () => {
      window.dispatchEvent(
        new CustomEvent(
          "scorvex-shop-refresh"
        )
      );
    }
  );

  /* =======================================================
     API GLOBAL
     ======================================================= */

  window.SCORVEX_SHOP = {

    categories:
      SHOP_CATEGORIES,

    getItem:
      getShopItem,

    getItems,

    filterItems,

    getBalance,

    ownsItem,

    buy,

    equip,

    buyAndEquip,

    render,

    formatMoney

  };

  console.log(
    "SCORVEX G7: tienda cargada."
  );

})();
