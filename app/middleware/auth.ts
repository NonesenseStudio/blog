export default defineNuxtRouteMiddleware((to) => {
  const auth: any = useState("auth");

  if (
    to.path.startsWith("/dashboard") &&
    !to.path.startsWith("/dashboard/login")
  ) {
    if (!auth.value.isAuthenticated) {
      return navigateTo(
        `/dashboard/login?redirect=${encodeURIComponent(to.fullPath)}`,
      );
    }
  }
});
