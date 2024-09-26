import { v } from "convex/values";
import { mutation } from "./_generated/server";
import { vSessionId } from "convex-helpers/server/sessions";

export const setSessionForUser = mutation({
  args: {
    sessionId: vSessionId,
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const { sessionId, userId } = args;

    if (typeof sessionId !== "string" || sessionId.trim() === "") {
      throw new Error("Invalid sessionId");
    }

    if (typeof userId !== "string" || userId.trim() === "") {
      throw new Error("Invalid userId");
    }

    const existingUser = await ctx.db.get(userId);

    if (!existingUser) {
      return { success: false, message: "User doesn't exist" };
    }

    await ctx.db.patch(userId, { sessionId });

    return { success: true, document: { sessionId, role: existingUser.role } };
  },
});

export const getRole = mutation({
  args: {
    sessionId: vSessionId,
  },
  handler: async (ctx, args) => {
    const { sessionId } = args;

    if (typeof sessionId !== "string" || sessionId.trim() === "") {
      throw new Error("Invalid sessionId");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", sessionId))
      .first();

    if (!user) {
      return {
        success: false,
        message: "User with this sessionId doesn't exist",
      };
    }

    return {
      success: true,
      role: user.role,
    };
  },
});
