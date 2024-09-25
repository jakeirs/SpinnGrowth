import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createUser = internalMutation({
  args: { email: v.string(), stripeCheckoutId: v.string() },
  handler: async (ctx, { email, stripeCheckoutId }) => {
    const newUserId = await ctx.db.insert("users", { email, stripeCheckoutId });

    return newUserId;
  },
});

export const getUsers = query({
  args: {},
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();

    return users;
  },
});

export const checkIfUserPaid = query({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .unique();

    if (!user) {
      throw new Error("User didn't pay or not exist");
    }

    return {
      user,
    };
  },
});
