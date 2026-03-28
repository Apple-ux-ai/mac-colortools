# 项目问题记录 (ISSUES.md)

## 1. 待审核问题

### ISSUE-001: 测试框架从 Jest 切换为 Vitest
- **问题描述**: 原有的 Jest 配置在处理 ESM (ECMAScript Modules) 和 TypeScript 混合环境时存在兼容性问题，导致测试无法运行。
- **影响范围**: 单元测试、CI/CD 流程。
- **可选方案**:
  1. 继续配置 Babel/ts-jest 适配 Jest。
  2. 切换到原生支持 Vite 的 Vitest。
- **推荐方案**: 方案 2 (Vitest)。因为它与现有 Vite 开发环境完全共享配置，性能更优且配置极简。
- **需要决策**: 是否确认长期使用 Vitest 作为项目的测试框架？

### ISSUE-002: 签名 Nonce 生成算法优化
- **问题描述**: 原实现使用 `Math.random()` 生成随机串，在极端高并发或安全要求下唯一性略显不足。
- **影响范围**: 登录安全性、会话唯一性。
- **可选方案**:
  1. `Math.random()` 拼接。
  2. `CryptoJS.lib.WordArray.random(16)` (已实施)。
- **推荐方案**: 方案 2。已在 `authUtils.ts` 中完成替换，确保与服务端期望的 UUID/Hex 格式一致。
- **需要决策**: 无，仅需知晓安全性已增强。

### ISSUE-003: 轮询请求参数格式
- **问题描述**: 接口文档要求 `Content-Type: urlencoded`。
- **影响范围**: 登录 Token 获取。
- **方案**: 已在 `authStore.ts` 中显式使用 `URLSearchParams` 构造请求体，确保兼容性。
- **需要决策**: 无。

### ISSUE-004: 右上角按键点击范围失效 (已解决)
- **问题描述**: 登录和广告位按键的上半部分被 Electron 透明拖拽层覆盖，导致无法点击。
- **影响范围**: 用户登录、广告交互。
- **方案**: 提升 Header 层级 (`z-index: 101`) 并对按键区域显式设置 `WebkitAppRegion: 'no-drag'`。
- **需要决策**: 无。

---
*更新时间: 2026-01-08*
