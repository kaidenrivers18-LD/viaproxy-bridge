const { exec, execSync } = require('child_process');
const http = require('http');
const fs = require('fs');

// 1. FREE RENDER TIER KEEP-ALIVE SERVER
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('ViaProxy Bridge is Online and Translating!\n');
}).listen(process.env.PORT || 3000);

// 2. DOWNLOAD THE OFFICIAL VIAPROXY CORE IF MISSING
const JAR_URL = "https://github.com";
if (!fs.existsSync('ViaProxy.jar')) {
    console.log('Downloading the latest official ViaProxy tool from GitHub...');
    try {
        execSync(`curl -L -o ViaProxy.jar "${JAR_URL}"`);
        console.log('Download complete!');
    } catch (err) {
        console.error('Download failed. Retrying with wget...');
        execSync(`wget -O ViaProxy.jar "${JAR_URL}"`);
    }
}

// 3. GENERATING THE CROSPLAY CONFIGURATION FILE
const configContent = `
bind-address: 0.0.0.0:19132
target-address: smelt.aternos.host:40729
proxy-online-mode: false
auth-method: NONE
`;

fs.writeFileSync('viaproxy.yml', configContent);
console.log('Generated translation configurations successfully.');

// 4. LAUNCHING THE TRANSLATION ENGINE
console.log('Starting Bedrock-to-Java translation pipeline...');
const proxy = exec('java -jar ViaProxy.jar config viaproxy.yml');

proxy.stdout.on('data', (data) => console.log(data.toString()));
proxy.stderr.on('data', (data) => console.error(data.toString()));
