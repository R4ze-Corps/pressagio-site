const state = {
  role: "lider",
  route: "inicio",
  user: null,
  guild: null,
  fivem: null,
  realMembers: [],
  membersLoaded: false,
};

const routeTitles = {
  inicio: "Início",
  perfil: "Meu Perfil",
  metas: "Metas",
  eventos: "Eventos",
  ranking: "Ranking",
  recrutamento: "Recrutamento",
  regras: "Regras",
  loja: "Benefícios",
  lideranca: "Dashboard",
  membros: "Membros",
  advertencias: "Advertências",
  logs: "Logs",
};

const memberRoleOrder = [
  "⚡・01",
  "⚡・02",
  "⚡・03",
  "⚔️・Gerente Geral",
  "☘️・Gerente Farm",
  "💲・Gerente Vendas",
  "💼・Gerente Recrutamento",
  "🔥・Gerente Elite",
  "🔫・Gerente Ação",
  "👤・Membro",
];

const icons = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="7" r="4"/></svg>',
  target: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/></svg>',
  calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18"/></svg>',
  trophy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0z"/><path d="M5 5H3v2a4 4 0 0 0 4 4M19 5h2v2a4 4 0 0 1-4 4"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  store: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 10h16l-1-6H5zM6 10v10h12V10"/><path d="M9 20v-6h6v6"/></svg>',
  chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 5-7"/></svg>',
  users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  alert: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/></svg>',
  list: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 6h13M8 12h13M8 18h13"/><path d="M3 6h.01M3 12h.01M3 18h.01"/></svg>',
  bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',
  activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
  discord: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 18s1.5 1 4 1 4-1 4-1"/><path d="M7 7a14 14 0 0 1 10 0l1 8a12 12 0 0 1-4 2l-.8-1.5M10.8 15.5 10 17a12 12 0 0 1-4-2l1-8"/><path d="M9.5 12h.01M14.5 12h.01"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',
  refresh: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12a9 9 0 0 1-15.5 6.2L3 16M3 12A9 9 0 0 1 18.5 5.8L21 8"/><path d="M3 21v-5h5M21 3v5h-5"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 5v14M5 12h14"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="m20 6-11 11-5-5"/></svg>',
  pause: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M10 4H6v16h4zM18 4h-4v16h4z"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 2l5 5-12 12H5v-5z"/></svg>',
};

let goals = [
  { name: "Ferro", current: 320, initial: 120, target: 800, min: 400 },
  { name: "Polímero", current: 180, initial: 60, target: 500, min: 200 },
  { name: "Níquel", current: 60, initial: 20, target: 300, min: 100 },
  { name: "Carcaça de Bateria", current: 90, initial: 30, target: 250, min: 80 },
  { name: "Tecido", current: 210, initial: 80, target: 600, min: 250 },
];

const members = [
  { name: "Kauan Raze", role: "Lider", discord: "832901774100", pass: "12984", status: "Ativo", points: 3450 },
  { name: "Maya Vox", role: "Sublider", discord: "70211833190", pass: "44721", status: "Ativo", points: 3110 },
  { name: "Dante Rio", role: "Gerente", discord: "88122003914", pass: "77120", status: "Advertido", points: 2200 },
  { name: "Lua Santos", role: "Membro", discord: "56109381277", pass: "66502", status: "Ativo", points: 1740 },
  { name: "Nina Black", role: "Membro", discord: "67112209831", pass: "90812", status: "Afastado", points: 950 },
];

const events = [
  {
    name: "Corrida Noturna",
    date: "28/05/2026 - 21:00",
    prize: "15.000 pontos + tag especial",
    place: "Pier",
    players: 18,
    image: "linear-gradient(135deg, rgba(143,60,255,.35), transparent)",
  },
  {
    name: "Campeonato de Arena",
    date: "31/05/2026 - 20:30",
    prize: "Cargo destaque por 7 dias",
    place: "Arena central",
    players: 24,
    image: "linear-gradient(135deg, rgba(192,132,252,.28), transparent)",
  },
  {
    name: "Operacao Drop",
    date: "02/06/2026 - 22:00",
    prize: "Bonus de meta",
    place: "Norte",
    players: 31,
    image: "linear-gradient(135deg, rgba(95,27,183,.38), transparent)",
  },
];

