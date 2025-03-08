import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/shared/components/ui/Input";

describe("Input组件", () => {
  // 测试基本渲染
  test("正确渲染输入框", () => {
    render(<Input placeholder="请输入" />);
    expect(screen.getByPlaceholderText("请输入")).toBeInTheDocument();
  });

  // 测试标签渲染
  test("正确渲染标签", () => {
    render(<Input label="用户名" placeholder="请输入用户名" />);
    expect(screen.getByText("用户名")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("请输入用户名")).toBeInTheDocument();
  });

  // 测试错误状态
  test("显示错误信息", () => {
    render(<Input error="用户名不能为空" placeholder="请输入用户名" />);
    expect(screen.getByText("用户名不能为空")).toBeInTheDocument();

    // 检查错误类名是否应用
    const inputElement = screen.getByPlaceholderText("请输入用户名");
    expect(inputElement.className).toContain("error");
  });

  // 测试帮助文本
  test("显示帮助文本", () => {
    render(<Input helper="请输入6-12位字符" placeholder="请输入密码" />);
    expect(screen.getByText("请输入6-12位字符")).toBeInTheDocument();
  });

  // 测试全宽属性
  test("渲染全宽输入框", () => {
    const { container } = render(<Input fullWidth placeholder="全宽输入框" />);
    // 获取最外层的div元素
    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer.className).toContain("fullWidth");
  });

  // 测试不同变体
  test("渲染不同变体的输入框", () => {
    const { rerender } = render(
      <Input variant="outlined" placeholder="轮廓输入框" />
    );
    let inputWrapper = screen.getByPlaceholderText("轮廓输入框").closest("div");
    expect(inputWrapper?.className).toContain("outlined");

    rerender(<Input variant="filled" placeholder="填充输入框" />);
    inputWrapper = screen.getByPlaceholderText("填充输入框").closest("div");
    expect(inputWrapper?.className).toContain("filled");
  });

  // 测试图标
  test("渲染带图标的输入框", () => {
    const startIcon = <span data-testid="start-icon">🔍</span>;
    const endIcon = <span data-testid="end-icon">✓</span>;

    render(
      <Input
        startIcon={startIcon}
        endIcon={endIcon}
        placeholder="带图标的输入框"
      />
    );

    expect(screen.getByTestId("start-icon")).toBeInTheDocument();
    expect(screen.getByTestId("end-icon")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("带图标的输入框");
    expect(input.className).toContain("hasStartIcon");
    expect(input.className).toContain("hasEndIcon");
  });

  // 测试用户输入
  test("处理用户输入", () => {
    const handleChange = jest.fn();
    render(<Input placeholder="请输入" onChange={handleChange} />);

    const input = screen.getByPlaceholderText("请输入");
    fireEvent.change(input, { target: { value: "测试文本" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(input).toHaveValue("测试文本");
  });

  // 测试禁用状态
  test("禁用状态的输入框", () => {
    render(<Input disabled placeholder="禁用输入框" />);
    const input = screen.getByPlaceholderText("禁用输入框");

    expect(input).toBeDisabled();

    // 在React测试库中，即使元素被禁用，fireEvent.change也能改变值
    // 所以我们只测试元素是否被禁用，而不测试值是否能被改变
  });

  // 测试自定义className
  test("接受并应用自定义className", () => {
    const { container } = render(
      <Input className="custom-input" placeholder="自定义类输入框" />
    );
    // 获取最外层的div元素
    const outerContainer = container.firstChild as HTMLElement;
    expect(outerContainer.className).toContain("custom-input");
  });
});
