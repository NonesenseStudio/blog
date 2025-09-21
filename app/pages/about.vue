<script setup lang="ts">
import { useFetch } from "#app";
import { useHead } from "#imports";
useHead({
  title: "关于",
});
const result = await useFetch("/markdowns/about.md");
</script>

<template>
  <MarkdownRenderer :content="result.data.value as string"></MarkdownRenderer>
</template>

<style scoped></style>
