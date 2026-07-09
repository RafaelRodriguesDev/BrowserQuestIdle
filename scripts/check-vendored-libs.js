const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const LIB_DIR = path.join(ROOT, "client", "js", "lib");

const CONTRACTS = [
    {
        file: "require-jquery.js",
        markers: [
            "RequireJS 0.26.0",
            'var version = "0.26.0"',
            "jQuery JavaScript Library v1.6.4",
            'jquery: "1.6.4"',
            "window.jQuery = window.$ = jQuery",
            "define('jquery',[], function() {return jQuery })"
        ]
    },
    {
        file: "modernizr.js",
        markers: [
            "Modernizr 2.5.3",
            "localstorage",
            "audio",
            "window.Modernizr"
        ]
    },
    {
        file: "underscore.min.js",
        markers: [
            "Underscore.js",
            'b.VERSION="1.1.7"',
            "detect",
            "include"
        ]
    },
    {
        file: "bison.js",
        markers: [
            "window.BISON",
            "encode:",
            "decode:"
        ]
    },
    {
        file: "astar.js",
        markers: [
            "define(function()",
            "function AStar(grid, start, end, f)",
            "return AStar"
        ]
    },
    {
        file: "class.js",
        markers: [
            "Simple JavaScript Inheritance",
            "Class.extend",
            "exports.Class = Class"
        ]
    },
    {
        file: "stacktrace.js",
        markers: [
            "function printStackTrace(options)",
            "printStackTrace.implementation"
        ]
    },
    {
        file: "log.js",
        markers: [
            "var Logger = function(level)",
            "Logger.prototype.info",
            "Logger.prototype.debug",
            "Logger.prototype.error",
            'log = new Logger("debug")'
        ]
    },
    {
        file: "css3-mediaqueries.js",
        markers: [
            "css3-mediaqueries",
            "mediaQueryList",
            "cssHelper.mediaQueryLists"
        ]
    }
];

function readContractFile(file) {
    const filePath = path.join(LIB_DIR, file);
    if(!fs.existsSync(filePath)) {
        throw new Error(`Missing vendored library: client/js/lib/${file}`);
    }

    return fs.readFileSync(filePath, "utf8");
}

function checkContract(contract) {
    const contents = readContractFile(contract.file);
    const missing = contract.markers.filter((marker) => !contents.includes(marker));

    if(missing.length > 0) {
        throw new Error(
            `Vendored contract failed for client/js/lib/${contract.file}: missing marker(s): ${missing.join(", ")}`
        );
    }
}

function main() {
    const unexpected = fs.readdirSync(LIB_DIR)
        .filter((name) => name.endsWith(".js"))
        .filter((name) => !CONTRACTS.some((contract) => contract.file === name));

    if(unexpected.length > 0) {
        throw new Error(`Unexpected vendored library file(s): ${unexpected.join(", ")}`);
    }

    for(const contract of CONTRACTS) {
        checkContract(contract);
    }

    console.log(`vendor:check ok ${CONTRACTS.length} vendored browser library contracts verified`);
}

try {
    main();
} catch(error) {
    console.error(`vendor:check failed: ${error.message}`);
    process.exitCode = 1;
}
