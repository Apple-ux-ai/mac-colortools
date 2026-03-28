const { ipcRenderer, shell } = require('electron');

try {
  window.__KQ_ELECTRON__ = { ipcRenderer, shell };
} catch (e) {}
