"use client";

import React from "react";
import AntdMarkdown from "@/components/UI/AntdMarkdown";

interface AboutClientProps {
  markdownContent: string;
}

export default function AboutClient({ markdownContent }: AboutClientProps) {
  return <AntdMarkdown content={markdownContent} />;
}
