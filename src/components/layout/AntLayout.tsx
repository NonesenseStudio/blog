"use client";

import React, { useState, useEffect } from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider, theme, Layout as AntLayout } from "antd";
const { Footer } = AntLayout;
import { useTheme } from "next-themes";

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
        {" "}
        <AntLayout style={{ minHeight: "100vh" }}>
          {children}
          <Footer className="text-center select-none">
            <Copyright />
          </Footer>
        </AntLayout>
      </ConfigProvider>
    </AntdRegistry>
  );
}
