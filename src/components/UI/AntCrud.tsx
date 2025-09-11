"use client";

import React, { useState, useEffect } from "react";
import "@ant-design/v5-patch-for-react-19";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  message,
  Card,
  Row,
  Col,
  InputNumber,
  Switch,
  Popconfirm,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { TableProps, FormProps } from "antd";

// 类型定义
interface ApiResponse<T> {
  data: T[];
  total?: number;
}

interface ApiConfig {
  list?: string | ((params: any) => Promise<any>);
  create?: string | ((values: any) => Promise<any>);
  update?: string | ((id: string | number, values: any) => Promise<any>);
  delete?: string | ((id: string | number) => Promise<any>);
  get?: string | ((id: string | number) => Promise<any>);
}

interface GenericCrudProps<T> {
  // 资源名称（用于自动生成API端点）
  resourceName: string;

  // API配置（可覆盖默认行为）
  apiConfig?: ApiConfig;

  // 数据相关
  dataSource?: T[];
  loading?: boolean;
  total?: number;

  // 列配置
  columns: any[];

  // 搜索表单配置
  searchFields?: any[];

  // 编辑表单配置
  formFields?: any[];

  // 自定义操作
  customActions?: React.ReactNode;

  // 分页配置
  pageSize?: number;
  showPagination?: boolean;

  // 事件钩子（允许完全自定义API操作）
  onFetch?: (params: any) => Promise<T[] | { data: T[]; total: number }>;
  onCreate?: (values: Partial<T>) => Promise<T>;
  onUpdate?: (id: string | number, values: Partial<T>) => Promise<T>;
  onDelete?: (id: string | number) => Promise<void>;
  onGet?: (id: string | number) => Promise<T>;
}

