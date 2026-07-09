const path = require("path");
const { spawn } = require("child_process");
const { runBrowserSmoke } = require("./smoke-browser");

function buildClient() {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [path.join(process.cwd(), "scripts", "build-client.js")], {
            cwd: process.cwd(),
            stdio: "inherit"
        });

        child.on("error", reject);
        child.on("exit", (code) => {
            if(code === 0) {
                resolve();
            } else {
                reject(new Error(`build:client exited with code ${code}`));
            }
        });
    });
}

async function main() {
    try {
        await buildClient();
        await runBrowserSmoke({
            root: path.join(process.cwd(), "client-build"),
            clientPath: "/",
            port: 9091,
            label: "client-build"
        });
    } catch(error) {
        console.error(`smoke:browser:build failed: ${error.message}`);
        process.exitCode = 1;
    }
}

if(require.main === module) {
    main();
}
