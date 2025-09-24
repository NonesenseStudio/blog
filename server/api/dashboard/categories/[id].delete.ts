import { categoryService } from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, "id");
    if (!id) {
      return { success: false, error: "ID is required" };
    }

    const result = await categoryService.delete(id);

    if (!result) {
      return { success: false, error: "Category not found" };
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
