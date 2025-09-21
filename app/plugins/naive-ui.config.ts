import { defineNuxtPlugin } from "#app";
import { NButton } from "naive-ui";

export default defineNuxtPlugin((nuxtApp) => {
  // 修改 NButton 的默认属性
  NButton.props = {
    ...NButton.props,
    focusable: {
      type: Boolean,
      default: false,
    },
  };
});
