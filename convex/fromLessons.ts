import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Doc } from "./_generated/dataModel";

// Define types based on the structure in CourseIndex.tsx
export type CourseChapters = {
  title: string;
  lessonCode: string;
  notes?: string | null;
};

export type CourseSection = {
  lessonCode: string;
  title: string;
  chapters: CourseChapters[];
};

export const deleteLessonByLessonCode = mutation({
  args: {
    lessonCode: v.string(),
  },
  handler: async (ctx, args) => {
    const { lessonCode } = args;

    const lesson = await ctx.db
      .query("lessons")
      .filter((q) => q.eq(q.field("lessonCode"), lessonCode))
      .unique();

    // If the lesson is found, delete it
    if (lesson) {
      await ctx.db.delete(lesson._id);
      return { success: true, message: "Lesson deleted successfully" };
    } else {
      return { success: false, message: "Lesson not found" };
    }
  },
});

export const uploadCourseData = mutation({
  args: {
    lessonCode: v.string(),
    title: v.string(),
    content: v.any(),
    nextLesson: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { title, lessonCode, notes, content, nextLesson } = args;

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
        // patch
        await ctx.db.patch(existing._id, {
          lessonCode,
          content,
          title,
          notes,
          nextLesson,
        });
        return { success: true };
      } catch (err) {
        console.error("Error patching data", err);
        throw err;
      }
    }

    try {
      // insertLessons
      const lessonRecordId = await ctx.db.insert("lessons", {
        lessonCode,
        content,
        title,
        nextLesson,
        notes,
      });
      return { success: true, lessonRecordId };
    } catch (err) {
      console.error("Error inserting data", err);
      throw err;
    }
  },
});

/** to delete */
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
  args: { lessonCode: v.string() },
  handler: async (ctx, args) => {
    const { lessonCode } = args;

    if (typeof lessonCode !== "string" || lessonCode.trim() === "") {
      throw new Error("Invalid lessonCode");
    }

    try {
      const lesson = await ctx.db
        .query("lessons")
        .withIndex("by_lessonCode", (q) => q.eq("lessonCode", lessonCode))
        .first();

      return lesson;
    } catch (err) {
      console.error("Error querying lesson by id", err);
      throw err;
    }
  },
});

// Query to get all lessons sorted by lessonCode in ascending order
export const getAllLessons = query({
  handler: async (ctx) => {
    try {
      const lessons = await ctx.db.query("lessons").order("asc").collect();
      return lessons;
    } catch (err) {
      console.error("Error querying all lessons", err);
      throw err;
    }
  },
});

export const getLessonsForChapter = query({
  args: {
    chapterCode: v.string(),
  },
  handler: async (ctx, { chapterCode }) => {
    try {
      const lessons = await ctx.db
        .query("lessons")
        .filter((q) =>
          q.and(
            q.gte(q.field("lessonCode"), `${chapterCode}-0`),
            q.lte(q.field("lessonCode"), `${chapterCode}-99`)
          )
        )
        .order("asc")
        .collect();
      return lessons.sort((a, b) => a.lessonCode.localeCompare(b.lessonCode));
    } catch (err) {
      console.error("Error querying filtered lessons", err);
      throw err;
    }
  },
});

// Transform function to structure data for CourseIndex component
export const transformLessonsForCourseIndex = (
  lessons: Doc<"lessons">[]
): Array<CourseSection> => {
  const sections: Array<CourseSection> = [];

  lessons.forEach((lesson) => {
    const sectionCode =
      lesson.lessonCode.length <= 2 ? lesson.lessonCode : null;
    const chapterCode =
      lesson.lessonCode.length === 3 ? lesson.lessonCode : null;

    // push section
    if (sectionCode) {
      const sectionIndex = sections.findIndex(
        (section) => section.lessonCode === sectionCode
      );

      if (sectionIndex === -1) {
        // create new section
        sections.push({
          lessonCode: sectionCode,
          title: lesson.title,
          chapters: [],
        });
      }
      return;
    }

    // push chapter
    if (chapterCode) {
      const sectionCode = chapterCode.split("-")[0];
      // Find the index of the section
      const sectionIndex = sections.findIndex(
        (section) => section.lessonCode === sectionCode
      );

      if (sectionIndex !== -1) {
        // push chapter
        const entireSection = sections[sectionIndex];

        sections[sectionIndex] = {
          title: entireSection.title,
          lessonCode: entireSection.lessonCode,
          chapters: [
            ...entireSection.chapters,
            {
              lessonCode: chapterCode,
              title: lesson.title,
              notes: lesson.notes,
            },
          ],
        };
      }
    }
  });

  return sections;
};
