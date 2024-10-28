"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/project-summary/index";

const projects = [
  {
    tags: [
      "React.js",
      "Firebase",
      "Express",
      "Redis",
      "Postgres",
      "AWS",
      "Fuse.js",
      "Websockets",
    ],
    alternate: false,
    title: "Campusify",
    caption: "Social Media For College Students",
    description:
      "Connect with peers, share knowledge, and collaborate on projects in a community designed for students. Stay updated with the latest educational content, exchange ideas, and build valuable connections for your academic and career growth.",
    buttonText: "View project",
    buttonLink: "https://www.campusify.site",
    model: {
      type: "laptop",
      alt: "Campusify",
      textures: [
        {
          srcSet: "/images/campusify.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    tags: [
      "React.js",
      "MongoDB",
      "Express",
      "Websockets",
      "web3.js",
      "Solana",
      "Networkx",
      "Pandas",
      "FastAPI",
    ],
    alternate: true,
    title: "BlockWatch",
    caption: "Blockchain tracker for illegal activities",
    description:
      "A powerful solution for real-time blockchain monitoring, empowering users with enhanced transparency, security, and peace of mind on the blockchain.",
    buttonText: "View source code",
    buttonLink: "https://github.com/tanish35/Blockchain-Tracker",
    model: {
      type: "laptop",
      alt: "BlockWatch",
      textures: [
        {
          srcSet: "/images/blockchain.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    tags: [
      "ReactJs",
      "MongoDB",
      "Python",
      "Express",
      "FastAPI",
      "Pandas",
      "XGBoost",
      "AWS",
    ],
    alternate: false,
    title: "Pomogen",
    caption: "The next-gen AI-powered Pomodoro assistant",
    description:
      "Your AI-powered Pomodoro assistant for focused work and personalized break optimization",
    buttonText: "View project",
    buttonLink: "https://app-pomodoro.wedevelopers.online/profile/dashboard",
    model: {
      type: "laptop",
      alt: "Pomogen",
      textures: [
        {
          srcSet: "/images/pomodoro.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
];

const Projects = forwardRef(({ visible }, ref) => {
  return (
    <>
      {projects.map((project, index) => (
        <section
          id={`project-${index + 1}`}
          key={index}
          className="relative bg-grid-white/[0.2] flex items-center justify-center"
        >
          <ProjectSummary
            tags={project.tags}
            alternate={project.alternate}
            sectionRef={ref?.[index]}
            visible={visible?.[index]}
            index={index + 1}
            title={project.title}
            caption={project.caption}
            description={project.description}
            buttonText={project.buttonText}
            buttonLink={project.buttonLink}
            model={project.model}
          />
        </section>
      ))}
    </>
  );
});

export default Projects;