const warnings = [
  { member: "Dante Rio", reason: "Ausencia em acao marcada", severity: "Media", by: "Kauan Raze", date: "25/05/2026" },
  { member: "Nina Black", reason: "Meta atrasada sem aviso", severity: "Leve", by: "Maya Vox", date: "23/05/2026" },
  { member: "Dante Rio", reason: "Conduta no Discord", severity: "Grave", by: "Kauan Raze", date: "20/05/2026" },
];

const entradasSaidas = [
  { member: "Lua Santos", action: "entrou", date: "Hoje, 19:40" },
  { member: "Nox", action: "saiu", date: "Ontem, 23:10" },
  { member: "Rafa", action: "aprovado no recrutamento", date: "24/05/2026" },
  { member: "Maya Vox", action: "entrou", date: "20/05/2026" },
  { member: "Dante Rio", action: "saiu", date: "15/05/2026" },
  { member: "Lua Santos", action: "entrou", date: "12/05/2026" },
];

const msgExcluida = [
  { author: "Dante Rio", channel: "geral", date: "Hoje, 18:22" },
  { author: "Nina Black", channel: "recrutamento", date: "Ontem, 21:05" },
  { author: "Maya Vox", channel: "lideranca", date: "25/05/2026" },
  { author: "Lua Santos", channel: "eventos", date: "23/05/2026" },
];

const msgEditada = [
  { author: "Kauan Raze", channel: "geral", date: "Hoje, 20:15" },
  { author: "Maya Vox", channel: "comunicados", date: "Ontem, 14:30" },
  { author: "Dante Rio", channel: "metas", date: "24/05/2026" },
];

const callLogs = [
  { channel: "Lideranca", participants: 5, duration: "23min", date: "Hoje, 21:00" },
  { channel: "Gerencia", participants: 8, duration: "47min", date: "Ontem, 20:15" },
  { channel: "Geral", participants: 12, duration: "1h12min", date: "25/05/2026" },
  { channel: "Recrutamento", participants: 3, duration: "15min", date: "23/05/2026" },
];

const rules = [
  ["Regras gerais", ["Respeitar membros e aliados.", "Nao vazar informacoes internas.", "Manter postura RP em acoes."]],
  ["Regras de acoes", ["Confirmar presenca antes do horario.", "Seguir comando da lideranca.", "Nao abandonar acao sem avisar."]],
  ["Eventos", ["Ler regras antes de participar.", "Provas devem ser enviadas no prazo.", "Premios sao revisados pela lideranca."]],
  ["Metas", ["Entregar meta semanal.", "Avisar afastamento com antecedencia.", "Produtos devem ser registrados no painel."]],
  ["Hierarquia", ["Cargos definem permissao no site.", "Gerencia pode revisar membros.", "Lideranca decide punicoes finais."]],
  ["Conduta no Discord", ["Nao marcar cargos sem necessidade.", "Usar canais corretos.", "Evitar conflitos em canais publicos."]],
];

const store = [
  ["Tag especial", 1200, "Destaque visual no Discord por 7 dias."],
  ["Prioridade em evento", 900, "Entrada prioritaria em um evento interno."],
  ["Cargo exclusivo", 2800, "Cargo cosmetico aprovado pela lideranca."],
  ["Bonus de meta", 1500, "Reducao combinada em uma meta semanal."],
];

async function init() {
  document.querySelectorAll("[data-icon]").forEach((node) => {
    node.innerHTML = icons[node.dataset.icon] || "";
  });

  await applyAuthState();
  startSessionPolling();
  renderGoals();
  renderEvents();
  renderRanking();
  renderRules();
  renderStore();
  renderMembers();
  renderWarnings();
  renderEntradasSaidas();
  renderMsgExcluida();
  renderMsgEditada();
  renderCallLogs();
  bindNavigation();
  bindForms();
  setRoute("inicio");
}

function startSessionPolling() {
  window.setInterval(() => {
    if (document.body.classList.contains("is-authenticated")) {
      applyAuthState({ silent: true });
    }
  }, 15000);
}

