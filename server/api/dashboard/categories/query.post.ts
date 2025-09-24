import {
  categoryService,
  QueryParams,
} from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<QueryParams>(event);
    const result = await categoryService.query(body);

    return {
      success: true,
      data: result.list,
      pagination: result.pagination,
    };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
