import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    contentCode: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("images", {
      storageId: args.storageId,
      title: args.title,
      contentCode: args.contentCode,
    });
  },
});

export const queryImage = query({
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

export const getImageURL = mutation({
  args: {
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const { storageId } = args;

    if (storageId) {
      return await ctx.storage.getUrl(storageId as Id<"_storage">);
    }

    return "";
  },
});

export const deleteImage = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { storageId }) => {
    const imageDoc = await ctx.db
      .query("images")
      .filter((q) => q.eq(q.field("storageId"), storageId))
      .unique();
    await ctx.db.delete(imageDoc?._id!);
    return await ctx.storage.delete(storageId);
  },
});
