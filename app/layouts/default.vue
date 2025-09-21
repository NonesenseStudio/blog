<script setup lang="ts">
import type { MenuOption } from "naive-ui";
import { h } from "vue";
import { NuxtLink } from "#components";
import dayjs from "dayjs";
import { useDark } from "@vueuse/core";
import { Search } from "@vicons/ionicons5";

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | Boring` : "A Boring Blog";
  },
});
const router = useRouter();
const isDark = ref<any>(false);
const keyword = ref<string | null>("");
const route = useRoute();
const activeKey = computed(() => {
  return route.name;
});
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

const onSearch = () => {
  if (keyword.value) {
    router.push(`/posts/search?keyword=${keyword.value}`);
  }
};
onMounted(() => {
  isDark.value = useDark();
});
</script>

<template>
  <n-layout>
    <n-layout-header class="h-15">
      <n-space class="items-center">
        <logo :fill="isDark ? 'rgba(255, 255, 255, 0.82)' : '#000'"></logo>
        <n-menu :value="activeKey" mode="horizontal" :options="menuOptions" />
        <n-input-group>
          <n-input
            placeholder="请输入关键字"
            style="border-radius: 25px 0 0 25px"
            v-model:value="keyword"
          />
          <n-button type="primary" ghost round @click="onSearch">
            <template #icon>
              <n-icon><search /></n-icon>
            </template>
          </n-button>
        </n-input-group>
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
