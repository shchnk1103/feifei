# Button 组件

一个功能强大且符合可访问性标准的按钮组件，支持多种样式变体、尺寸和状态。

## 基本用法

```tsx
import { Button } from "@/shared/components/ui/Button";

export function Example() {
  return (
    <div>
      <Button>默认按钮</Button>
      <Button variant="secondary">次要按钮</Button>
      <Button variant="ghost">幽灵按钮</Button>
    </div>
  );
}
```

## 变体样式

```tsx
<Button variant="primary">主要按钮</Button>
<Button variant="secondary">次要按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button variant="danger">危险按钮</Button>
<Button variant="success">成功按钮</Button>
<Button variant="warning">警告按钮</Button>
```

## 不同尺寸

```tsx
<Button size="small">小按钮</Button>
<Button size="medium">中按钮</Button>
<Button size="large">大按钮</Button>
```

## 图标按钮

```tsx
import { SearchIcon, ArrowRightIcon } from "@/shared/components/icons";

<Button icon={<SearchIcon />}>搜索</Button>
<Button icon={<ArrowRightIcon />} iconPosition="right">下一步</Button>
```

## 加载状态

```tsx
<Button loading>加载中</Button>
<Button loading loadingText="正在提交...">提交</Button>
```

## 圆角按钮

```tsx
<Button rounded>圆角按钮</Button>
```

## 全宽按钮

```tsx
<Button fullWidth>全宽按钮</Button>
```

## 禁用状态

```tsx
<Button disabled>禁用按钮</Button>
```

## 可访问性增强

```tsx
<Button ariaLabel="点击搜索">搜索</Button>
<Button loading loadingText="正在加载结果">加载中</Button>
```

## 使用 ref

```tsx
import { useRef } from 'react';

function Example() {
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  return (
    <Button ref={buttonRef}>引用按钮</Button>
  );
}
```

## 使用表单类型

```tsx
<Button type="submit">提交表单</Button>
<Button type="reset">重置</Button>
<Button type="button">普通按钮</Button>
```

## 属性说明

| 属性         | 类型                                                                      | 默认值    | 说明                     |
| ------------ | ------------------------------------------------------------------------- | --------- | ------------------------ |
| variant      | 'primary' \| 'secondary' \| 'ghost' \| 'danger' \| 'success' \| 'warning' | 'primary' | 按钮样式变体             |
| size         | 'small' \| 'medium' \| 'large'                                            | 'medium'  | 按钮尺寸                 |
| fullWidth    | boolean                                                                   | false     | 是否全宽显示             |
| loading      | boolean                                                                   | false     | 是否显示加载状态         |
| loadingText  | string                                                                    | undefined | 加载状态的屏幕阅读器文本 |
| icon         | ReactNode                                                                 | undefined | 按钮图标                 |
| iconPosition | 'left' \| 'right'                                                         | 'left'    | 图标位置                 |
| rounded      | boolean                                                                   | false     | 是否使用完全圆角样式     |
| disabled     | boolean                                                                   | false     | 是否禁用                 |
| ariaLabel    | string                                                                    | undefined | 按钮的ARIA标签           |
| type         | 'button' \| 'submit' \| 'reset'                                           | 'button'  | 按钮类型                 |
| ref          | React.Ref                                                                 | -         | 引用HTML按钮元素的引用   |
| ...props     | ButtonHTMLAttributes                                                      | -         | 原生按钮属性             |

## CSS变量主题定制

按钮组件使用的CSS变量都在`src/styles/themes/button.css`中定义，可以通过修改这些变量来全局调整按钮样式。

### 主题变量示例

```css
/* 主题中调整按钮变量示例 */
:root {
  /* 主要按钮颜色 */
  --button-primary-bg: #3f51b5;
  --button-primary-text: #ffffff;
  --button-primary-hover: #303f9f;
  
  /* 按钮尺寸 */
  --button-medium-height: 40px;
  
  /* 动画效果 */
  --button-transition: 0.2s ease;
}
```

## 可访问性注意事项

本组件符合WCAG 2.1标准的可访问性要求：

1. 键盘可访问 - 可以通过Tab键聚焦，并使用空格/回车触发
2. 屏幕阅读器支持 - 提供适当的ARIA属性和标签
3. 加载状态通知 - 使用`aria-busy`和可选的`loadingText`
4. 高对比度设计 - 所有颜色符合WCAG AA级对比度要求
5. 聚焦状态 - 清晰的视觉聚焦指示器

## 最佳实践

1. 总是为没有文本的图标按钮提供`ariaLabel`
2. 加载状态时提供`loadingText`以增强屏幕阅读器体验
3. 使用语义上适当的按钮变体（例如，使用`danger`表示删除操作）
4. 遵循应用程序的颜色对比度指南