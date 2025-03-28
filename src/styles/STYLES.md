# 样式系统文档

本文档详细说明了项目的CSS样式系统结构、各文件的作用以及使用方法，旨在帮助开发人员理解、使用和扩展现有的样式系统。

## 目录结构

样式系统采用模块化结构，分为以下几个主要目录：

```
src/styles/
├── base/         - 基础样式（变量、重置）
├── components/   - 组件样式
├── layouts/      - 布局样式
├── themes/       - 主题变量
├── utils/        - 工具类
└── globals.css   - 全局样式导入
```

## 全局样式 (globals.css)

`globals.css` 是样式系统的入口文件，它导入所有其他CSS模块。该文件不应包含具体样式定义，仅作为导入其他样式文件的集中点，以及定义少量特定全局变量。

```css
/* 导入顺序很重要：基础样式 → 布局 → 工具类 → 主题 → 组件 */
@import "./base/variables.css";
@import "./base/reset.css";
/* ...其他导入... */
```

## 基础样式 (base/)

### variables.css

定义全局CSS变量，包括颜色、字体、间距、过渡时间等基础变量。这些变量在整个项目中被重复使用，确保样式的一致性。

主要内容：
- 颜色变量（背景色、前景色、强调色等）
- 字体变量（大小、行高、字重等）
- 间距变量（内边距、外边距等）
- 过渡变量（动画时间等）
- Z-index层级

### reset.css

重置浏览器默认样式，确保跨浏览器的一致性。

主要内容：
- 盒模型重置 (`box-sizing: border-box`)
- 外边距和内边距重置
- 列表、链接样式重置
- 图片和表单元素重置
- 文本选择和焦点样式

## 主题样式 (themes/)

主题文件定义特定组件或全局UI元素的变量，支持亮色和暗色主题切换。

### theme.css

定义全局主题相关变量，包括亮色和暗色主题。

### button.css

按钮组件主题变量，定义按钮在不同状态和变体下的颜色和样式。

### header.css

头部组件主题变量，定义头部在亮色和暗色主题下的背景、边框和文本颜色。

```css
:root {
  --header-bg: rgba(255, 255, 255, 0.95);
  --header-border: rgba(0, 0, 0, 0.05);
  /* ...其他头部相关变量... */
}

[data-theme="dark"] {
  --header-bg: rgba(0, 0, 0, 0.95);
  /* ...暗色主题变量... */
}
```

### glass.css

毛玻璃效果主题变量，定义毛玻璃效果的模糊度、不透明度和边框颜色。还提供了`.glassmorphism`工具类用于快速应用毛玻璃效果。

### card.css

卡片组件主题变量，定义卡片背景、边框、阴影和文本颜色。

## 布局样式 (layouts/)

### layout.css

定义全局布局相关样式，包括容器、网格系统和响应式布局工具。

```css
.container {
  margin-left: auto;
  margin-right: auto;
  max-width: var(--max-width);
  /* ...其他样式... */
}
```

### page.css

定义页面级别的布局样式，包括页面容器、主内容区域和响应式布局调整。

```css
.page-container {
  position: relative;
  min-height: calc(100vh - var(--header-height));
  width: 100%;
}

.home-container {
  width: 100%;
  max-width: 80rem;
  margin: 0 auto;
  /* ...其他样式... */
}
```

## 组件样式 (components/)

组件样式文件定义特定UI组件的样式。每个组件一个文件，便于维护和扩展。

### button.css

按钮组件样式，包括基本样式、尺寸变体、颜色变体和状态（悬浮、禁用等）。

### card.css

卡片组件样式，包括基本卡片、卡片标题、描述、元信息等。还支持不同的卡片布局（水平、垂直）和变体（紧凑型、无边框等）。

```css
.card {
  border-radius: var(--radius-md);
  background: var(--card-bg);
  /* ...其他样式... */
}

.card-title { /* ... */ }
.card-description { /* ... */ }
```

### tag.css

