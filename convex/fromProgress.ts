import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { vSessionId } from "convex-helpers/server/sessions";

/**
 * setSession for the User
 * Make sure to set progress when the membership was created | added access to course
 */
export const setProgressOfProgram = mutation({
  args: {
    lessonCode: v.string(),
    sessionId: vSessionId,
  },
  handler: async (ctx, args) => {
    const { sessionId, lessonCode } = args;

    if (typeof sessionId !== "string" || sessionId.trim() === "") {
      throw new Error("Invalid sessionId");
    }

    if (typeof lessonCode !== "string" || lessonCode.trim() === "") {
      throw new Error("Invalid userId");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!existingUser) {
      return {
        success: false,
        message: "User doesn't exist",
        document: undefined,
      };
    }

    const progressDocument = await ctx.db
      .query("progress")
      .filter((q) => q.eq(q.field("userId"), existingUser._id))
      .first();

    if (!progressDocument) {
      const progressId = await ctx.db.insert("progress", {
        userId: existingUser._id,
        progress: [],
      });

      return {
        success: true,
        message: "User Progress has been created",
        document: progressId,
      };
    }

    const isLessonAlreadyComplete =
      progressDocument.progress.includes(lessonCode);

    // mark as incomplete
    if (isLessonAlreadyComplete) {
      const newProgress = progressDocument.progress.filter(
        (lesson) => lesson !== lessonCode
      );

      await ctx.db.patch(progressDocument?._id, { progress: [...newProgress] });
    } else {
      // mark as complete

      await ctx.db.patch(progressDocument?._id, {
        progress: [lessonCode, ...progressDocument.progress],
      });
    }

    return { success: true };
  },
});
