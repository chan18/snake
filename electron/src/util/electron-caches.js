const { app } = require('electron');
const fs = require('fs');
const path = require('path');
const request = require('request');

const snakeCacheDirectory = path.join(app.getPath('home'), 'snake-game-cache');
const secretFile = path.join(snakeCacheDirectory, 'secret.json');
const scriptDirectory = path.join(snakeCacheDirectory, 'scripts');

function createCacheDirectory() {
  const templateDir = './src/api/Scripts';

  if (fs.existsSync(snakeCacheDirectory) === false) {
    fs.mkdirSync(snakeCacheDirectory);
  }
  if (fs.existsSync(scriptDirectory) === false) {
    fs.mkdirSync(scriptDirectory);
  }
  fs.readdirSync(templateDir).forEach((element) => {
    const to = path.join(scriptDirectory, element);
    if (!fs.existsSync(to)) {
      const from = path.join(templateDir, element);
      console.log(`${from} -> ${to}`);
      fs.copyFileSync(from, to);
    }
  });
}

const fsCache = {
  downloadScript(username, script, cb) {
    const scriptPath = path.join(scriptDirectory, `${username}.snk`);
    const url = script.startsWith('http') ? script : `https://${script}`;
    request(url).pipe(fs.createWriteStream(scriptPath));
    cb({ verdict: `@${username} script accepted!` });
  },
  scriptExists(name) {
    const userScript = path.join(scriptDirectory, name);
    return fs.existsSync(userScript);
  },
  getSrc(script) {
    const f = path.join(scriptDirectory, script);
    return fs.readFileSync(f, 'utf-8');
  },
  config() {
    const data = this.readAll(secretFile);
    if (data) {
      if (!data.gameState) { data.gameState = 'Pause'; }
      return data;
    }
    return {
      botName: 'please-fill-out',
      channel: 'please-fill-out',
      clientId: 'please-fill-out',
    };
  },
  readAll(file) {
    let data = {};

    createCacheDirectory();
    try {
      const cacheContent = fs.readFileSync(file, 'utf-8');

      try {
        const d = JSON.parse(cacheContent);
        data = d;
      } catch (e) {
        data = {};
      }
    } catch (err) { /* ignored err */ }
    return data;
  },
  saveAll(data) {
    createCacheDirectory();
    fs.writeFileSync(secretFile, JSON.stringify(data, null, 2));
  },
};

module.exports = {
  fsCache,
};
