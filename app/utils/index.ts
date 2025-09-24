import { createDiscreteApi, darkTheme } from "naive-ui";
import { useDark } from "@vueuse/core";

const isDark = useDark();
export let { message, notification, dialog, loadingBar, modal } =
  createDiscreteApi(
    ["message", "dialog", "notification", "loadingBar", "modal"],
    {
      configProviderProps: {
        theme: isDark.value ? darkTheme : null, // 动态绑定主题
      },
    },
  );
