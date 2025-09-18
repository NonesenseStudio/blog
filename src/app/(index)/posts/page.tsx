"use client";

import { Layout } from "antd";

const { Sider, Content } = Layout;

export default function Posts() {
  const layoutStyle = {
    height: "100%",
  };
  const siderStyle = {
    height: "100%",
    backgroundColor: "#fff",
  };
  return (
    <Layout style={layoutStyle}>
      <Sider width="10%" style={siderStyle}>
        Sider
      </Sider>
      <Content>Content</Content>
    </Layout>
  );
}
