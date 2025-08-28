import { AntdRegistry } from "@ant-design/nextjs-registry";
import FrontendLayout from "@/components/layout/FrontendLayout";
import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";


export const metadata: Metadata = {
  title: {
    template: "%s | A Boring Blog",
    default: "A Boring Blog",
  },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class" // 与 Tailwind 的 class 模式匹配
          defaultTheme="system" // 默认跟随系统
          enableSystem={true} // 启用系统主题检测
          disableTransitionOnChange // 避免切换时的视觉闪烁
        >
          <AntdRegistry>
            <FrontendLayout>{children}</FrontendLayout>
          </AntdRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
