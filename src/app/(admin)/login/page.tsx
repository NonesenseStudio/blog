"use client";

import { Button, Form, Input, Card, Typography } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();

  const handleSubmit = () => {
    // 暂时不需要验证，直接跳转到dashboard
    router.push("/dashboard");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-md shadow-lg dark:shadow-gray-800 dark:bg-gray-800">
        <Title level={2} className="text-center mb-8 dark:text-gray-200">
          后台管理系统
        </Title>
        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名" }]}
            className="mb-6"
          >
            <Input
              prefix={
                <UserOutlined className="text-gray-400 dark:text-gray-300" />
              }
              placeholder="用户名"
              size="large"
              className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码" }]}
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
  );
}
