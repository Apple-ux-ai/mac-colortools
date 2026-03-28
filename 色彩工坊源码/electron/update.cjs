const { app, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const axios = require('axios');

const UPDATE_API = 'http://software.kunqiongai.com:8000/api/v1/updates/check/';
const SOFTWARE_ID = '10024';

async function checkUpdate(isManual = false) {
  // 开发环境下跳过更新检查，或者你可以根据需要开启
  if (process.env.NODE_ENV === 'development') {
    console.log('[Updater] Skipping update check in development mode');
    if (isManual) {
      dialog.showMessageBox({
        type: 'info',
        title: '检查更新',
        message: '当前处于开发模式',
        detail: '开发环境下不执行真实更新检查。',
        buttons: ['确定']
      });
    }
    return;
  }

  const version = app.getVersion();
  console.log(`[Updater] Checking update for version: ${version}, software: ${SOFTWARE_ID}`);
  
  try {
    const { data } = await axios.get(UPDATE_API, {
      params: {
        software: SOFTWARE_ID,
        version: version
      },
      timeout: 5000 // 设置超时
    });

    console.log('[Updater] Check result:', data);

    if (data.has_update) {
      const { response } = await dialog.showMessageBox({
        type: 'info',
        title: '发现新版本',
        message: `发现新版本 ${data.version}，是否立即更新？`,
        detail: data.description || '建议您立即更新以获得更好的体验。',
        buttons: ['立即更新'],
        defaultId: 0,
        cancelId: -1,
        noLink: true
      });

      if (response === 0) {
        startUpdater(data.download_url, data.package_hash);
      }
    } else {
      if (isManual) {
        dialog.showMessageBox({
          type: 'info',
          title: '检查更新',
          message: `当前已是最新版本 v${version}`,
          buttons: ['确定']
        });
      }
    }
  } catch (error) {
    console.error('[Updater] Check update failed:', error.message);
    if (isManual) {
      dialog.showErrorBox('检查失败', `无法连接到更新服务器：${error.message}`);
    }
  }
}

function startUpdater(url, hash) {
  // 在打包环境中，updater.exe 位于 resources 目录下
  const updaterPath = path.join(process.resourcesPath, 'updater.exe');
  const appDir = path.dirname(process.execPath);
  const exeName = '色彩工坊.exe'; 
  const pid = process.pid;

  console.log('[Updater] Starting updater:', updaterPath);
  console.log('[Updater] Args:', { url, hash, appDir, exeName, pid });

  const args = [
    '--url', url,
    '--hash', hash,
    '--dir', appDir,
    '--exe', exeName,
    '--pid', pid
  ];

  try {
    const subprocess = spawn(updaterPath, args, {
      detached: true,
      stdio: 'ignore'
    });
    
    subprocess.unref();
    app.quit();
  } catch (e) {
    console.error('[Updater] Failed to spawn updater:', e);
    dialog.showErrorBox('更新失败', '无法启动更新程序，请联系管理员或手动下载安装。');
  }
}

module.exports = { checkUpdate };
