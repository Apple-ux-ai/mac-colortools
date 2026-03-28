/**
 * 功能：用户登录/信息组件
 */
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { LogIn, User, LogOut, X, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';

const UserAuth: React.FC = () => {
  const { t } = useTranslation();
  const { token, userInfo, isPolling, pollError, login, logout, cancelLogin, checkLoginStatus } = useAuthStore();
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // 点击外部关闭面板
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setShowPanel(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogin = () => {
    login();
  };

  const handleLogout = () => {
    logout();
    setShowPanel(false);
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* 触发按钮 */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
          token 
            ? 'bg-white border border-slate-100 shadow-sm hover:shadow-md' 
            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 hover:bg-indigo-700'
        }`}
      >
        {token && userInfo ? (
          <>
            <img src={userInfo.avatar} alt="Avatar" className="w-6 h-6 rounded-full border border-slate-100" />
            <span className="text-sm font-bold text-slate-700">{userInfo.nickname}</span>
          </>
        ) : (
          <>
            <LogIn size={18} />
            <span className="text-sm font-bold">{t('auth.loginRegister')}</span>
          </>
        )}
      </button>

      {/* 信息面板 */}
      <AnimatePresence>
        {showPanel && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 overflow-hidden"
          >
            {token && userInfo ? (
              // 已登录状态
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-3">
                  <div className="relative">
                    <img src={userInfo.avatar} alt="Avatar" className="w-20 h-20 rounded-full border-4 border-slate-50 shadow-sm" />
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-800">{userInfo.nickname}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t('auth.member')}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-50">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-slate-500 font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    <LogOut size={18} />
                    <span>{t('auth.logout')}</span>
                  </button>
                </div>
              </div>
            ) : isPolling ? (
              // 正在轮询状态
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-indigo-50 rounded-full"></div>
                  <Loader2 className="absolute top-0 left-0 w-16 h-16 text-indigo-600 animate-spin" />
                </div>
                <div className="text-center">
                  <h3 className="font-black text-slate-800">{t('auth.syncing')}</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed px-4">{t('auth.syncingHint')}</p>
                </div>
                <button
                  onClick={cancelLogin}
                  className="mt-4 flex items-center gap-2 px-6 py-2 rounded-full border border-slate-200 text-slate-400 text-sm font-bold hover:bg-slate-50 hover:text-slate-600 transition-colors"
                >
                  <X size={14} />
                  <span>{t('auth.cancelLogin')}</span>
                </button>
              </div>
            ) : (
              // 未登录状态
              <div className="space-y-6">
                <div className="flex flex-col items-center gap-4 py-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                    <User size={32} />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-black text-slate-800">{t('auth.welcomeBack')}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t('auth.syncAccount')}</p>
                  </div>
                </div>
                
                {pollError && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-xs font-bold text-center">
                    {pollError}
                  </div>
                )}

                <button
                  onClick={handleLogin}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-lg shadow-indigo-100 hover:bg-indigo-700 hover:shadow-indigo-200 transition-all active:scale-95"
                >
                  <LogIn size={20} />
                  <span>{t('auth.goLogin')}</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAuth;
