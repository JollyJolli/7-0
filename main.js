(() => {
  "use strict";

  try { window.bot7a0?.destruir?.({ silencioso: true }); } catch {}

  const C = {
    total: 11,
    maxRerolls: 3,
    intervalo: 350,
    render: 7000,
    pausaTirar: 700,
    pausaElegir: 450,
    pausaColocar: 800,
    pausaMundial: 1100,
    excelente: 89,
    umbral: { temprano: 81, medio: 79, tarde: 76 },
    cacheDias: 30
  };

  const S = {
    activo: true,
    ocupado: false,
    finalizando: false,
    finalizado: false,
    destruido: false,
    mundialLanzado: false,
    fase: "Iniciando",
    detalle: "Preparando el director técnico",
    fuente: "Esperando tirada",
    tiradas: 0,
    picks: 0,
    colocados: 0,
    rerolls: 0,
    errores: 0,
    consultas: 0,
    cacheHits: 0,
    inicio: Date.now(),
    timer: null,
    observer: null,
    actual: null,
    equipoReal: [],
    firmaRerollBloqueada: ""
  };

  const COMP = {
    POR: ["POR"],
    LD: ["LD", "MD", "DFC"],
    LI: ["LI", "MI", "DFC"],
    DFC: ["DFC", "LD", "LI", "VOL"],
    MD: ["MD", "LD", "MC", "ED"],
    MI: ["MI", "LI", "MC", "EI"],
    VOL: ["VOL", "MC", "DFC"],
    MC: ["MC", "VOL", "MEI", "MD", "MI"],
    MEI: ["MEI", "MC", "EI", "ED", "DC"],
    EI: ["EI", "MI", "MEI", "ED", "DC"],
    ED: ["ED", "MD", "MEI", "EI", "DC"],
    DC: ["DC", "MEI", "EI", "ED"]
  };

  const RAREZA = {
    POR: 5,
    LD: 3.8,
    LI: 3.8,
    DFC: 3.1,
    VOL: 3,
    MC: 2.7,
    MD: 2.7,
    MI: 2.7,
    MEI: 2.6,
    EI: 2.3,
    ED: 2.3,
    DC: 2
  };

  const PAISES = {
    "alemania": "ger",
    "argelia": "alg",
    "angola": "ang",
    "arabia saudita": "ksa",
    "argentina": "arg",
    "australia": "aus",
    "austria": "aut",
    "belgica": "bel",
    "bolivia": "bol",
    "bosnia y herzegovina": "bih",
    "brasil": "bra",
    "bulgaria": "bul",
    "camerun": "cmr",
    "canada": "can",
    "chile": "chi",
    "china": "chn",
    "colombia": "col",
    "corea del norte": "prk",
    "corea del sur": "kor",
    "costa de marfil": "civ",
    "costa rica": "crc",
    "croacia": "cro",
    "cuba": "cub",
    "dinamarca": "den",
    "ecuador": "ecu",
    "egipto": "egy",
    "el salvador": "slv",
    "emiratos arabes unidos": "uae",
    "escocia": "sco",
    "eslovaquia": "svk",
    "eslovenia": "svn",
    "espana": "esp",
    "estados unidos": "usa",
    "francia": "fra",
    "gales": "wal",
    "ghana": "gha",
    "grecia": "gre",
    "haiti": "hai",
    "honduras": "hon",
    "hungria": "hun",
    "indonesia": "idn",
    "inglaterra": "eng",
    "iran": "irn",
    "iraq": "irq",
    "irlanda": "irl",
    "irlanda del norte": "nir",
    "islandia": "isl",
    "israel": "isr",
    "italia": "ita",
    "jamaica": "jam",
    "japon": "jpn",
    "kuwait": "kuw",
    "marruecos": "mar",
    "mexico": "mex",
    "nigeria": "nga",
    "noruega": "nor",
    "nueva zelanda": "nzl",
    "paises bajos": "ned",
    "panama": "pan",
    "paraguay": "par",
    "peru": "per",
    "polonia": "pol",
    "portugal": "por",
    "qatar": "qat",
    "republica checa": "cze",
    "republica de irlanda": "irl",
    "rumania": "rou",
    "rusia": "rus",
    "senegal": "sen",
    "serbia": "srb",
    "sudafrica": "rsa",
    "suecia": "swe",
    "suiza": "sui",
    "togo": "tog",
    "trinidad y tobago": "tri",
    "tunez": "tun",
    "turquia": "tur",
    "ucrania": "ukr",
    "union sovietica": "urs",
    "uruguay": "uru",
    "yugoslavia": "yug",
    "zaire": "zai"
  };

  const cachePlantel = new Map();
  const cacheCodigo = new Map();
  const cacheAnio = new Map();

  const CSS = `
  #b70,#b70 *{box-sizing:border-box}#b70{position:fixed;right:14px;bottom:14px;z-index:2147483646;width:min(380px,calc(100vw - 22px));font-family:Inter,system-ui,sans-serif;color:#f8fafc;background:rgba(15,23,42,.96);border:1px solid #ffffff24;border-radius:18px;box-shadow:0 20px 60px #0007;backdrop-filter:blur(14px);overflow:hidden}#b70.mini .body{display:none}#b70 .head{display:flex;justify-content:space-between;align-items:center;padding:12px 13px;background:linear-gradient(135deg,#7c3aed,#2563eb)}#b70 .brand{display:flex;gap:9px;align-items:center}#b70 .ball{font-size:23px}#b70 .title{font-size:13px;font-weight:950;letter-spacing:.05em}#b70 .sub{font-size:9px;opacity:.8}#b70 .hbtn{border:0;border-radius:8px;width:29px;height:29px;margin-left:5px;background:#ffffff24;color:#fff;font-weight:900;cursor:pointer}#b70 .body{padding:12px}#b70 .row{display:flex;justify-content:space-between;align-items:center;gap:8px}#b70 .status{display:flex;align-items:center;gap:7px;font-size:12px;font-weight:850}#b70 .dot{width:9px;height:9px;border-radius:50%;background:#22c55e;box-shadow:0 0 12px #22c55e}#b70[data-state=paused] .dot{background:#f59e0b;box-shadow:0 0 12px #f59e0b}#b70[data-state=done] .dot{background:#eab308;box-shadow:0 0 12px #eab308}#b70 .rer{font-size:11px;color:#cbd5e1}#b70 .phase,#b70 .source{margin-top:8px;padding:8px 9px;border-radius:10px;font-size:10px;line-height:1.4}#b70 .phase{background:#ffffff0e;color:#dbeafe}#b70 .source{background:#22c55e16;border:1px solid #22c55e2e;color:#bbf7d0}#b70 .plabel{display:flex;justify-content:space-between;margin:10px 0 5px;font-size:11px;color:#cbd5e1}#b70 .progress{height:9px;background:#1e293b;border-radius:99px;overflow:hidden}#b70 .progress span{display:block;height:100%;width:0;background:linear-gradient(90deg,#22c55e,#84cc16);transition:.3s}#b70 .stats{display:grid;grid-template-columns:repeat(4,1fr);gap:7px;margin-top:10px}#b70 .stat{padding:7px 4px;text-align:center;border-radius:10px;background:#ffffff0d}#b70 .stat b{display:block;font-size:14px}#b70 .stat small{font-size:8px;color:#94a3b8;text-transform:uppercase}#b70 .controls{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:11px}#b70 .btn{border:0;border-radius:10px;padding:9px;color:#fff;background:#334155;font-size:11px;font-weight:850;cursor:pointer}#b70 .primary{background:linear-gradient(135deg,#2563eb,#7c3aed)}#b70 .green{background:#15803d}#b70 .red{background:#991b1b}#b70 .foot{margin-top:8px;text-align:center;color:#64748b;font-size:9px}#b70t{position:fixed;right:16px;bottom:405px;z-index:2147483647;width:min(380px,calc(100vw - 22px));display:flex;flex-direction:column;gap:7px;pointer-events:none}.b70toast{opacity:0;transform:translateY(10px);transition:.22s;padding:10px 11px;border-radius:12px;color:#fff;background:rgba(15,23,42,.97);border-left:4px solid #3b82f6;box-shadow:0 10px 30px #0006;font-family:Inter,system-ui,sans-serif}.b70toast.show{opacity:1;transform:none}.b70toast.ok{border-color:#22c55e}.b70toast.warn{border-color:#f59e0b}.b70toast.err{border-color:#ef4444}.b70toast b{font-size:12px}.b70toast div{margin-top:3px;color:#cbd5e1;font-size:10px;line-height:1.35}.b70-player{outline:3px solid #22c55e!important;box-shadow:0 0 0 5px #22c5538!important}.b70-slot{outline:3px solid #facc15!important;box-shadow:0 0 0 5px #facc1538!important}.b70-world{outline:4px solid #a855f7!important;box-shadow:0 0 0 7px #a855f740!important}@media(max-width:640px){#b70{right:7px;bottom:7px}#b70t{right:7px;bottom:390px}}
  `;

  const sleep = ms =>
    new Promise(resolve => setTimeout(resolve, ms));

  const text = (root, selector) =>
    root
      ?.querySelector(selector)
      ?.textContent
      ?.replace(/\s+/g, " ")
      .trim() || "";

  function norm(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[’'`´]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, " ")
      .trim()
      .toLowerCase();
  }

  function normName(value) {
    return norm(
      String(value || "")
        .replace(/★|\([^)]*\)/g, "")
    );
  }

  function esc(value) {
    return String(value).replace(
      /[&<>"]/g,
      character => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;"
      })[character]
    );
  }

  function visible(element) {
    if (
      !element ||
      !document.documentElement.contains(element)
    ) {
      return false;
    }

    const style = getComputedStyle(element);
    const rectangle = element.getBoundingClientRect();

    return (
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      rectangle.width > 0 &&
      rectangle.height > 0
    );
  }

  function wait(test, timeout = C.render) {
    return new Promise(resolve => {
      const started = Date.now();

      const tick = () => {
        try {
          if (test()) {
            resolve(true);
            return;
          }
        } catch {}

        if (Date.now() - started >= timeout) {
          resolve(false);
          return;
        }

        setTimeout(tick, 100);
      };

      tick();
    });
  }

  function click(element) {
    if (!element) return false;

    try {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
      });
    } catch {}

    element.click();
    return true;
  }

  function flash(element, className, duration = 650) {
    if (!element) return;

    element.classList.add(className);

    setTimeout(() => {
      element.classList.remove(className);
    }, duration);
  }

  function localePrefix() {
    const match = location.pathname.match(
      /^\/(en|es|fr|pl|it|de|tr)(?:\/|$)/i
    );

    return match
      ? `/${match[1].toLowerCase()}`
      : "";
  }

  function toast(
    title,
    message,
    type = "",
    duration = 3400
  ) {
    const root = document.getElementById("b70t");

    if (!root) return;

    const element = document.createElement("div");

    element.className = `b70toast ${type}`;
    element.innerHTML = `
      <b>${esc(title)}</b>
      <div>${esc(message)}</div>
    `;

    root.prepend(element);

    requestAnimationFrame(() => {
      element.classList.add("show");
    });

    setTimeout(() => {
      element.classList.remove("show");

      setTimeout(() => {
        element.remove();
      }, 250);
    }, duration);

    while (root.children.length > 4) {
      root.lastElementChild?.remove();
    }
  }

  function injectUI() {
    document.getElementById("b70style")?.remove();
    document.getElementById("b70")?.remove();
    document.getElementById("b70t")?.remove();

    const style = document.createElement("style");

    style.id = "b70style";
    style.textContent = CSS;

    document.head.appendChild(style);

    const toasts = document.createElement("div");

    toasts.id = "b70t";

    document.body.appendChild(toasts);

    const panel = document.createElement("section");

    panel.id = "b70";
    panel.dataset.state = "run";

    panel.innerHTML = `
      <div class="head">
        <div class="brand">
          <span class="ball">⚽</span>

          <div>
            <div class="title">
              BOT 7A0 · DIRECTOR TÉCNICO
            </div>

            <div class="sub">
              clásico + de memoria · 3 re-sorteos
            </div>
          </div>
        </div>

        <div>
          <button class="hbtn" data-a="mini">—</button>
          <button class="hbtn" data-a="close">×</button>
        </div>
      </div>

      <div class="body">
        <div class="row">
          <div class="status">
            <span class="dot"></span>
            <span data-u="status">Activo</span>
          </div>

          <div class="rer">
            🔁 <b data-u="rer">3</b> disponibles
          </div>
        </div>

        <div class="phase">
          <b data-u="phase">Iniciando</b>
          <br>
          <span data-u="detail">Preparando…</span>
        </div>

        <div class="source">
          🧠 <b>Datos:</b>
          <span data-u="source">Esperando tirada</span>
        </div>

        <div class="plabel">
          <span>Progreso del XI</span>
          <b data-u="count">0/11</b>
        </div>

        <div class="progress">
          <span data-u="bar"></span>
        </div>

        <div class="stats">
          <div class="stat">
            <b data-u="ovr">?</b>
            <small>ovr bot</small>
          </div>

          <div class="stat">
            <b data-u="rolls">0</b>
            <small>tiradas</small>
          </div>

          <div class="stat">
            <b data-u="picks">0</b>
            <small>elegidos</small>
          </div>

          <div class="stat">
            <b data-u="req">0</b>
            <small>consultas</small>
          </div>
        </div>

        <div class="controls">
          <button class="btn primary" data-a="pause">
            ⏸ Pausar
          </button>

          <button class="btn" data-a="step">
            ⏭ Un paso
          </button>

          <button class="btn green" data-a="team">
            📋 Ver XI
          </button>

          <button class="btn red" data-a="stop">
            ⛔ Detener
          </button>
        </div>

        <div class="foot">
          al completar 11/11 entra automáticamente al Mundial
        </div>
      </div>
    `;

    document.body.appendChild(panel);

    panel.addEventListener("click", event => {
      const button = event.target.closest("[data-a]");

      if (!button) return;

      if (button.dataset.a === "mini") {
        panel.classList.toggle("mini");
      }

      if (button.dataset.a === "close") {
        panel.style.display = "none";
      }

      if (button.dataset.a === "pause") {
        S.activo ? pause() : resume();
      }

      if (button.dataset.a === "step") {
        step(true);
      }

      if (button.dataset.a === "team") {
        showTeam();
      }

      if (button.dataset.a === "stop") {
        stop();
      }
    });
  }

  const U = key =>
    document.querySelector(`#b70 [data-u="${key}"]`);

  function phase(name, detail = "") {
    S.fase = name;
    S.detalle = detail;

    updateUI();
  }

  function updateUI() {
    const panel = document.getElementById("b70");

    if (!panel) return;

    const playerCount = count();
    const teamOverall = overall();

    panel.dataset.state = S.finalizado
      ? "done"
      : S.activo
        ? "run"
        : "paused";

    U("status").textContent = S.finalizado
      ? "Mundial iniciado"
      : S.finalizando
        ? "Finalizando"
        : S.activo
          ? S.ocupado
            ? "Trabajando"
            : "Activo"
          : "Pausado";

    U("rer").textContent = rerollsLeft();
    U("phase").textContent = S.fase;
    U("detail").textContent = S.detalle || "—";
    U("source").textContent = S.fuente;
    U("count").textContent = `${playerCount}/${C.total}`;

    U("bar").style.width =
      `${Math.min(100, playerCount / C.total * 100)}%`;

    U("ovr").textContent = teamOverall ?? "?";
    U("rolls").textContent = S.tiradas;
    U("picks").textContent = S.picks;
    U("req").textContent = S.consultas;

    panel.querySelector('[data-a="pause"]').textContent =
      S.activo
        ? "⏸ Pausar"
        : "▶ Reanudar";
  }

  function count() {
    const match = (
      document.querySelector(".box-head .eyebrow")
        ?.textContent || ""
    ).match(/(\d+)\s*\/\s*11/);

    if (match) {
      return Number(match[1]);
    }

    return [
      ...document.querySelectorAll(".boxscore tbody tr")
    ].filter(row => (
      !row.classList.contains("empty") &&
      row.children[1]?.textContent?.trim() !== "—"
    )).length;
  }

  /*
 * Overall mostrado oficialmente por 7a0.
 *
 * En modo Clásico normalmente devuelve un número.
 * En modo De memoria devuelve null porque la página muestra "?".
 */
