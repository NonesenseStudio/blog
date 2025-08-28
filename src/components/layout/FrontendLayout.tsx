"use client";

import Layout from "./AntLayout";
import React, { useState, useEffect } from "react";
import { Layout as AntLayout, Menu, Avatar, Dropdown } from "antd";
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
const { Header, Content } = AntLayout;
import Logo from "@/components/logo";
import { useTheme } from "next-themes";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    let keys: string[] = [];
    if (pathname === "/") keys = ["home"];
    else if (pathname.startsWith("/posts")) keys = ["posts"];
    else if (pathname.startsWith("/categories")) keys = ["categories"];
    else if (pathname.startsWith("/about")) keys = ["about"];
    setSelectedKeys(keys);
  }, [pathname]);

  const tabItems = [
    {
      key: "home",
      label: <Link href="/">首页</Link>,
    },
    {
      key: "posts",
      label: <Link href="/posts">文章</Link>,
    },
    {
      key: "categories",
      label: <Link href="/categories">分类</Link>,
    },
    {
      key: "about",
      label: <Link href="/about">关于 boring</Link>,
    },
  ];
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

  if (!mounted) {
    return null;
  }

  return (
    <Layout>
      <Header
        className="bg-background dark:bg-background"
        style={{
          padding: 0,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          userSelect: "none",
        }}
      >
        <Logo
          className="ml-4"
          fill={resolvedTheme === "dark" ? "#ffffff" : "#000000"}
        />
        <Menu
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={tabItems}
          style={{ flex: 1, minWidth: 0 }}
        />
        <div className="mr-6">
          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick,
            }}
            placement="bottomRight"
          >
            <Avatar style={{ cursor: "pointer" }} icon={<UserOutlined />} />
          </Dropdown>
        </div>
      </Header>
      <Content className="p-6 min-h-70 bg-background dark:bg-background">
        {children}
      </Content>
    </Layout>
  );
}
