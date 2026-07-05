export const projects = [
  {
    slug: "opsmith",
    image: "/images/opsmith.png",
    tags: [
      "Next.js",
      "Express",
      "BullMQ",
      "Redis",
      "Prometheus",
      "ChromaDB",
      "RAG",
      "GitHub Automation",
      "SuperPlane",
      "AI Auto-Patching",
    ],
    alternate: false,
    title: "Ops Smith",
    caption: "Autonomous AI-SRE Platform",
    description:
      "An autonomous SRE platform for service monitoring, anomaly detection, root-cause analysis, and AI-driven auto-patching. Orchestrates Prometheus probes, BullMQ/Redis workers, RAG retrieval, and SuperPlane workflows to generate fixes, open GitHub PRs, validate service health, and roll back unsafe changes — all surfaced through a real-time dashboard for metrics, AI activity, incidents, and patch status.",
    buttonText: "View project",
    buttonLink: "https://github.com/tanish35/OpSmith",
    model: {
      type: "laptop",
      alt: "Ops Smith",
      textures: [
        {
          srcSet: "/images/opsmith.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    slug: "askvault",
    image: "/images/askVault.png",
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
    slug: "quantra",
    image: "/images/quant.png",
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
      alt: "Quantra",
      textures: [
        {
          srcSet: "/images/quant.png 1280w",
          placeholder: "/images/placeholder.jpg",
        },
      ],
    },
  },
  {
    slug: "ecox",
    image: "/images/ecox.png",
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
    slug: "campusify",
    image: "/images/campusify.png",
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
    slug: "blockwatch",
    image: "/images/blockchain.png",
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
    slug: "pomogen",
    image: "/images/pomodoro.png",
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

export function getProjectBySlug(slug) {
  return projects.find((project) => project.slug === slug);
}
