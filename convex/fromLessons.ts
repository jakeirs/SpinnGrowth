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
      .query("lessons")
      .filter((q) =>
        q.or(q.eq(q.field("lessonId"), lessonId), q.eq(q.field("title"), title))
      )
      .first();

    if (existing) {
      return {
        success: false,
        message: `Record already exists: title or lessonId`,
      };
    }

    try {
      const lessonRecordId = await ctx.db.insert("lessons", {
        lessonId,
        content,
        title,
      });
      return { success: true, lessonRecordId };
    } catch (err) {
      console.error("Error mutating data", err);
      throw err;
    }
  },
});

export const retrieveLessonCourse = mutation({
  args: {
    lessonId: v.string(),
  },
  handler: async (ctx, args) => {
    const { lessonId } = args;

    if (typeof lessonId !== "string" || lessonId.trim() === "") {
      throw new Error("Invalid lessonId");
    }

    try {
      const document = await ctx.db
        .query("lessons")
        .filter((q) => q.eq(q.field("lessonId"), lessonId))
        .first();

      return { success: true, document };
    } catch (err) {
      console.error("Error querying lesson course", err);
      throw err;
    }
  },
});
