<script setup lang="ts">
import { h, ref } from "vue";
import { NButton, NIcon, NPopconfirm } from "naive-ui";
import { CreateOutline, TrashOutline } from "@vicons/ionicons5";
import NCrud from "~/components/UI/NCrud.vue";
import { definePageMeta } from "#imports";

definePageMeta({
  middleware: ["auth"],
});
// 引用 CRUD 组件
const crudRef = ref();

// 表格列定义，现在包含操作列
const columns = [
  {
    title: "名称",
    key: "name",
  },
  {
    title: "Slug",
    key: "slug",
  },
  {
    title: "描述",
    key: "description",
  },
  {
    title: "创建时间",
    key: "createdAt",
    width: 180,
    render(row: any) {
      return new Date(row.createdAt).toLocaleString();
    },
  },
  {
    title: "更新时间",
    key: "updatedAt",
    width: 180,
    render(row: any) {
      return new Date(row.updatedAt).toLocaleString();
    },
  },
  {
    title: "操作",
    key: "actions",
    width: 150,
    render(row: any) {
      return h("div", { class: "flex gap-2" }, [
        h(
          NButton,
          {
            size: "small",
            type: "primary",
            onClick: () => handleEdit(row),
          },
          {
            default: () => "编辑",
            icon: () => h(NIcon, null, { default: () => h(CreateOutline) }),
          },
        ),
        h(
          NPopconfirm,
          {
            onPositiveClick: () => crudRef.value?.handleDelete(row.id),
            negativeText: "取消",
            positiveText: "确定",
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: "small",
                  type: "error",
                },
                {
                  default: () => "删除",
                  icon: () =>
                    h(NIcon, null, { default: () => h(TrashOutline) }),
                },
              ),
            default: () => "确定删除选中的分类吗？",
          },
        ),
      ]);
    },
  },
];

// 表单验证规则
const formRules = {
  name: {
    required: true,
    message: "请输入分类名称",
    trigger: "blur",
  },
  slug: {
    required: true,
    message: "请输入Slug",
    trigger: "blur",
  },
};

// 初始表单数据
const initialFormData = {
  name: "",
  slug: "",
  description: "",
};

// 编辑处理函数
const handleEdit = (row: any) => {
  if (crudRef.value) {
    crudRef.value.handleEdit(row);
  }
};
</script>

<template>
  <n-crud
    ref="crudRef"
    keyword="categories"
    :columns="columns"
    :form-rules="formRules"
    :initial-form-data="initialFormData"
    title="分类"
  >
    <!-- 表单插槽 -->
    <template #form="{ formData }">
      <n-form-item label="名称" path="name">
        <n-input
          v-model:value="formData.name"
          clearable
          placeholder="请输入分类名称"
        />
      </n-form-item>
      <n-form-item label="Slug" path="slug">
        <n-input
          v-model:value="formData.slug"
          clearable
          placeholder="请输入Slug"
        />
      </n-form-item>
      <n-form-item label="描述" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          clearable
          placeholder="请输入描述"
        />
      </n-form-item>
      <!-- 可以添加更多表单字段 -->
    </template>
  </n-crud>
</template>
