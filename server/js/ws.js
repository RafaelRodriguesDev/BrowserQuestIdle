var cls = require("./lib/class"),
    url = require('url'),
    WebSocket = require("ws"),
    http = require('http'),
    Utils = require('./utils'),
    _ = require('underscore'),
    BISON = require('bison'),
    WS = {},
    useBison = false;

module.exports = WS;


var Server = cls.Class.extend({
    init: function(port, host) {
        this.port = port;
        this.host = host || "127.0.0.1";
    },

    onConnect: function(callback) {
        this.connection_callback = callback;
    },

    onError: function(callback) {
        this.error_callback = callback;
    },

    broadcast: function(message) {
        throw "Not implemented";
    },

    forEachConnection: function(callback) {
        _.each(this._connections, callback);
    },

    addConnection: function(connection) {
        this._connections[connection.id] = connection;
    },

    removeConnection: function(id) {
        delete this._connections[id];
    },

    getConnection: function(id) {
        return this._connections[id];
    }
});


var Connection = cls.Class.extend({
    init: function(id, connection, server) {
        this._connection = connection;
        this._server = server;
        this.id = id;
    },

    onClose: function(callback) {
        this.close_callback = callback;
    },

    listen: function(callback) {
        this.listen_callback = callback;
    },

    broadcast: function(message) {
        throw "Not implemented";
    },

    send: function(message) {
        throw "Not implemented";
    },

    sendUTF8: function(data) {
        throw "Not implemented";
    },

    close: function(logError) {
        log.info("Closing connection to "+this._connection.remoteAddress+". Error: "+logError);
        this._connection.close();
    }
});


WS.MultiVersionWebsocketServer = Server.extend({
    _connections: {},
    _counter: 0,

    init: function(port, host) {
        var self = this;

        this._super(port, host);

        this._httpServer = http.createServer(function(request, response) {
            var path = url.parse(request.url).pathname;
            switch(path) {
                case '/status':
                    if(self.status_callback) {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.write(self.status_callback());
                        break;
                    }
                case '/health':
                    if(self.health_callback) {
                        response.writeHead(200, { 'Content-Type': 'application/json' });
                        response.write(self.health_callback());
                        break;
                    }
                default:
                    response.writeHead(404);
            }
            response.end();
        });

        this._wss = new WebSocket.Server({ server: this._httpServer });

        this._wss.on('connection', function(socket, request) {
            socket.remoteAddress = request.socket.remoteAddress;

            var connection = new WS.WebSocketConnection(self._createId(), socket, self);

            if(self.connection_callback) {
                self.connection_callback(connection);
            }
            self.addConnection(connection);
        });

        this._wss.on('error', function(error) {
            if(self.error_callback) {
                self.error_callback(error);
            }
        });

        this._httpServer.listen(port, this.host, function() {
            log.info("Server is listening on "+self.host+":"+port);
        });
    },

    _createId: function() {
        return '5' + Utils.random(99) + '' + (this._counter++);
    },

    broadcast: function(message) {
        this.forEachConnection(function(connection) {
            connection.send(message);
        });
    },

    onRequestStatus: function(status_callback) {
        this.status_callback = status_callback;
    },

    onRequestHealth: function(health_callback) {
        this.health_callback = health_callback;
    }
});


WS.WebSocketConnection = Connection.extend({
    init: function(id, connection, server) {
        var self = this;

        this._super(id, connection, server);

        this._connection.on('message', function(data) {
            if(self.listen_callback) {
                var message = data.toString();
                if(useBison) {
                    self.listen_callback(BISON.decode(message));
                } else {
                    try {
                        self.listen_callback(JSON.parse(message));
                    } catch(e) {
                        if(e instanceof SyntaxError) {
                            self.close("Received message was not valid JSON.");
                        } else {
                            throw e;
                        }
                    }
                }
            }
        });

        this._connection.on('close', function() {
            if(self.close_callback) {
                self.close_callback();
            }
            self._server.removeConnection(self.id);
        });
    },

    send: function(message) {
        var data;
        if(useBison) {
            data = BISON.encode(message);
        } else {
            data = JSON.stringify(message);
        }
        this.sendUTF8(data);
    },

    sendUTF8: function(data) {
        if(this._connection.readyState === WebSocket.OPEN) {
            this._connection.send(data);
        }
    }
});
