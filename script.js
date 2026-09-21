const out = document.querySelector("#output");
const form = document.querySelector("#nameForm");
const input = document.querySelector("#nameInput");
const actions = document.querySelector("#actions");
const crt = document.querySelector("#crt");
const snd = document.querySelector("#soundToggle");

const sleep = ms => new Promise(r => setTimeout(r, ms));

let sound = false;
let audio = null;
let start = Date.now();
let name = "";
let noAttempts = 0;

function esc(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[m]));
}

function beep(freq = 660, d = .035) {
  if (!sound) return;

  try {
    audio ??= new (window.AudioContext || window.webkitAudioContext)();

    const o = audio.createOscillator();
    const g = audio.createGain();

    o.type = "square";
    o.frequency.value = freq;
    g.gain.value = .025;

    o.connect(g);
    g.connect(audio.destination);

    o.start();
    o.stop(audio.currentTime + d);
  } catch {}
}

snd.onclick = () => {
  sound = !sound;
  snd.textContent = `SOM:${sound ? "LIGADO" : "DESLIGADO"}`;
  beep();
};

function add(text = "", cls = "") {
  const d = document.createElement("div");

  d.className = `line ${cls}`;
  d.innerHTML = esc(text);

  out.appendChild(d);
  scroll();

  return d;
}

function raw(html, cls = "") {
  const d = document.createElement("div");

  d.className = `line ${cls}`;
  d.innerHTML = html;

  out.appendChild(d);
  scroll();

  return d;
}

function scroll() {
  requestAnimationFrame(() => {
    document.querySelector(".terminal").scrollTop = 999999;
  });
}

async function type(text, cls = "", speed = 14) {
  const d = add("", cls);

  for (const c of text) {
    d.textContent += c;

    if (c !== " ") {
      beep(700 + Math.random() * 100, .012);
    }

    await sleep(speed);
  }

  return d;
}

async function lines(arr, delay = 180) {
  for (const x of arr) {
    if (Array.isArray(x)) {
      await type(x[0], x[1] || "", x[2] ?? 10);
    } else {
      await type(x, "", 10);
    }

    await sleep(delay);
  }
}

async function boot() {
  start = Date.now();

  const old = localStorage.getItem("mds86_name");
  const done = localStorage.getItem("mds86_done");

  await lines([
    "SISTEMAS MANDUCA",
    "SISTEMA COMPATÍVEL MDS/86",
    "TESTE DE MEMÓRIA: 640K ........ OK",
    "",
    ["BIOS ROM REV. 2.17", "dim"],
    ["DIREITOS RESERVADOS (C) 1987-1994", "dim"],
    "",
    "INICIALIZANDO ENTRADA/SAÍDA.... OK",
    "CARREGANDO NÚCLEO.............. OK",
    "VERIFICANDO TERMINAL........... OK",
    "SESSÃO REMOTA.................. ESTABELECIDA",
    "",
    "> executando IDENT.EXE"
  ], 110);

  if (old && done) {
    name = old;

    await sleep(650);

    await lines([
      "",
      "INICIALIZAÇÃO CONCLUÍDA.",
      "",
      "...",
      "",
      ["ESPERE.", "amber"],
      "",
      ["REGISTRO DO INDIVÍDUO ENCONTRADO.", "red"],
      "",
      `Bem-vindo de volta, ${name}.`,
      "",
      "Você não aprendeu da primeira vez?",
      "",
      "> reiniciando sessão restrita..."
    ], 260);

    await sleep(900);

    return consent();
  }

  await sleep(500);

  await lines([
    "",
    "TERMINAL DE IDENTIFICAÇÃO MDS",
    "-----------------------------",
    "",
    "Operador não identificado.",
    "",
    "IDENTIFICAÇÃO OBRIGATÓRIA."
  ], 100);

  form.classList.remove("hidden");

  // O texto do label do HTML também é traduzido por aqui,
  // então não é necessário alterar o index.html.
  const label = form.querySelector("label");

  if (label) {
    label.textContent = "DIGITE O NOME DO INDIVÍDUO:";
  }

  input.focus();
}

form.addEventListener("submit", async e => {
  e.preventDefault();

  let v = input.value.trim().replace(/\s+/g, " ");

  if (!v) return;

  name = v.slice(0, 24).toUpperCase();

  localStorage.setItem("mds86_name", name);

  form.classList.add("hidden");

  await identify();
});

