"use client";

import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Typography, Divider } from "antd";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";
const { Title, Paragraph, Text, Link } = Typography;

// 动态导入 ReactMarkdown 以避免服务器端渲染问题
const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div>Loading...</div>,
});

interface AntdMarkdownProps {
  content: string;
  className?: string;
}

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

export default function AntdMarkdown({
  content,
  className = "",
}: AntdMarkdownProps) {
  // 使用 ref 来跟踪组件状态
  const isMounted = useRef(true);
  const markdownRef = useRef<HTMLDivElement>(null);

  // 深拷贝样式对象，避免引用问题
  const codeStyle = React.useMemo(
    () => JSON.parse(JSON.stringify(tomorrow)),
    [],
  );

  // 使用 useMemo 优化组件渲染
  const components = React.useMemo(
    () => ({
      p: ({ ...props }: any) => <Paragraph {...props} />,

      h1: ({ ...props }: any) => <Title level={1} {...props} />,
      h2: ({ ...props }: any) => <Title level={2} {...props} />,
      h3: ({ ...props }: any) => <Title level={3} {...props} />,
      h4: ({ ...props }: any) => <Title level={4} {...props} />,
      h5: ({ ...props }: any) => <Title level={5} {...props} />,
      h6: ({ ...props }: any) => <Title level={5} {...props} />,
      hr: ({ ...props }: any) => <Divider {...props} />,

      code: ({ inline, className, children, ...props }: CodeProps) => {
        const match = /language-(\w+)/.exec(className || "");
        if (!inline && match) {
          return (
            <SyntaxHighlighter
              style={codeStyle}
              language={match[1]}
              PreTag="div"
              {...props}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        }
        return (
          <Text code {...props}>
            {children}
          </Text>
        );
      },

      a: ({ href, title, children }: any) => (
        <Link
          href={href}
          title={title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {children}
        </Link>
      ),

      blockquote: ({ children, ...props }: any) => {
        const safeProps: React.HTMLAttributes<HTMLDivElement> = {
          className: props.className,
          id: props.id,
          style: {
            borderLeft: "4px solid #1890ff",
            paddingLeft: 16,
            margin: "16px 0",
            background: "#f9f9f9",
            fontStyle: "italic",
            ...props.style,
          },
        };

        return <div {...safeProps}>{children}</div>;
      },

      ul: ({ ...props }: any) => <ul {...props} style={{ paddingLeft: 20 }} />,
      ol: ({ ...props }: any) => <ol {...props} style={{ paddingLeft: 20 }} />,
      li: ({ ...props }: any) => <li {...props} />,
      strong: ({ ...props }: any) => <strong {...props} />,
      em: ({ ...props }: any) => <em {...props} />,
      table: ({ ...props }: any) => (
        <div style={{ overflowX: "auto" }}>
          <table
            {...props}
            style={{ width: "100%", borderCollapse: "collapse" }}
          />
        </div>
      ),
      th: ({ ...props }: any) => (
        <th
          {...props}
          style={{
            border: "1px solid #ddd",
            padding: "8px",
            textAlign: "left",
          }}
        />
      ),
      td: ({ ...props }: any) => (
        <td {...props} style={{ border: "1px solid #ddd", padding: "8px" }} />
      ),
    }),
    [codeStyle],
  );

  // 添加清理逻辑
  useEffect(() => {
    return () => {
      // 标记组件已卸载
      isMounted.current = false;

      // 清理 DOM 节点
      if (markdownRef.current) {
        // 移除所有事件监听器
        const clone = markdownRef.current.cloneNode(false);
        if (markdownRef.current.parentNode) {
          markdownRef.current.parentNode.replaceChild(
            clone,
            markdownRef.current,
          );
        }
      }

      // 清理语法高亮器的缓存
      if (typeof SyntaxHighlighter !== "undefined") {
        // 清理 Prism 的内部状态
        (SyntaxHighlighter as any).highlight = null;
        (SyntaxHighlighter as any).languages = {};
      }
    };
  }, []);

  // 处理内容更新
  useEffect(() => {
    if (!isMounted.current) return;

    // 可以在这里添加内容更新时的处理逻辑
  }, [content]);

  return (
    <div ref={markdownRef} className={className}>
      <ReactMarkdown
        components={components}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
