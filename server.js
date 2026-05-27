const http = require("http");
const https = require("https");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

loadEnvFile();

const port = Number(process.env.PORT || process.argv[2] || 8080);
const root = __dirname;
const sessions = new Map();
const presences = new Map();
let goalStock = [
  { name: "Ferro", current: 320, target: 800, min: 400 },
  { name: "Polímero", current: 180, target: 500, min: 200 },
  { name: "Níquel", current: 60, target: 300, min: 100 },
  { name: "Carcaça de Bateria", current: 90, target: 250, min: 80 },
];
const profileRoleIds = new Set([
  "1500614985200439416",
  "1500615042595295304",
  "1500615066649628792",
  "1500609717612052640",
  "1500609718782132325",
  "1500609737732133055",
  "1500609720233365534",
  "1500609722355552328",
  "1501039815129432165",
  "1500609723983073411",
  "1500609725572845578",
]);

const config = {
  clientId: process.env.DISCORD_CLIENT_ID || "",
  clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
  redirectUri: process.env.DISCORD_REDIRECT_URI || `http://127.0.0.1:${port}/auth/discord/callback`,
  scopes: process.env.DISCORD_SCOPES || "identify guilds guilds.members.read",
  guildId: process.env.DISCORD_GUILD_ID || "1500607972605296713",
  fivemGuildId: process.env.FIVEM_GUILD_ID || "1153823875004637204",
  botToken: process.env.DISCORD_BOT_TOKEN || "",
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
};

const server = http.createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url || "/", `http://${request.headers.host}`);

    if (requestUrl.pathname === "/auth/discord") {
      handleDiscordStart(response);
      return;
    }

    if (requestUrl.pathname === "/auth/discord/callback") {
      await handleDiscordCallback(request, response, requestUrl);
      return;
    }

    if (requestUrl.pathname === "/api/session") {
      handleSession(request, response);
      return;
    }

    if (requestUrl.pathname === "/api/members") {
      await handleMembers(request, response);
      return;
    }

    if (requestUrl.pathname === "/api/goals") {
      handleGoals(request, response);
      return;
    }

    if (requestUrl.pathname === "/api/goals/sync") {
      handleGoalsSync(request, response);
      return;
    }

    if (requestUrl.pathname === "/api/presence") {
      handlePresence(request, response);
      return;
    }

    if (requestUrl.pathname === "/auth/logout") {
      handleLogout(request, response);
      return;
    }

    serveStatic(requestUrl.pathname, response);
  } catch (error) {
    sendJson(response, 500, { error: "server_error", message: error.message });
  }
});

