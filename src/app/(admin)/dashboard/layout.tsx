import { AntdRegistry } from "@ant-design/nextjs-registry";
import BackendLayout from "@/components/layout/BackendLayout";
import React from "react";
import "@/app/globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AntdRegistry>
      <BackendLayout>{children}</BackendLayout>
    </AntdRegistry>
  );
}
