# 交付清单 (DELIVER.md)

## 1. 本次更新概要
- **功能**: 实现了 Electron 构建流程的分离，支持“先签名，后打包”的 DevOps 需求。
- **版本**: v1.0.0

## 2. 核心流程说明 (DevOps)

### 阶段一：生成待签名文件
运行以下命令，将在 `dist_electron_unpacked/win-unpacked` 目录下生成未打包的程序文件。
```bash
npm run build:dir
```

### 阶段二：手动签名
请使用你的证书工具（如 `signtool`）对 `dist_electron_unpacked/win-unpacked` 目录下的以下文件进行签名：
- `色彩工坊.exe`
- `*.dll` (如有需要)

### 阶段三：打包最终安装包
签名完成后，运行以下命令。它会直接打包已签名的文件夹，而不会重新编译代码。
```bash
npm run build:pack
```
产物位置：`dist_electron_unpacked/色彩工坊 Setup 1.0.0.exe`

## 3. 常见问题
- **构建报错 "resource busy or locked"**: 
  - 请确保之前的程序已关闭。
  - 可运行 `taskkill /F /IM "色彩工坊.exe" /T` 强制关闭。
- **版本号管理**: 
  - 修改 `package.json` 中的 `version` 字段可更新版本号。

---
交付完成！后续同类需求直接 @FullStack-Guardian。祝发布顺利 🎉
