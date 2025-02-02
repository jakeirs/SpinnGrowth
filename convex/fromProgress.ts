import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { vSessionId } from "convex-helpers/server/sessions";

export const getUserProgress = query({
  args: { sessionId: vSessionId },
  handler: async (ctx, args) => {
    const { sessionId } = args;

    const user = await ctx.db
      .query("users")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!user) {
      return null;
    }

    const progressDocument = await ctx.db
      .query("progress")
      .filter((q) => q.eq(q.field("userId"), user._id))
      .first();

    return progressDocument ? progressDocument.progress : [];
  },
});

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
      throw new Error("Invalid lessonCode");
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
        progress: [lessonCode],
      });

      return {
        success: true,
        message: "User Progress has been created",
        document: progressId,
        complete: true,
      };
    }

    const isLessonAlreadyComplete =
      progressDocument.progress.includes(lessonCode);

    // mark as incomplete
    if (isLessonAlreadyComplete) {
      const newProgress = progressDocument.progress.filter(
        (lesson) => lesson !== lessonCode
      );

      await ctx.db.patch(progressDocument._id, {
        progress: newProgress,
      });
    } else {
      // mark as complete
      await ctx.db.patch(progressDocument._id, {
        progress: [...progressDocument.progress, lessonCode],
      });
    }

    return { success: true, complete: !isLessonAlreadyComplete };
  },
});
