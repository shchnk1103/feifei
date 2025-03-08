import { mergeStyles } from "@/shared/utils/styles";

describe("mergeStyles", () => {
  test("合并多个样式对象", () => {
    const style1 = { button: "btn", header: "header" };
    const style2 = { button: "btn-primary", footer: "footer" };

    const result = mergeStyles(style1, style2);

    // 注意：当前实现会覆盖相同键的值，而不是合并它们
    expect(result).toEqual({
      button: "btn-primary", // 后面的样式会覆盖前面的样式
      header: "header", // 保留唯一键
      footer: "footer", // 保留唯一键
    });
  });

  test("处理空对象", () => {
    const style1 = { button: "btn" };
    const style2 = {};

    const result = mergeStyles(style1, style2);

    expect(result).toEqual({
      button: "btn",
    });
  });

  test("处理多个样式对象", () => {
    const style1 = { button: "btn" };
    const style2 = { header: "header" };
    const style3 = { footer: "footer" };

    const result = mergeStyles(style1, style2, style3);

    expect(result).toEqual({
      button: "btn",
      header: "header",
      footer: "footer",
    });
  });

  test("处理无参数调用", () => {
    const result = mergeStyles();
    expect(result).toEqual({});
  });

  test("当存在同名属性时后面的会覆盖前面的", () => {
    const style1 = { common: "first", unique1: "value1" };
    const style2 = { common: "second", unique2: "value2" };
    const style3 = { common: "third", unique3: "value3" };

    const result = mergeStyles(style1, style2, style3);

    expect(result).toEqual({
      common: "third", // 只保留最后一个值
      unique1: "value1",
      unique2: "value2",
      unique3: "value3",
    });
  });
});
