"use client";

import React from "react";
import { FloatingNav } from "@/ui/aceternity/floating-navbar";
import {
  IconHome,
  IconTie,
  IconComponents,
  IconArticle,
} from "@tabler/icons-react";

export default function FloatingNavBar() {
  const navItems = [
    {
      name: "About",
      link: "#about",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Projects",
      link: "#project-1",
      icon: (
        <IconComponents className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Experience",
      link: "#experience",
      icon: <IconTie className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];
  return <FloatingNav navItems={navItems} />;
}