function setSubRoute(subroute) {
  const view = document.getElementById("view-logs");
  if (!view) return;
  view.querySelectorAll(".sub-card").forEach((item) => {
    item.classList.toggle("active", item.dataset.subroute === subroute);
  });
  view.querySelectorAll(".sub-view").forEach((sv) => sv.classList.remove("active"));
  const target = document.getElementById(`subview-${subroute}`);
  if (target) target.classList.add("active");
}

function bindNavigation() {
  document.querySelectorAll("[data-route]").forEach((element) => {
    element.addEventListener("click", () => setRoute(element.dataset.route));
  });

  document.querySelectorAll("[data-subroute]").forEach((element) => {
    element.addEventListener("click", () => setSubRoute(element.dataset.subroute));
  });

  document.querySelector(".menu-toggle").addEventListener("click", () => {
    document.querySelector(".sidebar").classList.toggle("open");
  });

  document.getElementById("discord-login").addEventListener("click", () => {
    loginWithDiscord();
  });

  document.getElementById("login-screen-button").addEventListener("click", () => {
    loginWithDiscord();
  });
}

async function applyAuthState(options = {}) {
  try {
    const response = await fetch("/api/session", { credentials: "same-origin" });
    const data = await response.json();
    const isAuthenticated = response.ok && data.authenticated;

    state.user = isAuthenticated ? data.user : null;
    state.guild = isAuthenticated ? data.guild : null;
    state.fivem = isAuthenticated ? data.fivem : null;
    document.body.classList.toggle("is-authenticated", isAuthenticated);

    if (isAuthenticated) {
      updateLoggedUser(data.user, data.guild, data.fivem, data.discordStatus);
    }
  } catch {
    if (!options.silent) {
      document.body.classList.remove("is-authenticated");
    }
  }
}

function loginWithDiscord() {
  if (window.location.protocol === "file:") {
    window.location.href = "http://127.0.0.1:4173/auth/discord";
    return;
  }

  window.location.href = "/auth/discord";
}

function updateLoggedUser(user, guild, fivem, discordStatus) {
  const name = guild?.displayName || user.globalName || user.username || "Discord";
  const roleName = getPrimaryRole(guild);
  const avatarUrl = guild?.avatar || user.avatar;

  document.getElementById("current-user").textContent = name;
  document.getElementById("current-role").textContent = roleName;
  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-subtitle").textContent = guild?.inServer
    ? `${roleName} no servidor`
    : "Usuário conectado, fora do servidor configurado";
  document.getElementById("profile-role").textContent = roleName;
  document.getElementById("profile-discord-id").textContent = user.id;
  document.getElementById("profile-fivem-passport").textContent = fivem?.registered ? fivem.passport : "Não registrado";
  document.getElementById("profile-server").textContent = guild?.name || "Servidor não identificado";
  document.getElementById("profile-joined").textContent = guild?.joinedAt ? formatDate(guild.joinedAt) : "Não informado";

  const status = document.getElementById("profile-discord-status");
  const statusColor = discordStatus?.color || "gray";
  const statusLabel = discordStatus?.label || "Indisponível";
  status.className = `status-dot-label ${statusColor}`;
  status.title = statusLabel;
  status.setAttribute("aria-label", statusLabel);
  status.querySelector("span").textContent = statusLabel;

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  document.querySelectorAll(".avatar, .large-avatar").forEach((avatar) => {
    if (avatarUrl) {
      avatar.textContent = "";
      avatar.style.backgroundImage = `url("${avatarUrl}")`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
    } else {
      avatar.textContent = initials || "DC";
    }
  });
}

function getPrimaryRole(guild) {
  if (!guild?.inServer) return "Fora do servidor";
  const allowedProfileRoles = Array.isArray(guild.profileRoles)
    ? guild.profileRoles.filter((role) => role.name !== "@everyone")
    : [];

  if (allowedProfileRoles.length > 0) {
    return allowedProfileRoles.map((role) => role.name).join(", ");
  }

  return guild.hasBotDetails ? "Sem cargo registrado" : "Membro do servidor";
}

function formatDate(value) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}

