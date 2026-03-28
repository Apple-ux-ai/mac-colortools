# 色彩工坊 · 多语言（i18n）实施方案

## 一、目标与范围

- **UI 位置**：在顶部主内容区 Header 的红色区域（当前页标题右侧、AdBanner / 登录注册左侧）增加「多语言」按钮，点击后展开下拉列表选择语言。
- **交互**：与图二一致，下拉为深色背景、浅色文字，当前语言项紫色高亮；支持列表内所有语言。
- **技术**：使用 i18n 相关库实现文案切换与语言持久化，不修改业务逻辑，仅做文案与布局改造。

## 二、技术选型建议

| 方案 | 库 | 优点 | 缺点 |
|------|----|------|------|
| **推荐** | **react-i18next** + **i18next** | 生态成熟、与 React 集成好、支持命名空间与懒加载、类型友好 | 需多一个依赖 |
| 备选 | react-intl (FormatJS) | 功能全、大厂使用多 | 包体积与 API 略重 |
| 备选 | 自建 Context + JSON | 无额外依赖 | 复数、插值、日期等需手写，后期维护成本高 |

**建议采用：`react-i18next` + `i18next`**，便于后续扩展（如复数、日期、数字格式等）。

---

## 三、支持语言列表（与图二一致）

按显示顺序，共 28 种：

1. 简体中文 (zh-CN) — 默认  
2. 繁體中文 (zh-TW)  
3. English (en)  
4. العربية (ar)  
5. বাংলা (bn)  
6. Deutsch (de)  
7. Español (es)  
8. فارسی (fa)  
9. Français (fr)  
10. עברית (he)  
11. हिन्दी (hi)  
12. Bahasa Indonesia (id)  
13. Italiano (it)  
14. 日本語 (ja)  
15. 한국어 (ko)  
16. Bahasa Melayu (ms)  
17. Nederlands (nl)  
18. Polski (pl)  
19. Português (pt)  
20. Português (Brasil) (pt-BR)  
21. Русский (ru)  
22. Kiswahili (sw)  
23. தமிழ் (ta)  
24. ไทย (th)  
25. Filipino (fil)  
26. Türkçe (tr)  
27. Українська (uk)  
28. اردو (ur)  
29. Tiếng Việt (vi)  

说明：下拉展示「语言名称」（如「简体中文」「English」），内部使用标准 locale 码（如 `zh-CN`、`en`）做切换与持久化。

---

## 四、目录与文件规划

```
src/
├── i18n/
│   ├── index.ts              # 初始化 i18next，注册语言与资源
│   ├── locales/
│   │   ├── zh-CN.json        # 简体中文（主语言，优先补全）
│   │   ├── en.json           # 英文
│   │   ├── zh-TW.json        # 繁体中文
│   │   └── ...               # 其余语言，可先空对象或部分 key，后续按需补全
│   └── types.ts              # 可选：locale 类型与 key 类型
├── components/
│   └── LanguageSwitcher.tsx  # 多语言按钮 + 下拉（红色区域组件）
├── store/
│   └── localeStore.ts        # 当前语言状态 + 持久化（与 themeStore 类似）
└── App.tsx                   # 在 Header 右侧区域插入 <LanguageSwitcher />
```

- **文案来源**：从现有中文文案中提取到 `zh-CN.json`，其他语言可先与 `en.json` 结构一致，内容逐步翻译或保持 key 占位。
- **持久化**：在 `localeStore` 中存当前 `locale`，与 `themeStore` 一样用 `zustand` + `persist`，key 如 `kunqiong-locale`；应用启动时在 i18n 初始化后设置 `i18n.changeLanguage(savedLocale)`。

---

## 五、实施阶段（分步、可验收）

### 阶段 1：基础 i18n 架设

1. 安装依赖：`i18next`、`react-i18next`。
2. 新建 `src/i18n/index.ts`：  
   - 初始化 i18next；  
   - 设置 `fallbackLng: 'zh-CN'`；  
   - 通过 `resources` 或 `backend` 注册上述 28 种语言的 JSON（可先只做 zh-CN + en 两个完整文件，其余用空对象或最小 key 占位）。
3. 在 `src/main.tsx` 最顶部 **import './i18n'**，保证在任何组件前完成 i18n 初始化。
4. 新建 `src/store/localeStore.ts`：  
   - 状态：`locale: string`；  
   - 方法：`setLocale(locale: string)`；  
   - 使用 `persist` 持久化；  
   - 在应用启动时（如 `main.tsx` 或 `App.tsx` 的 useEffect）根据 `localeStore.getState().locale` 调用 `i18n.changeLanguage(locale)`，并订阅 `localeStore` 变化以同步调用 `i18n.changeLanguage`。

**验收**：控制台无 i18n 报错，切换 `localeStore` 中的 locale 后，若已有使用 `useTranslation` 的组件，文案会随语言变化。

---

### 阶段 2：语言切换器 UI（红色区域）

