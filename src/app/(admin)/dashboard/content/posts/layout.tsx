import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "文章管理",
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
