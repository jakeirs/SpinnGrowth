"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { CircleCheckbox } from "../CircleCheckbox";
import { courseStructure, ExpandedState } from "./config";
import { SelectedLessonType } from "./config";
import Link from 'next/link';

export interface SidebarProps {
  expanded: ExpandedState;
  setExpanded: React.Dispatch<React.SetStateAction<ExpandedState>>;
  completed: Record<string, boolean>;
  setSelectedLesson: React.Dispatch<React.SetStateAction<SelectedLessonType>>;
}

export const Sidebar: React.FC<SidebarProps> = ({
  expanded = {},
  setExpanded,
  completed,
  setSelectedLesson,
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
        const lessonCompleted = completed[`${sectionIndex}-${lessonIndex}`] ? 1 : 0;
        const sublessonsCompleted = lesson.sublessons.filter(
          (_, subIndex) =>
            completed[`${sectionIndex}-${lessonIndex}-${subIndex}`]
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

  useEffect(() => {
    toggleExpandAll(true);
  }, []);

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
        <div key={index}>
          <Progress value={calculateProgress(index)} className="h-2" />
          <div className={`mb-4 pt-3 pb-1 ${section.color} rounded-lg`}>
            <div className="flex mb-2 px-4">
              <div className="flex-grow">
                <Link href={`/member/program/${index}`}>
                  <div
                    className="flex items-center justify-between cursor-pointer p-1"
                    onClick={(e) => {
                      e.preventDefault();
                      setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
                      setSelectedLesson(`${index}`);
                    }}
                  >
                    <div className="flex items-center">
                      <div>
                        <CircleCheckbox
                          checked={completed[`${index}`]}
                          readOnly={true}
                        />
                      </div>
                      <span className="font-medium ml-2">{section.title}</span>
                    </div>
                    {expanded[index] ? (
                      <ChevronDown className="flex-shrink-0" />
                    ) : (
                      <ChevronRight className="flex-shrink-0" />
                    )}
                  </div>
                </Link>
                {expanded[index] && (
                  <div className="mt-2 pl-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="mb-2">
                        <div className="flex-grow">
                          <Link href={`/member/program/${index}-${lessonIndex}`}>
                            <div
                              className="flex items-center justify-between cursor-pointer p-1"
                              onClick={(e) => {
                                e.preventDefault();
                                setExpanded((prev) => ({
                                  ...prev,
                                  [`${index}-${lessonIndex}`]:
                                    !prev[`${index}-${lessonIndex}`],
                                }));
                                setSelectedLesson(`${index}-${lessonIndex}`);
                              }}
                            >
                              <div className="flex items-center">
                                <div>
                                  <CircleCheckbox
                                    checked={completed[`${index}-${lessonIndex}`]}
                                    readOnly={true}
                                  />
                                </div>
                                <span className="ml-2">{lesson.title}</span>
                              </div>
                              {expanded[`${index}-${lessonIndex}`] ? (
                                <ChevronDown size={14} />
                              ) : (
                                <ChevronRight size={14} />
                              )}
                            </div>
                          </Link>
                          {expanded[`${index}-${lessonIndex}`] && (
                            <ul className="mt-1 pl-2">
                              {lesson.sublessons.map((sublesson, subIndex) => (
                                <li key={subIndex}>
                                  <Link href={`/member/program/${index}-${lessonIndex}-${subIndex}`}>
                                    <div
                                      className="flex items-center text-sm text-gray-600 mb-1 cursor-pointer"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setSelectedLesson(`${index}-${lessonIndex}-${subIndex}`);
                                      }}
                                    >
                                      <div>
                                        <CircleCheckbox
                                          checked={
                                            completed[
                                              `${index}-${lessonIndex}-${subIndex}`
                                            ]
                                          }
                                          readOnly={true}
                                        />
                                      </div>
                                      <span className="ml-2">{sublesson}</span>
                                    </div>
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </ScrollArea>
  );
};
