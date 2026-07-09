# BrowserQuestIdle - Idle Mechanics Backlog

This document maintains the backlog of game design and feature tasks for turning BrowserQuest into an idle game. By keeping this backlog separate from the technical modernization tasks (`.planning/`), we ensure that technical debt is cleanly addressed before mixing in gameplay changes.

## Phase 6+: Idle Gameplay Features

- [ ] **Data Persistence & Local Storage**
  - Save the player's idle stats (gold, level, items, upgrades) between sessions using `localStorage` on the client or flat files/SQLite on the server.
- [ ] **Idle Core Loop (Clicker Mechanics)**
  - Implement a basic click-to-earn mechanic by intercepting the `onPlayerAction` hook in `server/js/idle-extensions.js`.
  - Add visual feedback on the client when earning resources (e.g., floating numbers).
- [ ] **Passive Resource Generation**
  - Implement the `onServerTick` hook in `server/js/idle-extensions.js` to reward logged-in players passively over time.
- [ ] **Upgrades UI**
  - Modify the HTML/CSS in `client/` to add an "Upgrades" panel.
  - Implement new WebSocket protocol messages (e.g. `BUY_UPGRADE`) to communicate with the server without disrupting the original protocol.
- [ ] **Offline Progress**
  - When a player logs in, calculate the time elapsed since their last session and grant them the offline resources they generated.
