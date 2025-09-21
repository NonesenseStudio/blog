<script setup lang="ts">
import { darkTheme, useOsTheme } from "naive-ui";

const osTheme = useOsTheme();
const theme = computed(() => (osTheme.value === "dark" ? darkTheme : null));

</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />
    <NuxtLayout> <NuxtPage /> </NuxtLayout>
  </n-config-provider>
</template>
