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
  // 跟踪下拉菜单状态
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // 记录选择器容器DOM引用
  const selectorRef = useRef<HTMLDivElement>(null);

  // 获得焦点时自动聚焦到文本末尾
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isActive]);

  // 同步外部的活动状态
  useEffect(() => {
    if (isActive) {
      setHasFocus(true);
    }
  }, [isActive]);

  // 处理标题内容变化
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange({ content: e.target.value });
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

  // 点击文档其他区域时处理失焦
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // 检查点击是否发生在组件之外
      const clickedOnInput = inputRef.current?.contains(e.target as Node);
      const clickedOnSelector = selectorRef.current?.contains(e.target as Node);

      if (hasFocus && !clickedOnInput && !clickedOnSelector) {
        setHasFocus(false);
        setDropdownOpen(false);
        onBlur();
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, [hasFocus, onBlur]);

  // 处理失去焦点
  const handleBlur = useCallback(
    (e: React.FocusEvent) => {
      // 防止点击下拉菜单或选择器时触发失焦
      if (
        e.relatedTarget &&
        (e.relatedTarget.classList.contains(styles.headingOption) ||
          e.relatedTarget.classList.contains(styles.levelSelect))
      ) {
        return;
      }

      // 检查点击是否发生在选择器内部
      if (
        selectorRef.current &&
        selectorRef.current.contains(e.relatedTarget as Node)
      ) {
        return;
      }

      // 短暂延迟失焦，以允许点击事件完成
      setTimeout(() => {
        const isInputFocused = document.activeElement === inputRef.current;
        const isSelectorFocused = selectorRef.current?.contains(
          document.activeElement as Node
        );

        if (!isInputFocused && !isSelectorFocused) {
          setHasFocus(false);
          setDropdownOpen(false);
          onBlur();
        }
      }, 100);
    },
    [onBlur]
  );

  // 处理级别选择器的点击
  const handleSelectorClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // 切换下拉菜单状态
    setDropdownOpen((prev) => !prev);
    // 确保输入框保持焦点
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // 选择标题级别
  const selectHeadingLevel = useCallback(
    (level: number) => {
      onChange({ level });
      setDropdownOpen(false);
      // 选择后保持输入框焦点
      if (inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 10);
      }
    },
    [onChange]
  );

  // 根据标题级别应用不同的样式
  const headingLevel = block.level || 2;
  const headingClass = `${styles.headingBlockEditor} ${
    styles[`h${headingLevel}`]
  }`;

  // 自定义下拉菜单选项
  const headingOptions = [
    { value: 1, label: "H1" },
    { value: 2, label: "H2" },
    { value: 3, label: "H3" },
  ];

  // 选择器类名
  const selectorClassName = `${styles.headingLevelSelector} ${
    hasFocus ? styles.visibleSelector : styles.hiddenSelector
  }`;

  return (
    <div
      className={`${styles.headingBlockWrapper} ${
        hasFocus ? styles.activeHeadingBlock : ""
      }`}
    >
      {/* 自定义标题级别选择控件 - 始终创建但是通过CSS显示/隐藏 */}
      <div
        ref={selectorRef}
        className={selectorClassName}
        data-visible={hasFocus}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 显示当前选项的按钮 */}
        <button
          type="button"
          className={styles.levelSelect}
          onClick={handleSelectorClick}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          aria-label="选择标题级别"
        >
          H{headingLevel}
        </button>

        {/* 自定义下拉菜单 */}
        {dropdownOpen && (
          <div className={styles.headingDropdown}>
            {headingOptions.map((option) => (
              <button
                key={option.value}
                className={`${styles.headingOption} ${
                  option.value === headingLevel ? styles.activeOption : ""
                }`}
                onClick={() => selectHeadingLevel(option.value)}
                tabIndex={0}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

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
