import React from 'react';

/**
 * 安全获取 ipcRenderer
 * 优先使用 preload 暴露的 __KQ_ELECTRON__，其次尝试 window.require
 */
const getIpcRenderer = () => {
  if ((window as any).__KQ_ELECTRON__?.ipcRenderer) {
    return (window as any).__KQ_ELECTRON__.ipcRenderer;
  }
  if ((window as any).require) {
    try {
      return (window as any).require('electron').ipcRenderer;
    } catch (e) {
      console.warn('Failed to require electron ipcRenderer', e);
    }
  }
  return null;
};

const WindowControls: React.FC = () => {
  const handleMinimize = () => {
    const ipc = getIpcRenderer();
    if (ipc) {
      ipc.send('window-min');
    }
  };

  const handleMaximize = () => {
    const ipc = getIpcRenderer();
    if (ipc) {
      ipc.send('window-max');
    }
  };

  const handleClose = () => {
    const ipc = getIpcRenderer();
    if (ipc) {
      ipc.send('window-close');
    }
  };

  return (
    <div 
      className="flex items-center h-10 bg-transparent z-[9999] window-no-drag" 
    >
      {/* 最小化 */}
      <button
        onClick={handleMinimize}
        className="h-full w-12 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 transition-colors focus:outline-none"
        title="最小化"
      >
        <div className="w-3 h-[1px] bg-current"></div>
      </button>

      {/* 最大化/还原 */}
      <button
        onClick={handleMaximize}
        className="h-full w-12 flex items-center justify-center text-slate-500 hover:bg-slate-200/50 hover:text-slate-800 transition-colors focus:outline-none"
        title="最大化"
      >
        <div className="w-2.5 h-2.5 border border-current"></div>
      </button>

      {/* 关闭 */}
      <button
        onMouseDown={handleClose}
        className="h-full w-12 flex items-center justify-center text-slate-500 hover:bg-red-500 hover:text-white transition-colors focus:outline-none pointer-events-auto"
        title="关闭"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default WindowControls;
