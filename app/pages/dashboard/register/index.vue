<script setup lang="ts">
import { useHead } from "#imports";
import { message } from "#imports";

definePageMeta({
  layout: "empty",
});
useHead({ title: "注册" });

const route = useRoute();
const formRef = ref();
const formData = ref({
  name: "",
  email: "",
  password: "",
});
const rules = {
  name: {
    required: true,
    message: "请输入用户名",
    trigger: "blur",
  },
  email: [
    {
      required: true,
      message: "请输入邮箱",
      trigger: "blur",
    },
    {
      type: "email",
      message: "请输入正确的邮箱地址",
      trigger: ["blur", "change"],
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
      trigger: "blur",
    },
    {
      min: 6,
      message: "密码长度不能小于6位",
      trigger: "blur",
    },
  ],
};
const handleRegister = async () => {
  const valid = await formRef.value.validate();
  if (!valid) return;
  $fetch("/api/auth/register", {
    method: "POST",
    body: formData.value,
  }).then((res) => {
    if (res.success) {
      message.success("注册成功");
      navigateTo("/dashboard/login");
    } else {
      message.error(res.message);
      formRef.value.restoreValidation();
    }
  });
  // if (data.value.success) {
  //   message.success("注册成功");
  //   navigateTo("/dashboard/login");
  // } else {
  //   message.error(data.value.message);
  // }
};
</script>

<template>
  <div
    class="bg-background dark:bg-background w-full h-full flex justify-center items-center"
    v-if="route.query.type === 'master'"
  >
    <n-card hoverable style="width: 400px">
      <n-form ref="formRef" :model="formData" :rules="rules">
        <n-form-item label="用户名" path="name">
          <n-input placeholder="请输入用户名" v-model:value="formData.name" />
        </n-form-item>
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
          <n-button type="primary" style="width: 100%" @click="handleRegister"
            >注册</n-button
          >
        </n-form-item>
      </n-form>
    </n-card>
  </div>

  <n-empty
    description="抱歉，你没有权限访问这个页面  "
    class="w-full h-full justify-center"
    v-else
  >
    <template #extra>
      <n-button size="small"> 看看别的 </n-button>
    </template>
  </n-empty>
</template>

<style scoped></style>