function handleDiscordStart(response) {
  if (!config.clientId || !config.clientSecret) {
    sendSetupError(response);
    return;
  }

  const state = crypto.randomBytes(18).toString("hex");
  const authUrl = new URL("https://discord.com/oauth2/authorize");
  authUrl.searchParams.set("client_id", config.clientId);
  authUrl.searchParams.set("redirect_uri", config.redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", config.scopes);
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("prompt", "consent");

  response.writeHead(302, {
    Location: authUrl.toString(),
    "Set-Cookie": cookie("pressagio_oauth_state", state, { maxAge: 300, httpOnly: true }),
  });
  response.end();
}

async function handleDiscordCallback(request, response, requestUrl) {
  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const cookies = parseCookies(request.headers.cookie || "");

  if (!code || !state || state !== cookies.pressagio_oauth_state) {
    redirectWithError(response, "discord_state_invalid");
    return;
  }

  const token = await exchangeDiscordCode(code);
  const user = await fetchDiscordUser(token.access_token);
  const guilds = config.scopes.includes("guilds") ? await fetchDiscordGuilds(token.access_token) : [];
  const guildInfo = await fetchConfiguredGuildInfo(user, guilds);
  const fivemInfo = await fetchFivemInfo(user, token.access_token);
  const sessionId = crypto.randomBytes(32).toString("hex");

  sessions.set(sessionId, {
    createdAt: Date.now(),
    token,
    user: normalizeDiscordUser(user),
    guilds,
    guildInfo,
    fivemInfo,
  });

  response.writeHead(302, {
    Location: "/",
    "Set-Cookie": [
      cookie("pressagio_session", sessionId, { maxAge: 60 * 60 * 24 * 7, httpOnly: true }),
      cookie("pressagio_oauth_state", "", { maxAge: 0, httpOnly: true }),
    ],
  });
  response.end();
}

function handleSession(request, response) {
  const session = getSession(request);

  if (!session) {
    sendJson(response, 401, { authenticated: false });
    return;
  }

  sendJson(response, 200, {
    authenticated: true,
    user: session.user,
    discordStatus: getDiscordStatus(session.user.id),
    guild: session.guildInfo,
    fivem: session.fivemInfo,
    guilds: session.guilds.map((guild) => ({
      id: guild.id,
      name: guild.name,
      owner: guild.owner,
      permissions: guild.permissions,
    })),
  });
}

async function handleMembers(request, response) {
  const session = getSession(request);

  if (!session) {
    sendJson(response, 401, { error: "not_authenticated" });
    return;
  }

  if (!config.botToken) {
    sendJson(response, 500, { error: "bot_token_missing" });
    return;
  }

  const [members, roles] = await Promise.all([
    fetchGuildMembers(config.guildId),
    fetchGuildRoles(config.guildId),
  ]);

  const roleMap = new Map(roles.map((role) => [role.id, role]));
  const normalized = members
    .filter((member) => !member.user?.bot)
    .map((member) => normalizeGuildMember(member, roleMap))
    .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

  sendJson(response, 200, {
    guildId: config.guildId,
    count: normalized.length,
    members: normalized,
  });
}

function handleLogout(request, response) {
  const cookies = parseCookies(request.headers.cookie || "");
  if (cookies.pressagio_session) {
    sessions.delete(cookies.pressagio_session);
  }

  response.writeHead(302, {
    Location: "/",
    "Set-Cookie": cookie("pressagio_session", "", { maxAge: 0, httpOnly: true }),
  });
  response.end();
}

function handlePresence(request, response) {
  const session = getSession(request);

  if (!session) {
    sendJson(response, 401, { error: "not_authenticated" });
    return;
  }

  sendJson(response, 200, {
    userId: session.user.id,
    status: getDiscordStatus(session.user.id),
    cachedPresences: presences.size,
  });
}

function handleGoals(request, response) {
  goalStock = goalStock.map((goal) => {
    const variation = crypto.randomInt(-35, 76);
    const current = Math.max(0, Math.min(goal.target, goal.current + variation));
    return { ...goal, current };
  });

  const totalCurrent = goalStock.reduce((sum, goal) => sum + goal.current, 0);
  const totalTarget = goalStock.reduce((sum, goal) => sum + goal.target, 0);

  sendJson(response, 200, {
    updatedAt: new Date().toISOString(),
    summaryPercent: Math.round((totalCurrent / totalTarget) * 100),
    goals: goalStock,
  });
}

function handleGoalsSync(request, response) {
  if (request.method !== "POST") {
    response.writeHead(405);
    response.end("Method Not Allowed");
    return;
  }

  let body = "";
  request.on("data", (chunk) => { body += chunk; });
  request.on("end", () => {
    try {
      const data = JSON.parse(body);

      if (!data.goals || !Array.isArray(data.goals)) {
        sendJson(response, 400, { error: "invalid_body", message: "Campo 'goals' é obrigatório." });
        return;
      }

      // Merge received goals with existing goalStock
      for (const received of data.goals) {
        if (!received.name) continue;
        const existing = goalStock.find((g) => g.name === received.name);
        if (existing) {
          if (typeof received.current === "number") existing.current = received.current;
          if (typeof received.target === "number") existing.target = received.target;
          if (typeof received.min === "number") existing.min = received.min;
        }
      }

      const totalCurrent = goalStock.reduce((sum, goal) => sum + goal.current, 0);
      const totalTarget = goalStock.reduce((sum, goal) => sum + goal.target, 0);

      sendJson(response, 200, {
        updatedAt: new Date().toISOString(),
        summaryPercent: Math.round((totalCurrent / totalTarget) * 100),
        goals: goalStock,
      });
    } catch (error) {
      sendJson(response, 400, { error: "invalid_json", message: error.message });
    }
  });
}

function serveStatic(pathname, response) {
  const cleanPath = pathname === "/" ? "index.html" : pathname.replace(/^[/\\]+/, "");
  const normalized = path.normalize(cleanPath).replace(/^(\.\.[\\/])+/, "");
  const filePath = path.join(root, normalized);

  if (!filePath.startsWith(root)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      response.writeHead(404);
      response.end("Not found");
      return;
    }

    response.writeHead(200, {
      "Content-Type": types[path.extname(filePath)] || "application/octet-stream",
    });
    response.end(content);
  });
}

