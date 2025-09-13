import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "分类管理",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
