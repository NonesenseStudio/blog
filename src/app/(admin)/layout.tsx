import { AntdRegistry } from "@ant-design/nextjs-registry";
import BackendLayout from "@/components/layout/BackendLayout";
import React from "react";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "@/app/globals.css";
import "@ant-design/v5-patch-for-react-19";
import { useCategoryStore } from "@/stores";

export const metadata: Metadata = {
  title: {
    template: "%s | 后台管理系统",
    default: "后台管理系统",
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
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