const AntCrud = <T extends { id?: string | number }>({
  resourceName,
  apiConfig = {},
  dataSource: externalDataSource,
  loading: externalLoading = false,
  total: externalTotal = 0,
  columns,
  searchFields = [],
  formFields = [],
  customActions,
  pageSize = 10,
  showPagination = true,
  onFetch,
  onCreate,
  onUpdate,
  onDelete,
  onGet,
}: GenericCrudProps<T>) => {
  const [searchForm] = Form.useForm();
  const [editForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<T | null>(null);
  const [searchParams, setSearchParams] = useState<Record<string, any>>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize,
  });
  const [internalData, setInternalData] = useState<T[]>([]);
  const [internalTotal, setInternalTotal] = useState(0);
  const [internalLoading, setInternalLoading] = useState(false);

  // 判断是否使用内部状态管理
  const useInternalState = !externalDataSource && !onFetch;
  const dataSource = useInternalState ? internalData : externalDataSource || [];
  const loading = useInternalState ? internalLoading : externalLoading;
  const total = useInternalState ? internalTotal : externalTotal || 0;

  // 默认API端点生成
  const defaultApiEndpoints = {
    list: `/api/${resourceName}`,
    create: `/api/${resourceName}`,
    update: (id: string | number) => `/api/${resourceName}/${id}`,
    delete: (id: string | number) => `/api/${resourceName}/${id}`,
    get: (id: string | number) => `/api/${resourceName}/${id}`,
  };

  // API调用方法
  const apiCall = {
    // 获取列表
    fetch: async (params: any = {}): Promise<T[] | ApiResponse<T>> => {
      if (onFetch) {
        return onFetch({
          ...params,
          page: pagination.current,
          pageSize: pagination.pageSize,
        });
      }

      const endpoint = apiConfig.list || defaultApiEndpoints.list;
      let url = endpoint as string;
      let queryParams = { ...params };
      // 处理分页参数
      if (showPagination) {
        queryParams = {
          ...queryParams,
          page: pagination.current,
          pageSize: pagination.pageSize,
        };
      }

      // 构建查询字符串
      const queryString = new URLSearchParams(queryParams).toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Fetch error:", error);
        throw error;
      }
    },

    // 创建记录
    create: async (values: Partial<T>) => {
      if (onCreate) {
        return onCreate(values);
      }

      const endpoint = apiConfig.create || defaultApiEndpoints.create;
      let url =
        typeof endpoint === "function" ? await endpoint(values) : endpoint;

      try {
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Create error:", error);
        throw error;
      }
    },

    // 更新记录
    update: async (id: string | number, values: Partial<T>) => {
      if (onUpdate) {
        return onUpdate(id, values);
      }

      const endpoint = apiConfig.update || defaultApiEndpoints.update(id);
      let url =
        typeof endpoint === "function" ? await endpoint(id, values) : endpoint;

      try {
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Update error:", error);
        throw error;
      }
    },

    // 删除记录
    delete: async (id: string | number) => {
      if (onDelete) {
        return onDelete(id);
      }

      const endpoint = apiConfig.delete || defaultApiEndpoints.delete(id);
      let url = typeof endpoint === "function" ? await endpoint(id) : endpoint;

      try {
        const response = await fetch(url, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        console.error("Delete error:", error);
        throw error;
      }
    },

    // 获取单条记录
    get: async (id: string | number): Promise<T> => {
      if (onGet) {
        return onGet(id);
      }

      const endpoint = apiConfig.get || defaultApiEndpoints.get(id);
      let url = typeof endpoint === "function" ? await endpoint(id) : endpoint;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json() as Promise<T>;
      } catch (error) {
        console.error("Get error:", error);
        throw error;
      }
    },
  };

  // 获取数据
  useEffect(() => {
    if (useInternalState) {
      fetchData().catch((error) => {
        console.error("Failed to fetch data:", error);
        message.error("获取数据失败");
      });
    }
  }, [pagination, searchParams, useInternalState]);

  const fetchData = async () => {
    setInternalLoading(true);
    try {
      const result = await apiCall.fetch(searchParams);

      if (useInternalState) {
        if (Array.isArray(result)) {
          setInternalData(result);
          setInternalTotal(result.length);
        } else {
          // 现在 TypeScript 知道 result 有 data 属性
          const apiResponse = result as ApiResponse<T>;
          setInternalData(apiResponse.data);
          setInternalTotal(apiResponse.total || apiResponse.data.length);
        }
      }
    } catch (error) {
      message.error("获取数据失败");
      console.error("Error fetching data:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setPagination({ ...pagination, current: 1 });
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setSearchParams({});
    setPagination({ ...pagination, current: 1 });
  };

  // 创建记录
  const handleCreate = () => {
    setEditingRecord(null);
    editForm.resetFields();
    setModalVisible(true);
  };

  // 编辑记录
  const handleEdit = async (record: T) => {
    try {
      setInternalLoading(true);
      let fullRecord: T;
      if (record.id) {
        fullRecord = await apiCall.get(record.id);
      } else {
        fullRecord = record;
      }
      setEditingRecord(fullRecord);
      editForm.setFieldsValue(fullRecord);
      setModalVisible(true);
    } catch (error) {
      message.error("获取详情失败");
      console.error("Error fetching detail:", error);
    } finally {
      setInternalLoading(false);
    }
  };

  // 删除记录
  const handleDelete = async (record: T) => {
    if (!record.id) {
      message.error("记录ID不存在");
      return;
    }

    try {
      await apiCall.delete(record.id);
      message.success("删除成功");
      fetchData().catch((error) => {
        console.error("Failed to fetch data after delete:", error);
        message.error("刷新数据失败");
      }); // 刷新数据
    } catch (error) {
      message.error("删除失败");
      console.error("Error deleting record:", error);
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingRecord && editingRecord.id) {
        await apiCall.update(editingRecord.id, values);
        message.success("更新成功");
      } else {
        await apiCall.create(values);
        message.success("创建成功");
      }
      setModalVisible(false);
      fetchData().catch((error) => {
        console.error("Failed to fetch data after submit:", error);
        message.error("刷新数据失败");
      }); // 刷新数据
    } catch (error) {
      message.error(editingRecord ? "更新失败" : "创建失败");
      console.error("Error submitting form:", error);
    }
  };

  // 处理分页变化
  const handleTableChange: TableProps<T>["onChange"] = (pag) => {
    setPagination({
      current: pag.current!,
      pageSize: pag.pageSize!,
    });
  };

  // 添加操作列
  const actionColumn = {
    title: "操作",
    key: "actions",
    fixed: "right",
    width: 120,
    render: (_: any, record: T) => (
      <Space size="middle">
        <Button
          type="link"
          icon={<EditOutlined />}
          onClick={() => handleEdit(record)}
        >
          编辑
        </Button>
        <Popconfirm
          title="确定要删除吗？"
          onConfirm={() => handleDelete(record)}
          okText="确定"
          cancelText="取消"
        >
          <Button type="link" danger icon={<DeleteOutlined />}>
            删除
          </Button>
        </Popconfirm>
      </Space>
    ),
  };

  // 表格列配置
  const tableColumns = [...columns, actionColumn];

  return (
    <Card>
      {/* 搜索栏 */}
      {searchFields.length > 0 && (
        <Form
          form={searchForm}
          onFinish={handleSearch}
          layout="inline"
          style={{ marginBottom: 16 }}
        >
          <Row gutter={16} style={{ width: "100%" }}>
            {searchFields.map((field) => (
              <Col key={field.name} span={8}>
                <Form.Item name={field.name} label={field.label}>
                  {field.component}
                </Form.Item>
              </Col>
            ))}
            <Col span={8}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  搜索
                </Button>
                <Button onClick={handleReset} icon={<ReloadOutlined />}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      )}

      {/* 操作按钮 */}
      <div style={{ marginBottom: 16 }}>
        <Space>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建
          </Button>
          {customActions}
        </Space>
      </div>

      {/* 数据表格 */}
      <Table
        columns={tableColumns}
        dataSource={dataSource}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        pagination={
          showPagination
            ? {
                current: pagination.current,
                pageSize: pagination.pageSize,
                total,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) =>
                  `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
              }
            : false
        }
      />

      {/* 编辑模态框 */}
      <Modal
        title={editingRecord ? "编辑记录" : "新建记录"}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
        destroyOnHidden
        forceRender
      >
        <Form
          form={editForm}
          onFinish={handleSubmit}
          layout="vertical"
          preserve={false}
        >
          {formFields.map((field) => (
            <Form.Item
              key={field.name}
              name={field.name}
              label={field.label}
              rules={field.rules}
              valuePropName={field.valuePropName || "value"}
            >
              {field.component}
            </Form.Item>
          ))}
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingRecord ? "更新" : "创建"}
              </Button>
              <Button onClick={() => setModalVisible(false)}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default AntCrud;
