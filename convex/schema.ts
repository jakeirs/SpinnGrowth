import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    firstName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    stripeCheckoutId: v.optional(v.string()),
  }).index("by_email", ["email"]),

  lessons: defineTable({
    lessonId: v.string(),
    title: v.string(),
    content: v.any(),
  }),
});
