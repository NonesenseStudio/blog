import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";

interface MarkdownRendererProps {
  content: string;
}

// 扩展 code 组件的属性类型
interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components: Components = {
    code({ inline, className, children, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={tomorrow}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    table({ children }) {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            {children}
          </table>
        </div>
      );
    },
    th({ children }) {
      return (
        <th className="border border-gray-300 px-4 py-2 bg-gray-100 font-semibold text-left">
          {children}
        </th>
      );
    },
    td({ children }) {
      return <td className="border border-gray-300 px-4 py-2">{children}</td>;
    },
  };

  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
