"use client";

import Layout from "./AntLayout";
import React, { useState, useEffect } from "react";
import {
  Layout as AntLayout,
  Menu,
  Input,
  GetProps,
  Button,
  Drawer,
} from "antd";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
const { Header, Content } = AntLayout;
import Logo from "@/components/logo";
import { useTheme } from "next-themes";
import { MenuOutlined } from "@ant-design/icons";
import MobileTabs from "@/components/layout/Modules/MobileTabs";

type SearchProps = GetProps<typeof Input.Search>;
const { Search } = Input;

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
  const [open, setOpen] = useState(false);

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
      key: "about",
      label: <Link href="/about">关于 boring</Link>,
    },
  ];

  const onSearch: SearchProps["onSearch"] = (value) => {
    router.push(`/posts/search/?key=${value}`);
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
        <div className="mr-6 flex items-center">
          <Search
            placeholder="搜索文章"
            onSearch={onSearch}
            enterButton
            styles={{
              // @ts-ignore
              input: {
                borderRadius: "25px 0 0 25px",
                border: "1px solid #d9d9d9",
                backgroundColor: "transparent",
              },
            }}
          />
          {/*<Button*/}
          {/*  icon={<MenuOutlined />}*/}
          {/*  onClick={() => setOpen(true)}*/}
          {/*></Button>*/}
          {/*<Drawer*/}
          {/*  title="Basic Drawer"*/}
          {/*  closable={{ "aria-label": "Close Button" }}*/}
          {/*  onClose={() => setOpen(false)}*/}
          {/*  open={open}*/}
          {/*  width="100%"*/}
          {/*>*/}
          {/*  <MobileTabs />*/}
          {/*</Drawer>*/}
        </div>
      </Header>
      <Content className="p-6 min-h-70 bg-background dark:bg-background">
        {children}
      </Content>
    </Layout>
  );
}
