import { render, screen, fireEvent, act } from "@testing-library/react";
import { Modal } from "@/shared/components/ui/Modal";

// 模拟createPortal
jest.mock("react-dom", () => ({
  ...jest.requireActual("react-dom"),
  createPortal: (node: React.ReactNode) => node,
}));

// 模拟framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    div: ({
      children,
      className,
      onClick,
    }: {
      children: React.ReactNode;
      className?: string;
      onClick?: () => void;
    }) => (
      <div className={className} onClick={onClick} data-testid={className}>
        {children}
      </div>
    ),
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => children,
}));

describe("Modal组件", () => {
  // 在每个测试后清理
  afterEach(() => {
    jest.clearAllMocks();
  });

  // 测试基本渲染 - 关闭状态
  test("当isOpen为false时不渲染内容", () => {
    render(
      <Modal isOpen={false}>
        <div>模态框内容</div>
      </Modal>
    );

    expect(screen.queryByText("模态框内容")).not.toBeInTheDocument();
  });

  // 测试基本渲染 - 打开状态
  test("当isOpen为true时渲染内容", () => {
    render(
      <Modal isOpen={true}>
        <div>模态框内容</div>
      </Modal>
    );

    expect(screen.getByText("模态框内容")).toBeInTheDocument();
  });

  // 测试标题渲染
  test("正确渲染标题", () => {
    render(
      <Modal isOpen={true} title="测试标题">
        <div>模态框内容</div>
      </Modal>
    );

    expect(screen.getByText("测试标题")).toBeInTheDocument();
  });

  // 测试关闭按钮
  test("点击关闭按钮时调用onClose", () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="测试标题">
        <div>模态框内容</div>
      </Modal>
    );

    // 找到关闭按钮并点击
    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试点击遮罩层关闭
  test("点击遮罩层时调用onClose", () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>模态框内容</div>
      </Modal>
    );

    // 找到遮罩层并点击
    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试禁用点击遮罩层关闭
  test("当closeOnOverlayClick为false时，点击遮罩层不调用onClose", () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOverlayClick={false}>
        <div>模态框内容</div>
      </Modal>
    );

    // 找到遮罩层并点击
    const overlay = screen.getByTestId("overlay");
    fireEvent.click(overlay);

    expect(handleClose).not.toHaveBeenCalled();
  });

  // 测试不同尺寸
  test("渲染不同尺寸的模态框", () => {
    const { rerender } = render(
      <Modal isOpen={true} size="small">
        <div>小模态框</div>
      </Modal>
    );

    let modalElement = screen.getByTestId("modal small");
    expect(modalElement.className).toContain("small");

    rerender(
      <Modal isOpen={true} size="medium">
        <div>中模态框</div>
      </Modal>
    );
    modalElement = screen.getByTestId("modal medium");
    expect(modalElement.className).toContain("medium");

    rerender(
      <Modal isOpen={true} size="large">
        <div>大模态框</div>
      </Modal>
    );
    modalElement = screen.getByTestId("modal large");
    expect(modalElement.className).toContain("large");
  });

  // 测试按ESC键关闭
  test("按ESC键时调用onClose", () => {
    const handleClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={handleClose}>
        <div>模态框内容</div>
      </Modal>
    );

    // 模拟按下ESC键
    fireEvent.keyDown(document, { key: "Escape" });

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  // 测试body样式变化
  test("打开时设置body的overflow为hidden，关闭时恢复", () => {
    const { rerender } = render(
      <Modal isOpen={true}>
        <div>模态框内容</div>
      </Modal>
    );

    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal isOpen={false}>
        <div>模态框内容</div>
      </Modal>
    );

    // 在React的useEffect清理函数执行后，overflow应该被重置
    act(() => {
      // 触发useEffect的清理函数
    });

    expect(document.body.style.overflow).toBe("unset");
  });
});
