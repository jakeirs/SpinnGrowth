import React from 'react';

export interface Sublesson {
  title: string;
}

export interface Lesson {
  title: string;
  sublessons: string[];
}

export interface Section {
  title: string;
  color: string;
  lessons: Lesson[];
}

export interface CompletedState {
  [key: string]: boolean;
}

export interface ExpandedState {
  [key: string]: boolean;
}

export type SelectedLessonType = string | null;

export interface SidebarProps {
  expanded: ExpandedState;
  setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>>;
  completed: CompletedState;
  setCompleted: React.Dispatch<React.SetStateAction<CompletedState>>;
  setSelectedLesson: React.Dispatch<React.SetStateAction<SelectedLessonType>>;
}

export const courseStructure: Section[] = [
  {
    title: "Introduction to Programming",
    color: "bg-red-100",
    lessons: [
      {
        title: "What is Programming?",
        sublessons: [
          "History of Programming",
          "Types of Programming Languages",
        ],
      },
      {
        title: "Setting Up Your Environment",
        sublessons: ["Choosing an IDE", "Installing Necessary Tools"],
      },
    ],
  },
  {
    title: "Basic Concepts",
    color: "bg-blue-100",
    lessons: [
      {
        title: "Variables and Data Types",
        sublessons: ["Numeric Types", "String Type", "Boolean Type"],
      },
      {
        title: "Control Structures",
        sublessons: ["If-Else Statements", "Loops"],
      },
    ],
  },
  {
    title: "Functions and Modules",
    color: "bg-green-100",
    lessons: [
      {
        title: "Defining Functions",
        sublessons: ["Function Parameters", "Return Values"],
      },
      {
        title: "Working with Modules",
        sublessons: ["Built-in Modules", "Creating Custom Modules"],
      },
    ],
  },
  {
    title: "Data Structures",
    color: "bg-yellow-100",
    lessons: [
      {
        title: "Lists and Arrays",
        sublessons: ["Creating and Modifying Lists", "List Comprehensions"],
      },
      {
        title: "Dictionaries",
        sublessons: ["Key-Value Pairs", "Dictionary Methods"],
      },
    ],
  },
  {
    title: "Object-Oriented Programming",
    color: "bg-purple-100",
    lessons: [
      {
        title: "Classes and Objects",
        sublessons: ["Defining Classes", "Creating Instances"],
      },
      {
        title: "Inheritance and Polymorphism",
        sublessons: ["Subclasses", "Method Overriding"],
      },
    ],
  },
  {
    title: "Advanced Topics",
    color: "bg-pink-100",
    lessons: [
      { title: "File I/O", sublessons: ["Reading Files", "Writing to Files"] },
      {
        title: "Error Handling",
        sublessons: ["Try-Except Blocks", "Raising Exceptions"],
      },
    ],
  },
];