标签组件样式，包括基本标签、尺寸变体、颜色变体和可关闭标签。

### form.css

表单组件样式，包括输入框、文本区域、选择框、复选框和单选框。还包括表单布局、错误状态和帮助文本。

### header.css

头部组件样式，包括基本头部、导航、徽标和移动端响应式布局。

### header-fixed.css

固定头部样式，用于创建固定在视口某个位置的头部元素。

```css
.header-fixed {
  position: fixed;
  top: var(--space-md);
  left: var(--space-md);
  background: var(--header-bg);
  /* ...其他样式... */
}
```

### footer.css

页脚组件样式，包括页脚布局、链接、社交媒体图标和版权信息。

### scroll.css

滚动相关组件样式，包括滚动容器、列表显示和滚动条自定义样式。

```css
.scroll-container {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  /* ...其他样式... */
}

.list-container {
  position: sticky;
  top: 80px;
  /* ...其他样式... */
}
```

### message.css

消息提示组件样式，包括错误、成功、警告和信息提示样式。

```css
.error-message {
  background-color: var(--error-bg);
  color: var(--error-color);
  /* ...其他样式... */
}

.success-message {
  background-color: var(--success-bg);
  /* ...其他样式... */
}
```

## 工具类 (utils/)

### utilities.css

通用工具类，包括文本对齐、布局助手、间距和显示属性等。

```css
.flex { display: flex; }
.flex-col { flex-direction: column; }
.text-center { text-align: center; }
```

### animations.css

动画和过渡效果，包括关键帧动画定义和动画工具类。

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.animate-fade-in {
  animation: fadeIn var(--transition-normal) ease-in-out;
}
```

## 使用指南

### 如何使用页面布局

页面布局类用于构建整体页面结构：

```html
<div class="page-container">
  <div class="home-container">
    <!-- 页面内容 -->
    <main class="content">
      <!-- 主要内容 -->
    </main>
  </div>
</div>
```

### 如何使用滚动组件

滚动组件用于创建可滚动区域：

```html
<!-- 基本滚动容器 -->
<div class="scroll-container">
  <!-- 滚动内容 -->
</div>

<!-- 列表容器 -->
<div class="list-section">
  <div class="list-container">
    <div class="list-item">列表项 1</div>
    <div class="list-item">列表项 2</div>
    <!-- 更多列表项 -->
  </div>
</div>
```

### 如何使用消息组件

消息组件用于显示各种状态的提示信息：

```html
<!-- 错误消息 -->
<div class="message error-message">
  提交失败，请检查表单内容。
</div>

<!-- 成功消息 -->
<div class="message success-message">
  操作成功完成！
</div>

<!-- 警告消息 -->
<div class="message warning-message">
  请注意，此操作不可撤销。
</div>

<!-- 信息消息 -->
<div class="message info-message">
  系统将于今晚10点进行维护。