async function exchangeDiscordCode(code) {
  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: config.redirectUri,
  });

  return postForm("https://discord.com/api/oauth2/token", body);
}

async function fetchDiscordUser(accessToken) {
  return getJson("https://discord.com/api/users/@me", accessToken);
}

async function fetchDiscordGuilds(accessToken) {
  try {
    return await getJson("https://discord.com/api/users/@me/guilds", accessToken);
  } catch {
    return [];
  }
}

async function fetchConfiguredGuildInfo(user, guilds) {
  const listedGuild = guilds.find((guild) => guild.id === config.guildId) || null;
  const baseInfo = {
    id: config.guildId,
    inServer: Boolean(listedGuild),
    name: listedGuild?.name || "Servidor Presságio",
    nickname: null,
    displayName: user.global_name || user.username,
    avatar: null,
    roles: [],
    roleIds: [],
    hasBotDetails: false,
  };

  if (!config.botToken) {
    return baseInfo;
  }

  try {
    const [member, roles] = await Promise.all([
      fetchGuildMember(config.guildId, user.id),
      fetchGuildRoles(config.guildId),
    ]);

    const roleMap = new Map(roles.map((role) => [role.id, role]));
    const memberRoles = member.roles
      .map((roleId) => roleMap.get(roleId))
      .filter(Boolean)
      .sort((a, b) => b.position - a.position)
      .map((role) => ({
        id: role.id,
        name: role.name,
        color: role.color,
        position: role.position,
      }));

    const guildAvatar = member.avatar
      ? `https://cdn.discordapp.com/guilds/${config.guildId}/users/${user.id}/avatars/${member.avatar}.png?size=128`
      : null;

    return {
      ...baseInfo,
      inServer: true,
      nickname: member.nick || null,
      displayName: member.nick || user.global_name || user.username,
      avatar: guildAvatar,
      roles: memberRoles,
      profileRoles: memberRoles.filter((role) => profileRoleIds.has(role.id)),
      roleIds: member.roles,
      joinedAt: member.joined_at || null,
      hasBotDetails: true,
    };
  } catch (error) {
    return {
      ...baseInfo,
      botError: error.message,
    };
  }
}

async function fetchFivemInfo(user, accessToken) {
  const fallback = {
    guildId: config.fivemGuildId,
    registered: false,
    passport: null,
    name: null,
    rawName: null,
  };

  if (config.scopes.includes("guilds.members.read")) {
    try {
      const member = await fetchCurrentUserGuildMember(config.fivemGuildId, accessToken);
      const rawName = member.nick || user.global_name || user.username || "";
      const parsed = parseFivemName(rawName);

      return {
        ...fallback,
        registered: Boolean(parsed),
        passport: parsed?.passport || null,
        name: parsed?.name || null,
        rawName,
        source: "oauth",
      };
    } catch (error) {
      fallback.oauthError = error.message;
    }
  }

  if (!config.botToken) return fallback;

  try {
    const member = await fetchGuildMember(config.fivemGuildId, user.id);
    const rawName = member.nick || member.user?.global_name || member.user?.username || "";
    const parsed = parseFivemName(rawName);

    return {
      ...fallback,
      registered: Boolean(parsed),
      passport: parsed?.passport || null,
      name: parsed?.name || null,
      rawName,
      source: "bot",
    };
  } catch (error) {
    return {
      ...fallback,
      error: error.message,
    };
  }
}