1. 新建 `src/components/LanguageSwitcher.tsx`：  
   - 一个按钮（可带图标，如 Globe 或 Languages），文案可用 `t('common.language')` 或直接写「语言」占位。  
   - 点击后展开下拉列表，列表项为上述 28 种语言的「显示名称」（可从 i18n 的 `locales/languageNames.json` 或组件内静态 map 读取）。  
   - 下拉样式：深色背景、浅色文字，当前选中项紫色高亮（与图二一致）。  
   - 选择某一项后：更新 `localeStore.setLocale(对应 locale)`，并关闭下拉。  
   - 使用 `useRef` + 点击外部关闭下拉（与现有 `UserAuth` 类似）。
2. 在 `App.tsx` 顶部主内容区 **Header** 中，在红色区域插入 `<LanguageSwitcher />`：  
   - 结构为：左侧当前页标题 → **语言切换器** → AdBanner → UserAuth（与设计图顺序一致）。

**验收**：在红色区域看到语言按钮，点击出现下拉，选择后下拉关闭，且当前选中项高亮正确；若已接好 i18n，切换语言后界面文案会变。

---

### 阶段 3：全局文案接入 i18n

1. **文案抽取**：  
   - 从 `App.tsx`、`PageContainer`、各模块（如 `Calc.tsx`、`Home.tsx`、侧栏、快捷键说明等）中抽取所有中文文案。  
   - 按模块或页面划分 key，例如：  
     - `nav.home`、`nav.calc`、`nav.query`、…  
     - `calc.title`、`calc.grayscale`、…  
     - `common.back`、`common.language`、`common.close`、…  
   - 统一放入 `zh-CN.json`（并同步到 `en.json` 等）。
2. **组件改造**：  
   - 在需要文案的组件中 `useTranslation()`，将原硬编码中文替换为 `t('key')`。  
   - 优先顺序建议：App.tsx（导航、Header、快捷键弹窗）→ PageContainer → 各模块首页（Calc/Query/Home 等）→ 子页面与公共组件。
3. **RTL 与字体（可选）**：  
   - 若后续支持阿拉伯语、乌尔都语等 RTL 语言，可在 `localeStore` 或 i18n 的 `language` 变化时给 `document.documentElement` 设置 `dir="rtl"` 或 `dir="ltr"`；字体可后续再按需加。

**验收**：侧栏、顶栏、计算处理/查询工具等主要页面在 zh-CN / en 切换后，对应文案均来自 i18n 且显示正确。

---

### 阶段 4：其余语言资源与体验

1. 为其余 26 种语言在 `locales/` 下补充 JSON 文件（可先复制 `en.json` 或 `zh-CN.json` 再逐步翻译，未翻译的 key 会回退到 fallbackLng）。  
2. 语言列表中的「显示名称」可统一放在某 namespace（如 `languageNames`）或单独 JSON，便于维护。  
3. 可选：在 LanguageSwitcher 中增加搜索/筛选（语言多时体验更好）。

**验收**：下拉中所有语言均可选，切换后界面使用对应语言资源或回退到中文/英文无报错。

---

## 六、与现有结构的配合

- **主题**：不依赖主题实现；LanguageSwitcher 可读取 `useThemeStore` 或当前 className，使下拉在深色主题下仍保持「深色背景、浅色字、紫色高亮」的视觉一致。  
- **路由**：多语言与路由无关，不改变现有 `react-router-dom` 配置。  
- **Electron**：无特殊要求；若将来需要把「当前语言」传给主进程（如安装包语言、系统托盘菜单），可在 `localeStore` 变更时通过 ipc 通知主进程。

---

## 七、风险与注意点

- **包体积**：28 种语言若全部同步加载会增大首屏体积，可考虑按需懒加载：`i18next` 的 `backend` 或动态 `import()` 按当前选择的 locale 加载对应 JSON。  
- **缺失 key**：未翻译的 key 会显示 key 本身或 fallback 文案，建议开发阶段开启 i18next 的 `debug` 或 `returnEmptyString: false` 便于排查。  
- **持久化 key**：`persist` 的 key（如 `kunqiong-locale`）不要与现有 theme 等冲突。

---

## 八、总结

| 步骤 | 内容 | 产出 |
|------|------|------|
| 1 | 安装 i18next + react-i18next，建 i18n 目录与 localeStore，在 main 中初始化并接好持久化 | 可切换语言状态、无报错 |
| 2 | 实现 LanguageSwitcher 并放入 Header 红色区域 | 红色区域有下拉、可选 28 种语言 |
| 3 | 全局文案抽取并改为 t(key)，先完善 zh-CN + en | 主要界面双语可切换 |
| 4 | 补全其余语言 JSON 与显示名，可选搜索/懒加载 | 全语言可选、体验完整 |

按上述阶段实施，可先完成「红色区域多语言按钮 + 下拉 + 语言切换与持久化」，再逐步把全站文案接入 i18n，无需一次性改完所有文件。
