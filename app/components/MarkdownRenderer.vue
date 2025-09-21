<template>
  <div class="markdown-body" v-html="renderedContent"></div>
</template>

<script setup lang="ts">
import MarkdownIt from "markdown-it";

const { content = "" } = defineProps<{
  content: string;
}>();
const md = new MarkdownIt();

const renderedContent = computed(() => md.render(content));
</script>

<style>
.markdown-body {
  line-height: 1.6;
  word-wrap: break-word;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 1.5em;
  margin-bottom: 0.5em;
  font-weight: 600;
}

.markdown-body h1 {
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body h2 {
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
  padding-bottom: 0.3em;
}

.markdown-body p {
  margin-bottom: 1em;
}

.markdown-body code {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27, 31, 35, 0.05);
  border-radius: 3px;
}

.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: #f6f8fa;
  border-radius: 3px;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
  margin: 0 0 1em 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
  margin-bottom: 1em;
}

.markdown-body li {
  margin-bottom: 0.25em;
}

.markdown-body table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 1em;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table th {
  background-color: #f6f8fa;
  font-weight: 600;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
}

.markdown-body .header-anchor {
  float: left;
  line-height: 1;
  margin-left: -20px;
  padding-right: 4px;
  opacity: 0;
  transition: opacity 0.2s;
}

.markdown-body h1:hover .header-anchor,
.markdown-body h2:hover .header-anchor,
.markdown-body h3:hover .header-anchor,
.markdown-body h4:hover .header-anchor,
.markdown-body h5:hover .header-anchor,
.markdown-body h6:hover .header-anchor {
  opacity: 1;
}

/* 自定义容器样式 */
.markdown-body .info {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  padding: 1em;
  margin: 1em 0;
  border-radius: 0.25em;
}

.markdown-body .warning {
  background-color: #fff3e0;
  border-left: 4px solid #ff9800;
  padding: 1em;
  margin: 1em 0;
  border-radius: 0.25em;
}

.markdown-body .danger {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  padding: 1em;
  margin: 1em 0;
  border-radius: 0.25em;
}
</style>
