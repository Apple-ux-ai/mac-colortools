# 修复右上角按键点击范围技术规范

## 1. 问题分析
在 [App.tsx](file:///e:/360MoveData/Users/win10/Desktop/Color%20Tools/src/App.tsx) 中，顶部定义了一个高度为 `h-10` (40px) 的透明拖拽区域，用于 Electron 窗口拖拽。
```tsx
<div className="absolute top-0 left-0 right-0 h-10 z-[100] pointer-events-none flex">
  <div className="flex-1 h-full pointer-events-auto" style={{ WebkitAppRegion: 'drag' } as any}></div>
  {/* ... */}
</div>
```
Header 组件的高度为 `h-20` (80px)，其 `z-index` 为 10。
由于拖拽区域 `z-index: 100` 高于 Header，导致位于 Header 右侧的按钮上半部分（0-40px 区域）被拖拽层覆盖，点击事件被 Electron 拦截。

## 2. 实施方案
采用方案 A：将按钮区域从拖拽层中排除。

### 2.1 修改 App.tsx
- 在自定义标题栏区域的右侧，添加一个与 Header 按钮对齐的 `no-drag` 区域。
- 或者直接将 Header 的 `z-index` 提升，并对内部按钮设置 `WebkitAppRegion: 'no-drag'`。

**推荐做法**：
1. 修改 [App.tsx](file:///e:/360MoveData/Users/win10/Desktop/Color%20Tools/src/App.tsx) 中的 Header，将其 `z-index` 提升到 `101`（高于拖拽层的 100）。
2. 在 Header 内部的按钮容器或具体组件（`UserAuth` 和 `AdBanner`）上添加 `style={{ WebkitAppRegion: 'no-drag' } as any}`。

## 3. 实施检查清单
1. [ ] 修改 [App.tsx](file:///e:/360MoveData/Users/win10/Desktop/Color%20Tools/src/App.tsx)：提升 Header 的 `z-index`。
2. [ ] 修改 [App.tsx](file:///e:/360MoveData/Users/win10/Desktop/Color%20Tools/src/App.tsx)：为右上角操作区添加 `no-drag` 样式。
3. [ ] 检查并更新 [ISSUES.md](file:///e:/360MoveData/Users/win10/Desktop/Color%20Tools/ISSUES.md)（如果存在）。
4. [ ] 验证点击范围是否恢复正常。
