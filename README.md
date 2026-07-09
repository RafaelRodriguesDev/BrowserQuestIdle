BrowserQuestIdle
================

BrowserQuestIdle is a local modernization baseline for Mozilla BrowserQuest, an HTML5/JavaScript multiplayer game experiment.

The current validated path is local development play: install dependencies, start the Node game server, serve the repository root as static files, open `/client/`, create a character, and move in the map.


Local Run
---------

Install dependencies:

```powershell
npm install
```

Start the game server:

```powershell
node server/js/main.js
```

In another shell, serve the repository root. Example:

```powershell
python -m http.server 9090
```

Open:

```text
http://localhost:9090/client/
```

Do not serve the `client/` directory directly. The client loads shared files from `../shared/`, so the repository root must be the static web root.


Smoke Checks
------------

Run the full local smoke suite:

```powershell
npm run smoke
```

Individual checks:

```powershell
npm run smoke:server
npm run smoke:websocket
npm run smoke:browser
```

The smoke suite verifies `/status`, the BrowserQuest WebSocket `HELLO`/`WELCOME` handshake, and browser gameplay entry at `/client/` with a movement click.


Documentation
-------------

Additional notes are in `client/README.md` and `server/README.md`.


License
-------

Code is licensed under MPL 2.0. Content is licensed under CC-BY-SA 3.0.
See the LICENSE file for details.


Credits
-------

Created by [Little Workshop](http://www.littleworkshop.fr):

* Franck Lecollinet - [@whatthefranck](http://twitter.com/whatthefranck)
* Guillaume Lecollinet - [@glecollinet](http://twitter.com/glecollinet)
