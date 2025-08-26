"use client";

import React from "react";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import {
  ConfigProvider,
  theme,
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import "@/app/globals.css";

const { Header, Sider, Content, Footer } = AntLayout;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 根据路径判断当前选中的菜单项
  const getSelectedMenuKeys = () => {
    if (pathname === "/") return ["home"];
    if (pathname.startsWith("/posts")) return ["posts"];
    if (pathname.startsWith("/categories")) return ["categories"];
    if (pathname.startsWith("/about")) return ["about"];
    return [];
  };

  // 用户菜单项
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "设置",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
    },
  ];

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    if (key === "logout") {
      // 处理退出登录逻辑
      console.log("退出登录");
    } else if (key === "profile") {
      router.push("/profile");
    } else if (key === "settings") {
      router.push("/settings");
    }
  };

  return (
    <html lang="zh-CN">
      <body>
        <AntdRegistry>
          <ConfigProvider
            theme={{
              algorithm: theme.defaultAlgorithm,
              token: {
                colorPrimary: "#1677ff",
              },
            }}
          >
            <AntLayout style={{ minHeight: "100vh" }}>
              <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="light"
              >
                <div
                  style={{
                    height: 32,
                    margin: 16,
                    background: "rgba(0, 0, 0, 0.2)",
                  }}
                />
                <Menu
                  mode="inline"
                  selectedKeys={getSelectedMenuKeys()}
                  items={[
                    {
                      key: "home",
                      icon: <HomeOutlined />,
                      label: <Link href="/">首页</Link>,
                    },
                    {
                      key: "posts",
                      icon: <HomeOutlined />,
                      label: <Link href="/posts">文章</Link>,
                    },
                    {
                      key: "categories",
                      icon: <HomeOutlined />,
                      label: <Link href="/categories">分类</Link>,
                    },
                    {
                      key: "about",
                      icon: <HomeOutlined />,
                      label: <Link href="/src/app/(index)/about/about">关于</Link>,
                    },
                  ]}
                />
              </Sider>
              <AntLayout>
                <Header
                  style={{
                    padding: 0,
                    background: "#fff",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    {React.createElement(
                      collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
                      {
                        className: "trigger",
                        onClick: () => setCollapsed(!collapsed),
                        style: {
                          fontSize: "18px",
                          padding: "0 24px",
                          cursor: "pointer",
                        },
                      },
                    )}
                  </div>
                  <div style={{ marginRight: "24px" }}>
                    <Dropdown
                      menu={{
                        items: userMenuItems,
                        onClick: handleUserMenuClick,
                      }}
                      placement="bottomRight"
                    >
                      <Avatar
                        style={{ cursor: "pointer" }}
                        icon={<UserOutlined />}
                      />
                    </Dropdown>
                  </div>
                </Header>
                <Content
                  style={{
                    margin: "24px 16px",
                    padding: 24,
                    minHeight: 280,
                    background: "#fff",
                  }}
                >
                  {children}
                </Content>
                <Footer style={{ textAlign: "center" }}>
                  Blog ©{new Date().getFullYear()} Created by Your Name
                </Footer>
              </AntLayout>
            </AntLayout>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
