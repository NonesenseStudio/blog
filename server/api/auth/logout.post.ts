export default defineEventHandler(async (event) => {
  // 清除cookie
  setCookie(event, "auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
  });

  return {
    success: true,
    message: "已成功注销",
  };
});
