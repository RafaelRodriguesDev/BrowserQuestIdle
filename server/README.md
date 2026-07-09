BrowserQuest server documentation
=================================

The local game server runs with Node.js and the dependencies declared in the root `package.json`.

Current default runtime dependencies:

- `underscore`
- `bison`
- `ws`

Install them from the repository root:

```powershell
npm install
```

The removed legacy packages `log`, `websocket`, `websocket-server`, `sanitizer`, and `memcache` are not required for default local play.


Configuration
-------------

The server settings (bind host, port, number of worlds, number of players per world, etc.) can be configured.
Copy `config_local.json-dist` to a new `config_local.json` file, then edit it. The server will override default settings with this file.

Default local/private bind:

```json
{
    "host": "127.0.0.1",
    "port": 8000
}
```


Deployment
----------

For local development, run from the repository root:

```powershell
node server/js/main.js
```

The server listens on the host and port configured in `server/config.json` or `server/config_local.json`.

For private production, keep the Node listener on `127.0.0.1` or another private interface and put a reverse proxy in front of it. The proxy should terminate HTTPS and forward WebSocket upgrade requests to the Node listener.

Production deployment with a real public HTTPS/WSS proxy has not been smoke-tested in this modernization baseline. Treat direct local server play, private proxy operation, and production dispatcher behavior as separate paths.

Run the process under a supervisor such as a Windows service wrapper, PM2, systemd, or another process manager. The supervisor should:

- Start `node server/js/main.js`.
- Capture stdout and stderr as the operational logs.
- Restart the process on failure.
- Check `http://127.0.0.1:8000/health` or run `npm run smoke:health` for readiness.

Note: the `shared` directory is the only one in the project which is a server dependency.


Monitoring
----------

The server has a health URL for readiness and a status URL for player population.

Health check:

```text
http://[host]:[port]/health
```

It returns JSON with `status`, process `uptime`, and configured world count.

Population status:

```text
http://[host]:[port]/status
```

It will return a JSON array containing the number of players in all instanced worlds on this game server.

Automated health smoke:

```powershell
npm run smoke:health
```

Default local config keeps `metrics_enabled` set to `false`. The old memcache metrics path is explicit opt-in work and is not required for local smoke checks.
