import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const uploadCourseData = mutation({
  args: {
    lessonId: v.string(),
    title: v.string(),
    content: v.any(),
  },
  handler: async (ctx, args) => {
    // Validate input data if necessary
    if (typeof args.lessonId !== "string" || args.lessonId.trim() === "") {
      throw new Error("Invalid lessonId");
    }

    try {
      // Insert the data into the "course" table
      const courseId = await ctx.db.insert("course", {
        lessonId: args.lessonId,
        content: args.content,
        title: args.title,
      });
      return { courseId };
    } catch (err) {
      console.error("Error mutating data", err);
      throw err;
    }
  },
});
