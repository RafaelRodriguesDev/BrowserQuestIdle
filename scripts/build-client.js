const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const BUILD_DIR = path.join(ROOT, "client-build");
const CLIENT_JS_DIR = path.join(ROOT, "client", "js");
const BUILD_LOG = path.join(ROOT, "build.txt");
const BUILD_CONFIG = path.join(ROOT, "client", "config", "config_build.json");
const BUILD_CONFIG_TEMPLATE = path.join(ROOT, "client", "config", "config_build.json-dist");

const KEEP_JS = new Set([
    "game.js",
    "home.js",
    "log.js",
    "require-jquery.js",
    "modernizr.js",
    "css3-mediaqueries.js",
    "mapworker.js",
    "detect.js",
    "underscore.min.js",
    "text.js"
]);

function removeIfExists(target) {
    fs.rmSync(target, { recursive: true, force: true });
}

function runOptimizer() {
    return new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [path.join(ROOT, "bin", "r.js"), "-o", "build.js"], {
            cwd: CLIENT_JS_DIR,
            stdio: "inherit"
        });

        child.on("error", reject);
        child.on("exit", (code) => {
            if(code === 0) {
                resolve();
            } else {
                reject(new Error(`RequireJS optimizer exited with code ${code}`));
            }
        });
    });
}

function ensureBuildConfig() {
    if(fs.existsSync(BUILD_CONFIG)) {
        return;
    }
    if(!fs.existsSync(BUILD_CONFIG_TEMPLATE)) {
        throw new Error("Missing client/config/config_build.json and config_build.json-dist");
    }
    fs.copyFileSync(BUILD_CONFIG_TEMPLATE, BUILD_CONFIG);
    console.log("Created ignored client/config/config_build.json from template");
}

function pruneBuiltJs() {
    const jsDir = path.join(BUILD_DIR, "js");
    if(!fs.existsSync(jsDir)) {
        throw new Error(`Build did not create ${path.relative(ROOT, jsDir)}`);
    }

    function walk(dir) {
        for(const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const fullPath = path.join(dir, entry.name);
            if(entry.isDirectory()) {
                walk(fullPath);
            } else if(entry.isFile() && !KEEP_JS.has(entry.name)) {
                fs.rmSync(fullPath, { force: true });
            }
        }
    }

    walk(jsDir);
}

function removeEmptyDirectories(dir) {
    if(!fs.existsSync(dir)) {
        return;
    }
    for(const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const fullPath = path.join(dir, entry.name);
        if(entry.isDirectory()) {
            removeEmptyDirectories(fullPath);
        }
    }
    if(dir !== path.join(BUILD_DIR, "js") && fs.readdirSync(dir).length === 0) {
        fs.rmdirSync(dir);
    }
}

function moveBuildLog() {
    const generatedLog = path.join(BUILD_DIR, "build.txt");
    if(fs.existsSync(generatedLog)) {
        fs.copyFileSync(generatedLog, BUILD_LOG);
        fs.rmSync(generatedLog, { force: true });
    }
}

async function main() {
    console.log("Deleting previous build directory");
    removeIfExists(BUILD_DIR);
    removeIfExists(BUILD_LOG);

    ensureBuildConfig();

    console.log("Building client with RequireJS");
    await runOptimizer();

    console.log("Removing unnecessary js files from the build directory");
    pruneBuiltJs();
    removeEmptyDirectories(path.join(BUILD_DIR, "js"));

    console.log("Removing generated sprites and config directories");
    removeIfExists(path.join(BUILD_DIR, "sprites"));
    removeIfExists(path.join(BUILD_DIR, "config"));

    console.log("Moving build.txt to repository root");
    moveBuildLog();

    console.log("Build complete");
}

main().catch((error) => {
    console.error(`build:client failed: ${error.message}`);
    process.exitCode = 1;
});
