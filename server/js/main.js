var fs = require('fs');

var fs = require('fs');


function main(config) {
    var ws = require("./ws"),
        WorldServer = require("./worldserver"),
        _ = require('underscore'),
        server = new ws.MultiVersionWebsocketServer(config.port, config.host || "127.0.0.1"),
        worlds = [];
    
    log = {
        info: function() { console.log.apply(console, arguments); },
        debug: function() {
            if(config.debug_level === "debug") {
                console.log.apply(console, arguments);
            }
        },
        error: function() { console.error.apply(console, arguments); }
    };


    
    log.info("Starting BrowserQuest game server...");
    
    server.onConnect(function(connection) {
        var world, // the one in which the player will be spawned
            connect = function() {
                if(world) {
                    world.connect_callback(new Player(connection, world));
                }
            };
        
        // simply fill each world sequentially until they are full
        world = _.detect(worlds, function(world) {
            return world.playerCount < config.nb_players_per_world;
        });
        world.updatePopulation();
        connect();
    });

    server.onError(function() {
        log.error(Array.prototype.join.call(arguments, ", "));
    });
    


    _.each(_.range(config.nb_worlds), function(i) {
        var world = new WorldServer('world'+ (i+1), config.nb_players_per_world, server);
        world.run(config.map_filepath);
        worlds.push(world);
    });
    
    server.onRequestStatus(function() {
        return JSON.stringify(getWorldDistribution(worlds));
    });

    server.onRequestHealth(function() {
        return JSON.stringify({
            status: "ok",
            uptime: process.uptime(),
            worlds: worlds.length
        });
    });
    var distribution = [];
    
    _.each(worlds, function(world) {
        distribution.push(world.playerCount);
    });
    return distribution;
}

function getConfigFile(path, callback) {
    fs.readFile(path, 'utf8', function(err, json_string) {
        if(err) {
            console.error("Could not open config file:", err.path);
            callback(null);
        } else {
            callback(JSON.parse(json_string));
        }
    });
}

var defaultConfigPath = './server/config.json',
    customConfigPath = './server/config_local.json';

process.argv.forEach(function (val, index, array) {
    if(index === 2) {
        customConfigPath = val;
    }
});

getConfigFile(defaultConfigPath, function(defaultConfig) {
    getConfigFile(customConfigPath, function(localConfig) {
        if(localConfig) {
            main(localConfig);
        } else if(defaultConfig) {
            main(defaultConfig);
        } else {
            console.error("Server cannot start without any configuration file.");
            process.exit(1);
        }
    });
});
