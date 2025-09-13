"use client";

import React, { useState, useEffect } from "react";
import { Form, Input, Button, TreeSelect, Select, message, Space } from "antd";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { ArrowLeftOutlined, LoadingOutlined } from "@ant-design/icons";
import http from "@/lib/http";

// 动态导入 MDEditor 以避免 SSR 问题
const MDEditor = dynamic(
  () => import("@uiw/react-md-editor").then((mod) => mod.default),
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

  const [treeData, setTreeData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 获取分类数据并转换为树形结构
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await http.get("/api/categories");
      const categories = response.data;

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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories().then((r) => r);
  }, []);
  const handleSubmit = async (values: ArticleForm) => {
    console.log(values, content);
    const { status } = values;
    if (!content) {
      message.error("请输入文章内容");
      return;
    }

    setSubmitting(true);
    try {
      const response = await http.post("/api/posts", {
        ...values,
        content,
      });
      if (!response.ok) {
        throw new Error("Failed to create article");
      }
      message.success("文章创建成功！");
      router.push("/dashboard/content/posts");
    } catch (error) {
      message.error("创建文章失败，请重试");
      console.error("Error creating article:", error);
    } finally {
      setSubmitting(false);
    }
  };

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
            <Form.Item
              name="categories"
              // rules={[{ required: true, message: "请选择文章分类" }]}
              style={{ width: " 20%" }}
            >
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
          <Form.Item label="内容" required>
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || "")}
              height={600}
              visibleDragbar={false}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
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
