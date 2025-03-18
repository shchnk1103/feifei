import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";
import { TextBlockEditorProps } from "./types";

export function TextBlockEditor({
  block,
  isActive,
  onChange,
  onFocus,
  onBlur,
  onEnterKey,
}: TextBlockEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // 自动调整文本域高度
  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // 初始化时和内容变化时设置高度
  useEffect(() => {
    adjustHeight();
  }, [block.content]);

  // 获得焦点时自动聚焦到文本末尾
  useEffect(() => {
    if (isActive && textareaRef.current) {
      textareaRef.current.focus();
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
      adjustHeight();
    }
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({ content: e.target.value });
    adjustHeight();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // 按下回车键且未按下Shift键时，创建新块
    if (e.key === "Enter" && !e.shiftKey && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  return (
    <div
      className={`${styles.textBlockWrapper} ${
        isActive ? styles.activeTextBlock : ""
      }`}
    >
      <textarea
        ref={textareaRef}
        className={styles.textBlockEditor}
        value={block.content || ""}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder="输入文本内容..."
        rows={1}
      />
    </div>
  );
}
