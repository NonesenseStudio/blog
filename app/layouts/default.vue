<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { h } from "vue";
import { NuxtLink } from "#components";
import dayjs from "dayjs";
import { useDark } from "@vueuse/core";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Boring` : "A Boring Blog";
  },
});
const isDark = useDark();
const menuOptions: MenuOption[] = [
  {
    label: () =>
      h(
        NuxtLink,
        {
          to: "/",
        },
        () => "首页",
      ),
    key: "index",
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          to: "/posts",
        },
        () => "文章",
      ),
    key: "posts",
  },
  {
    label: () =>
      h(
        NuxtLink,
        {
          to: "/about",
        },
        () => "关于",
      ),
    key: "about",
  },
];
const route = useRoute();
const activeKey = computed(() => {
  return route.name;
});
</script>

<template>
  <n-layout>
    <n-layout-header class="h-15">
      <n-space class="items-center">
        <logo :fill="isDark ? 'rgba(255, 255, 255, 0.82)' : '#000'"></logo>
        <n-menu :value="activeKey" mode="horizontal" :options="menuOptions" />
      </n-space>
    </n-layout-header>
    <n-layout-content content-style="padding: 24px;">
      <slot></slot>
    </n-layout-content>
    <n-layout-footer>
      <div class="w-full text-center">
        Personal Space ©{{ dayjs().format("YYYY") }}
        <div>Designed and Created by Myself</div>
      </div></n-layout-footer
    >
  </n-layout>
</template>

<style scoped></style>
