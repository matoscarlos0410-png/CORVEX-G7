/* =========================================================
   SCORVEX G7 — MISSIONS SYSTEM
   Archivo: missions-g7.js
   ========================================================= */

(() => {
  "use strict";

  const SAVE_KEY = "SCORVEX_G7_SAVE";

  /* ---------------------------------------------------------
     MISIONES
     --------------------------------------------------------- */

  const MISSIONS = {

    eliminate_10: {
      id: "eliminate_10",
      name: "Primer Contacto",
      description: "Derrota 10 enemigos.",
      type: "kills",
      target: 10,
      reward: {
        coins: 2500,
        crystals: 2,
        xp: 150
      }
    },

    eliminate_50: {
      id: "eliminate_50",
      name: "Cazador SCORVEX",
      description: "Derrota 50 enemigos.",
      type: "kills",
      target: 50,
      reward: {
        coins: 10000,
        crystals: 5,
        xp: 500
      }
    },

    damage_10000: {
      id: "damage_10000",
      name: "Potencia de Fuego",
      description: "Inflige 10 000 puntos de daño.",
      type: "damage",
      target: 10000,
      reward: {
        coins: 15000,
        crystals: 8,
        xp: 750
      }
    },

    use_abilities: {
      id: "use_abilities",
      name: "Dominio de Energía",
      description: "Utiliza habilidades 15 veces.",
      type: "abilities",
      target: 15,
      reward: {
        coins: 12000,
        crystals: 6,
        xp: 600
      }
    },

    defeat_boss: {
      id: "defeat_boss",
      name: "Cazador de Jefes",
      description: "Derrota 1 jefe.",
      type: "bosses",
      target: 1,
      reward: {
        coins: 30000,
        crystals: 15,
        xp: 1500
      }
    }

  };

  /* ---------------------------------------------------------
     GUARDADO
     --------------------------------------------------------- */

  function getSave() {

    try {

      const raw =
        localStorage.getItem(SAVE_KEY);

      if (!raw) {
        return {};
      }

      return JSON.parse(raw);

    } catch (error) {

      console.warn(
        "No se pudo leer el guardado de SCORVEX G7.",
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
        "No se pudo guardar SCORVEX G7.",
        error
      );

      return false;

    }
  }

  /* ---------------------------------------------------------
     ESTADO DE MISIONES
     --------------------------------------------------------- */

  function getMissionState(save = getSave()) {

    if (!save.missions) {
      save.missions = {};
    }

    Object.keys(MISSIONS).forEach(id => {

      if (!save.missions[id]) {

        save.missions[id] = {
          progress: 0,
          completed: false,
          claimed: false
        };

      }

    });

    return save.missions;
  }

  /* ---------------------------------------------------------
     ACTUALIZAR PROGRESO
     --------------------------------------------------------- */

  function updateMission(type, amount = 1) {

    const save = getSave();

    const missions =
      getMissionState(save);

    let changed = false;

    Object.values(MISSIONS).forEach(mission => {

      if (mission.type !== type) {
        return;
      }

      const state =
        missions[mission.id];

      if (state.claimed) {
        return;
      }

      state.progress = Math.min(
        mission.target,
        state.progress + Math.max(0, amount)
      );

      if (
        state.progress >= mission.target
      ) {

        state.progress =
          mission.target;

        state.completed = true;

      }

      changed = true;

    });

    if (changed) {
      saveGame(save);
    }

    return getMissionState(save);
  }

  /* ---------------------------------------------------------
     MÉTODOS RÁPIDOS
     --------------------------------------------------------- */

  function enemyDefeated(amount = 1) {
    return updateMission(
      "kills",
      amount
    );
  }

  function damageDealt(amount = 1) {
    return updateMission(
      "damage",
      amount
    );
  }

  function abilityUsed(amount = 1) {
    return updateMission(
      "abilities",
      amount
    );
  }

  function bossDefeated(amount = 1) {
    return updateMission(
      "bosses",
      amount
    );
  }

  /* ---------------------------------------------------------
     COMPROBAR SI ESTÁ COMPLETADA
     --------------------------------------------------------- */

  function isCompleted(id) {

    const save = getSave();

    const missions =
      getMissionState(save);

    return Boolean(
      missions[id] &&
      missions[id].completed
    );

  }

  /* ---------------------------------------------------------
     RECLAMAR RECOMPENSA
     --------------------------------------------------------- */

  function claimMission(id) {

    const mission =
      MISSIONS[id];

    if (!mission) {

      return {
        success: false,
        message: "Misión no encontrada."
      };

    }

    const save = getSave();

    const missions =
      getMissionState(save);

    const state =
      missions[id];

    if (!state.completed) {

      return {
        success: false,
        message: "La misión todavía no está completada."
      };

    }

    if (state.claimed) {

      return {
        success: false,
        message: "Esta recompensa ya fue reclamada."
      };

    }

    save.coins =
      Number(save.coins || 0) +
      Number(mission.reward.coins || 0);

    save.crystals =
      Number(save.crystals || 0) +
      Number(mission.reward.crystals || 0);

    save.xp =
      Number(save.xp || 0) +
      Number(mission.reward.xp || 0);

    state.claimed = true;

    saveGame(save);

    return {
      success: true,
      message: "Recompensa reclamada.",
      reward: {
        ...mission.reward
      }
    };

  }

  /* ---------------------------------------------------------
     RECLAMAR TODAS
     --------------------------------------------------------- */

  function claimAllCompleted() {

    const results = [];

    Object.keys(MISSIONS).forEach(id => {

      if (isCompleted(id)) {

        const result =
          claimMission(id);

        if (result.success) {
          results.push({
            id,
            reward: result.reward
          });
        }

      }

    });

    return results;
  }

  /* ---------------------------------------------------------
     RESET DE MISIONES
     --------------------------------------------------------- */

  function resetMissions() {

    const save = getSave();

    save.missions = {};

    getMissionState(save);

    saveGame(save);

    return save.missions;
  }

  /* ---------------------------------------------------------
     OBTENER UNA MISIÓN
     --------------------------------------------------------- */

  function getMission(id) {
    return MISSIONS[id] || null;
  }

  /* ---------------------------------------------------------
     OBTENER TODAS
     --------------------------------------------------------- */

  function getAllMissions() {
    return Object.values(MISSIONS);
  }

  /* ---------------------------------------------------------
     OBTENER ESTADO COMPLETO
     --------------------------------------------------------- */

  function getMissionProgress(id) {

    const mission =
      MISSIONS[id];

    if (!mission) {
      return null;
    }

    const save = getSave();

    const missions =
      getMissionState(save);

    const state =
      missions[id];

    return {
      ...mission,
      progress: state.progress,
      completed: state.completed,
      claimed: state.claimed,
      percentage: Math.min(
        100,
        Math.round(
          (state.progress / mission.target) * 100
        )
      )
    };

  }

  /* ---------------------------------------------------------
     RENDERIZAR MISIONES
     --------------------------------------------------------- */

  function render(container) {

    if (!container) {
      return;
    }

    container.innerHTML = "";

    Object.keys(MISSIONS).forEach(id => {

      const mission =
        getMissionProgress(id);

      const card =
        document.createElement("div");

      card.className =
        "mission-card";

      card.dataset.missionId =
        mission.id;

      const percentage =
        mission.percentage;

      card.innerHTML = `

        <div class="mission-card-header">

          <div>
            <h3>${mission.name}</h3>
            <p>${mission.description}</p>
          </div>

          <span class="mission-status">
            ${
              mission.claimed
                ? "RECLAMADA"
                : mission.completed
                  ? "COMPLETADA"
                  : "EN PROGRESO"
            }
          </span>

        </div>

        <div class="mission-progress">

          <div
            class="mission-progress-bar"
            style="width:${percentage}%"
          ></div>

        </div>

        <div class="mission-progress-text">

          ${mission.progress}
          /
          ${mission.target}

          <span>${percentage}%</span>

        </div>

        <div class="mission-reward">

          <span>
            🪙 ${mission.reward.coins.toLocaleString()}
          </span>

          <span>
            💎 ${mission.reward.crystals}
          </span>

          <span>
            ⭐ ${mission.reward.xp} XP
          </span>

        </div>

        <button
          class="mission-claim-btn"
          data-mission="${mission.id}"
          ${!mission.completed || mission.claimed ? "disabled" : ""}
        >
          ${
            mission.claimed
              ? "RECLAMADA"
              : mission.completed
                ? "RECLAMAR"
                : "EN PROGRESO"
          }
        </button>

      `;

      container.appendChild(card);

    });

    bindClaimButtons(container);

  }

  /* ---------------------------------------------------------
     BOTONES DE RECLAMACIÓN
     --------------------------------------------------------- */

  function bindClaimButtons(container) {

    container
      .querySelectorAll(
        ".mission-claim-btn"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const id =
              button.dataset.mission;

            const result =
              claimMission(id);

            if (
              result.success &&
              window.SCORVEX_AUDIO
            ) {

              window.SCORVEX_AUDIO
                .purchase();

            }

            render(container);

            window.dispatchEvent(
              new CustomEvent(
                "scorvex-mission-claimed",
                {
                  detail: result
                }
              )
            );

          }
        );

      });

  }

  /* ---------------------------------------------------------
     EVENTOS AUTOMÁTICOS
     --------------------------------------------------------- */

  window.addEventListener(
    "scorvex-enemy-defeated",
    event => {

      const amount =
        Number(
          event.detail?.amount || 1
        );

      enemyDefeated(amount);

    }
  );

  window.addEventListener(
    "scorvex-damage-dealt",
    event => {

      const amount =
        Number(
          event.detail?.amount || 0
        );

      if (amount > 0) {
        damageDealt(amount);
      }

    }
  );

  window.addEventListener(
    "scorvex-ability-used",
    event => {

      const amount =
        Number(
          event.detail?.amount || 1
        );

      abilityUsed(amount);

    }
  );

  window.addEventListener(
    "scorvex-boss-defeated",
    event => {

      const amount =
        Number(
          event.detail?.amount || 1
        );

      bossDefeated(amount);

    }
  );

  /* ---------------------------------------------------------
     EXPORTAR
     --------------------------------------------------------- */

  window.SCORVEX_MISSIONS = {

    missions: MISSIONS,

    getSave,

    saveGame,

    getMission,

    getAllMissions,

    getMissionState,

    getMissionProgress,

    updateMission,

    enemyDefeated,

    damageDealt,

    abilityUsed,

    bossDefeated,

    isCompleted,

    claimMission,

    claimAllCompleted,

    resetMissions,

    render

  };

  /* ---------------------------------------------------------
     INICIALIZACIÓN
     --------------------------------------------------------- */

  const initialSave =
    getSave();

  getMissionState(initialSave);

  saveGame(initialSave);

  console.log(
    "SCORVEX G7 — Sistema de misiones cargado:",
    Object.keys(MISSIONS).length,
    "misiones"
  );

})();