async function identify() {
  await lines([
    `IDENTIFICAÇÃO RECEBIDA: ${name}`,
    "",
    "PESQUISANDO ÍNDICE LOCAL..."
  ], 130);

  for (const [bar, p] of [
    ["████░░░░░░░░░░░░", 24],
    ["█████████░░░░░░░", 57],
    ["████████████████", 100]
  ]) {
    add(`${bar}  ${p}%`, "progress");
    await sleep(500);
  }

  await lines([
    "",
    "COMPARANDO REGISTROS........... SIM",
    "VERIFICANDO INDIVÍDUO.......... OK"
  ], 150);

  await sleep(600);

  crt.classList.add("red-flash", "glitch");

  beep(110, .35);

  await lines([
    ["", "red"],
    ["!!! ALVO ENCONTRADO !!!", "red big"],
    ["", "red"],
    [`INDIVÍDUO: ${name}`, "red"],
    ["STATUS: ATIVO", "red"],
    ["SESSÃO: ABERTA", "red"]
  ], 90);

  await sleep(1300);

  crt.classList.remove("red-flash", "glitch");
  crt.classList.add("blackout");

  await sleep(1800);

  out.innerHTML = "";

  crt.classList.remove("blackout");

  consent();
}

async function consent() {
  await type(
    `${name}, deseja continuar?`,
    "big center",
    45
  );

  actions.classList.remove("hidden");

  actions.innerHTML = `
    <button class="terminal-btn" id="yes">
      [ SIM ]
    </button>

    <button class="terminal-btn no-btn" id="no">
      [ NÃO ]
    </button>
  `;

  const yes = document.querySelector("#yes");
  const no = document.querySelector("#no");

  placeNo(no);

  const flee = e => {
    e.preventDefault();

    noAttempts++;

    placeNo(no);

    beep(180, .04);

    if (noAttempts === 2) {
      raw(
        '<span class="amber">AVISO: RESPOSTA NEGATIVA DETECTADA.</span>'
      );
    }

    if (noAttempts === 4) {
      raw(`
        <span class="red">
          FALHA NA RESPOSTA NEGATIVA.
        </span>
        <br>
        Você não tem muita escolha.
      `);
    }

    if (noAttempts === 7) {
      raw(`
        <br>
        Ainda está tentando?
      `);
    }
  };

  ["pointerenter", "pointerdown", "touchstart"].forEach(ev => {
    no.addEventListener(ev, flee, {
      passive: false
    });
  });

  yes.onclick = analysis;
}

function placeNo(b) {
  const box = actions.getBoundingClientRect();

  const w = b.offsetWidth || 120;
  const h = b.offsetHeight || 48;

  const pad = 8;

  b.style.left =
    Math.max(
      pad,
      Math.random() * Math.max(pad, box.width - w - pad)
    ) + "px";

  b.style.top =
    Math.max(
      pad,
      Math.random() * Math.max(pad, box.height - h - pad)
    ) + "px";
}

async function analysis() {
  actions.classList.add("hidden");

  out.innerHTML = "";

  await lines([
    "AUTORIZAÇÃO.................... 1",
    "MODO RESTRITO.................. ATIVADO",
    "",
    "NÃO DESCONECTE O TERMINAL.",
    "",
    "Iniciando análise do indivíduo..."
  ], 150);

  await sleep(600);

  await lines([
    "LENDO PADRÕES DE COMPORTAMENTO.....",
    "VERIFICANDO HISTÓRICO DE DECISÕES..",
    "ANALISANDO NÍVEL DE CURIOSIDADE.....",
    "PROCURANDO DECISÕES QUESTIONÁVEIS...",
    "CALCULANDO NÍVEL DE AMEAÇA..........."
  ], 300);

  await sleep(500);

  crt.classList.add("red-flash", "glitch");

  await lines([
    ["", "red"],
    ["AVISO 0x17", "red"],
    ["COMPORTAMENTO ANÔMALO DETECTADO", "red"]
  ], 80);

  await sleep(800);

  crt.classList.remove("red-flash", "glitch");

  raw(`
<pre>
+--------------------------------+
| UNIDADE DE ANÁLISE             |
|                                |
|          .-----.               |
|       .-'   |   '-.            |
|      /      |      \\           |
|     |-------+-------|           |
|      \\      |      /           |
|       '-.   |   .-'            |
|          '-----'               |
|                                |
| SINAL: █████████████ 97%       |
+--------------------------------+

INDIVÍDUO: ${esc(name)}

CLASSIFICAÇÃO:

<span class="red">
CURIOSIDADE SUSPEITAMENTE ELEVADA
</span>
</pre>
  `);

  await sleep(2200);

  question();
}

