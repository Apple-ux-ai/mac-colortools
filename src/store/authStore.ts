/**
 * 功能：登录鉴权状态管理
 * 包含：Token持久化、轮询逻辑、用户信息管理
 */
import { create } from 'zustand';
import axios from 'axios';
import { generateSignedNonce, encodeSignedNonce, getFinalLoginUrl } from '../utils/authUtils';

const API_BASE_URL = 'https://api-web.kunqiongai.com';

interface UserInfo {
  avatar: string;
  nickname: string;
}

interface AuthState {
  token: string | null;
  userInfo: UserInfo | null;
  isPolling: boolean;
  pollError: string | null;
  
  // 动作
  login: () => Promise<void>;
  logout: () => Promise<void>;
  cancelLogin: () => void;
  checkLoginStatus: () => Promise<boolean>;
  fetchUserInfo: () => Promise<void>;
}

let pollInterval: any = null;
let pollTimeout: any = null;

export const useAuthStore = create<AuthState>((set, get) => ({
  token: localStorage.getItem('auth_token'),
  userInfo: null,
  isPolling: false,
  pollError: null,

  login: async () => {
    try {
      // 0. 先检查是否已登录，避免重复打开
      const isLoggedIn = await get().checkLoginStatus();
      if (isLoggedIn) return;

      set({ isPolling: true, pollError: null });

      // 1. 获取网页登录地址
      const urlRes = await axios.post(`${API_BASE_URL}/soft_desktop/get_web_login_url`);
      if (urlRes.data.code !== 1) throw new Error(urlRes.data.msg);
      const baseLoginUrl = urlRes.data.data.login_url;

      // 2. 生成签名 nonce
      const signedNonce = generateSignedNonce();
      const encodedNonce = encodeSignedNonce(signedNonce);

      // 3. 构造最终 URL 并尝试打开浏览器
      const finalUrl = getFinalLoginUrl(baseLoginUrl, encodedNonce);
      
      // 判断是否在 Electron 环境
      if (window.require) {
        const { shell } = window.require('electron');
        shell.openExternal(finalUrl);
      } else {
        window.open(finalUrl, '_blank');
      }

      // 4. 开始轮询
      const startTime = Date.now();
      const TIMEOUT = 300000; // 300秒

      pollInterval = setInterval(async () => {
        try {
          const res = await axios.post(`${API_BASE_URL}/user/desktop_get_token`, 
            new URLSearchParams({
              client_type: 'desktop',
              client_nonce: encodedNonce
            }).toString(), 
            {
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }
          );

          if (res.data.code === 1) {
            const token = res.data.data.token;
            localStorage.setItem('auth_token', token);
            set({ token, isPolling: false });
            clearInterval(pollInterval);
            clearTimeout(pollTimeout);
            get().fetchUserInfo();
          }
        } catch (e) {
          console.error('轮询出错:', e);
        }

        if (Date.now() - startTime > TIMEOUT) {
          get().cancelLogin();
          set({ pollError: '登录超时，请重试' });
        }
      }, 2000);

      pollTimeout = setTimeout(() => {
        get().cancelLogin();
        set({ pollError: '登录超时，请重试' });
      }, TIMEOUT);

    } catch (error: any) {
      set({ isPolling: false, pollError: error.message });
    }
  },

  logout: async () => {
    const token = get().token;
    if (token) {
      try {
        await axios.post(`${API_BASE_URL}/logout`, null, {
          headers: { token }
        });
      } catch (e) {
        console.error('注销失败:', e);
      }
    }
    localStorage.removeItem('auth_token');
    set({ token: null, userInfo: null });
  },

  cancelLogin: () => {
    if (pollInterval) clearInterval(pollInterval);
    if (pollTimeout) clearTimeout(pollTimeout);
    set({ isPolling: false });
  },

  checkLoginStatus: async () => {
    const token = get().token;
    if (!token) return false;

    try {
      const res = await axios.post(`${API_BASE_URL}/user/check_login`, { token }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      if (res.data.code === 1) {
        get().fetchUserInfo();
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  },

  fetchUserInfo: async () => {
    const token = get().token;
    if (!token) return;

    try {
      const res = await axios.post(`${API_BASE_URL}/soft_desktop/get_user_info`, null, {
        headers: { token }
      });
      if (res.data.code === 1) {
        set({ userInfo: res.data.data.user_info });
      }
    } catch (e) {
      console.error('获取用户信息失败:', e);
    }
  }
}));
