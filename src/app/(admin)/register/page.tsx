"use client";

import { Button, Form, Input, Card, Typography, message } from "antd";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter, useSearchParams } from "next/navigation";
import http from "@/lib/http";
import Link from "next/link";
import { useEffect, useState } from "react";

const { Title } = Typography;
export default function RegisterPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const handleSubmit = async (values: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      // 确保密码和确认密码匹配
      if (values.password !== values.confirmPassword) {
        messageApi.error("两次输入的密码不一致");
        return;
      }

      const response = await http.post("/api/auth/register", {
        name: values.name,
        email: values.email,
        password: values.password,
      });

      messageApi.success("注册成功！请登录");

      // 注册成功后跳转到登录页
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error: any) {
      // 处理不同的错误类型
      if (error.response?.data?.errors) {
        // 显示表单验证错误
        const errors = error.response.data.errors;
        errors.forEach((err: any) => {
          messageApi.error(`${err.field}: ${err.message}`);
        });
      } else {
        // 显示一般错误消息
        messageApi.error(
          error.response?.data?.message || "注册失败，请稍后重试",
        );
      }
      console.error("注册失败:", error);
    }
  };

  return type && type === "owner" ? (
    <>
      {contextHolder}
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg dark:shadow-gray-800 dark:bg-gray-800">
          <Title level={2} className="text-center mb-8 dark:text-gray-200">
            用户注册
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="name"
              rules={[
                { required: true, message: "请输入姓名" },
                { min: 2, message: "姓名长度不能小于2位" },
              ]}
              className="mb-6"
            >
              <Input
                prefix={
                  <UserOutlined className="text-gray-400 dark:text-gray-300" />
                }
                placeholder="姓名"
                size="large"
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </Form.Item>

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "请输入邮箱" },
                { type: "email", message: "请输入有效的邮箱地址" },
              ]}
              className="mb-6"
            >
              <Input
                prefix={
                  <MailOutlined className="text-gray-400 dark:text-gray-300" />
                }
                placeholder="邮箱"
                size="large"
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "请输入密码" },
                { min: 6, message: "密码长度不能小于6位" },
              ]}
              className="mb-6"
            >
              <Input
                type="password"
                prefix={
                  <LockOutlined className="text-gray-400 dark:text-gray-300" />
                }
                placeholder="密码"
                size="large"
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </Form.Item>

            <Form.Item
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                { required: true, message: "请确认密码" },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致"));
                  },
                }),
              ]}
              className="mb-6"
            >
              <Input
                type="password"
                prefix={
                  <LockOutlined className="text-gray-400 dark:text-gray-300" />
                }
                placeholder="确认密码"
                size="large"
                className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 mb-4"
              >
                <span className="text-white text-xl">注册</span>
              </Button>

              <div className="text-center">
                <span className="dark:text-gray-400">已有账号？</span>
                <Link
                  href="/login"
                  replace
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 ml-1"
                >
                  立即登录
                </Link>
              </div>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  ) : (
    <div className="min-h-screen flex justify-center items-center">
      <h1>您没有权限访问此页面</h1>
    </div>
  );
}
