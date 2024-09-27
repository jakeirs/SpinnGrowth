import { Lesson } from "./../src/app/(pages)/member/program/_parts/Sidebar/config";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const uploadCourseData = mutation({
  args: {
    lessonCode: v.string(),
    title: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    const { title, lessonCode, content } = args;

    if (typeof lessonCode !== "string" || lessonCode.trim() === "") {
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
      .filter((q) => q.eq(q.field("lessonCode"), lessonCode))
      .first();

    if (existing) {
      try {
        await ctx.db.patch(existing._id, {
          lessonCode,
          content,
          title,
        });

        return { success: true };
      } catch (err) {
        console.error("Error patching data", err);
        throw err;
      }
    }

    try {
      const lessonRecordId = await ctx.db.insert("lessons", {
        lessonCode,
        content,
        title,
      });
      return { success: true, lessonRecordId };
    } catch (err) {
      console.error("Error inserting data", err);
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
      throw new Error("Invalid lessonCode");
    }

    try {
      const document = await ctx.db
        .query("lessons")
        .filter((q) => q.eq(q.field("lessonCode"), lessonId))
        .first();

      return { success: true, document };
    } catch (err) {
      console.error("Error querying lesson course", err);
      throw err;
    }
  },
});

/**
 * Query Lesson by lessonId
 */
export const getLessonById = query({
  args: { lessonId: v.string() },
  handler: async (ctx, args) => {
    const { lessonId } = args;

    if (typeof lessonId !== "string" || lessonId.trim() === "") {
      throw new Error("Invalid lessonCode");
    }

    try {
      const lesson = await ctx.db
        .query("lessons")
        .withIndex("by_lessonCode", (q) => q.eq("lessonCode", lessonId))
        .first();

      return lesson;
    } catch (err) {
      console.error("Error querying lesson by id", err);
      throw err;
    }
  },
});
