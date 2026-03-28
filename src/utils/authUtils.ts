/**
 * 功能：登录鉴权工具类
 * 严格遵循《接入文档.md》中的签名与加密算法
 */
import CryptoJS from 'crypto-js';

// 客户端与服务端约定的密钥
const SECRET_KEY = '7530bfb1ad6c41627b0f0620078fa5ed';

/**
 * 生成带签名的临时会话ID (nonce)
 */
export const generateSignedNonce = () => {
  // 1. 生成随机nonce (UUID形式)
  const nonce = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  
  // 2. 生成时间戳 (秒级)
  const timestamp = Math.floor(Date.now() / 1000);
  
  // 3. 构造待签名字符串: nonce|timestamp
  const message = `${nonce}|${timestamp}`;
  
  // 4. HMAC-SHA256签名
  const hmac = CryptoJS.HmacSHA256(message, SECRET_KEY);
  const signature = CryptoJS.enc.Base64.stringify(hmac);
  
  return {
    nonce,
    timestamp,
    signature
  };
};

/**
 * 将带签名的nonce编码为URL安全的字符串
 */
export const encodeSignedNonce = (signedNonce: { nonce: string; timestamp: number; signature: string }) => {
  // 1. 转为 JSON 字符串
  const jsonStr = JSON.stringify(signedNonce);
  
  // 2. Base64 编码
  let urlSafeStr = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(jsonStr));
  
  // 3. 替换 URL 不安全字符并移除末尾等号
  urlSafeStr = urlSafeStr
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
    
  return urlSafeStr;
};

/**
 * 获取完整的登录 URL
 */
export const getFinalLoginUrl = (baseLoginUrl: string, encodedNonce: string) => {
  return `${baseLoginUrl}?client_type=desktop&client_nonce=${encodedNonce}`;
};
