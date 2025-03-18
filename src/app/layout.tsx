import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/modules/theme";
import { Header, Footer } from "@/shared";
import { AuthProvider } from "@/modules/auth";
import { SessionProvider } from "@/shared/components/providers/SessionProvider";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "@/styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  display: "swap",
  subsets: ["latin"],
  preload: true,
});

export const metadata: Metadata = {
  title: "Feifei",
  description: "A blog platform for sharing thoughts and ideas.",
  keywords: ["博客", "技术", "生活", "前端开发"],
  authors: [{ name: "FeiとFei" }],
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <SessionProvider>
          <AuthProvider>
            <ThemeProvider>
              <div className="flex min-h-screen flex-col">
                <Header />

                <main className="flex-1">{children}</main>

                <Footer />
              </div>

              <Analytics />
              <SpeedInsights />
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
