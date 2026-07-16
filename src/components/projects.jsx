"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/project-summary/index";
import { projects } from "@/data/projects";

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
