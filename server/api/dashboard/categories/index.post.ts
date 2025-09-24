import { categoryService } from "~~/server/services/category.service";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);
    const newCategory = {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      parentId: body.parentId || null,
    };

    const result = await categoryService.create(event,newCategory);

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});