</div>
```

### 如何使用组件样式

1. **按钮组件**：
   ```html
   <!-- 基本按钮 -->
   <button class="button primary">主要按钮</button>
   <button class="button secondary">次要按钮</button>
   <button class="button ghost">幽灵按钮</button>
   
   <!-- 尺寸变体 -->
   <button class="button primary small">小按钮</button>
   <button class="button primary medium">中等按钮</button>
   <button class="button primary large">大按钮</button>
   
   <!-- 状态 -->
   <button class="button primary" disabled>禁用按钮</button>
   <button class="button primary loading">加载中...</button>
   ```

2. **卡片组件**：
   ```html
   <!-- 基本卡片 -->
   <div class="card">
     <h3 class="card-title">卡片标题</h3>
     <p class="card-description">卡片描述内容...</p>
     <div class="card-meta">
       <span class="card-author">作者名</span>
       <span class="card-time">2023-03-28</span>
     </div>
   </div>
   
   <!-- 带图片的卡片 -->
   <div class="card">
     <div class="card-image">
       <img src="path/to/image.jpg" alt="描述" />
     </div>
     <h3 class="card-title">带图片的卡片</h3>
     <p class="card-description">卡片描述内容...</p>
   </div>
   
   <!-- 水平卡片 -->
   <div class="card card-horizontal">
     <div class="card-image">
       <img src="path/to/image.jpg" alt="描述" />
     </div>
     <div>
       <h3 class="card-title">水平卡片</h3>
       <p class="card-description">卡片描述内容...</p>
     </div>
   </div>
   ```

3. **标签组件**：
   ```html
   <!-- 基本标签 -->
   <span class="tag">标签文本</span>
   
   <!-- 颜色变体 -->
   <span class="tag tag-primary">主要标签</span>
   <span class="tag tag-success">成功标签</span>
   <span class="tag tag-warning">警告标签</span>
   <span class="tag tag-error">错误标签</span>
   
   <!-- 尺寸变体 -->
   <span class="tag tag-sm">小标签</span>
   <span class="tag tag-lg">大标签</span>
   
   <!-- 带图标的标签 -->
   <span class="tag tag-with-icon">
     <span class="tag-icon">🏷️</span>
     标签文本
   </span>
   
   <!-- 可关闭标签 -->
   <span class="tag tag-closable">
     标签文本
     <button class="tag-close-button">×</button>
   </span>
   ```

### 如何使用工具类

工具类可以组合使用，以快速构建页面布局和样式：

```html
<!-- 居中容器 -->
<div class="container">
  <!-- 全宽弹性布局 -->
  <div class="flex flex-col items-center">
    <!-- 带动画的元素 -->
    <div class="animate-fade-in">
      <h1 class="text-center">标题</h1>
      <p>内容...</p>
    </div>
    
    <!-- 指定间距 -->
    <div class="m-3 p-2">
      <!-- 鼠标指针样式 -->
      <button class="button primary cursor-pointer">按钮</button>
    </div>
  </div>
</div>
```

### 如何使用毛玻璃效果

毛玻璃效果可以通过添加 `.glassmorphism` 类实现：

```html
<div class="header header-glassmorphism">
  <!-- 头部内容 -->
</div>

<div class="card glassmorphism">
  <!-- 卡片内容 -->
</div>
```

## 样式组织原则

1. **关注点分离**：主题变量与组件样式分离，便于维护和修改
2. **单一职责**：每个文件只负责一个功能或组件
3. **可复用性**：设计可复用的通用组件和工具类
4. **可扩展性**：设计易于扩展的系统，方便添加新功能
5. **渐进增强**：兼顾基本功能和高级特性

## 最佳实践

1. **使用变量**：始终使用CSS变量而非硬编码值，确保设计的一致性
2. **组件化思维**：为每个组件创建独立的CSS文件
3. **明确的命名**：使用清晰、描述性的类名
4. **文档化**：为复杂组件添加注释
5. **响应式设计**：使用媒体查询确保在不同设备上的良好表现
6. **避免深层嵌套**：保持选择器简单
7. **模块化组织**：不再使用局部CSS模块（如page.module.css），而是将样式集中管理在styles目录下

## 添加新样式

1. 确定样式的类型和归属
2. 在相应目录下创建或编辑文件
3. 如果是新文件，在`globals.css`中导入
4. 遵循现有的命名和结构规范
5. 更新本文档，记录新添加的样式

## 主题切换

项目使用 `data-theme` 属性控制主题切换。暗色主题样式通过 `[data-theme="dark"]` 选择器定义。

```html
<html data-theme="dark">
  <!-- 网站内容 -->
</html>
```

切换主题的JavaScript代码示例：

```javascript
// 切换到暗色主题
document.documentElement.setAttribute('data-theme', 'dark');

// 切换到亮色主题
document.documentElement.setAttribute('data-theme', 'light');

// 根据系统偏好切换
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
```

## 更新历史

- 2023-03-28 - 创建基础样式系统文档
- 2023-03-29 - 添加页面布局、滚动组件和消息组件样式 