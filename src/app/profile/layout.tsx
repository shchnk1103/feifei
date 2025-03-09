import { Metadata } from "next";

export const metadata: Metadata = {
  title: "个人资料 | FeiとFei",
  description: "查看和编辑您的个人资料信息",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main>{children}</main>;
}
