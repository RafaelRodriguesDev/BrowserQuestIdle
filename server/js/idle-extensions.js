/**
 * BrowserQuestIdle - Idle Gameplay Extension Point
 * 
 * This module is designed to be the entry point for idle game mechanics
 * without breaking the existing BrowserQuest network protocol or game loops.
 */

var IdleExtensions = {
    /**
     * Called when a player is fully initialized and enters a world.
     * Use this hook to load idle-specific data for a player (e.g., resources, upgrades).
     * @param {Player} player The BrowserQuest player object.
     */
    onPlayerEnteredWorld: function(player) {
        // Initialize player idle stats if they don't exist
        player.idleStats = player.idleStats || {
            clicks: 0,
            goldMultiplier: 1.0,
            lastActive: Date.now()
        };
        // log.info("Idle stats loaded for player " + player.name);
    },

    /**
     * Called periodically during the server tick for idle resource generation.
     * @param {WorldServer} world The world instance.
     */
    onServerTick: function(world) {
        // e.g. iterate over world.players and increment resources
    },

    /**
     * Called when a player clicks on an entity or performs an action.
     * Use this to intercept actions for idle mechanics (e.g. clicking for resources).
     * @param {Player} player The player acting
     * @param {Entity} target The target entity
     * @returns {boolean} True if the action should be handled normally, False to intercept/override.
     */
    onPlayerAction: function(player, target) {
        // Example: Idle clicking mechanic on specific entities
        return true; 
    }
};

module.exports = IdleExtensions;
