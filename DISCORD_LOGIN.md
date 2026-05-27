# Login com Discord

1. Acesse o Discord Developer Portal e crie uma aplicacao.
2. Em OAuth2, copie o `Client ID` e o `Client Secret`.
3. Em Redirects, adicione exatamente:

```txt
http://127.0.0.1:4173/auth/discord/callback
```

4. Crie um arquivo `.env` na pasta do site usando o modelo:

```txt
DISCORD_CLIENT_ID=seu_client_id
DISCORD_CLIENT_SECRET=seu_client_secret
DISCORD_REDIRECT_URI=http://127.0.0.1:4173/auth/discord/callback
DISCORD_SCOPES=identify guilds guilds.members.read
DISCORD_GUILD_ID=1500607972605296713
DISCORD_BOT_TOKEN=token_do_seu_bot
```

5. Para detectar apelido e cargos reais no servidor, coloque o bot dentro do servidor `1500607972605296713`.

6. Para sincronizar o status do perfil do Discord, ative no Discord Developer Portal:

```txt
Bot > Privileged Gateway Intents > Presence Intent
```

O bot tambem precisa estar no servidor principal.

7. Reinicie o servidor:

```bat
npm.cmd start
```

Use sempre o site por `http://127.0.0.1:4173/`. O login OAuth nao funciona abrindo `index.html` direto por `file:///`.

Sem `DISCORD_BOT_TOKEN`, o site ainda consegue ler o apelido do proprio usuario no servidor FiveM usando `guilds.members.read`, desde que o usuario autorize novamente o login.

Para cargos de todos os membros e dados administrativos do servidor principal, o bot ainda precisa estar no servidor principal.
