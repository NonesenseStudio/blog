import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// 辅助函数：首字母大写
const capitalize = (s: string): string => s.charAt(0).toUpperCase() + s.slice(1);

// 创建 store 的工厂函数
export function createDataStore<T>(
  storeName: string,
  dataPropertyName: string,
  fetchFunction: () => Promise<T[]>,
  initialData: T[] = []
) {
  // 生成方法名
  const setterName = `set${capitalize(dataPropertyName)}`;
  const fetcherName = `fetch${capitalize(dataPropertyName)}`;

  // 创建 store
  return create<{
    [key: string]: T[] | boolean | string | null | ((data: T[]) => void) | (() => Promise<void>);
  }>()(
    persist(
      (set, get) => ({
        // 数据属性
        [dataPropertyName]: initialData,
        // 通用状态
        isLoading: false,
        error: null,
        // 设置数据的方法
        [setterName]: (data: T[]) => set({ [dataPropertyName]: data }),
        // 获取数据的方法
        [fetcherName]: async () => {
          if (get().isLoading) return;

          set({ isLoading: true, error: null });

          try {
            const data = await fetchFunction();
            set({ [dataPropertyName]: data, isLoading: false });
          } catch (error) {
            set({
              error: error instanceof Error ? error.message : 'An error occurred',
              isLoading: false
            });
          }
        },
      }),
      {
        name: storeName,
        storage: createJSONStorage(() =>
          typeof window !== "undefined" ? localStorage : emptyStorage
        ),
      }
    )
  );
}

// 空的 storage 对象用于服务端
const emptyStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};
