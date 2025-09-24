import { categoryService } from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
  try {
    const allCategories = await categoryService.getAll();
    return { success: true, data: allCategories };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
