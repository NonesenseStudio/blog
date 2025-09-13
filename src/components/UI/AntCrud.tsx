"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  message,
  Card,
  Row,
  Col,
  Popconfirm,
  Select,
  DatePicker,
  InputNumber,
  Switch,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import type { TableProps } from "antd";
import { ColumnsType } from "antd/es/table";

// 类型定义
interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "select" | "date" | "switch";
  required?: boolean;
  options?: { label: string; value: any }[];
  placeholder?: string;
  rules?: any[];
}

interface ColumnConfig {
  title: string;
  dataIndex: string;
  key: string;
  type?: "text" | "date" | "number";
  render?: (value: any, record: any) => React.ReactNode;
}

interface ApiConfig {
  endpoint: string;
  idField?: string;
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

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface ApiResponse<T> {
  data: T[];
  pagination: PaginationData;
}

// 新增：操作按钮插槽类型
interface ActionButtonsProps {
  record: any;
  onEdit: (record: any) => void;
  onDelete: (record: any) => void;
}

interface AntCrudProps {
  config: CrudConfig;
  actionButtons?: React.FC<ActionButtonsProps>;
  extraButtons?: React.ReactNode;
}

const AntCrud: React.FC<AntCrudProps> = ({
  config,
  actionButtons,
  extraButtons,
}) => {
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [messageApi, contextHolder] = message.useMessage();

  // 使用 ref 存储分页状态，避免依赖问题
  const paginationRef = useRef(pagination);
  paginationRef.current = pagination;

  // 渲染表单字段
  const renderFormField = (field: FieldConfig) => {
    const commonProps = {
      placeholder: field.placeholder,
    };

    switch (field.type) {
      case "textarea":
        return <Input.TextArea {...commonProps} />;
      case "number":
        return <InputNumber {...commonProps} style={{ width: "100%" }} />;
      case "select":
        return <Select {...commonProps} options={field.options} />;
      case "date":
        return <DatePicker {...commonProps} style={{ width: "100%" }} />;
      case "switch":
        return <Switch />;
      default:
        return <Input {...commonProps} />;
    }
  };

  // 获取列表数据
  const fetchData = useCallback(
    async (params: any = {}) => {
      setLoading(true);
      try {
        const queryParams = {
          query: true,
          page: params.page || paginationRef.current.current,
          pageSize: params.pageSize || paginationRef.current.pageSize,
          ...params,
          ...(config.defaultSort && {
            sortBy: config.defaultSort.field,
            sortOrder: config.defaultSort.order,
          }),
        };

        const response = await fetch(config.api.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(queryParams),
        });

        if (!response.ok) {
          throw new Error("请求失败");
        }

        const result: ApiResponse<any> = await response.json();
        setData(result.data);
        setPagination((prev) => ({
          ...prev,
          total: result.pagination.total,
        }));
      } catch (error) {
        messageApi.error("获取数据失败");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [config.api.endpoint, config.defaultSort, messageApi],
  );

  // 初始化加载数据
  useEffect(() => {
    fetchData().then((r) => r);
  }, [fetchData]);

  // 处理搜索
  const handleSearch = (values: any) => {
    setPagination((prev) => ({ ...prev, current: 1 })); // 重置到第一页
    fetchData(values);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setPagination((prev) => ({ ...prev, current: 1 })); // 重置到第一页
    fetchData();
  };

  // 创建记录
  const handleCreate = () => {
    setEditingRecord(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 编辑记录
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  // 删除记录
  const handleDelete = async (record: any) => {
    try {
      const response = await fetch(
        `${config.api.endpoint}/${record[config.api.idField || "id"]}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("删除失败");
      }

      messageApi.success("删除成功");
      // 如果当前页只有一条数据，删除后返回上一页
      const newPage =
        data.length === 1 && pagination.current > 1
          ? pagination.current - 1
          : pagination.current;
      setPagination((prev) => ({ ...prev, current: newPage }));
      await fetchData({ page: newPage });
    } catch (error) {
      messageApi.error("删除失败");
      console.error("Error deleting record:", error);
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      const url = editingRecord
        ? `${config.api.endpoint}/${editingRecord[config.api.idField || "id"]}`
        : config.api.endpoint;

      const response = await fetch(url, {
        method: editingRecord ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error(editingRecord ? "更新失败" : "创建失败");
      }

      messageApi.success(editingRecord ? "更新成功" : "创建成功");
      setModalVisible(false);
      await fetchData();
    } catch (error) {
      messageApi.error(editingRecord ? "更新失败" : "创建失败");
      console.error("Error submitting form:", error);
    }
  };

  // 处理分页变化
  const handleTableChange: TableProps<any>["onChange"] = (pag) => {
    const newPagination = {
      total: paginationRef.current.total,
      current: pag.current!,
      pageSize: pag.pageSize!,
    };
    setPagination(newPagination);
    fetchData({
      page: pag.current,
      pageSize: pag.pageSize,
    }).then((r) => r);
  };

  // 添加操作列
  const actionColumn: ColumnsType<any>[0] = {
    title: "操作",
    key: "actions",
    fixed: "right" as const,
    width: 120,
    render: (_: any, record: any) => (
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
  const tableColumns: ColumnsType<any> = [
    ...config.columns.map((col) => ({
      ...col,
      render:
        col.render ||
        ((value: any) => {
          if (col.type === "date") {
            return value ? new Date(value).toLocaleString() : "-";
          }
          return value ?? "-";
        }),
    })),
    actionColumn,
  ];

  return (
    <>
      {contextHolder}
      <Card>
        {/* 搜索栏 */}
        {config.searchFields && config.searchFields.length > 0 && (
          <Form
            form={searchForm}
            onFinish={handleSearch}
            layout="inline"
            style={{ marginBottom: 16 }}
          >
            <Row gutter={16} style={{ width: "100%" }}>
              {config.searchFields.map((field) => (
                <Col key={field.name} span={8}>
                  <Form.Item
                    name={field.name}
                    label={field.label}
                    rules={field.rules}
                  >
                    {renderFormField(field)}
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
            {extraButtons || (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreate}
              >
                新建{config.title}
              </Button>
            )}
          </Space>
        </div>
        {/* 数据表格 */}
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey={config.api.idField || "id"}
          loading={loading}
          onChange={handleTableChange}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
        {/* 编辑模态框 */}
        <Modal
          title={editingRecord ? `编辑${config.title}` : `新建${config.title}`}
          open={modalVisible}
          onCancel={() => {
            setModalVisible(false);
            form.resetFields();
          }}
          footer={null}
          width={600}
          destroyOnHidden
          forceRender
        >
          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
            preserve={false}
          >
            {config.formFields.map((field) => (
              <Form.Item
                key={field.name}
                name={field.name}
                label={field.label}
                rules={[
                  { required: field.required, message: `请输入${field.label}` },
                  ...(field.rules || []),
                ]}
              >
                {renderFormField(field)}
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
    </>
  );
};

export default AntCrud;
