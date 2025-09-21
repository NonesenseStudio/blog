<script setup lang="ts">
import { NuxtLink } from "#components";
import { type MenuOption, NIcon } from "naive-ui";
import { renderIcon } from "~/utils/icon";
import { Home, ReaderOutline, Folder, Menu } from "@vicons/ionicons5";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | 后台管理系统` : "后台管理系统";
  },
});
const route = useRoute();
const collapsed = ref<boolean>(false);
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        NuxtLink,
        {
          to: "/dashboard",
        },
        { default: () => "首页" },
      ),
    key: "dashboard",
    icon: renderIcon(Home),
  },
  {
    label: "内容管理",
    key: "content",
    icon: renderIcon(Folder),
    children: [
      {
        label: () =>
          h(
            NuxtLink,
            {
              to: "/dashboard/content/posts",
            },
            { default: () => "文章管理" },
          ),
        key: "posts",
        icon: renderIcon(ReaderOutline),
      },
      {
        label: () =>
          h(
            NuxtLink,
            {
              to: "/dashboard/content/category",
            },
            { default: () => "分类管理" },
          ),
        key: "category",
        icon: renderIcon(ReaderOutline),
      },
    ],
  },
];
const activeKey = computed(() => {
  const name = route.name as string;
  let keys = name.split("-");
  return keys[keys.length - 1];
});

const layoutStyle = {
  height: "100vh",
  overflow: "hidden",
};
const contentLayoutStyle = {
  height: "100%",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};
</script>

<template>
  <n-layout class="h-screen" :content-style="layoutStyle" has-sider>
    <n-layout-sider
      content-style="padding: 24px 0;"
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="0"
      :width="240"
    >
      <n-menu
        :options="menuOptions"
        :value="activeKey"
        :collapsed="collapsed"
        :collapsed-width="0"
      />
    </n-layout-sider>
    <n-layout :content-style="contentLayoutStyle">
      <n-layout-header class="h-15" style="height: 60px">
        <n-flex
          justify="space-between"
          align="center"
          class="h-full pl-10 pr-10"
          style="padding: 0 10px"
        >
          <n-button
            text
            @click="collapsed = !collapsed"
            :focusable="false"
            size="large"
          >
            <template #icon>
              <n-icon> <Menu /> </n-icon>
            </template>
          </n-button>
        </n-flex>
      </n-layout-header>
      <n-layout-content content-style="flex:1;overflow:hidden">
        <slot></slot>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>