function fetchCurrentUserGuildMember(guildId, accessToken) {
  return getJson(`https://discord.com/api/users/@me/guilds/${guildId}/member`, accessToken);
}

function parseFivemName(rawName) {
  const match = String(rawName).trim().match(/^(\d+)\s*\|\s*(.+)$/);
  if (!match) return null;

  return {
    passport: match[1],
    name: match[2].trim(),
  };
}

function fetchGuildMember(guildId, userId) {
  return getBotJson(`https://discord.com/api/guilds/${guildId}/members/${userId}`);
}

function fetchGuildRoles(guildId) {
  return getBotJson(`https://discord.com/api/guilds/${guildId}/roles`);
}

async function fetchGuildMembers(guildId) {
  const collected = [];
  let after = "0";

  while (true) {
    const batch = await getBotJson(`https://discord.com/api/guilds/${guildId}/members?limit=1000&after=${after}`);
    collected.push(...batch);

    if (batch.length < 1000) break;
    after = batch[batch.length - 1].user.id;
  }

  return collected;
}

function normalizeGuildMember(member, roleMap) {
  const roles = member.roles
    .map((roleId) => roleMap.get(roleId))
    .filter(Boolean)
    .filter((role) => role.name !== "@everyone")
    .sort((a, b) => b.position - a.position)
    .map((role) => ({
      id: role.id,
      name: role.name,
      color: role.color,
      position: role.position,
    }));

  const name = member.nick || member.user.global_name || member.user.username;
  const avatar = member.avatar
    ? `https://cdn.discordapp.com/guilds/${config.guildId}/users/${member.user.id}/avatars/${member.avatar}.png?size=128`
    : member.user.avatar
      ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.png?size=128`
      : null;

  return {
    id: member.user.id,
    name,
    username: member.user.username,
    avatar,
    role: roles[0]?.name || "Membro",
    roles,
    joinedAt: member.joined_at || null,
    status: getMemberAvailability(roles),
  };
}

function getMemberAvailability(roles) {
  const roleNames = roles.map((role) => role.name.toLowerCase());
  const absenceTerms = ["ausência", "ausencia", "ausente", "afastado"];

  if (roleNames.some((name) => absenceTerms.some((term) => name.includes(term)))) {
    return "Ausência";
  }

  return "Disponível";
}

function postForm(url, body) {
  return requestJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(body.toString()),
    },
    body: body.toString(),
  });
}

function getJson(url, accessToken) {
  return requestJson(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

function getBotJson(url) {
  return requestJson(url, {
    method: "GET",
    headers: {
      Authorization: `Bot ${config.botToken}`,
    },
  });
}

function requestJson(url, options) {
  return new Promise((resolve, reject) => {
    const request = https.request(url, {
      method: options.method,
      headers: options.headers,
    }, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });
      response.on("end", () => {
        let parsed;
        try {
          parsed = data ? JSON.parse(data) : {};
        } catch {
          reject(new Error("Discord returned an invalid response."));
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(parsed.error_description || parsed.message || "Discord OAuth request failed."));
          return;
        }

        resolve(parsed);
      });
    });

    request.on("error", reject);

    if (options.body) {
      request.write(options.body);
    }

    request.end();
  });
}

function normalizeDiscordUser(user) {
  const avatar = user.avatar
    ? `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png?size=128`
    : null;

  return {
    id: user.id,
    username: user.username,
    globalName: user.global_name || user.username,
    discriminator: user.discriminator,
    avatar,
  };
}

function getSession(request) {
  const cookies = parseCookies(request.headers.cookie || "");
  const session = sessions.get(cookies.pressagio_session);

  if (!session) return null;

  const maxAge = 1000 * 60 * 60 * 24 * 7;
  if (Date.now() - session.createdAt > maxAge) {
    sessions.delete(cookies.pressagio_session);
    return null;
  }

  return session;
}

function parseCookies(header) {
  return Object.fromEntries(
    header
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const index = item.indexOf("=");
        return [decodeURIComponent(item.slice(0, index)), decodeURIComponent(item.slice(index + 1))];
      })
  );
}

function cookie(name, value, options = {}) {
  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    "Path=/",
    "SameSite=Lax",
  ];

  if (options.httpOnly) parts.push("HttpOnly");
  if (options.maxAge !== undefined) parts.push(`Max-Age=${options.maxAge}`);

  return parts.join("; ");
}

function sendJson(response, status, data) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(data));
}

function redirectWithError(response, error) {
  response.writeHead(302, { Location: `/?login_error=${encodeURIComponent(error)}` });
  response.end();
}

function sendSetupError(response) {
  response.writeHead(500, { "Content-Type": "text/html; charset=utf-8" });
  response.end(`
    <h1>Discord OAuth nao configurado</h1>
    <p>Crie um arquivo <code>.env</code> com <code>DISCORD_CLIENT_ID</code>, <code>DISCORD_CLIENT_SECRET</code>, <code>DISCORD_REDIRECT_URI</code> e, para cargos/passaporte, <code>DISCORD_BOT_TOKEN</code>.</p>
    <p>Redirect URI esperado: <code>${config.redirectUri}</code></p>
  `);
}

function loadEnvFile() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) return;

  const lines = fs.readFileSync(envPath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    const value = trimmed.slice(index + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

server.listen(port, "127.0.0.1", () => {
  console.log(`Pressagio site: http://127.0.0.1:${port}/`);
  console.log(`Discord redirect URI: ${config.redirectUri}`);
  startPresenceGateway();
});

