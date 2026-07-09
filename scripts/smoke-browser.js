const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");
const { startServer, stopServer, waitForStatus } = require("./smoke-server");

const DEFAULT_STATIC_PORT = 9090;

const MIME_TYPES = {
    ".css": "text/css",
    ".gif": "image/gif",
    ".html": "text/html",
    ".jpg": "image/jpeg",
    ".js": "text/javascript",
    ".json": "application/json",
    ".mp3": "audio/mpeg",
    ".ogg": "audio/ogg",
    ".png": "image/png",
    ".tmx": "application/xml",
    ".xml": "application/xml"
};

function startStaticServer(root, port) {
    const server = http.createServer((request, response) => {
        const requestUrl = new URL(request.url, `http://127.0.0.1:${port}`);
        let pathname = decodeURIComponent(requestUrl.pathname);
        if(pathname.endsWith("/")) {
            pathname += "index.html";
        }

        const filePath = path.resolve(root, pathname.replace(/^\/+/, ""));
        if(!filePath.startsWith(root)) {
            response.writeHead(403);
            response.end("Forbidden");
            return;
        }

        fs.readFile(filePath, (error, data) => {
            if(error) {
                response.writeHead(404);
                response.end("Not found");
                return;
            }

            response.writeHead(200, {
                "Content-Type": MIME_TYPES[path.extname(filePath).toLowerCase()] || "application/octet-stream"
            });
            response.end(data);
        });
    });

    return new Promise((resolve, reject) => {
        server.once("error", reject);
        server.listen(port, "127.0.0.1", () => resolve(server));
    });
}

async function runBrowserSmoke(options) {
    options = options || {};
    const root = path.resolve(options.root || process.cwd());
    const clientPath = options.clientPath || "/client/";
    const port = options.port || DEFAULT_STATIC_PORT;
    const label = options.label || clientPath;

    const gameServer = startServer();
    let staticServer;
    let browser;
    let diagnostics = [];

    try {
        await waitForStatus(10000);
        staticServer = await startStaticServer(root, port);

        browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        diagnostics = [];
        page.on("console", (message) => {
            diagnostics.push(`console:${message.type()}: ${message.text()}`);
        });
        page.on("pageerror", (error) => {
            diagnostics.push(`pageerror: ${error.message}`);
        });
        page.on("requestfailed", (request) => {
            const failure = request.failure();
            diagnostics.push(`requestfailed: ${request.url()} ${failure ? failure.errorText : ""}`.trim());
        });
        page.on("response", response => {
            if (response.status() >= 400) {
                diagnostics.push(`response error: ${response.status()} ${response.url()}`);
            }
        });
        await page.addInitScript(() => window.localStorage.clear());
        await page.goto(`http://127.0.0.1:${port}${clientPath}`, { waitUntil: "domcontentloaded" });

        await page.locator("#nameinput").fill("CodexTester");
        await page.evaluate(() => {
            const input = document.querySelector("#nameinput");
            input.value = "CodexTester";
            input.setAttribute("value", "CodexTester");
            input.dispatchEvent(new KeyboardEvent("keyup", { bubbles: true }));
        });
        await page.waitForFunction(() => {
            const play = document.querySelector("#createcharacter .play");
            return play && !play.classList.contains("disabled");
        });
        await page.locator("#createcharacter .play div").click();

        await page.locator("body.started").waitFor({ timeout: 20000 });
        await page.waitForFunction(() => {
            const count = document.querySelector("#playercount .count");
            return count && count.textContent.trim() === "1";
        }, null, { timeout: 10000 });

        if(await page.locator("#instructions.active").count()) {
            await page.locator("#instructions").click({ force: true });
            await page.waitForFunction(() => !document.querySelector("#instructions").classList.contains("active"));
        }

        const canvas = page.locator("#foreground");
        const box = await canvas.boundingBox();
        if(!box || box.width < 100 || box.height < 100) {
            throw new Error("Foreground canvas did not render with a usable size");
        }

        await canvas.click({ position: { x: Math.floor(box.width / 2), y: Math.floor(box.height / 2) } });
        await page.waitForTimeout(500);

        const healthy = await page.evaluate(() => {
            const bodyStarted = document.body.classList.contains("started");
            const playerCount = document.querySelector("#playercount .count").textContent.trim();
            const canvas = document.querySelector("#foreground");
            return bodyStarted && playerCount === "1" && canvas.width > 0 && canvas.height > 0;
        });

        if(!healthy) {
            throw new Error("Browser game state was not healthy after movement click");
        }

        console.log(`smoke:browser ok ${label} started with 1 player and accepted movement click`);
    } catch(error) {
        console.error(`smoke:browser failed: ${error.message}`);
        if(typeof diagnostics !== "undefined" && diagnostics.length > 0) {
            console.error(diagnostics.slice(-20).join("\n"));
        }
        process.exitCode = 1;
    } finally {
        if(browser) {
            await browser.close();
        }
        if(staticServer) {
            await new Promise((resolve) => staticServer.close(resolve));
        }
        stopServer(gameServer);
    }
}

async function main() {
    await runBrowserSmoke();
}

if(require.main === module) {
    main();
}

module.exports = {
    runBrowserSmoke,
    startStaticServer
};
