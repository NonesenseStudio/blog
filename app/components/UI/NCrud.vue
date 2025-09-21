<script setup lang="ts">
import type { DataTableColumns } from "naive-ui";
import { Search } from "@vicons/ionicons5";

const {
  columns = [
    {
      title: "No",
      key: "no",
    },
    {
      title: "Title",
      key: "title",
    },
    {
      title: "Length",
      key: "length",
    },
  ],
  pagination = true,
} = defineProps<{
  columns: DataTableColumns[];
  pagination: boolean;
}>();
const tableData = [
  { no: 3, title: "Wonderwall", length: "4:18" },
  { no: 4, title: "Don't Look Back in Anger", length: "4:48" },
  { no: 12, title: "Champagne Supernova", length: "7:27" },
];
const layoutStyle = {
  height: "100%",
  padding: "24px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};
</script>

<template>
  <n-layout :content-style="layoutStyle" class="h-full">
    <n-layout-header>
      <n-space>
        <n-input-group>
          <n-input placeholder="请输入关键字" />
          <n-button type="primary" ghost>
            <template #icon>
              <n-icon><search /></n-icon>
            </template>
          </n-button>
        </n-input-group>
      </n-space>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px 0;flex:1">
      <n-data-table
        :columns="columns"
        :data="tableData"
        :pagination="pagination"
        :bordered="false"
        style="height: 100%"
      />
    </n-layout-content>
  </n-layout>
</template>

<style scoped></style>