async function question() {
  await lines([
    "",
    "VERIFICAÇÃO FINAL OBRIGATÓRIA.",
    "",
    "Por que você abriu este link?"
  ], 100);

  actions.classList.remove("hidden");

  actions.innerHTML = `
    <div class="choice-list">

      <button class="terminal-btn">
        [ A ] Curiosidade
      </button>

      <button class="terminal-btn">
        [ B ] Me mandaram
      </button>

      <button class="terminal-btn">
        [ C ] Não sei
      </button>

      <button class="terminal-btn">
        [ D ] Eu sabia o que estava fazendo
      </button>

    </div>
  `;

  [...actions.querySelectorAll("button")]
    .forEach((b, i) => {
      b.onclick = () => reject(i);
    });
}

async function reject(i) {
  actions.classList.add("hidden");

  const ans = [
    "Curiosidade",
    "Me mandaram",
    "Não sei",
    "Eu sabia o que estava fazendo"
  ][i];

  await lines([
    "",
    `> "${ans}"`,
    "",
    "PROCESSANDO...",
    "COMPARANDO RESPOSTA...",
    "VERIFICANDO...",
    ""
  ], 180);

  await sleep(700);

  await lines([
    ["RESPOSTA REJEITADA.", "red"],
    "",
    "Motivo:",
    "",
    "Você viu um link suspeito",
    "e clicou mesmo assim."
  ], 160);

  if (i === 3) {
    await lines([
      "",
      "> Não.",
      "> Você não sabia."
    ], 250);
  }

  await sleep(1300);

  finalProcedure();
}

async function finalProcedure() {
  out.innerHTML = "";

  await lines([
    "EXECUTANDO PROCEDIMENTO FINAL",
    ""
  ], 120);

  for (const [bar, p, t] of [
    ["██░░░░░░░░░░░░░░░░", 12, 400],
    ["██████░░░░░░░░░░░░", 31, 500],
    ["███████████░░░░░░░", 58, 550],
    ["████████████████░░", 87, 650],
    ["██████████████████", 99, 3200]
  ]) {
    add(`[${bar}] ${p}%`, "progress");

    beep(420 + p * 3, .04);

    await sleep(t);
  }

  crt.classList.add("glitch", "red-flash");

  await lines([
    ["ERRO FATAL", "red big"],
    ["CÓDIGO: 0x00000BURRO", "red"],
    "",
    "O SISTEMA NÃO CONSEGUIU",
    "CONCLUIR A ANÁLISE.",
    "",
    "MOTIVO:",
    "",
    "REQUISITOS MÍNIMOS DE",
    "INTELIGÊNCIA NÃO ATINGIDOS."
  ], 110);

  await sleep(1800);

  crt.classList.remove("glitch", "red-flash");

  crt.classList.add("blackout");

  await sleep(2200);

  out.innerHTML = "";

  crt.classList.remove("blackout");

  ending();
}

function fmt(ms) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);

  return `${String(m).padStart(2, "0")} minuto${m === 1 ? "" : "s"} e ${String(s % 60).padStart(2, "0")} segundos`;
}

async function ending() {
  const elapsed = fmt(Date.now() - start);

  await lines([
    [`PARABÉNS, ${name}.`, "big"],
    "",
    "Você acabou de perder",
    elapsed,
    "da sua vida entrando",
    "em um link aleatório.",
    "",
    "Nenhuma informação secreta",
    "foi encontrada.",
    "",
    "Nenhum scanner era real.",
    "",
    "Mas uma coisa foi confirmada:",
    "",
    ["CURIOSIDADE: 100%", "amber"],
    "",
    ["CONQUISTA DESBLOQUEADA", "amber"],
    ["[ O CURIOSO ]", "amber"],
    "",
    "\"clicou onde claramente",
    " não deveria clicar\"",
    "",
    ["SESSÃO ENCERRADA.", "dim"],
    ["OBRIGADO PELA PARTICIPAÇÃO.", "dim"],
    "",
    ["SISTEMA MDS/86", "dim"],
    ["feito por manduca.", "dim"]
  ], 130);

  localStorage.setItem("mds86_done", "1");

  await sleep(3500);

  await type(
    "> espere...",
    "dim",
    90
  );

  await sleep(900);

  actions.classList.remove("hidden");

  actions.innerHTML = `
    <button
      class="terminal-btn"
      id="egg"
    >
      [ NÃO CLIQUE AQUI ]
    </button>
  `;

  document.querySelector("#egg").onclick = easter;
}

async function easter() {
  actions.classList.add("hidden");

  await sleep(400);

  await lines([
    "",
    "> sério?",
    "",
    `${name}...`,
    "",
    ["VOCÊ CLICOU DE NOVO.", "red"],
    "",
    "TESTE DE CURIOSIDADE:",
    "FALHOU COM SUCESSO.",
    "",
    "O MDS/86 vai se lembrar disso",
    "neste navegador.",
    "",
    "Agora pode fechar a página."
  ], 180);
}

boot();
