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

The server settings (number of worlds, number of players per world, etc.) can be configured.
Copy `config_local.json-dist` to a new `config_local.json` file, then edit it. The server will override default settings with this file.


Deployment
----------

For local development, run from the repository root:

```powershell
node server/js/main.js
```

The server listens on the port configured in `server/config.json` or `server/config_local.json`.

Production deployment has not been revalidated in this modernization baseline. Treat direct local server play and production dispatcher behavior as separate paths.

Note: the `shared` directory is the only one in the project which is a server dependency.


Monitoring
----------

The server has a status URL which can be used as a health check or simply as a way to monitor player population.

Send a GET request to: `http://[host]:[port]/status`

It will return a JSON array containing the number of players in all instanced worlds on this game server.

Default local config keeps `metrics_enabled` set to `false`. The old memcache metrics path is explicit opt-in work and is not required for local smoke checks.
