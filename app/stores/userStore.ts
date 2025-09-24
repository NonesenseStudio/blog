interface User {
  id: string;
  name: string;
  email: string;
}
export const useUserStore = defineStore("user", {
  state: () => ({
    user: {
      id: "",
      name: "",
      email: "",
    } as User,
  }),
  actions: {
    setUser(user: User) {
      this.user = user;
    },
  },
});
