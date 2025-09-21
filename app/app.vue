<script setup lang="ts">
import { darkTheme, useOsTheme } from "naive-ui";
import { computed, onMounted, ref } from "vue";

const osThemeRef = ref<string | null>(null); // 初始化为null，在客户端设置

onMounted(() => {
  // 在客户端才调用 useOsTheme
  osThemeRef.value = useOsTheme().value;
});

const theme = computed(() => {
  // 确保在客户端才根据系统主题返回 darkTheme 或 null
  return osThemeRef.value === "dark" ? darkTheme : null;
});
</script>

<template>
  <n-config-provider :theme="theme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <n-global-style />
  </n-config-provider>
</template>
