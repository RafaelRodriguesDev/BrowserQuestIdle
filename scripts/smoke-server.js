const { spawn } = require("child_process");
const http = require("http");

const SERVER_HOST = "127.0.0.1";
const SERVER_PORT = 8000;
const STATUS_URL = `http://${SERVER_HOST}:${SERVER_PORT}/status`;
const HEALTH_URL = `http://${SERVER_HOST}:${SERVER_PORT}/health`;

function requestJson(url, validate, label) {
    return new Promise((resolve, reject) => {
        const req = http.get(url, (res) => {
            let body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
                if(res.statusCode !== 200) {
                    reject(new Error(`${label} returned ${res.statusCode}: ${body}`));
                    return;
                }
                try {
                    const parsed = JSON.parse(body);
                    if(!validate(parsed)) {
                        reject(new Error(`${label} returned unexpected JSON: ${body}`));
                        return;
                    }
                    resolve(parsed);
                } catch(error) {
                    reject(new Error(`${label} returned invalid JSON: ${body}`));
                }
            });
        });
        req.on("error", reject);
        req.setTimeout(1000, () => req.destroy(new Error(`Timed out waiting for ${label}`)));
    });
}

function requestStatus() {
    return requestJson(STATUS_URL, Array.isArray, "/status");
}

function requestHealth() {
    return requestJson(HEALTH_URL, (parsed) => {
        return parsed && parsed.status === "ok" && typeof parsed.uptime === "number" && typeof parsed.worlds === "number";
    }, "/health");
}

async function waitForStatus(timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    let lastError;

    while(Date.now() < deadline) {
        try {
            return await requestStatus();
        } catch(error) {
            lastError = error;
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
    }

    throw lastError || new Error("Server did not become ready");
}

async function waitForHealth(timeoutMs) {
    const deadline = Date.now() + timeoutMs;
    let lastError;

    while(Date.now() < deadline) {
        try {
            return await requestHealth();
        } catch(error) {
            lastError = error;
            await new Promise((resolve) => setTimeout(resolve, 250));
        }
    }

    throw lastError || new Error("Server health did not become ready");
}

function startServer() {
    const child = spawn(process.execPath, ["server/js/main.js"], {
        cwd: process.cwd(),
        stdio: ["ignore", "pipe", "pipe"]
    });

    let output = "";
    child.stdout.on("data", (chunk) => output += chunk.toString());
    child.stderr.on("data", (chunk) => output += chunk.toString());
    child.output = () => output.trim();

    return child;
}

function stopServer(child) {
    if(child && !child.killed) {
        child.kill();
    }
}

async function main() {
    const server = startServer();
    const check = process.argv[2] === "--health" ? waitForHealth : waitForStatus;
    const label = process.argv[2] === "--health" ? "smoke:health" : "smoke:server";

    try {
        const status = await check(10000);
        console.log(`${label} ok ${JSON.stringify(status)}`);
    } catch(error) {
        console.error(`${label} failed: ${error.message}`);
        const output = server.output();
        if(output) {
            console.error(output);
        }
        process.exitCode = 1;
    } finally {
        stopServer(server);
    }
}

if(require.main === module) {
    main();
}

module.exports = {
    requestStatus,
    requestHealth,
    waitForStatus,
    waitForHealth,
    startServer,
    stopServer,
    SERVER_HOST,
    SERVER_PORT
};
