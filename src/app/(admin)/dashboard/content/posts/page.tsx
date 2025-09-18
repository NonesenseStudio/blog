"use client";

import React from "react";
import AntCrud from "@/components/UI/AntCrud";
import { Button, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import CategoryTree from "@/app/(admin)/dashboard/content/posts/CategoryTree";

const PostPage = () => {
  const router = useRouter();

  interface ColumnConfig {
    title: string;
    dataIndex: string;
    key: string;
    type?: "text" | "date" | "number";
    render?: (value: any, record: any) => React.ReactNode;
  }

  interface FieldConfig {
    name: string;
    label: string;
    type: "text" | "textarea" | "number" | "select" | "date" | "switch";
    required?: boolean;
    options?: { label: string; value: any }[];
    placeholder?: string;
    rules?: any[];
  }

  interface CrudConfig {
    title: string;
    api: {
      endpoint: string;
      idField?: string;
    };
    columns: ColumnConfig[];
    searchFields?: FieldConfig[];
    formFields: FieldConfig[];
    defaultSort?: {
      field: string;
      order: "asc" | "desc";
    };
  }

  const handleCreate = () => {
    router.push("/dashboard/content/posts/create");
  };

  const categoryConfig: CrudConfig = {
    title: "文章",
    api: {
      endpoint: "/api/posts",
      idField: "id",
    },
    columns: [
      { title: "标题", dataIndex: "title", key: "title", type: "text" },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        type: "text",
      },
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        type: "text",
        render: (status: string) => {
          let colors: any = {
            published: "success",
            draft: "warning",
            archived: "processing",
          };

          return (
            <Tag color={colors[status]}>
              {status === "published"
                ? "已发布"
                : status === "draft"
                  ? "草稿"
                  : "已归档"}
            </Tag>
          );
        },
      },
      {
        title: "发表时间",
        dataIndex: "createdAt",
        key: "createdAt",
        type: "date",
      },
      {
        title: "修改时间",
        dataIndex: "updatedAt",
        key: "updatedAt",
        type: "date",
      },
    ],
    searchFields: [
      {
        name: "keyword",
        label: "关键词",
        type: "text",
        placeholder: "请输入关键词",
      },
    ],
    formFields: [
      { name: "title", label: "标题", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "描述", type: "textarea" },
    ],
    defaultSort: {
      field: "createdAt",
      order: "desc",
    },
  };
  return (
    <div className="flex">
      <CategoryTree />
      <AntCrud
        config={categoryConfig}
        extraButtons={
          <>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleCreate}
            >
              新建文章
            </Button>
          </>
        }
      />
    </div>
  );
};

export default PostPage;
