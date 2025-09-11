// pages/users/index.tsx
import React from "react";
import { Input, Select } from "antd";
import AntCrud from "@/components/UI/AntCrud";

const UsersPage = () => {
  // 定义表格列
  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
    },
  ];

  // 搜索字段配置
  const searchFields = [
    {
      name: "name",
      label: "姓名",
      component: <Input placeholder="请输入姓名" />,
    },
    {
      name: "role",
      label: "角色",
      component: (
        <Select placeholder="请选择角色">
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">普通用户</Select.Option>
        </Select>
      ),
    },
  ];

  // 表单字段配置
  const formFields = [
    {
      name: "name",
      label: "姓名",
      rules: [{ required: true, message: "请输入姓名" }],
      component: <Input placeholder="请输入姓名" />,
    },
    {
      name: "email",
      label: "邮箱",
      rules: [
        { required: true, message: "请输入邮箱" },
        { type: "email", message: "邮箱格式不正确" },
      ],
      component: <Input placeholder="请输入邮箱" />,
    },
    {
      name: "role",
      label: "角色",
      rules: [{ required: true, message: "请选择角色" }],
      component: (
        <Select placeholder="请选择角色">
          <Select.Option value="admin">管理员</Select.Option>
          <Select.Option value="user">普通用户</Select.Option>
        </Select>
      ),
    },
  ];

  return (
    <AntCrud
      resourceName="categories"
      columns={columns}
      searchFields={searchFields}
      formFields={formFields}
      pageSize={10}
    />
  );
};

export default UsersPage;
