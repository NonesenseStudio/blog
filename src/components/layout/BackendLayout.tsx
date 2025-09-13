"use client";

import React from "react";
import {
  ConfigProvider,
  theme,
  Layout as AntLayout,
  Menu,
  Avatar,
  Dropdown,
  MenuProps,
} from "antd";
import {
  HomeOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  FolderOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

const { Header, Sider, Content } = AntLayout;

// 定义菜单项类型，符合 Ant Design 的 MenuProps 类型
type MenuItem = Required<MenuProps>["items"][number];

// 菜单配置
const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    icon: <DashboardOutlined />,
    label: <Link href="/dashboard">仪表盘</Link>,
  },
  {
    key: "content",
    icon: <FileTextOutlined />,
    label: "内容管理",
    children: [
      {
        key: "posts",
        icon: <FileTextOutlined />,
        label: <Link href="/dashboard/content/posts">文章管理</Link>,
      },
      {
        key: "categories",
        icon: <FolderOutlined />,
        label: <Link href="/dashboard/content/categories">分类管理</Link>,
      },
    ],
  },
  {
    key: "about",
    icon: <InfoCircleOutlined />,
    label: <Link href="/about">关于我们</Link>,
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // 递归获取选中的菜单项
  const getSelectedMenuKeys = (items: MenuItem[]): string[] => {
    for (const item of items) {
      // 检查 item 和 item.key 是否存在
      if (
        item &&
        item.key &&
        typeof item.key === "string" &&
        pathname.startsWith(`/${item.key}`)
      ) {
        return [item.key];
      }

      // 检查子菜单
      if (item && "children" in item && item.children) {
        const childKeys = getSelectedMenuKeys(item.children as MenuItem[]);
        if (childKeys.length > 0 && item.key && typeof item.key === "string") {
          return [...childKeys, item.key];
        }
      }
    }
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
      type: "divider" as const,
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
    } else {
      router.push(`/${key}`);
    }
  };

  return (
    <AntLayout style={{ minHeight: "100vh", overflow: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        width={240}
      >
        <div
          style={{
            height: 32,
            margin: 16,
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: 6,
          }}
        />
        <Menu
          mode="inline"
          selectedKeys={getSelectedMenuKeys(menuItems)}
          defaultOpenKeys={getSelectedMenuKeys(menuItems).slice(0, -1)}
          items={menuItems}
          style={{ borderRight: 0 }}
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
            boxShadow: "0 1px 4px rgba(0,0,0,.1)",
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
                  transition: "all 0.2s",
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
              arrow
            >
              <Avatar
                style={{
                  cursor: "pointer",
                  backgroundColor: "#87d068",
                }}
                icon={<UserOutlined />}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          style={{
            margin: "24px",
            padding: 24,
            background: "#fff",
            borderRadius: 6,
            height: "calc(100vh - 88px)", // 减去header高度和上下margin
            overflow: "auto",
          }}
        >
          {children}
        </Content>
      </AntLayout>
    </AntLayout>
  );
}
