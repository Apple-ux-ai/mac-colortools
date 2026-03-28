/**
 * 复制文本到剪贴板的通用工具函数
 * 支持现代 Clipboard API 以及针对非安全上下文（HTTP）的 fallback 方案
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  // 1. 尝试使用现代 Clipboard API
  // 注意：navigator.clipboard 仅在安全上下文（HTTPS/localhost）中可用
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API copy failed:', err);
      // 失败后继续尝试 fallback 方案
    }
  }

  // 2. Fallback 方案：使用传统的 document.execCommand('copy')
  // 这种方法在 HTTP 环境下通常也能工作
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    
    // 确保 textarea 在视口之外且不可见
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    textArea.style.top = '0';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    
    textArea.focus();
    textArea.select();
    
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
};
