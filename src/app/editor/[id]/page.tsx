import { EditorClientPage } from "@/modules/editor/components/EditorClientPage";

/**
 * 编辑器页面
 * @description 根据 URL 参数渲染对应的文章编辑器
 * @param props - 包含 params（动态路由参数），如 { id: string }
 */
export default async function Page(props) {
  const { id } = await props.params;

  return <EditorClientPage id={id} />;
}
