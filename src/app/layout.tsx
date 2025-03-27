import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AppContextProvider } from "@/shared/contexts/AppContextProvider";
import { Header, Footer } from "@/shared";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Feifei",
  description: "A blog platform for sharing thoughts and ideas.",
  keywords: ["博客", "技术", "生活", "前端开发"],
  authors: [{ name: "FeiとFei" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: "https://feifei.com",
    siteName: "FeiとFei",
    description: "记录生活点滴，分享技术心得",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="antialiased">
        <AppContextProvider>
          <div className="layout">
            <Header />

            <main className="main">{children}</main>

            <Footer />
          </div>

          <Analytics />
          <SpeedInsights />
        </AppContextProvider>
      </body>
    </html>
  );
}
