import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/shared/components/ui/Button";

describe("Button组件", () => {
  // 测试基本渲染
  test("正确渲染按钮文本", () => {
    render(<Button>测试按钮</Button>);
    expect(
      screen.getByRole("button", { name: "测试按钮" })
    ).toBeInTheDocument();
  });

  // 测试不同变体
  test("渲染不同变体的按钮", () => {
    const { rerender } = render(<Button variant="primary">主要按钮</Button>);
    const button = screen.getByRole("button", { name: "主要按钮" });

    // 检查类名包含primary
    expect(button.className).toContain("primary");

    // 重新渲染为secondary变体
    rerender(<Button variant="secondary">次要按钮</Button>);
    expect(button.className).toContain("secondary");

    // 重新渲染为ghost变体
    rerender(<Button variant="ghost">幽灵按钮</Button>);
    expect(button.className).toContain("ghost");
  });

  // 测试不同尺寸
  test("渲染不同尺寸的按钮", () => {
    const { rerender } = render(<Button size="small">小按钮</Button>);
    const button = screen.getByRole("button", { name: "小按钮" });

    expect(button.className).toContain("small");

    rerender(<Button size="medium">中按钮</Button>);
    expect(button.className).toContain("medium");

    rerender(<Button size="large">大按钮</Button>);
    expect(button.className).toContain("large");
  });

  // 测试全宽属性
  test("渲染全宽按钮", () => {
    render(<Button fullWidth>全宽按钮</Button>);
    const button = screen.getByRole("button", { name: "全宽按钮" });

    expect(button.className).toContain("fullWidth");
  });

  // 测试点击事件
  test("点击按钮时触发onClick事件", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>可点击按钮</Button>);

    fireEvent.click(screen.getByRole("button", { name: "可点击按钮" }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  // 测试禁用状态
  test("禁用状态的按钮不触发点击事件", () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        禁用按钮
      </Button>
    );

    const button = screen.getByRole("button", { name: "禁用按钮" });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // 测试自定义className
  test("接受并应用自定义className", () => {
    render(<Button className="custom-class">自定义类按钮</Button>);
    const button = screen.getByRole("button", { name: "自定义类按钮" });

    expect(button.className).toContain("custom-class");
  });
});
