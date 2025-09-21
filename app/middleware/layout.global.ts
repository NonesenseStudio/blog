export default defineNuxtRouteMiddleware((to) => {
  // 如果该页面已经通过 definePageMeta 设置了自定义布局，则中间件不再干预
  if (to.meta.layout) {
    return; // 直接返回，不设置布局
  }
  // 对于没有设置布局的页面，根据路由路径自动设置布局
  if (to.path.startsWith("/dashboard")) {
    setPageLayout("dashboard");
  } else {
    // 可以不加这行，因为默认就是 default 布局
    setPageLayout("default");
  }
});
