"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { CircleCheckbox } from "../CircleCheckbox";
import { courseStructure, ExpandedState, SidebarProps } from "./config";

export const Sidebar: React.FC<SidebarProps> = ({
  expanded = true,
  setExpanded,
  completed,
  setCompleted,
}) => {
  const [expandAll, setExpandAll] = useState<boolean>(true);

  const calculateProgress = (sectionIndex: number): number => {
    const section = courseStructure[sectionIndex];
    const totalItems = section.lessons.reduce(
      (acc, lesson) => acc + lesson.sublessons.length + 1,
      0
    );
    const completedItems = section.lessons.reduce(
      (acc, lesson, lessonIndex) => {
        const lessonCompleted = completed[
          `lesson-${sectionIndex}-${lessonIndex}`
        ]
          ? 1
          : 0;
        const sublessonsCompleted = lesson.sublessons.filter(
          (_, subIndex) =>
            completed[`sublesson-${sectionIndex}-${lessonIndex}-${subIndex}`]
        ).length;
        return acc + lessonCompleted + sublessonsCompleted;
      },
      0
    );
    return (completedItems / totalItems) * 100;
  };

  const toggleExpandAll = (checked: boolean) => {
    setExpandAll(checked);
    const newExpanded: ExpandedState = {};
    courseStructure.forEach((section, index) => {
      newExpanded[index] = checked;
      section.lessons.forEach((_, lessonIndex) => {
        newExpanded[`${index}-${lessonIndex}`] = checked;
      });
    });
    setExpanded(newExpanded);
  };

  return (
    <ScrollArea className="h-screen w-80 bg-gray-100 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Course Index</h2>
        <div className="flex items-center">
          <span className="text-sm mr-2">Expand All</span>
          <Switch checked={expandAll} onCheckedChange={toggleExpandAll} />
        </div>
      </div>
      {courseStructure.map((section, index) => (
        <div key={index} className={`mb-4 ${section.color}`}>
          <Progress value={calculateProgress(index)} className="h-2 mb-2" />
          <div className="flex items-start mb-2">
            <div className="mr-2 relative">
              <CircleCheckbox
                checked={completed[`section-${index}`]}
                onCheckedChange={(checked: boolean) =>
                  setCompleted((prev) => ({
                    ...prev,
                    [`section-${index}`]: checked,
                  }))
                }
                className="z-10 relative"
              />
              {expanded[index] && (
                <div className="absolute top-5 bottom-0 left-2.5 w-0.5 bg-gray-300 -z-10" />
              )}
            </div>
            <div className="flex-grow">
              <div className="flex items-center justify-between">
                <span className="font-medium">{section.title}</span>
                <button
                  className="flex items-center"
                  onClick={() =>
                    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }))
                  }
                  aria-label={
                    expanded[index] ? "Collapse section" : "Expand section"
                  }
                >
                  {expanded[index] ? (
                    <ChevronDown className="flex-shrink-0" />
                  ) : (
                    <ChevronRight className="flex-shrink-0" />
                  )}
                </button>
              </div>
              {expanded[index] && (
                <div className="mt-2">
                  {section.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="ml-4 mb-2">
                      <div className="flex items-start">
                        <div className="mr-2 relative">
                          <CircleCheckbox
                            checked={
                              completed[`lesson-${index}-${lessonIndex}`]
                            }
                            onCheckedChange={(checked: boolean) =>
                              setCompleted((prev) => ({
                                ...prev,
                                [`lesson-${index}-${lessonIndex}`]: checked,
                              }))
                            }
                            className="z-10 relative"
                          />
                          {expanded[`${index}-${lessonIndex}`] && (
                            <div className="absolute top-5 bottom-0 left-2.5 w-0.5 bg-gray-300 -z-10" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex items-center justify-between">
                            <span>{lesson.title}</span>
                            <button
                              className="flex items-center"
                              onClick={() =>
                                setExpanded((prev) => ({
                                  ...prev,
                                  [`${index}-${lessonIndex}`]:
                                    !prev[`${index}-${lessonIndex}`],
                                }))
                              }
                              aria-label={
                                expanded[`${index}-${lessonIndex}`]
                                  ? "Collapse lesson"
                                  : "Expand lesson"
                              }
                            >
                              {expanded[`${index}-${lessonIndex}`] ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </button>
                          </div>
                          {expanded[`${index}-${lessonIndex}`] && (
                            <ul className="mt-1">
                              {lesson.sublessons.map((sublesson, subIndex) => (
                                <li
                                  key={subIndex}
                                  className="flex items-start text-sm text-gray-600 mb-1 ml-4"
                                >
                                  <CircleCheckbox
                                    checked={
                                      completed[
                                        `sublesson-${index}-${lessonIndex}-${subIndex}`
                                      ]
                                    }
                                    onCheckedChange={(checked: boolean) =>
                                      setCompleted((prev) => ({
                                        ...prev,
                                        [`sublesson-${index}-${lessonIndex}-${subIndex}`]:
                                          checked,
                                      }))
                                    }
                                    className="mr-2 mt-0.5"
                                  />
                                  <span>{sublesson}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
