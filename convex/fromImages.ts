import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const sendImage = mutation({
  args: { storageId: v.id("_storage"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.insert("images", {
      storageId: args.storageId,
      title: args.title,
    });
  },
});

export const getPhoto = query({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const imagesObj = await ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("title"), args.title))
      .first();

    const storageId = imagesObj?.storageId;
    if (storageId) {
      return await ctx.storage.getUrl(storageId);
    }
    return "";
  },
});
