# 多语言翻译与语言包维护

## 当前状态

- **zh-CN**、**en**：人工维护的源语言包。
- **zh-TW**：由 `scripts/zh-CN-to-zh-TW.cjs` 从 zh-CN 简繁转换生成，勿直接编辑。
- **其余 26 种语言**（ar, bn, de, es, fa, fr, he, hi, id, it, ja, ko, ms, nl, pl, pt, pt-BR, ru, sw, ta, th, fil, tr, uk, ur, vi）：由翻译表 + 构建脚本生成。

## 流程概览

1. **翻译表**：`scripts/translations-table.json`  
   结构：`{ "key": { "ja": "訳文", "de": "Übersetzung", ... }, ... }`  
   每个 key 对应 en.json 的扁平路径（如 `common.language`），每个 locale 对应译文；缺失则回退到英文。

2. **从表生成 locale 文件**：  
   ```bash
   node scripts/build-locales-from-table.cjs
   ```  
   会覆盖 `src/i18n/locales/` 下除 zh-CN、en、zh-TW 外的 26 个 JSON。

3. **拉取翻译写入表**（MyMemory 免费 API）：  
   ```bash
   node scripts/fetch-translations.cjs <locale>
   ```  
   例如：`node scripts/fetch-translations.cjs de`  
   - 匿名约 5000 字符/天；设置 `MYMEMORY_EMAIL=your@email.com` 可提高到约 5 万字符/天。  
   - 每 20 条会保存一次表，遇配额会提前退出并保存进度。

4. **批量拉取并构建**：  
   ```bash
   node scripts/fetch-all-locales.cjs
   ```  
   会依次对尚未填满的 locale 执行 fetch，最后再执行一次 build。

## 简繁转换（zh-TW）

修改 zh-CN 后重新生成 zh-TW：

```bash
node scripts/zh-CN-to-zh-TW.cjs
```

## 增加新 key

1. 在 `src/i18n/locales/zh-CN.json` 和 `en.json` 中增加新 key。
2. 运行 `node scripts/generate-locales.cjs` 会**仅**把 en 复制到其余 26 个文件（旧逻辑，可选）。  
   若使用翻译表流程，则需在 `translations-table.json` 中为新 key 补全各 locale，再运行 `node scripts/build-locales-from-table.cjs`。
3. 若用 zh-TW 脚本，再运行 `node scripts/zh-CN-to-zh-TW.cjs`。

## 人工校对

可直接编辑 `src/i18n/locales/<locale>.json`。若之后再次运行 `build-locales-from-table.cjs`，会按表覆盖；若希望保留人工修改，请同步改 `scripts/translations-table.json` 中对应 key 的 locale 值，或改为只跑 fetch 不跑 build。
