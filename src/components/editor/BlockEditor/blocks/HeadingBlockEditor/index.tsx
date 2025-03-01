import React, { useEffect, useRef } from "react";
import { Block } from "@/types/blocks";
import styles from "./styles.module.css";

interface HeadingBlockEditorProps {
  block: Block;
  isActive: boolean;
  onChange: (updatedBlock: Partial<Block>) => void;
  onFocus: () => void;
  onBlur: () => void;
  onEnterKey?: () => void;
}

export function HeadingBlockEditor({
  block,
  isActive,
  onChange,
  onFocus,
  onBlur,
  onEnterKey,
}: HeadingBlockEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // 获得焦点时自动聚焦到文本末尾
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current.focus();
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [isActive]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ content: e.target.value });
  };

  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ level: parseInt(e.target.value) });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  // 根据标题级别应用不同的样式
  const headingClass = `${styles.headingBlockEditor} ${
    styles[`h${block.level || 2}`]
  }`;

  return (
    <div
      className={`${styles.headingBlockWrapper} ${
        isActive ? styles.activeHeadingBlock : ""
      }`}
    >
      <div className={styles.headingControls}>
        {isActive && (
          <select
            value={block.level || 2}
            onChange={handleLevelChange}
            className={styles.levelSelect}
            onFocus={onFocus}
          >
            <option value={1}>H1</option>
            <option value={2}>H2</option>
            <option value={3}>H3</option>
          </select>
        )}
      </div>

      <input
        ref={inputRef}
        type="text"
        className={headingClass}
        value={block.content || ""}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
        placeholder={`标题 ${block.level || 2}`}
      />
    </div>
  );
}
