import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const deleteContentByCode = mutation({
  args: {
    contentCode: v.string(),
  },
  handler: async (ctx, args) => {
    {
      /**@todo check session */
    }
    const { contentCode } = args;

    const staticContent = await ctx.db
      .query("staticContent")
      .filter((q) => q.eq(q.field("contentCode"), contentCode))
      .unique();

    // If staticContent is found, delete it
    if (staticContent) {
      await ctx.db.delete(staticContent._id);
      return { success: true, message: "staticContent deleted successfully" };
    } else {
      return { success: false, message: "staticContent not found" };
    }
  },
});

export const getStaticContentByCode = query({
  args: { contentCode: v.string() },
  handler: async (ctx, args) => {
    const { contentCode } = args;

    if (typeof contentCode !== "string" || contentCode.trim() === "") {
      throw new Error("Invalid content Lesson");
    }

    try {
      const staticContent = await ctx.db
        .query("staticContent")
        .filter((q) => q.eq(q.field("contentCode"), contentCode))
        .first();

      return staticContent;
    } catch (err) {
      console.error("Error querying staticContent by contentCode", err);
      throw err;
    }
  },
});

export const saveStaticContent = mutation({
  args: {
    contentCode: v.string(),
    title: v.string(),
    content: v.any(),
    notes: v.optional(v.any()), // added because in <EditorTools /> needed
    nextLesson: v.optional(v.any()), // added because in <EditorTools /> needed
  },
  handler: async (ctx, args) => {
    {
      /**@todo check session */
    }
    const { title, content, contentCode: contentCodeRandomCase } = args;
    if (
      typeof contentCodeRandomCase !== "string" ||
      contentCodeRandomCase.trim() === ""
    ) {
      throw new Error("Invalid contentCode");
    }
    const contentCode = contentCodeRandomCase.toLocaleLowerCase();

    if (typeof title !== "string" || title.trim() === "") {
      throw new Error("Invalid title");
    }

    if (typeof content === undefined) {
      throw new Error("Invalid content");
    }

    const existing = await ctx.db
      .query("staticContent")
      .filter((q) => q.eq(q.field("contentCode"), contentCode))
      .first();

    if (existing) {
      try {
        // patch
        await ctx.db.patch(existing._id, {
          contentCode,
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
      // insertLessons
      const staticContentId = await ctx.db.insert("staticContent", {
        contentCode,
        content,
        title,
      });
      return { success: true, staticContentId };
    } catch (err) {
      console.error("Error inserting data", err);
      throw err;
    }
  },
});