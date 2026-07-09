const WebSocket = require("ws");
const Types = require("../shared/js/gametypes");
const { startServer, stopServer, waitForStatus, SERVER_HOST, SERVER_PORT } = require("./smoke-server");

const WS_URL = `ws://${SERVER_HOST}:${SERVER_PORT}/`;

function waitForMessage(socket, predicate, timeoutMs, label) {
    return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error(`Timed out waiting for ${label}`));
        }, timeoutMs);

        function cleanup() {
            clearTimeout(timeout);
            socket.off("message", onMessage);
            socket.off("error", onError);
            socket.off("close", onClose);
        }

        function onError(error) {
            cleanup();
            reject(error);
        }

        function onClose() {
            cleanup();
            reject(new Error(`Connection closed while waiting for ${label}`));
        }

        function onMessage(data) {
            const text = data.toString();
            if(predicate(text)) {
                cleanup();
                resolve(text);
            }
        }

        socket.on("message", onMessage);
        socket.on("error", onError);
        socket.on("close", onClose);
    });
}

async function main() {
    const server = startServer();
    let socket;

    try {
        await waitForStatus(10000);
        socket = new WebSocket(WS_URL);

        await new Promise((resolve, reject) => {
            socket.once("open", resolve);
            socket.once("error", reject);
        });

        await waitForMessage(socket, (text) => text === "go", 5000, "go");

        socket.send(JSON.stringify([
            Types.Messages.HELLO,
            "SmokeTester",
            Types.Entities.CLOTHARMOR,
            Types.Entities.SWORD1
        ]));

        const welcomeText = await waitForMessage(socket, (text) => {
            try {
                const message = JSON.parse(text);
                return Array.isArray(message) && message[0] === Types.Messages.WELCOME;
            } catch(error) {
                return false;
            }
        }, 5000, "WELCOME");

        const welcome = JSON.parse(welcomeText);
        if(typeof welcome[1] !== "number" || welcome[2] !== "SmokeTester") {
            throw new Error(`Malformed WELCOME payload: ${welcomeText}`);
        }

        console.log(`smoke:websocket ok player=${welcome[1]}`);
    } catch(error) {
        console.error(`smoke:websocket failed: ${error.message}`);
        process.exitCode = 1;
    } finally {
        if(socket) {
            socket.close();
        }
        stopServer(server);
    }
}

if(require.main === module) {
    main();
}
