"use client";

import React from "react";
import AntCrud from "@/components/UI/AntCrud";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

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
      { title: "名称", dataIndex: "name", key: "name", type: "text" },
      { title: "Slug", dataIndex: "slug", key: "slug", type: "text" },
      {
        title: "描述",
        dataIndex: "description",
        key: "description",
        type: "text",
      },
      {
        title: "创建时间",
        dataIndex: "createdAt",
        key: "createdAt",
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
      { name: "name", label: "名称", type: "text", required: true },
      { name: "slug", label: "Slug", type: "text", required: true },
      { name: "description", label: "描述", type: "textarea" },
    ],
    defaultSort: {
      field: "createdAt",
      order: "desc",
    },
  };
  return (
    <AntCrud
      config={categoryConfig}
      extraButtons={
        <>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建文章
          </Button>
        </>
      }
    />
  );
};

export default PostPage;
