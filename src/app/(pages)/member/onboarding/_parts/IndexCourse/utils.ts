// Define the type for a lesson based on the expected structure
type Lesson = {
  lessonCode: string;
  // Add other properties as needed, e.g.:
  // title: string;
  // content: any;
  // notes?: string;
};

export function processLessons(lessons: Lesson[], progress: string[]): string[] {
  // Extract all lessonCodes
  const allLessonCodes = lessons.map(lesson => lesson.lessonCode);
  
  // Filter lessonCodes:
  // 1. Keep codes with length less than 5
  // 2. Keep codes containing at least two "-" characters
  const filteredLessonCodes = allLessonCodes.filter(code => 
    code.length < 5 && (code.match(/-/g) || []).length >= 2
  );
  
  return filteredLessonCodes;
}



// Helper function to count occurrences of a character in a string
function countOccurrences(str: string, char: string): number {
  return (str.match(new RegExp(char, 'g')) || []).length;
}