function setRoute(route) {
  state.route = route;
  document.querySelectorAll(".view").forEach((view) => view.classList.remove("active"));
  document.getElementById(`view-${route}`)?.classList.add("active");

  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.toggle("active", item.dataset.route === route);
  });

  const active = document.querySelector(`.nav-item[data-route="${route}"]`);
  const title = routeTitles[route] || active?.textContent.trim() || "Início";
  document.getElementById("page-title").textContent = title;
  document.querySelector(".sidebar").classList.remove("open");

  if (route === "logs") {
    const firstSub = document.querySelector(".sub-card");
    if (firstSub) setSubRoute(firstSub.dataset.subroute);
  }

  if (route === "membros") {
    loadRealMembers();
  }
}

function renderGoals(editingIndex = -1) {
  const canEdit = state.user?.id === "1311011330400190508";
  if (!canEdit) editingIndex = -1;
  const container = document.getElementById("goal-list");
  container.innerHTML = goals
    .map((goal, i) => {
      const percent = Math.round((goal.current / goal.target) * 100);
      const low = goal.current <= goal.min;
      const editing = canEdit && editingIndex === i;
      return `
        <article class="goal-item">
          <div class="goal-line">
            <div>
              <strong>${goal.name}</strong>
              <div class="goal-meta">${
                editing
                  ? `Atual: <input class="goal-edit-input" id="goal-current-${i}" type="number" value="${goal.current}" min="0" /> &nbsp; Início: <input class="goal-edit-input" id="goal-initial-${i}" type="number" value="${goal.initial}" min="0" />`
                  : `Atual: ${goal.current} &nbsp; Início: ${goal.initial}`
              }</div>
            </div>
            <span class="pill ${low ? "red" : "green"}">${low ? "Acabando" : "Estavel"}</span>
          </div>
          <div class="progress-track"><span style="width:${Math.min(percent, 100)}%"></span></div>
          ${canEdit ? `
          <div class="goal-actions">
            ${
              editing
                ? `<button class="icon-button" data-save-goal="${i}" type="button" title="Salvar"><span data-icon="check">${icons.check}</span></button>`
                : `<button class="icon-button" data-edit-goal="${i}" type="button" title="Editar"><span data-icon="edit">${icons.edit}</span></button>`
            }
          </div>` : ""}
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("[data-edit-goal]").forEach((btn) => {
    btn.addEventListener("click", () => renderGoals(Number(btn.dataset.editGoal)));
  });

  document.querySelectorAll("[data-save-goal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = Number(btn.dataset.saveGoal);
      const currentInput = document.getElementById(`goal-current-${i}`);
      const initialInput = document.getElementById(`goal-initial-${i}`);
      const currentVal = parseInt(currentInput.value, 10);
      const initialVal = parseInt(initialInput.value, 10);
      if (!isNaN(currentVal) && currentVal >= 0) goals[i].current = currentVal;
      if (!isNaN(initialVal) && initialVal >= 0) goals[i].initial = initialVal;
      renderGoals();
    });
  });

  updateGoalSummary();
}

async function refreshGoals() {
  const button = document.getElementById("refresh-goals");
  const label = document.getElementById("goal-sync-label");
  button.classList.add("is-loading");
  button.disabled = true;
  label.textContent = "Atualizando lista...";

  try {
    const response = await fetch("/api/goals", { credentials: "same-origin" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Erro ao atualizar metas.");
    }

    goals = data.goals || goals;
    renderGoals();
    label.textContent = `Atualizado às ${formatTime(data.updatedAt)}`;
    showToast("Lista de metas atualizada com a nova quantidade.");
  } catch {
    label.textContent = "Não foi possível atualizar agora.";
    showToast("Não foi possível atualizar a lista de metas.");
  } finally {
    button.classList.remove("is-loading");
    button.disabled = false;
  }
}

function updateGoalSummary() {
  const totalCurrent = goals.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.target, 0);
  const percent = Math.round((totalCurrent / totalTarget) * 100);

  document.querySelector(".hero-panel .signal-row strong").textContent = `${percent}%`;
  document.querySelector(".hero-panel .progress-track span").style.width = `${Math.min(percent, 100)}%`;
}

function formatTime(value) {
  return new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function renderEvents() {
  document.getElementById("event-list").innerHTML = events
    .map(
      (event) => `
      <article class="event-card" style="--event-image:${event.image}">
        <div>
          <div class="event-top">
            <span class="pill blue">${event.date}</span>
            <span>${event.players} confirmados</span>
          </div>
          <h3>${event.name}</h3>
          <p>Local: ${event.place}</p>
        </div>
        <div>
          <strong>Premiacao</strong>
          <p>${event.prize}</p>
          <button class="ghost-button compact" type="button">Confirmar presenca</button>
        </div>
      </article>
    `
    )
    .join("");
}

function renderRanking() {
  const ranked = [...members].sort((a, b) => b.points - a.points);
  document.getElementById("ranking-list").innerHTML = ranked
    .map(
      (member, index) => `
      <div class="ranking-row">
        <div class="rank-left">
          <span class="rank-number">${index + 1}</span>
          <div><strong>${member.name}</strong><span class="goal-meta">${member.role}</span></div>
        </div>
        <strong>${member.points.toLocaleString("pt-BR")} pts</strong>
      </div>
    `
    )
    .join("");
}

function renderRules() {
  document.getElementById("rules-list").innerHTML = rules
    .map(
      ([title, items]) => `
      <article class="rules-card">
        <h4>${title}</h4>
        <ul>${items.map((item) => `<li>${item}</li>`).join("")}</ul>
      </article>
    `
    )
    .join("");
}

function renderStore() {
  document.getElementById("store-list").innerHTML = store
    .map(
      ([title, price, text]) => `
      <article class="store-card">
        <div>
          <h4>${title}</h4>
          <p>${text}</p>
        </div>
        <strong>${price.toLocaleString("pt-BR")} pontos</strong>
        <button class="ghost-button compact" type="button">Resgatar</button>
      </article>
    `
    )
    .join("");
}

async function loadRealMembers() {
  const table = document.getElementById("member-table");
  if (!state.membersLoaded) {
    table.innerHTML = `<div class="empty-state">Carregando membros reais do Discord...</div>`;
  }

  try {
    const response = await fetch("/api/members", { credentials: "same-origin" });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Não foi possível carregar os membros.");
    }

    state.realMembers = data.members || [];
    state.membersLoaded = true;
    renderMembers(document.getElementById("member-search").value);
  } catch (error) {
    table.innerHTML = `<div class="empty-state">Não foi possível carregar os membros reais. Verifique se o bot está no servidor principal e se o servidor foi reiniciado.</div>`;
  }
}

function renderMembers(filter = "") {
  const term = filter.toLowerCase();
  const rows = state.realMembers.filter((member) => {
    const roles = Array.isArray(member.roles) ? member.roles.map((role) => role.name).join(" ") : "";
    const haystack = `${member.name} ${member.username} ${member.id} ${member.role} ${roles}`.toLowerCase();
    return haystack.includes(term);
  });

  if (!state.membersLoaded) {
    document.getElementById("member-table").innerHTML = `<div class="empty-state">Abra esta aba para carregar os membros reais do Discord.</div>`;
    return;
  }

  if (rows.length === 0) {
    document.getElementById("member-table").innerHTML = `<div class="empty-state">Nenhum membro encontrado.</div>`;
    return;
  }

  const grouped = groupMembersByRole(rows);
  document.getElementById("member-table").innerHTML = memberRoleOrder
    .filter((roleName) => grouped.get(roleName)?.length)
    .map((roleName) => `
      <section class="member-group">
        <div class="member-group-head">
          <strong>${roleName}</strong>
          <span>${grouped.get(roleName).length} membro${grouped.get(roleName).length > 1 ? "s" : ""}</span>
        </div>
        ${grouped.get(roleName).map(memberRowTemplate).join("")}
      </section>
    `)
    .join("");
}

function groupMembersByRole(rows) {
  const grouped = new Map(memberRoleOrder.map((roleName) => [roleName, []]));

  rows.forEach((member) => {
    const roleName = getMemberGroupRole(member);
    grouped.get(roleName).push(member);
  });

  grouped.forEach((membersInRole) => {
    membersInRole.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  });

  return grouped;
}

function getMemberGroupRole(member) {
  const names = Array.isArray(member.roles) ? member.roles.map((role) => normalizeRoleName(role.name)) : [];
  const found = memberRoleOrder.find((roleName) => names.includes(normalizeRoleName(roleName)));
  return found || "👤・Membro";
}

function normalizeRoleName(name) {
  return String(name)
    .normalize("NFKC")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function memberRowTemplate(member) {
  return `
    <div class="member-row">
      <div class="member-identity">
        <span class="member-avatar" style="${member.avatar ? `background-image:url('${member.avatar}')` : ""}">${member.avatar ? "" : getInitials(member.name)}</span>
        <div><strong>${member.name}</strong><span>${member.username}</span></div>
      </div>
      <span>${getMemberGroupRole(member)}</span>
      <span>Discord: ${member.id}</span>
      <span class="status-dot-label ${statusClass(member.status)}" title="${member.status}" aria-label="${member.status}"><span>${member.status}</span><i></i></span>
      <button class="icon-button" type="button" title="Editar membro"><span data-icon="user">${icons.user}</span></button>
    </div>
  `;
}

function renderWarnings() {
  const warningSelect = document.querySelector('#warning-form select[name="membro"]');
  warningSelect.innerHTML = members.map((member) => `<option>${member.name}</option>`).join("");

  document.getElementById("warning-list").innerHTML = warnings.map(warningRow).join("");
  document.getElementById("punishment-list").innerHTML = warnings.slice(0, 3).map(warningRow).join("");
}

function warningRow(warning) {
  return `
    <div class="table-row">
      <div><strong>${warning.member}</strong><span>${warning.reason}</span></div>
      <span class="pill ${warning.severity === "Grave" ? "red" : warning.severity === "Media" ? "yellow" : "blue"}">${warning.severity}</span>
      <span>${warning.date}</span>
    </div>
  `;
}

function renderEntradasSaidas() {
  const entradas = entradasSaidas.filter((e) => e.action === "entrou" || e.action === "aprovado no recrutamento");
  const saidas = entradasSaidas.filter((e) => e.action === "saiu");

  document.getElementById("entradas-list").innerHTML = entradas
    .map(
      (entry) => `
      <div><span></span><p><strong>${entry.member} ${entry.action}</strong><small>${entry.date}</small></p></div>
    `
    )
    .join("");

  document.getElementById("saidas-list").innerHTML = saidas
    .map(
      (entry) => `
      <div><span></span><p><strong>${entry.member} ${entry.action}</strong><small>${entry.date}</small></p></div>
    `
    )
    .join("");
}

function renderMsgExcluida() {
  document.getElementById("msg-excluida-list").innerHTML = msgExcluida
    .map(
      (entry) => `
      <div class="log-item">
        <div><strong>${entry.author}</strong><span>#${entry.channel}</span></div>
        <span>${entry.date}</span>
      </div>
    `
    )
    .join("");
}

function renderMsgEditada() {
  document.getElementById("msg-editada-list").innerHTML = msgEditada
    .map(
      (entry) => `
      <div class="log-item">
        <div><strong>${entry.author}</strong><span>#${entry.channel}</span></div>
        <span>${entry.date}</span>
      </div>
    `
    )
    .join("");
}

function renderCallLogs() {
  document.getElementById("call-list").innerHTML = callLogs
    .map(
      (entry) => `
      <div class="log-item">
        <div><strong>${entry.channel}</strong><span>${entry.participants} participantes · ${entry.duration}</span></div>
        <span>${entry.date}</span>
      </div>
    `
    )
    .join("");
}

function bindForms() {
  document.getElementById("recruitment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Ficha enviada. O bot publicaria a candidatura no canal privado do Discord.");
    event.currentTarget.reset();
  });

  document.getElementById("warning-form").addEventListener("submit", (event) => {
    event.preventDefault();
    showToast("Advertencia registrada. O bot notificaria o membro no Discord.");
    event.currentTarget.reset();
  });

  document.getElementById("accept-rules").addEventListener("click", () => {
    showToast("Aceite registrado. O bot poderia salvar esse log no Discord.");
  });

  document.getElementById("new-event").addEventListener("click", () => {
    showToast("Criacao de evento simulada. Ao salvar, o bot anunciaria no Discord.");
  });

  document.getElementById("refresh-goals").addEventListener("click", refreshGoals);

  document.getElementById("member-search").addEventListener("input", (event) => {
    renderMembers(event.target.value);
  });
}

function getInitials(name) {
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function statusClass(status) {
  if (status === "Ativo" || status === "Disponível") return "green";
  if (status === "Ausência") return "blue";
  if (status === "Advertido") return "yellow";
  return "red";
}

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 3200);
}

init();
