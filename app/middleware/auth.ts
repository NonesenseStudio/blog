export default defineNuxtRouteMiddleware(async (to) => {
  if (
    to.path.startsWith("/dashboard") &&
    !to.path.startsWith("/dashboard/login")
  ) {
    try {
      const { data } = await useFetch("/api/auth/user");

      // 如果用户未登录或API返回失败
      if (!data.value || !data.value.success) {
        // 保存当前路径，以便登录后重定向回来
        const redirectPath = to.fullPath;
        return navigateTo(
          `/dashboard/login?redirect=${encodeURIComponent(redirectPath)}`,
        );
      }

      // 如果用户已登录且访问的是登录页，重定向到仪表板
      if (to.path === "/dashboard/login") {
        return navigateTo("/dashboard");
      }
    } catch (error) {
      console.error("认证检查失败:", error);
      return navigateTo("/dashboard/login");
    }
  }
});
