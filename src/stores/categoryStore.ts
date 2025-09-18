import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  // 添加其他你需要的分类属性
}

interface CategoryStore {
  categories: Category[];
  setCategories: (categories: Category[]) => void;
}

// 创建一个空的 storage 对象用于服务端
const emptyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set) => ({
      categories: [],
      setCategories: (categories) => set({ categories }),
    }),
    {
      name: "category-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : emptyStorage,
      ),
    },
  ),
);
