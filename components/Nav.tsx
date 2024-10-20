"use client";

import { useLayoutEffect, useState } from "react";
import HumeLogo from "./logos/Hume";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import Github from "./logos/GitHub";
import pkg from '@/package.json';

export const Nav = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useLayoutEffect(() => {
    const el = document.documentElement;

    if (el.classList.contains("dark")) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleDark = () => {
    const el = document.documentElement;
    el.classList.toggle("dark");
    setIsDarkMode((prev) => !prev);
  };

  return (
    <div
      className={
        "relative px-6 py-3 flex items-center h-16 z-50 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-black border-b border-border shadow-2xl rounded-full backdrop-blur-md glassmorphism"
      }
    >
      {/* Particles in the background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="particle-bg" />
      </div>

      <div className="z-10 flex items-center gap-4">
        <HumeLogo className={"h-6 w-auto text-white dark:text-indigo-200 transition-all duration-300"} />
      </div>

      <div className={"ml-auto flex items-center gap-5 z-10"}>
        {/* Dark Mode Toggle with Animated Glow */}
        <Button
          onClick={toggleDark}
          variant={"ghost"}
          className={
            "ml-auto flex items-center gap-1.5 transition-all duration-300 hover:scale-110 neon-glow"
          }
        >
          <span>
            {isDarkMode ? (
              <Sun className={"size-5 text-yellow-400 glow-yellow transition-transform hover:scale-110"} />
            ) : (
              <Moon className={"size-5 text-indigo-500 glow-indigo transition-transform hover:scale-110"} />
            )}
          </span>
          <span className="font-semibold text-white dark:text-indigo-200 transition-all duration-300">
            {isDarkMode ? "Light" : "Dark"} Mode
          </span>
        </Button>
      </div>
    </div>
  );
};
