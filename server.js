const http = require("http");
const fs = require("fs");
const path = require("path");

loadEnvFile();

const port = Number(process.env.PORT || process.argv[2] || 8080);

const handler = require("./api/index.js");

const server = http.createServer(handler);

server.listen(port, "0.0.0.0", () => {
  console.log(`Pressagio site: http://127.0.0.1:${port}/`);
  console.log(`Discord redirect URI: ${process.env.DISCORD_REDIRECT_URI || `http://127.0.0.1:${port}/auth/discord/callback`}`);
  startPresenceGateway();
});

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

function startPresenceGateway() {
  if (!process.env.DISCORD_BOT_TOKEN) return;
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
            token: process.env.DISCORD_BOT_TOKEN,
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

const presences = globalThis.__presences || new Map();
globalThis.__presences = presences;

function savePresence(presence) {
  if (!presence?.user?.id || !presence.status) return;
  presences.set(presence.user.id, {
    status: presence.status,
    updatedAt: new Date().toISOString(),
  });
}
