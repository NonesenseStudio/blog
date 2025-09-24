export default defineNuxtPlugin(async () => {
  const { data }: any = await useFetch("/api/auth/user", {
    key: "auth-user",
  });

  // 将认证状态存储在全局状态中
  const auth = useState("auth", () => ({
    user: data.value?.data || null,
    isAuthenticated: data.value?.success || false,
  }));
});
