"use client";

import React, { useEffect, useState } from "react";
import { Button, Form, Input, message, Select, Space, TreeSelect } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import http from "@/lib/http";
import { useCategoryStore } from "@/stores";
// 动态导入 MDEditor 以避免 SSR 问题
const MDEditor = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      // 确保只在客户端渲染
      if (typeof window === "undefined") {
        return () => null;
      }
      return mod.default;
    }),
  {
    ssr: false,
    loading: () => (
      <p>
        <LoadingOutlined /> 编辑器加载中...
      </p>
    ),
  },
);

const { Option } = Select;
const { TextArea } = Input;

interface ArticleForm {
  title: string;
  description: string;
  content: string;
  status: "draft" | "published" | "archived";
  categories: string;
}

interface Category {
  id: string;
  name: string;
  parentId: string | null;
}

const NewArticlePage: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();
  const { SHOW_PARENT } = TreeSelect;
  const { categories } = useCategoryStore();

  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);

  // 确保只在客户端渲染
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 获取分类数据并转换为树形结构
  const fetchCategories = async () => {
    if (!isClient) return; // 确保只在客户端执行

    setLoading(true);
    try {
      // 将扁平数据转换为树形结构
      const buildTree = (
        items: Category[],
        parentId: string | null = null,
      ): any[] => {
        return items
          .filter((item) => item.parentId === parentId)
          .map((item) => ({
            title: item.name,
            value: item.id,
            key: item.id,
            children: buildTree(items, item.id),
          }));
      };

      setTreeData(buildTree(categories));
    } catch (error) {
      console.error("获取分类数据失败:", error);
      setHasError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isClient) {
      fetchCategories();
    }
  }, [isClient]);

  const handleSubmit = async (values: ArticleForm) => {
    if (!content) {
      message.error("请输入文章内容");
      return;
    }

    setSubmitting(true);
    try {
      await http.post("/api/posts", {
        ...values,
        content,
      });
      message.success("文章创建成功！");
      router.push("/dashboard/content/posts");
    } catch (error) {
      message.error("创建文章失败，请重试");
      console.error("Error creating article:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // 错误状态处理
  if (hasError) {
    return (
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div>加载失败，请刷新页面重试</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <Space direction="vertical" className="w-full">
        <Button
          icon={<ArrowLeftOutlined />}
          type="text"
          onClick={() => {
            router.push("/dashboard/content/posts");
          }}
        >
          返回上一页
        </Button>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: "draft",
          }}
        >
          <div className="flex">
            <Form.Item name="categories" style={{ width: "20%" }}>
              <TreeSelect
                treeData={treeData}
                loading={loading}
                placeholder="请选择文章分类"
                treeDefaultExpandAll
                showCheckedStrategy={SHOW_PARENT}
                allowClear
                multiple
              />
            </Form.Item>
            <Form.Item
              name="title"
              rules={[{ required: true, message: "请输入文章标题" }]}
              className="w-full"
            >
              <Input placeholder="请输入文章标题" />
            </Form.Item>
          </div>
          <Form.Item name="description" label="描述">
            <TextArea rows={3} placeholder="请输入文章描述" />
          </Form.Item>
          <Form.Item name="status" hidden>
            <Input />
          </Form.Item>

          {/* 只在客户端渲染编辑器 */}
          {isClient && (
            <Form.Item label="内容" required>
              <MDEditor
                value={content}
                onChange={(value) => setContent(value || "")}
                height={600}
                visibleDragbar={false}
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button
              type="primary"
              loading={submitting}
              style={{ marginRight: 8 }}
              onClick={() => {
                form.setFieldsValue({ status: "published" });
                form.submit();
              }}
            >
              {submitting ? "保存中..." : "发表文章"}
            </Button>
            <Button
              loading={submitting}
              onClick={() => {
                form.setFieldsValue({ status: "draft" });
                form.submit();
              }}
            >
              {submitting ? "保存中..." : "保存草稿"}
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  );
};

export default NewArticlePage;
