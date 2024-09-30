// Define the type for a lesson based on the expected structure
type Lesson = {
  lessonCode: string;
  // Add other properties as needed, e.g.:
  // title: string;
  // content: any;
  // notes?: string;
};

export function processLessons(lessons: Lesson[]): string[] {
  // Extract all lessonCodes
  const allLessonCodes = lessons.map((lesson) => lesson.lessonCode);

  // Filter lessonCodes:
  // 1. Keep codes with length less than 5
  // 2. Keep codes containing at least two "-" characters
  const filteredLessonCodes = allLessonCodes.filter(
    (code) => code.length < 5 && (code.match(/-/g) || []).length >= 2
  );

  return filteredLessonCodes;
}

// Updated function to process progress and return lessons with at least two "-" characters
// Output:
// {
//   "0": { allLessons: ['0-0-1', '0-1-2'] },
//   "1": { allLessons: ['1-0-1', '1-1-0'] },
//   "2": { allLessons: ['2-0-1'] }
// }
export function processSectionProgress(
  lessons: Lesson[],
  progress: string[]
): { [key: string]: { allLessons: string[] } } {
  // Filter lessons to keep only those with at least two "-" characters
  const filteredLessons = lessons.filter(
    (lesson) => (lesson.lessonCode.match(/-/g) || []).length >= 2
  );

  // Group filtered lessons by their section (first number in the lesson code)
  const groupedLessons = filteredLessons.reduce(
    (acc, lesson) => {
      const section = lesson.lessonCode.split("-")[0];
      if (!acc[section]) {
        acc[section] = { allLessons: [] };
      }
      acc[section].allLessons.push(lesson.lessonCode);
      return acc;
    },
    {} as { [key: string]: { allLessons: string[] } }
  );

  // Check if progress contains valid strings (e.g., "0-0-1", "1-0-0", etc.)
  const validProgress = progress.some((code) => /^\d+-\d+-\d+$/.test(code));

  if (validProgress) {
    return groupedLessons;
  } else {
    // If no valid progress, return an object with empty arrays for each section
    return Object.keys(groupedLessons).reduce(
      (acc, section) => {
        acc[section] = { allLessons: [] };
        return acc;
      },
      {} as { [key: string]: { allLessons: string[] } }
    );
  }
}

// New function to process chapter progress
export function getProcessChapterProgress(
  lessonCodes: string[],
  progress: string[]
): { [key: string]: { allLessons: string[] } } {
  // Filter lesson codes to keep only those with at least two "-" characters
  const filteredLessonCodes = lessonCodes.filter(
    (code) => (code.match(/-/g) || []).length >= 2
  );

  // Group filtered lesson codes by their chapter (second number in the lesson code)
  const groupedLessons = filteredLessonCodes.reduce(
    (acc, code) => {
      const [section, chapter] = code.split("-");
      const key = `${section}-${chapter}`;
      if (!acc[key]) {
        acc[key] = { allLessons: [] };
      }
      acc[key].allLessons.push(code);
      return acc;
    },
    {} as { [key: string]: { allLessons: string[] } }
  );

  // Check if progress contains valid strings (e.g., "0-0-1", "1-0-0", etc.)
  const validProgress = progress.some((code) => /^\d+-\d+-\d+$/.test(code));

  if (validProgress) {
    return groupedLessons;
  } else {
    // If no valid progress, return an object with empty arrays for each chapter
    return Object.keys(groupedLessons).reduce(
      (acc, chapter) => {
        acc[chapter] = { allLessons: [] };
        return acc;
      },
      {} as { [key: string]: { allLessons: string[] } }
    );
  }
}

// Helper function to count occurrences of a character in a string
function countOccurrences(str: string, char: string): number {
  return (str.match(new RegExp(char, "g")) || []).length;
}

export const calcChapterProgress = ({
  chapterLessonCode,
  userProgress,
  processChapterProgress,
}: {
  chapterLessonCode: string;
  userProgress: string[];
  processChapterProgress: { [key: string]: { allLessons: string[] } };
}) => {
  const [section, chapter] = chapterLessonCode.split("-");
  const key = `${section}-${chapter}`;
  const chapterLessons = processChapterProgress[key]?.allLessons || [];
  const completedLessons = chapterLessons.filter((lesson) =>
    userProgress.includes(lesson)
  );
  const progressCount = completedLessons.length;
  const progressPercentage =
    chapterLessons.length > 0
      ? Math.round((progressCount / chapterLessons.length) * 100)
      : 0;
  return {
    progressCount,
    progressPercentage,
    totalLessons: chapterLessons.length,
  };
};

export const resumeLessonOn = (progress: string[]) => {
  if (!progress || !progress.at(-1)) {
    return {
      activeSection: "0",
      activeChapter: "0-0",
    };
  }
  const lastLesson = progress.at(-1);
  const activeSection = lastLesson?.split("-")[0];
  const activeChapter = `${activeSection}-${lastLesson?.split("-")[1]}`;

  return {
    activeSection,
    activeChapter,
  };
};
