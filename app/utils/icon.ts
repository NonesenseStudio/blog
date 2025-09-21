import { NIcon } from "naive-ui";
export const renderIcon = (icon: Component) => {
  return () => h(NIcon, null, { default: () => h(icon) });
};
