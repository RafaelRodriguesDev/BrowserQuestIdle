const { execSync } = require('child_process');
const fs = require('fs');

const SRC_FILE = 'tmx/map.tmx';
const TEMP_FILE = SRC_FILE + '.json';

const mode = process.argv[2] || 'client';
let DEST_FILE;
if (mode === 'client') {
    DEST_FILE = '../../client/maps/world_client'; // This will save two files
} else {
    DEST_FILE = '../../server/maps/world_server.json';
}

try {
    console.log(`Converting TMX to JSON (${mode} mode)...`);
    execSync(`python tmx2json.py ${SRC_FILE} ${TEMP_FILE}`, { stdio: 'inherit' });
    
    console.log(`Exporting map...`);
    execSync(`node exportmap.js ${TEMP_FILE} ${DEST_FILE} ${mode}`, { stdio: 'inherit' });
    
    console.log(`Cleaning up...`);
    if (fs.existsSync(TEMP_FILE)) {
        fs.unlinkSync(TEMP_FILE);
    }
    
    console.log(`Map export complete: ${DEST_FILE}`);
} catch (e) {
    console.error("Export failed:", e.message);
    process.exit(1);
}