function overallJuego() {
  const raw =
    document
      .querySelector(".box-head > .num")
      ?.textContent
      ?.trim() || "";

  if (
    !raw ||
    raw === "?"
  ) {
    return null;
  }

  const number = Number(raw);

  return Number.isFinite(number)
    ? number
    : null;
}

/*
 * Lee el equipo del box score.
 *
 * Cuando la fuerza está oculta, utiliza el valor que
 * guardamos al colocar al jugador.
 */
function team() {
  return [
    ...document.querySelectorAll(".boxscore tbody tr")
  ]
    .map((row, index) => {
      const position =
        row.children[0]?.textContent?.trim() || "";

      const player =
        row.children[1]?.textContent?.trim() || "";

      const forceText =
        row.children[2]?.textContent?.trim() || "";

      const visibleForce =
        forceText &&
        forceText !== "?"
          ? Number(forceText)
          : NaN;

      /*
       * Primero relacionamos por fila.
       * Esto permite incluso tener dos versiones
       * distintas de un jugador con el mismo nombre.
       */
      const savedByRow =
        S.equipoReal.find(saved =>
          saved.fila === index
        );

      /*
       * Respaldo por nombre cuando no pudimos
       * identificar la fila al colocarlo.
       */
      const sameName =
        S.equipoReal.filter(saved =>
          normName(saved.nombre) ===
          normName(player)
        );

      const savedByName =
        sameName.length === 1
          ? sameName[0]
          : null;

      const saved =
        savedByRow ||
        savedByName;

      const force =
        Number.isFinite(visibleForce)
          ? visibleForce
          : Number.isFinite(saved?.fuerza)
            ? saved.fuerza
            : null;

      return {
        posición: position,
        jugador: player,
        fuerza: force,

        empty:
          row.classList.contains("empty") ||
          !player ||
          player === "—"
      };
    })
    .filter(player => !player.empty)
    .map(({ empty, ...player }) => player);
}

