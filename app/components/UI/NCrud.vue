<template>
  <n-layout has-sider style="height: 100%" content-style="padding:24px">
    <!-- 侧边栏 -->
    <n-layout-sider
      v-if="hasSider"
      :width="240"
      :collapsed-width="64"
      :collapsed="collapsed"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
    >
      <div class="p-4 h-full overflow-y-auto">
        <slot name="sider"></slot>
      </div>
    </n-layout-sider>

    <!-- 主内容区 -->
    <n-layout>
      <n-card>
        <n-space align="center" justify="space-between">
          <n-space>
            <n-input
              v-model:value="searchText"
              placeholder="搜索..."
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <n-icon><search-outline /></n-icon>
              </template>
            </n-input>
            <n-button type="primary" @click="handleSearch">搜索</n-button>
          </n-space>
          <n-button type="primary" @click="openCreateModal">
            <template #icon>
              <n-icon><add-outline /></n-icon>
            </template>
            新建{{ title }}
          </n-button>
        </n-space>
      </n-card>

      <!-- 数据表格 -->
      <n-card class="mt-4">
        <n-data-table
          :columns="columns"
          :data="tableData"
          :loading="loading"
          :pagination="pagination"
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
        />
      </n-card>
    </n-layout>

    <!-- 创建/编辑模态框 -->
    <n-modal
      v-model:show="showModal"
      :title="action === 'create' ? '新建' : '编辑'"
      preset="card"
      style="width: 600px"
      :mask-closable="false"
    >
      <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        require-mark-placement="right-hanging"
      >
        <slot name="form" :form-data="formData"></slot>
      </n-form>
      <template #footer>
        <n-space justify="end">
          <n-button @click="closeModal">取消</n-button>
          <n-button type="primary" :loading="submitting" @click="handleSubmit">
            确定
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </n-layout>
</template>

<script setup lang="ts">
import { message } from "~/utils";
import { AddOutline, SearchOutline } from "@vicons/ionicons5";
import { NButton, NIcon } from "naive-ui";
import { useAsyncData } from "#app";

// 接口定义
export interface QueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "name";
  sortOrder?: "asc" | "desc";
}

export interface CrudItem {
  id: string | number;
  [key: string]: any;
}

export interface ApiResponse {
  data: CrudItem[];
  total: number;
}
// Props 定义
interface Props {
  keyword: string;
  columns: any[];
  formRules?: any;
  initialFormData?: any;
  hasSider?: boolean;
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  keyword: "",
  columns: () => [],
  formRules: () => ({}),
  initialFormData: () => ({}),
  hasSider: false,
  title: "",
});
// 组件状态
const loading = ref(false);
const submitting = ref(false);
const deleting = ref(false);
const searchText = ref("");
const tableData = ref<CrudItem[]>([]);
const showModal = ref(false);
const currentEditId = ref<string | number | null>(null);
const action = ref<"create" | "edit">("create");
const formRef = ref<any>(null);
const collapsed = ref(false);

// 表单数据
const formData = reactive<CrudItem>(
  props.initialFormData || {
    id: "",
    name: "",
    // 其他默认字段
  },
);

// 分页配置
const pagination = reactive({
  page: 1,
  pageSize: 10,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100],
});

// 查询参数
const queryParams = computed<QueryParams>(() => ({
  page: pagination.page,
  pageSize: pagination.pageSize,
  search: searchText.value,
  sortBy: "createdAt",
  sortOrder: "desc",
}));

// 使用 useAsyncData 获取初始数据
const { data: initialData, refresh } = await useAsyncData<ApiResponse>(
  `${props.keyword}-data`,
  () =>
    $fetch(`/api/dashboard/${props.keyword}/query`, {
      method: "POST",
      body: queryParams.value,
    }),
  {
    watch: [queryParams],
    transform: (response: any) => ({
      data: response.data || [],
      total: response.total || 0,
    }),
  },
);

// 初始化表格数据
watchEffect(() => {
  if (initialData.value) {
    tableData.value = initialData.value.data;
    pagination.itemCount = initialData.value.total;
  }
});

// API 请求函数 - 使用 $fetch 处理客户端交互
const apiRequest = async (endpoint: string, options: any = {}) => {
  const url = `/api/dashboard/${props.keyword}${endpoint}`;

  try {
    return await $fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error: any) {
    console.error("API请求错误:", error);
    message.error(
      error?.message || error?.data?.message || "请求失败，请稍后重试",
    );
    throw error;
  }
};

const fetchData = async () => {
  loading.value = true;
  try {
    await refresh();
  } catch (error) {
    // 错误已在 apiRequest 中处理
  } finally {
    loading.value = false;
  }
};

// 搜索处理
const handleSearch = () => {
  pagination.page = 1;
  fetchData();
};

// 分页处理
const handlePageChange = (page: number) => {
  pagination.page = page;
  fetchData();
};

const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize;
  pagination.page = 1;
  fetchData();
};

// 重置表单数据
const resetForm = () => {
  // 重置表单验证状态
  if (formRef.value) {
    formRef.value.restoreValidation();
  }

  // 清空表单数据
  Object.keys(formData).forEach((key) => {
    if (key in formData) {
      // 使用 delete 删除属性，然后重新赋值
      delete formData[key];
    }
  });

  // 重新设置初始值
  Object.assign(formData, props.initialFormData || {});
};

// 打开新建模态框
const openCreateModal = () => {
  action.value = "create";
  // 重置表单
  resetForm();
  showModal.value = true;
};

// 关闭模态框
const closeModal = () => {
  showModal.value = false;
  currentEditId.value = null;
  // 重置表单
  resetForm();
};

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return;

  try {
    await formRef.value.validate();
    submitting.value = true;

    const isEdit = action.value === "edit";
    const endpoint =
      isEdit && currentEditId.value ? `/${currentEditId.value}` : "";
    const method = isEdit ? "PUT" : "POST";

    await apiRequest(endpoint, {
      method,
      body: formData,
    });

    message.success(isEdit ? "编辑成功" : "创建成功");
    closeModal();
    await fetchData();
  } catch (error) {
    // 错误已在 apiRequest 中处理
  } finally {
    submitting.value = false;
  }
};

// 编辑
const handleEdit = (row: CrudItem) => {
  action.value = "edit";
  currentEditId.value = row.id;
  Object.assign(formData, row);
  showModal.value = true;
};

// 删除
const handleDelete = async (id: string) => {
  if (!id) return;

  try {
    deleting.value = true;
    await apiRequest(`/${id}`, {
      method: "DELETE",
    });

    message.success("删除成功");
    await fetchData();
  } catch (error) {
    // 错误已在 apiRequest 中处理
  } finally {
    deleting.value = false;
  }
};

// 暴露方法给父组件
defineExpose({
  fetchData,
  formData,
  action,
  handleEdit,
  handleDelete,
});
</script>
