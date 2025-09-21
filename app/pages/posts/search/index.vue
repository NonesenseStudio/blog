<script setup lang="ts">
const route = useRoute();
const keyword = computed(() => route.query.keyword);
</script>

<template>
  <div>抱歉，未找到“{{ keyword }}”的相关结果</div>
</template>

<style scoped></style>