/*
 * Calcula el promedio de fuerza de todos
 * los jugadores que ya están colocados.
 *
 * Solo devuelve un resultado cuando conocemos
 * la fuerza de absolutamente todos.
 */
function overallCalculado() {
  const currentTeam = team();

  if (!currentTeam.length) {
    return null;
  }

  const forces = currentTeam
    .map(player => player.fuerza)
    .filter(Number.isFinite);

  /*
   * Evita mostrar una media engañosa si falta
   * conocer la fuerza de algún jugador.
   */
  if (forces.length !== currentTeam.length) {
    return null;
  }

  const total = forces.reduce(
    (sum, force) => sum + force,
    0
  );

  const average =
    total / forces.length;

  /*
   * Una cifra decimal:
   * 86.3636... → 86.4
   */
  return Number(
    average.toFixed(1)
  );
}

/*
 * El panel prioriza nuestro cálculo.
 * Si todavía no podemos calcularlo, utiliza
 * el overall oficial visible del juego.
 */
function overall() {
  return (
    overallCalculado() ??
    overallJuego()
  );
}

  function slots() {
    return [
      ...document.querySelectorAll(".pitch .disc.empty")
    ]
      .filter(visible)
      .map((element, index) => ({
        el: element,
        index,
        pos: text(element, ".disc-circle")
      }))
      .filter(slot => slot.pos);
  }

  function positions(raw) {
    return [
      ...new Set(
        String(raw || "")
          .toUpperCase()
          .replace(/\+\d+/g, "")
          .split(/[\/|,·\s]+/)
          .map(position => position.trim())
          .filter(Boolean)
      )
    ];
  }

  function canFill(playerPositions, slotPosition) {
    return playerPositions.some(position =>
      (
        COMP[slotPosition] ||
        [slotPosition]
      ).includes(position)
    );
  }

  function rawPool() {
    return [
      ...document.querySelectorAll(
        ".draft-pool .pool-row"
      )
    ]
      .filter(button => (
        visible(button) &&
        !button.disabled &&
        !button.classList.contains("not-selectable") &&
        !button.classList.contains("is-selected")
      ))
      .map(button => {
        const positionElement =
          button.querySelector(".pool-pos");

        const rawPosition =
          positionElement
            ?.childNodes?.[0]
            ?.textContent
            ?.trim() ||
          positionElement
            ?.textContent
            ?.trim() ||
          "";

        const visibleForce = Number(
          text(button, ".pool-force")
        );

        return {
          btn: button,

          name:
            text(button, ".pool-name") ||
            "Desconocido",

          number:
            text(button, ".pool-num")
              .replace(/^#/, "") ||
            "?",

          rawPos: rawPosition,

          pos:
            positions(rawPosition),

          force:
            Number.isFinite(visibleForce)
              ? visibleForce
              : null,

          match: null
        };
      });
  }

  function selected() {
    const button = document.querySelector(
      ".draft-pool .pool-row.is-selected"
    );

    if (!button || !visible(button)) {
      return null;
    }

    const positionElement =
      button.querySelector(".pool-pos");

    const rawPosition =
      positionElement
        ?.childNodes?.[0]
        ?.textContent
        ?.trim() ||
      positionElement
        ?.textContent
        ?.trim() ||
      "";

    const name =
      text(button, ".pool-name") ||
      S.actual?.name ||
      "Desconocido";

    const visibleForce = Number(
      text(button, ".pool-force")
    );

    return {
      btn: button,
      name,

      number:
        text(button, ".pool-num")
          .replace(/^#/, "") ||
        S.actual?.number ||
        "?",

      rawPos: rawPosition,
      pos: positions(rawPosition),

      force:
        Number.isFinite(visibleForce)
          ? visibleForce
          : S.actual?.name === name
            ? S.actual.force
            : null
    };
  }

  function pickable() {
    return [
      ...document.querySelectorAll(
        ".pitch .disc.empty.slot-pickable"
      )
    ]
      .filter(visible)
      .map((element, index) => ({
        el: element,
        index,

        pos:
          text(element, ".disc-circle") ||
          "?"
      }));
  }

  function rollButton() {
    return [
      ...document.querySelectorAll(
        "button.roll-btn," +
        ".roll-panel button.btn-primary," +
        ".roll-panel button"
      )
    ].find(button => (
      visible(button) &&
      !button.disabled &&
      /tirar|roll|tira de nuevo/i.test(
        button.textContent || ""
      )
    ));
  }

  function rerollButtons() {
    return [
      ...document.querySelectorAll(".reroll-btn")
    ].filter(button => (
      visible(button) &&
      !button.disabled
    ));
  }

  function rerollsLeft() {
    const match = (
      document.querySelector(".reroll-label")
        ?.textContent || ""
    ).match(
      /(\d+)\s+(?:restante|restantes)/i
    );

    const interfaceValue =
      match
        ? Number(match[1])
        : null;

    const localValue = Math.max(
      0,
      C.maxRerolls - S.rerolls
    );

    return Number.isFinite(interfaceValue)
      ? Math.min(interfaceValue, localValue)
      : localValue;
  }

  function memoryMode() {
    const header =
      document.querySelector(
        ".play-controls .eyebrow"
      )?.textContent || "";

    const active = [
      ...document.querySelectorAll(
        ".chip.is-active,button.is-active"
      )
    ]
      .map(element => element.textContent || "")
      .join(" ");

    return /de memoria|almanaque/i.test(
      `${header} ${active}`
    );
  }

  function drawInfo() {
    const selectionElement =
      document.querySelector(".rr-sel");

    const year = Number(
      (
        document.querySelector(".rr-copa")
          ?.textContent || ""
      ).match(/(19|20)\d{2}/)?.[0]
    );

    let nation = "";

    if (selectionElement) {
      const copy =
        selectionElement.cloneNode(true);

      copy.querySelector(".rr-flag")?.remove();

      nation =
        copy.textContent
          ?.replace(/\s+/g, " ")
          .trim() || "";
    }

    return {
      nation,

      year:
        Number.isFinite(year)
          ? year
          : null
    };
  }

  async function codeFromYearPage(year, nation) {
    if (!cacheAnio.has(year)) {
      cacheAnio.set(
        year,
        (async () => {
          const url =
            `${localePrefix()}/copas/${year}`;

          S.consultas++;
          updateUI();

          const response = await fetch(url, {
            credentials: "same-origin",
            cache: "force-cache"
          });

          if (!response.ok) {
            throw new Error(
              `No se pudo abrir ${url}: ` +
              `HTTP ${response.status}`
            );
          }

          const documentCopy =
            new DOMParser().parseFromString(
              await response.text(),
              "text/html"
            );

          return [
            ...documentCopy.querySelectorAll(
              `a[href*="/copas/${year}/"]`
            )
          ]
            .map(link => ({
              name:
                norm(link.textContent),

              code:
                link
                  .getAttribute("href")
                  ?.split("/")
                  .filter(Boolean)
                  .pop() || ""
            }))
            .filter(link =>
              link.name &&
              link.code
            );
        })()
      );
    }

    const normalizedNation = norm(nation);
    const links = await cacheAnio.get(year);

    return (
      links.find(link =>
        link.name === normalizedNation
      )?.code ||

      links.find(link =>
        link.name.includes(normalizedNation) ||
        normalizedNation.includes(link.name)
      )?.code ||

      null
    );
  }

  async function nationCode(year, nation) {
    const key =
      `${year}:${norm(nation)}`;

    if (cacheCodigo.has(key)) {
      return cacheCodigo.get(key);
    }

    let code =
      PAISES[norm(nation)] ||
      null;

    if (!code) {
      code = await codeFromYearPage(
        year,
        nation
      );
    }

    if (code) {
      cacheCodigo.set(key, code);
    }

    return code;
  }

  function storageKey(year, code) {
    return `bot7a0:v3:${year}:${code}`;
  }

  function readCache(year, code) {
    try {
      const stored = JSON.parse(
        localStorage.getItem(
          storageKey(year, code)
        ) || "null"
      );

      if (
        !stored?.players ||
        Date.now() - stored.at >
          C.cacheDias * 86400000
      ) {
        return null;
      }

      return stored.players;
    } catch {
      return null;
    }
  }

  function saveCache(year, code, players) {
    try {
      localStorage.setItem(
        storageKey(year, code),

        JSON.stringify({
          at: Date.now(),
          players
        })
      );
    } catch {}
  }

  async function squad(year, code) {
    const key = `${year}:${code}`;

    if (cachePlantel.has(key)) {
      S.cacheHits++;
      return cachePlantel.get(key);
    }

    const local = readCache(year, code);

    if (local) {
      cachePlantel.set(key, local);
      S.cacheHits++;

      return local;
    }

    const url =
      `${localePrefix()}/copas/${year}/${code}`;

    phase(
      "Consultando plantel",
      `Leyendo valores reales de ` +
      `${code.toUpperCase()} ${year}`
    );

    S.fuente =
      `${code.toUpperCase()} ${year} · ` +
      "descargando plantel";

    S.consultas++;
    updateUI();

    const response = await fetch(url, {
      credentials: "same-origin",
      cache: "force-cache"
    });

    if (!response.ok) {
      throw new Error(
        `No se pudo cargar ${url}: ` +
        `HTTP ${response.status}`
      );
    }

    const documentCopy =
      new DOMParser().parseFromString(
        await response.text(),
        "text/html"
      );

    const players = [
      ...documentCopy.querySelectorAll(
        ".squad-row"
      )
    ]
      .map(row => ({
        name:
          text(row, ".squad-name")
            .replace(/★/g, "")
            .trim(),

        force:
          Number(
            text(row, ".squad-force")
          ),

        pos:
          text(row, ".squad-pos"),

        number:
          text(row, ".squad-num")
      }))
      .filter(player =>
        player.name &&
        Number.isFinite(player.force)
      );

    if (!players.length) {
      throw new Error(
        `${code.toUpperCase()} ${year} ` +
        "no contiene fuerzas legibles"
      );
    }

    cachePlantel.set(key, players);
    saveCache(year, code, players);

    return players;
  }

  function matchScore(poolPlayer, rosterPlayer) {
    const poolName =
      normName(poolPlayer.name);

    const rosterName =
      normName(rosterPlayer.name);

    if (!poolName || !rosterName) {
      return -Infinity;
    }

    if (poolName === rosterName) {
      return 1000;
    }

    let score = 0;

    if (
      poolName.includes(rosterName) ||
      rosterName.includes(poolName)
    ) {
      score +=
        760 -
        Math.abs(
          poolName.length -
          rosterName.length
        ) * 3;
    }

    const poolTokens =
      poolName.split(" ");

    const rosterTokens =
      rosterName.split(" ");

    const common =
      poolTokens.filter(token =>
        rosterTokens.includes(token)
      );

    score += common.length * 115;

    if (
      poolTokens.at(-1) ===
      rosterTokens.at(-1)
    ) {
      score += 330;
    }

    if (
      poolTokens[0]?.[0] ===
      rosterTokens[0]?.[0]
    ) {
      score += 45;
    }

    const poolNumber =
      String(poolPlayer.number || "")
        .replace(/\D/g, "");

    const rosterNumber =
      String(rosterPlayer.number || "")
        .replace(/\D/g, "");

    if (
      poolNumber &&
      rosterNumber &&
      poolNumber === rosterNumber
    ) {
      score += 240;
    }

    return score;
  }

  function mergeRatings(pool, roster) {
    const used = new Set();

    return pool.map(player => {
      if (Number.isFinite(player.force)) {
        return player;
      }

      const best = roster
        .map((rosterPlayer, index) => ({
          rosterPlayer,
          index,

          score:
            matchScore(
              player,
              rosterPlayer
            )
        }))
        .filter(candidate =>
          !used.has(candidate.index)
        )
        .sort((a, b) =>
          b.score - a.score
        )[0];

      if (!best || best.score < 300) {
        return player;
      }

      used.add(best.index);

      return {
        ...player,

        force:
          best.rosterPlayer.force,

        match:
          best.rosterPlayer.name,

        rosterPos:
          best.rosterPlayer.pos
      };
    });
  }

  async function ratedPool() {
    const pool = rawPool();

    if (!pool.length) {
      return pool;
    }

    if (!memoryMode()) {
      S.fuente =
        "Modo clásico · valores visibles";

      updateUI();

      return pool;
    }

    const {
      nation,
      year
    } = drawInfo();

    if (!nation || !year) {
      S.fuente =
        "Modo memoria · esperando sorteo";

      return pool;
    }

    let code =
      await nationCode(year, nation);

    if (!code) {
      S.fuente =
        `Código no encontrado para ` +
        `${nation} ${year}`;

      return pool;
    }

    let roster;

    try {
      roster = await squad(year, code);
    } catch (firstError) {
      const detected =
        await codeFromYearPage(
          year,
          nation
        );

      if (
        !detected ||
        detected === code
      ) {
        throw firstError;
      }

      code = detected;

      cacheCodigo.set(
        `${year}:${norm(nation)}`,
        code
      );

      roster =
        await squad(year, code);
    }

    const result =
      mergeRatings(pool, roster);

    const missing =
      result.filter(player =>
        !Number.isFinite(player.force)
      ).length;

    S.fuente = missing
      ? `${nation} ${year} ` +
        `(${code.toUpperCase()}) · ` +
        `${result.length - missing}/` +
        `${result.length} valores`

      : `${nation} ${year} ` +
        `(${code.toUpperCase()}) · ` +
        "todos los valores";

    updateUI();

    return result;
  }

  const supply = (pool, slot) =>
    pool.filter(player =>
      canFill(
        player.pos,
        slot.pos
      )
    ).length;

  function scorePool(pool, remaining) {
    const counts = remaining.reduce(
      (accumulator, slot) => {
        accumulator[slot.pos] =
          (accumulator[slot.pos] || 0) + 1;

        return accumulator;
      },
      {}
    );

    return pool
      .map(player => {
        let fits = remaining.filter(slot =>
          canFill(
            player.pos,
            slot.pos
          )
        );

        if (!fits.length) {
          fits = remaining.slice(0, 1);
        }

        const needs = fits
          .map(slot => ({
            slot,

            value:
              (RAREZA[slot.pos] || 2) +

              (
                counts[slot.pos] === 1
                  ? 0.75
                  : 0
              ) +

              3 / Math.max(
                1,
                supply(pool, slot)
              )
          }))
          .sort((a, b) =>
            b.value - a.value
          );

        const need =
          needs[0] || {
            value: 0,
            slot: fits[0]
          };

        const versatility =
          Math.max(
            0,
            Math.min(3, fits.length) - 1
          );

        const force =
          Number.isFinite(player.force)
            ? player.force
            : 68;

        const tactical =
          force +

          need.value * 4.1 +

          versatility * 1.7 +

          (
            force >= C.excelente
              ? 4
              : 0
          );

        return {
          ...player,
          fits,
          need,
          versatility,
          tactical
        };
      })
      .sort((a, b) =>
        b.tactical - a.tactical ||

        (b.force ?? -1) -
        (a.force ?? -1) ||

        a.name.localeCompare(b.name)
      );
  }

  function bestSlot(options, pool) {
    const counts = slots().reduce(
      (accumulator, slot) => {
        accumulator[slot.pos] =
          (accumulator[slot.pos] || 0) + 1;

        return accumulator;
      },
      {}
    );

    return options
      .map(slot => ({
        ...slot,

        supply:
          supply(pool, slot),

        rarity:
          RAREZA[slot.pos] || 2,

        score:
          supply(pool, slot) * 3.1 +

          (counts[slot.pos] || 1) *
          1.35 -

          (RAREZA[slot.pos] || 2) *
          2.4
      }))
      .sort((a, b) =>
        b.score - a.score
      )[0];
  }

  function threshold(playerCount) {
    if (playerCount <= 3) {
      return C.umbral.temprano;
    }

    if (playerCount <= 7) {
      return C.umbral.medio;
    }

    return C.umbral.tarde;
  }

  const poolSig = pool =>
    pool
      .map(player =>
        `${normName(player.name)}:` +
        `${player.force ?? "?"}`
      )
      .sort()
      .join("|");

  const namesSig = pool =>
    pool
      .map(player =>
        normName(player.name)
      )
      .sort()
      .join("|");

  function rerollDecision(scored, playerCount) {
    if (
      !rerollsLeft() ||
      !scored.length
    ) {
      return {
        yes: false,
        why: "Sin re-sorteos"
      };
    }

    const best = scored[0];

    if (!Number.isFinite(best.force)) {
      return {
        yes: false,
        why: "Sin valores suficientes"
      };
    }

    if (best.force >= C.excelente) {
      return {
        yes: false,
        why:
          `Estrella de ${best.force}`
      };
    }

    const target =
      threshold(playerCount);

    const critical = slots().filter(slot =>
      ["POR", "LD", "LI"]
        .includes(slot.pos)
    );

    const covers = scored.some(player =>
      player.fits.some(fit =>
        critical.some(slot =>
          slot.pos === fit.pos
        )
      )
    );

    if (
      critical.length &&
      !covers &&
      playerCount >= 5
    ) {
      return {
        yes: true,
        why:
          "No apareció una posición crítica"
      };
    }

    if (best.force < target) {
      return {
        yes: true,

        why:
          `El mejor tiene ${best.force}; ` +
          `objetivo ${target}+`
      };
    }

    if (
      playerCount >= 8 &&
      critical.length &&
      best.force < target + 1
    ) {
      return {
        yes: true,

        why:
          "Conviene buscar calidad " +
          "antes del cierre"
      };
    }

    return {
      yes: false,
      why: "La mano es suficientemente buena"
    };
  }

  function chooseReroll(scored) {
    const buttons = rerollButtons();

    if (!buttons.length) {
      return null;
    }

    const known = scored
      .filter(player =>
        Number.isFinite(player.force)
      )
      .slice(0, 5);

    const average = known.length
      ? known.reduce(
          (total, player) =>
            total + player.force,
          0
        ) / known.length
      : 0;

    const nationButton =
      buttons.find(button =>
        /selección|selecao|selection/i.test(
          button.textContent || ""
        )
      );

    const cupButton =
      buttons.find(button =>
        /mundial|copa|world/i.test(
          button.textContent || ""
        )
      );

    return average < 79
      ? (
          nationButton ||
          cupButton ||
          buttons[0]
        )
      : (
          cupButton ||
          nationButton ||
          buttons[0]
        );
  }

  async function doReroll(scored, decision) {
    const button =
      chooseReroll(scored);

    if (!button) {
      return false;
    }

    const completeSignature =
      poolSig(scored);

    const previousNames =
      namesSig(scored);

    if (
      S.firmaRerollBloqueada ===
      completeSignature
    ) {
      return false;
    }

    const action =
      button.textContent
        .replace(/\s+/g, " ")
        .trim();

    S.rerolls++;

    phase(
      "Re-sorteando",
      `${action} · ${decision.why}`
    );

    toast(
      "🔁 Re-sorteo táctico",

      `${action}. ${decision.why}. ` +
      `Quedan ${rerollsLeft()}.`,

      "warn",
      4200
    );

    console.group(
      "%c🔁 RE-SORTEO TÁCTICO",

      "background:#b45309;" +
      "color:#fff;" +
      "padding:6px 10px;" +
      "border-radius:6px;" +
      "font-weight:bold"
    );

    console.log(
      "Motivo:",
      decision.why
    );

    console.log(
      "Acción:",
      action
    );

    console.log(
      "Restantes:",
      rerollsLeft()
    );

    console.groupEnd();

    click(button);

    await sleep(C.pausaTirar);

    const changed = await wait(() => (
      rawPool().length &&
      namesSig(rawPool()) !== previousNames
    ));

    S.firmaRerollBloqueada =
      changed
        ? ""
        : completeSignature;

    if (!changed) {
      toast(
        "⚠️ Sin cambio",

        "No gastaré otro re-sorteo " +
        "sobre la misma mano.",

        "warn",
        4000
      );
    }

    return true;
  }

  async function choosePlayer(scored) {
    const best = scored[0];

    if (!best) {
      return false;
    }

    S.actual = {
      ...best,
      snapshot: scored
    };

    S.picks++;

    const force =
      Number.isFinite(best.force)
        ? best.force
        : "?";

    phase(
      "Eligiendo jugador",

      `${best.name} · fuerza ${force} · ` +
      `táctica ${best.tactical.toFixed(1)}`
    );

    toast(
      "⭐ Elección inteligente",

      `${best.name} (${force}) · ` +
      `${best.rawPos}. ` +
      `Táctica ${best.tactical.toFixed(1)}.`,

      "ok",
      4100
    );

    console.group(
      `%c⭐ ELECCIÓN INTELIGENTE: ${best.name}`,

      "background:#7c3aed;" +
      "color:#fff;" +
      "padding:6px 10px;" +
      "border-radius:6px;" +
      "font-weight:bold"
    );

    console.table(
      scored
        .slice(0, 6)
        .map((player, index) => ({
          ranking: index + 1,
          jugador: player.name,
          fuerza: player.force ?? "?",
          posiciones: player.rawPos,

          necesidad:
            player.need.value.toFixed(2),

          versatilidad:
            player.versatility,

          táctica:
            player.tactical.toFixed(2),

          fuente:
            player.match || "DOM"
        }))
    );

    console.log(
      "Decisión:",

      `${best.name} ofrece la mejor mezcla ` +
      "de fuerza, necesidad y versatilidad."
    );

    console.groupEnd();

    flash(
      best.btn,
      "b70-player"
    );

    await sleep(180);

    click(best.btn);

    const selectedCorrectly =
      await wait(() =>
        Boolean(selected())
      );

    if (!selectedCorrectly) {
      throw new Error(
        `No se pudo seleccionar a ${best.name}`
      );
    }

    await sleep(C.pausaElegir);

    return true;
  }

  async function placePlayer(player) {
    const options = pickable();

    if (!options.length) {
      return false;
    }

    const snapshot =
      S.actual?.snapshot ||
      rawPool();

    const chosen =
      bestSlot(options, snapshot);

    const previousCount =
      count();

/*
 * Guardamos qué filas estaban vacías antes del clic.
 * Después podremos detectar exactamente cuál recibió
 * al nuevo jugador.
 */
const filasVaciasAntes = new Set(
  [
    ...document.querySelectorAll(
      ".boxscore tbody tr"
    )
  ]
    .map((row, index) =>
      row.classList.contains("empty")
        ? index
        : -1
    )
    .filter(index => index >= 0)
);

    phase(
      "Eligiendo el mejor puesto",

      `${player.name} → ${chosen.pos} · ` +
      `oferta futura ${chosen.supply}`
    );

    toast(
      "📍 Puesto optimizado",

      `${player.name} irá a ${chosen.pos}. ` +
      "Reservo los puestos más escasos.",

      "ok",
      3900
    );

    console.group(
      `%c📍 MEJOR PUESTO PARA ${player.name}`,

      "background:#15803d;" +
      "color:#fff;" +
      "padding:6px 10px;" +
      "border-radius:6px;" +
      "font-weight:bold"
    );

    console.table(
      options.map(slot => ({
        puesto:
          slot.pos,

        oferta_futura:
          supply(snapshot, slot),

        escasez:
          RAREZA[slot.pos] || 2,

        recomendado:
          slot.el === chosen.el
            ? "✅"
            : ""
      }))
    );

    console.log(
      "Elegido:",
      chosen.pos,

      "porque deja más alternativas abiertas."
    );

    console.groupEnd();

    flash(
      chosen.el,
      "b70-slot"
    );

    await sleep(180);

    click(chosen.el);

    S.colocados++;

    const placedCorrectly =
      await wait(() =>
        count() > previousCount
      );

   if (!placedCorrectly) {
  throw new Error(
    `No se pudo colocar a ${player.name}`
  );
}

/*
 * Localizamos la fila que acaba de llenarse.
 */
const rowsAfter = [
  ...document.querySelectorAll(
    ".boxscore tbody tr"
  )
];

const newRowIndex =
  rowsAfter.findIndex(
    (row, index) =>
      filasVaciasAntes.has(index) &&
      !row.classList.contains("empty")
  );

/*
 * La fuerza puede venir del jugador seleccionado
 * o del objeto completo guardado en S.actual.
 */
const realForce =
  Number.isFinite(player.force)
    ? player.force
    : Number.isFinite(S.actual?.force)
      ? S.actual.force
      : null;

if (Number.isFinite(realForce)) {
  const record = {
    fila: newRowIndex,
    nombre: player.name,
    fuerza: realForce,
    posicion: chosen.pos,

    selección:
      drawInfo().nation || "",

    mundial:
      drawInfo().year || null
  };

  /*
   * Si por alguna razón ya existía información para
   * esa fila, la actualizamos. En caso contrario,
   * añadimos un nuevo jugador.
   */
  const existingIndex =
    newRowIndex >= 0
      ? S.equipoReal.findIndex(
          saved =>
            saved.fila === newRowIndex
        )
      : -1;

  if (existingIndex >= 0) {
    S.equipoReal[existingIndex] =
      record;
  } else {
    S.equipoReal.push(record);
  }

  console.log(
    "%c📊 OVERALL ACTUALIZADO",
    [
      "background:#0369a1",
      "color:#fff",
      "font-weight:bold",
      "padding:5px 9px",
      "border-radius:5px"
    ].join(";")
  );

  console.log(
    `${player.name}: ${realForce}`
  );

  console.log(
    "Fuerza acumulada:",
    S.equipoReal.reduce(
      (sum, saved) =>
        sum + saved.fuerza,
      0
    )
  );

  console.log(
    "Overall actual:",
    overallCalculado() ?? "calculando…"
  );

  console.table(
    S.equipoReal.map(saved => ({
      posición: saved.posicion,
      jugador: saved.nombre,
      fuerza: saved.fuerza,
      selección: saved.selección,
      mundial: saved.mundial
    }))
  );
}

await sleep(C.pausaColocar);

    toast(
      "✅ Jugador colocado",

      `${player.name} ocupa ${chosen.pos}. ` +
      `Equipo ${count()}/${C.total}.`,

      "ok",
      2700
    );

    S.actual = null;

    return true;
  }

  async function roll() {
    const button = rollButton();

    if (!button) {
      return false;
    }

    S.tiradas++;

    phase(
      "Tirando el dado",

      `Buscando el refuerzo ` +
      `${count() + 1} de ${C.total}`
    );

    toast(
      "🎲 Nueva tirada",

      `Buscando el mejor refuerzo ` +
      `para ${count() + 1}/11.`,

      "",
      2200
    );

    click(button);

    await sleep(C.pausaTirar);

    await wait(() => (
      rawPool().length ||
      selected()
    ));

    const draw = drawInfo();

    if (draw.nation && draw.year) {
      toast(
        "🌍 Sorteo listo",

        `${draw.nation} · ` +
        `Mundial ${draw.year}`,

        "",
        2500
      );
    }

    return true;
  }

  function worldButton() {
    return [
      ...document.querySelectorAll("button,a")
    ].find(element => (
      visible(element) &&
      !element.disabled &&
      /simular el mundial|jugar mundial|simulate/i
        .test(element.textContent || "")
    ));
  }

  async function playWorldCup() {
    if (S.mundialLanzado) {
      return true;
    }

    await wait(
      () => Boolean(worldButton()),
      8000
    );

    const button = worldButton();

    if (!button) {
      toast(
        "⚠️ Esperando botón",

        "El XI está completo; seguiré buscando " +
        "“Simular el Mundial”.",

        "warn",
        5200
      );

      return false;
    }

    S.mundialLanzado = true;
    S.finalizado = true;

    phase(
      "Entrando al Mundial",
      "XI completo · abriendo la simulación"
    );

    toast(
      "🏟️ ¡Vamos al Mundial!",

      "Entrando automáticamente a " +
      "Simular el Mundial…",

      "ok",
      4800
    );

    flash(
      button,
      "b70-world",
      900
    );

    await sleep(650);

    click(button);

    return true;
  }

  async function finish() {
    if (
      S.finalizando ||
      S.finalizado
    ) {
      return;
    }

    S.finalizando = true;
    S.activo = false;

    phase(
      "XI completo",

      `Overall ${overall() ?? "?"} · ` +
      "preparando el Mundial"
    );

    toast(
      "🏆 XI COMPLETADO",

      `Equipo terminado con overall ` +
      `${overall() ?? "?"}.`,

      "ok",
      4800
    );

    console.log(
      "%c🏆 XI COMPLETADO",

      "background:linear-gradient(" +
      "90deg,#15803d,#ca8a04);" +
      "color:#fff;" +
      "font-size:18px;" +
      "font-weight:bold;" +
      "padding:10px 16px;" +
      "border-radius:8px"
    );

    console.table(team());

    console.log(
      "Resumen:",
      {
        tiradas: S.tiradas,
        elecciones: S.picks,
        colocaciones: S.colocados,
        rerolls: S.rerolls,
        consultas: S.consultas,
        cacheHits: S.cacheHits,
        errores: S.errores,
        overall: overall(),

        segundos:
          Math.round(
            (
              Date.now() -
              S.inicio
            ) / 1000
          )
      }
    );

    await sleep(C.pausaMundial);

    const launched =
      await playWorldCup();

    if (!launched) {
      S.finalizando = false;
      S.finalizado = false;
      S.activo = true;

      phase(
        "Esperando botón del Mundial",
        "Volveré a buscarlo automáticamente"
      );
    }
  }

  async function step(manual = false) {
    if (
      S.destruido ||
      S.ocupado ||
      S.finalizado ||
      S.finalizando ||
      (
        !S.activo &&
        !manual
      )
    ) {
      return;
    }

    S.ocupado = true;

    updateUI();

    try {
      const playerCount = count();

      if (playerCount >= C.total) {
        await finish();
        return;
      }

      const player = selected();

      if (player) {
        const options = pickable();

        if (options.length) {
          await placePlayer(player);
        } else {
          phase(
            "Esperando puestos",

            `Calculando dónde colocar ` +
            `a ${player.name}`
          );
        }

        return;
      }

      if (rawPool().length) {
        phase(
          memoryMode()
            ? "Leyendo modo memoria"
            : "Analizando jugadores",

          memoryMode()
            ? "Buscando las fuerzas reales " +
              "en el plantel público"

            : "Calculando fuerza, necesidad " +
              "y versatilidad"
        );

        const rated =
          await ratedPool();

        const scored =
          scorePool(
            rated,
            slots()
          );

        const decision =
          rerollDecision(
            scored,
            playerCount
          );

        const signature =
          poolSig(scored);

        if (
          decision.yes &&
          rerollButtons().length &&
          signature !==
            S.firmaRerollBloqueada
        ) {
          await doReroll(
            scored,
            decision
          );
        } else {
          await choosePlayer(scored);
        }

        return;
      }

      if (rollButton()) {
        await roll();
        return;
      }

      phase(
        "Esperando interfaz",

        `Equipo ${playerCount}/${C.total} · ` +
        "buscando la siguiente acción"
      );
    } catch (error) {
      S.errores++;

      phase(
        "Error recuperable",

        error.message ||
        String(error)
      );

      toast(
        "❌ Error recuperable",

        `${error.message || error}. ` +
        "Seguiré intentando.",

        "err",
        4500
      );

      console.error(
        "[BOT 7A0]",
        error
      );
    } finally {
      S.ocupado = false;

      updateUI();
    }
  }

  function showTeam() {
    const currentTeam = team();

    console.group(
      "%c📋 XI ACTUAL",

      "background:#2563eb;" +
      "color:white;" +
      "padding:6px 10px;" +
      "border-radius:6px;" +
      "font-weight:bold"
    );

    console.table(currentTeam);

    console.log(
      "Overall:",
      overall() ?? "?",

      "| Progreso:",
      `${count()}/${C.total}`,

      "| Re-sorteos:",
      rerollsLeft(),

      "| Consultas:",
      S.consultas,

      "| Caché:",
      S.cacheHits
    );

    console.groupEnd();

    toast(
      "📋 Equipo actual",

      `${currentTeam.length}/11 jugadores · ` +
      `overall ${overall() ?? "?"}. ` +
      "Mira la consola.",

      "",
      3000
    );

    return currentTeam;
  }

  function pause() {
    S.activo = false;

    phase(
      "Pausado",
      "No realizaré clics hasta reanudar"
    );

    toast(
      "⏸ Bot pausado",
      "Reanúdalo desde el panel.",
      "warn"
    );
  }

  function resume() {
    if (
      S.destruido ||
      S.finalizado
    ) {
      return;
    }

    S.activo = true;

    if (
      !S.timer ||
      !S.observer
    ) {
      start();
    }

    phase(
      "Reanudado",
      "Analizando la siguiente decisión"
    );

    toast(
      "▶ Bot reanudado",
      "El director técnico vuelve al trabajo.",
      "ok"
    );

    step();
  }

  function stop() {
    S.activo = false;

    clearInterval(S.timer);
    S.timer = null;

    S.observer?.disconnect();
    S.observer = null;

    phase(
      "Detenido",
      "Usa bot7a0.reanudar() para continuar"
    );

    toast(
      "⛔ Bot detenido",
      "El panel sigue disponible.",
      "warn"
    );
  }

  function destroy({
    silencioso = false
  } = {}) {
    S.destruido = true;
    S.activo = false;

    clearInterval(S.timer);

    S.observer?.disconnect();

    document
      .getElementById("b70")
      ?.remove();

    document
      .getElementById("b70t")
      ?.remove();

    document
      .getElementById("b70style")
      ?.remove();

    if (!silencioso) {
      console.log(
        "🧹 Bot 7A0 eliminado."
      );
    }
  }

  function start() {
    clearInterval(S.timer);

    S.observer?.disconnect();

    S.timer = setInterval(() => {
      step(false);
    }, C.intervalo);

    const root =
      document.querySelector(".play-reserve") ||
      document.body;

    S.observer =
      new MutationObserver(() => {
        updateUI();

        if (
          S.activo &&
          !S.ocupado
        ) {
          setTimeout(() => {
            step(false);
          }, 70);
        }
      });

    S.observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,

      attributeFilter: [
        "class",
        "disabled"
      ]
    });
  }

  injectUI();

  window.bot7a0 = {
    pausar: pause,
    reanudar: resume,

    paso: () =>
      step(true),

    equipo: showTeam,
    detener: stop,
    destruir: destroy,
    jugarMundial: playWorldCup,

    estado: () => ({
      ...S,
      jugadores: count(),
      overall: overall(),
      rerollsRestantes: rerollsLeft(),
      modoMemoria: memoryMode(),
      sorteo: drawInfo()
    }),

    limpiarCache: () => {
      Object.keys(localStorage)
        .filter(key =>
          key.startsWith("bot7a0:")
        )
        .forEach(key =>
          localStorage.removeItem(key)
        );

      cachePlantel.clear();
      cacheCodigo.clear();
      cacheAnio.clear();

      console.log(
        "🧹 Caché del Bot 7A0 eliminada."
      );
    },

    config: C
  };

  window.detenerBot7a0 = stop;
  window.reanudarBot7a0 = resume;
  window.equipoBot7a0 = showTeam;

  console.log(
    "%c⚽ BOT 7A0 · DIRECTOR TÉCNICO",

    "background:linear-gradient(" +
    "90deg,#7c3aed,#2563eb);" +
    "color:white;" +
    "font-size:16px;" +
    "font-weight:bold;" +
    "padding:9px 14px;" +
    "border-radius:7px"
  );

  console.log(
    "🧠 Estrategia:",

    "fuerza real + necesidad + " +
    "versatilidad + conservación " +
    "de puestos escasos."
  );

  console.log(
    "📚 Modo memoria:",

    "consulta /copas/AÑO/CÓDIGO, " +
    "relaciona nombres y guarda " +
    "los valores en caché."
  );

  console.log(
    "🔁 Re-sorteos:",
    "máximo 3 por partida."
  );

  console.log(
    "🏟️ Final:",

    "al completar 11/11 pulsa " +
    "automáticamente Simular el Mundial."
  );

  console.log(
    "🎛️ Comandos:",
    {
      pausar:
        "bot7a0.pausar()",

      reanudar:
        "bot7a0.reanudar()",

      paso:
        "bot7a0.paso()",

      equipo:
        "bot7a0.equipo()",

      estado:
        "bot7a0.estado()",

      mundial:
        "bot7a0.jugarMundial()",

      cache:
        "bot7a0.limpiarCache()",

      destruir:
        "bot7a0.destruir()"
    }
  );

  toast(
    "⚽ Director técnico activado",

    "Compatible con Clásico y De memoria. " +
    "Completaré el XI y entraré al Mundial.",

    "ok",
    5200
  );

  updateUI();
  start();
  step();
})();
