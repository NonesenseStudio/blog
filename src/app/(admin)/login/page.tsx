"use client";

import { Button, Form, Input, Card, Typography, message } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import http from "@/lib/http";
import { useEffect } from "react";
import Cookies from "js-cookie";

const { Title } = Typography;
export default function LoginPage() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const [form] = Form.useForm();

  // 检查 cookie 是否存在且有效
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      // 验证 token 是否有效
      http
        .get("/api/auth/verify-token", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(() => {
          router.push("/dashboard");
        })
        .catch(() => {
          // token 无效，清除 cookie
          Cookies.remove("token");
        });
    }
  }, [router]);

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await http.post("/api/auth/login", {
        email: values.email,
        password: values.password,
      });

      const { token } = response.data;

      Cookies.set("token", token, { expires: 7 });

      router.push("/dashboard");
    } catch (error) {
      messageApi.error("登录失败，请检查邮箱和密码是否正确");
      console.error("登录失败:", error);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Card className="w-full max-w-md shadow-lg dark:shadow-gray-800 dark:bg-gray-800">
          <Title level={2} className="text-center mb-8 dark:text-gray-200">
            后台管理系统
          </Title>
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                  <UserOutlined className="text-gray-400 dark:text-gray-300" />
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

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                className="h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <span className="text-white text-xl">登录</span>
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </>
  );
}
