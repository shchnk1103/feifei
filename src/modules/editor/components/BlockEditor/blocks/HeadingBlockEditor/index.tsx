import React, { useEffect, useRef, useCallback, memo, useState } from "react";
import styles from "./styles.module.css";
import { HeadingBlockEditorProps } from "./types";

/**
 * 标题块编辑器组件
 *
 * 支持H1-H3级别的标题编辑，提供级别选择器
 */
export const HeadingBlockEditor = memo(function HeadingBlockEditor({
  block,
  isActive,
  onChange,
  onFocus,
  onBlur,
  onEnterKey,
}: HeadingBlockEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // 额外跟踪组件内部的焦点状态，确保级别选择器正确显示/隐藏
  const [hasFocus, setHasFocus] = useState(false);

  // 获得焦点时自动聚焦到文本末尾
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isActive]);

  // 处理标题内容变化
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ content: e.target.value });
    },
    [onChange]
  );

  // 处理标题级别变化
  const handleLevelChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange({ level: parseInt(e.target.value) });
    },
    [onChange]
  );

  // 处理回车键
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onEnterKey) {
        e.preventDefault();
        onEnterKey();
      }
    },
    [onEnterKey]
  );

  // 处理获得焦点
  const handleFocus = useCallback(() => {
    setHasFocus(true);
    onFocus();
  }, [onFocus]);

  // 处理失去焦点
  const handleBlur = useCallback(() => {
    setHasFocus(false);
    onBlur();
  }, [onBlur]);

  // 处理级别选择器的点击，防止冒泡导致失去焦点
  const handleSelectorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  // 根据标题级别应用不同的样式
  const headingLevel = block.level || 2;
  const headingClass = `${styles.headingBlockEditor} ${
    styles[`h${headingLevel}`]
  }`;

  return (
    <div
      className={`${styles.headingBlockWrapper} ${
        hasFocus ? styles.activeHeadingBlock : ""
      }`}
    >
      {/* 标题级别选择控件 - 只在有焦点时显示 */}
      {hasFocus && (
        <div
          className={styles.headingLevelSelector}
          onClick={handleSelectorClick}
        >
          <select
            value={headingLevel}
            onChange={handleLevelChange}
            className={styles.levelSelect}
            onFocus={handleFocus}
            aria-label="标题级别"
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        </div>
      )}

      {/* 标题内容输入框 */}
      <input
        ref={inputRef}
        type="text"
        className={headingClass}
        value={block.content || ""}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={`标题 ${headingLevel}`}
        aria-label={`标题 ${headingLevel}`}
      />
    </div>
  );
});
