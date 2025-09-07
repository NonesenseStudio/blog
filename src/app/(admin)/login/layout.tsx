import React from "react";
import type { Metadata } from "next";
import Layout from "@/components/layout/AntLayout";

export const metadata: Metadata = {
  title: "登录",
};
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Layout showLayout={false}>{children}</Layout>;
}