function getDiscordStatus(userId) {
  const presence = presences.get(userId);
  if (!presence) {
    return {
      value: "unknown",
      label: "Indisponível",
      color: "gray",
    };
  }

  const labels = {
    online: "Disponível",
    idle: "Ausente",
    dnd: "Não perturbe",
    offline: "Offline",
  };

  const colors = {
    online: "green",
    idle: "yellow",
    dnd: "red",
    offline: "gray",
  };

  return {
    value: presence.status,
    label: labels[presence.status] || "Indisponível",
    color: colors[presence.status] || "gray",
    updatedAt: presence.updatedAt,
  };
}

function startPresenceGateway() {
  if (!config.botToken) return;
  if (typeof WebSocket !== "function") {
    console.warn("WebSocket nao esta disponivel neste Node. Status do Discord desativado.");
    return;
  }

  let socket = null;
  let heartbeatTimer = null;
  let lastSequence = null;
  let reconnectTimer = null;

  const connect = () => {
    clearTimeout(reconnectTimer);
    socket = new WebSocket("wss://gateway.discord.gg/?v=10&encoding=json");

    socket.addEventListener("message", (event) => {
      const payload = JSON.parse(event.data);
      if (payload.s !== null) lastSequence = payload.s;

      if (payload.op === 10) {
        clearInterval(heartbeatTimer);
        heartbeatTimer = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ op: 1, d: lastSequence }));
          }
        }, payload.d.heartbeat_interval);

        socket.send(JSON.stringify({
          op: 2,
          d: {
            token: config.botToken,
            intents: 1 | 256,
            properties: {
              os: "windows",
              browser: "pressagio-central",
              device: "pressagio-central",
            },
            presence: {
              status: "online",
              activities: [],
              afk: false,
            },
          },
        }));
      }

      if (payload.t === "PRESENCE_UPDATE" && payload.d?.user?.id) {
        savePresence(payload.d);
      }

      if (payload.t === "READY" && Array.isArray(payload.d?.presences)) {
        payload.d.presences.forEach(savePresence);
      }

      if (payload.t === "GUILD_CREATE" && Array.isArray(payload.d?.presences)) {
        payload.d.presences.forEach(savePresence);
      }

      if (payload.t === "READY") {
        console.log("Discord presence gateway conectado.");
      }
    });

    socket.addEventListener("close", () => {
      clearInterval(heartbeatTimer);
      reconnectTimer = setTimeout(connect, 5000);
    });

    socket.addEventListener("error", () => {
      try {
        socket.close();
      } catch {}
    });
  };

  connect();
}

function savePresence(presence) {
  if (!presence?.user?.id || !presence.status) return;

  presences.set(presence.user.id, {
    status: presence.status,
    updatedAt: new Date().toISOString(),
  });
}
