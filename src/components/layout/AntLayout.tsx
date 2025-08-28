"use client";

import React, { useState, useEffect } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, Layout as AntLayout, App } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
const { Footer } = AntLayout;
import { useTheme } from "next-themes";
import '@ant-design/v5-patch-for-react-19';

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
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <AntdRegistry>
      <StyleProvider layer>
        <ConfigProvider
          theme={{
            algorithm:
              resolvedTheme === "dark"
                ? theme.darkAlgorithm
                : theme.defaultAlgorithm,
            token: {
              colorPrimary: "#1677ff",
            },
          }}
        >
            {showLayout ? (
              <AntLayout style={{ minHeight: "100vh" }}>
                {children}
                <Footer className="text-center select-none">
                  <Copyright />
                </Footer>
              </AntLayout>
            ) : (
              children
            )}
        </ConfigProvider>
      </StyleProvider>
    </AntdRegistry>
  );
}
