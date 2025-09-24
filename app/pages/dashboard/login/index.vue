<script setup lang="ts">
import { useHead } from "#imports";

definePageMeta({
  layout: "empty",
});
useHead({ title: "登录" });

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const loading = ref(false);
const error = ref("");

const formData = ref({
  email: "",
  password: "",
});
const rules = {
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "请输入有效的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  password: {
    required: true,
    message: "请输入密码",
    trigger: "blur",
  },
};
async function handleLogin() {
  loading.value = true;
  error.value = "";

  $fetch("/api/auth/login", {
    method: "POST",
    body: formData.value,
  })
    .then((res: any) => {
      if (res.success) {
        const redirectPath = route.query.redirect;
        if (redirectPath && typeof redirectPath === "string") {
          const decodedPath = decodeURIComponent(redirectPath);
          router.push(decodedPath);
        } else {
          router.replace("/dashboard");
        }
      } else {
        // 登录失败，显示错误信息
        error.value = res?.message || "登录失败，请重试";
      }
    })
    .catch((err) => {
      error.value = "网络错误，请稍后重试";
      console.error("登录错误:", err);
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  $fetch("/api/auth/user").then((res: any) => {
    if (res.success) {
      userStore.setUser(res.user);
      const redirectPath = route.query.redirect;
      if (redirectPath && typeof redirectPath === "string") {
        const decodedPath = decodeURIComponent(redirectPath);
        router.push(decodedPath);
      } else {
        router.replace("/dashboard");
      }
    } else {
      // 登录失败，显示错误信息
      error.value = res?.message || "登录失败，请重试";
    }
  });
});
</script>

<template>
  <div
    class="bg-background dark:bg-background w-full h-full flex justify-center items-center"
  >
    <n-card hoverable style="width: 400px">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="邮箱" path="email">
          <n-input placeholder="请输入邮箱" v-model:value="formData.email" />
        </n-form-item>
        <n-form-item label="密码" path="password">
          <n-input
            placeholder="请输入密码"
            type="password"
            v-model:value="formData.password"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" style="width: 100%" @click="handleLogin"
            >登录</n-button
          >
        </n-form-item>
      </n-form>
    </n-card>
  </div>
</template>

<style scoped></style>
