// src/app/articles/new/page.tsx
'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Select, message, Card } from 'antd';
import dynamic from 'next/dynamic';
import { useRouter } from "next/navigation";

// 动态导入 MDEditor 以避免 SSR 问题
const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

const { Option } = Select;
const { TextArea } = Input;

interface ArticleForm {
  title: string;
  description: string;
  content: string;
  status: 'draft' | 'published' | 'archived';
}

const NewArticlePage: React.FC = () => {
  const [form] = Form.useForm();
  const [content, setContent] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (values: ArticleForm) => {
    setSubmitting(true);
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          content,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create article');
      }

      message.success('文章创建成功！');
      router.push('/articles');
    } catch (error) {
      message.error('创建文章失败，请重试');
      console.error('Error creating article:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      <Card title="新建文章">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'draft',
          }}
        >
          <Form.Item
            name="title"
            label="标题"
            rules={[{ required: true, message: '请输入文章标题' }]}
          >
            <Input placeholder="请输入文章标题" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <TextArea
              rows={3}
              placeholder="请输入文章描述"
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="draft">草稿</Option>
              <Option value="published">已发布</Option>
              <Option value="archived">已归档</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="内容"
            rules={[{ required: true, message: '请输入文章内容' }]}
          >
            <MDEditor
              value={content}
              onChange={(value) => setContent(value || '')}
              height={600}
              visibleDragbar={false}
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={submitting}>
              {submitting ? '保存中...' : '保存文章'}
            </Button>
            <Button>保存草稿</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default NewArticlePage;
