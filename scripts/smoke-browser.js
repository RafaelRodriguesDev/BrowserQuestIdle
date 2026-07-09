const fs = require("fs");
const http = require("http");
const path = require("path");
const { chromium } = require("playwright");
const { startServer, stopServer, waitForStatus } = require("./smoke-server");

const STATIC_PORT = 9090;
const ROOT = process.cwd();

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

function startStaticServer() {
    const server = http.createServer((request, response) => {
        const requestUrl = new URL(request.url, `http://127.0.0.1:${STATIC_PORT}`);
        let pathname = decodeURIComponent(requestUrl.pathname);
        if(pathname.endsWith("/")) {
            pathname += "index.html";
        }

        const filePath = path.resolve(ROOT, pathname.replace(/^\/+/, ""));
        if(!filePath.startsWith(ROOT)) {
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
        server.listen(STATIC_PORT, "127.0.0.1", () => resolve(server));
    });
}

async function main() {
    const gameServer = startServer();
    let staticServer;
    let browser;

    try {
        await waitForStatus(10000);
        staticServer = await startStaticServer();

        browser = await chromium.launch();
        const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
        await page.addInitScript(() => window.localStorage.clear());
        await page.goto(`http://127.0.0.1:${STATIC_PORT}/client/`, { waitUntil: "domcontentloaded" });

        await page.locator("#nameinput").fill("CodexTester");
        await page.waitForFunction(() => !document.querySelector("#createcharacter .play").classList.contains("disabled"));
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

        console.log("smoke:browser ok /client/ started with 1 player and accepted movement click");
    } catch(error) {
        console.error(`smoke:browser failed: ${error.message}`);
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

if(require.main === module) {
    main();
}
