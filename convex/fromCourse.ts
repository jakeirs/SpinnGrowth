import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const uploadCourseData = mutation({
  args: {
    lessonId: v.string(),
    title: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const { title, lessonId, content } = args;

    if (typeof lessonId !== "string" || lessonId.trim() === "") {
      throw new Error("Invalid lessonId");
    }

    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Invalid title");
    }

    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Invalid content");
    }

    const existing = await ctx.db
      .query("course")
      .filter((q) =>
        q.or(q.eq(q.field("lessonId"), lessonId), q.eq(q.field("title"), title))
      )
      .first();

    if (existing) {
      return { success: false, message: "Record already exists" };
    }

    try {
      const courseId = await ctx.db.insert("course", {
        lessonId,
        content,
        title,
      });
      return { success: true, courseId };
    } catch (err) {
      console.error("Error mutating data", err);
      throw err;
    }
  },
});
