"use client";

import React, { forwardRef } from "react";
import ProjectSummary from "@/ui/project-summary/index";

const projects = [
  {
    tags: [
      "Qdrant",
      "Gemini AI",
      "AI-SDK by Vercel",
      "Unstructured",
      "Prisma",
      "Postgres",
    ],
    alternate: true,
    title: "AskVault",
    caption: "AI-Powered Data Management Platform",
    description:
      "A versatile platform for uploading data and performing intelligent searches, automating form submissions, and managing emailing workflows. Leverages Qdrant for vector search, Gemini AI for advanced intelligence, and integrates with Prisma and Postgres for robust data handling.",
    buttonText: "View project",
    buttonLink: "https://ask.wedevs.site",
    model: {
      type: "laptop",
      alt: "AskVault",
      textures: [
        {
          srcSet: "/images/askVault.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    tags: [
      "Python",
      "Backtrader",
      "Pandas",
      "NumPy",
      "SciPy",
      "YFinance",
      "Momentum",
      "FIP Score",
      "Skewness",
      "Volatility Targeting",
      "Risk Parity",
      "Backtesting",
      "Dynamic Rebalancing",
    ],

    alternate: false,
    title: "Quantra",
    caption: "Multi-Factor Alpha Engine",
    description:
      "A momentum-driven quant strategy that blends market regime filters, multi-timeframe momentum, skewness screening, and FIP scoring to generate consistent alpha. Built with Backtrader and designed for dynamic rebalancing and risk-aware portfolio construction.",

    buttonText: "View jupyter notebook",
    buttonLink:
      "https://colab.research.google.com/drive/1tsc2zJkNRTO5TaoEZ8mGSXw_fyLrMUWV?usp=sharing",
    model: {
      type: "laptop",
      alt: "EcoX",
      textures: [
        {
          srcSet: "/images/quant.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    tags: [
      "Postgres",
      "Express.js",
      "React.js",
      "Forge",
      "Solidity",
      "OpenZeppelin",
      "Chainlink Automation",
      "Ethers.js",
      "Wagmi",
      "Chakra UI",
      "ShadCN",
      "Smart Contracts",
      "GenAI",
      "WebSockets",
    ],

    alternate: true,
    title: "EcoX",
    caption: "Carbon Credit Marketplace",
    description:
      "A blockchain-powered platform for seamless carbon credit trading. Features include automated certificate verification, buying, selling, and auctioning of carbon credits to promote transparency and sustainability in the carbon economy.",

    buttonText: "View project",
    buttonLink: "https://ecox.wedevelopers.online",
    model: {
      type: "laptop",
      alt: "EcoX",
      textures: [
        {
          srcSet: "/images/ecox.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
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
