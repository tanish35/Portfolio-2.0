"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/utils/cn";

const RESUME_URL = "/files/resume.pdf";

export const FloatingNav = ({ navItems, className }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          "flex max-w-fit fixed top-6 inset-x-0 mx-auto z-[5000] items-center justify-center space-x-1 sm:space-x-2",
          "rounded-full border border-secondary-600 bg-[#100f0d]/95",
          "custom-shadow-200 px-2 sm:pl-5 sm:pr-2 py-1.5 sm:py-2",
          "font-gotham-book",
          className,
        )}
      >
        {navItems.map((navItem, idx) => (
          <button
            key={`link=${idx}`}
            type="button"
            onClick={() => {
              if (navItem.link.startsWith("/")) window.location = navItem.link;
              else {
                const el = document.querySelector(navItem.link);
                if (el) {
                  el.scrollIntoView({ behavior: "smooth" });
                  history.pushState(null, "", navItem.link);
                } else window.location = `/#${navItem.link.slice(1)}`;
              }
            }}
            className={cn(
              "relative items-center flex space-x-1 min-h-11 min-w-11 sm:min-h-0 sm:min-w-0 justify-center",
              "text-teritiary-400 hover:text-primary-200 focus-visible:text-primary-200",
              "rounded-full px-2 sm:px-3 py-2 sm:py-1.5 text-sm transition-colors",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f0d]",
            )}
          >
            <span className="block sm:hidden">{navItem.icon}</span>
            <span className="hidden sm:block">{navItem.name}</span>
          </button>
        ))}
        <button
          type="button"
          aria-label="Open resume PDF"
          onClick={() => {
            window.open(RESUME_URL, "_blank", "noopener,noreferrer");
          }}
          className={cn(
            "border border-secondary-600 text-sm font-medium relative",
            "text-teritiary-600 hover:text-primary-200 px-4 py-2 rounded-full min-h-11 sm:min-h-0",
            "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-200 focus-visible:ring-offset-2 focus-visible:ring-offset-[#100f0d]",
          )}
        >
          <span>Resume</span>
          <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-amber-500 to-transparent h-px" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
