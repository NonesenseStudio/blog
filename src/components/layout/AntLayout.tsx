"use client";

import React, { useState, useEffect } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, Layout as AntLayout, App } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
const { Footer } = AntLayout;
import { useTheme } from "next-themes";
import "@ant-design/v5-patch-for-react-19";
import { AppGlobal } from "./AppGlobal";
import "@/app/globals.css";

function Copyright() {
  const [year, setYear] = useState("");

  useEffect(() => {
    setYear(new Date().getFullYear().toString());
  }, []);

  return (
    <div>
      Personal Space ©{year}
      <div>Designed and Created by Myself</div>
    </div>
  );
}

export default function RootLayout({
  children,
  showLayout = true,
}: {
  children: React.ReactNode;
  showLayout?: boolean;
}) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // 确保在客户端渲染
  useEffect(() => {
    setMounted(true);
    // 设置初始主题
    if (resolvedTheme === "dark" || resolvedTheme === "light") {
      setCurrentTheme(resolvedTheme);
    }
  }, [resolvedTheme]);

  // 处理主题变化
  useEffect(() => {
    if (mounted && resolvedTheme) {
      setCurrentTheme(resolvedTheme === "dark" ? "dark" : "light");
    }
  }, [resolvedTheme, mounted]);

  // 避免服务端渲染和客户端渲染不匹配
  if (!mounted) {
    return <div style={{ visibility: "hidden" }}></div>;
  }

  return (
    <div className={currentTheme === "dark" ? "dark" : ""}>
      <AntdRegistry>
        <StyleProvider layer>
          <ConfigProvider
            theme={{
              algorithm:
                currentTheme === "dark"
                  ? theme.darkAlgorithm
                  : theme.defaultAlgorithm,
              token: {
                colorPrimary: "#1677ff",
              },
            }}
          >
            <App>
              <AppGlobal />
              {showLayout ? (
                <AntLayout
                  style={{
                    minHeight: "100vh",
                    backgroundColor:
                      currentTheme === "dark" ? "#141414" : "#fff",
                  }}
                >
                  {children}
                  <Footer
                    className="text-center select-none"
                    style={{
                      backgroundColor:
                        currentTheme === "dark" ? "#1f1f1f" : "#fff",
                      color: currentTheme === "dark" ? "#fff" : "#000",
                    }}
                  >
                    <Copyright />
                  </Footer>
                </AntLayout>
              ) : (
                children
              )}
            </App>
          </ConfigProvider>
        </StyleProvider>
      </AntdRegistry>
    </div>
  );
}
