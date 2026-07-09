const { spawn } = require("child_process");
const http = require("http");

const SERVER_URL = "http://127.0.0.1:8000/status";

function requestStatus() {
    return new Promise((resolve, reject) => {
        const req = http.get(SERVER_URL, (res) => {
            let body = "";
            res.setEncoding("utf8");
            res.on("data", (chunk) => body += chunk);
            res.on("end", () => {
                if(res.statusCode !== 200) {
                    reject(new Error(`/status returned ${res.statusCode}: ${body}`));
                    return;
                }
                try {
                    const parsed = JSON.parse(body);
                    if(!Array.isArray(parsed)) {
                        reject(new Error(`/status did not return an array: ${body}`));
                        return;
                    }
                    resolve(parsed);
                } catch(error) {
                    reject(new Error(`/status returned invalid JSON: ${body}`));
                }
            });
        });
        req.on("error", reject);
        req.setTimeout(1000, () => req.destroy(new Error("Timed out waiting for /status")));
    });
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

    try {
        const status = await waitForStatus(10000);
        console.log(`smoke:server ok ${JSON.stringify(status)}`);
    } catch(error) {
        console.error(`smoke:server failed: ${error.message}`);
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
    waitForStatus,
    startServer,
    stopServer
};
