"use client";

import { domAnimation, LazyMotion, m, Variants } from "framer-motion";
import { ReactNode } from "react";

export default function Template({ children }: { children: ReactNode }) {
  const anim = (variants: Variants, custom?: number) => {
    return {
      initial: "initial",
      animate: "enter",
      exit: "exit",
      variants,
      custom,
    };
  };

  const expand: Variants = {
    initial: {
      top: 0,
    },
    enter: (i) => ({
      top: "100vh",
      transition: {
        duration: 0.4,
        delay: 0.05 * i,
        ease: [0.215, 0.61, 0.355, 1],
      },
      transitionEnd: { height: "0", top: "0" },
    }),
  };

  const numberOfCols = 5;

  return (
    <div>
      {children}
      <div className="h-screen w-screen fixed top-0 left-0 pointer-events-none flex  overflow-hidden">
        <LazyMotion features={domAnimation}>
          {[...Array(numberOfCols)].map((_, i) => (
            <m.div
              {...anim(expand, numberOfCols - i)}
              key={i}
              className={`${i === 2 ? "bg-black" : "bg-black"} relative h-full w-full ring-8 ring-white`}
            />
          ))}
        </LazyMotion>
      </div>
    </div>
  );
}
