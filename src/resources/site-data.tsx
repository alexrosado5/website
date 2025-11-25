const siteData = {
  meta: {
    baseURL: "https://pixelshieldagency.com",
    keywords: [
      "PixelShield Agency",
      "Plugins",
      "IA",
      "Desarrollo digital",
      "Chatbot",
    ],
  },
  person: {
    firstName: "Alex",
    lastName: "Rosado",
    name: "PixelShield Agency",
    role: "Plugin Developers",
    avatar: "/images/avatar.png",
    email: "pixelshieldagency@gmail.com",
    phone: "+34 696109481",
    website: "https://pixelshieldagency.com",
    timezone: "Europe/Spain",
    address: "Barcelona, Spain",
    languages: ["Spanish", "English", "Catalan"],
    biography:
      "Founder of Pixel Shield Agency, specializing in custom plugins, 24/7 maintenance and innovative web improvement systems.",
  },
  hero: {
    headline: "Designing Plugins and high-impact digital products for websites",
    subline: (
      <>
        <strong>PixelShield Agency</strong> develops AI-powered web plugins, 
        enhances website performance, and provides reliable 24/7 maintenance,
        with plans to expand into new custom plugins for all users.
      </>
    ),
    featured: {
      label: "Automation & Maintenance",
      href: "https://owasp.org/www-project-top-ten/",
      badge: "Web Enhancement Studi",
    },
    ctaPrimary: {
      label: "Explore CodeShare",
      href: "https://codeshare.me",
    },
    ctaSecondary: {
      label: "Watch Beatra in action",
      href: "https://beatra.app",
    },
    stats: [
      { value: "44K+", label: "Audience across Instagram & YouTube" },
      { value: "15K+", label: "Developers inside CodeShare" },
      { value: "1M+", label: "Monthly Beatra listeners" },
      { value: "4", label: "Active venture & partner builds" },
    ],
  },
  newsletter: {
    display: false,
    title: "Build log",
    description: "Shipping notes from CodeShare, Beatra, and creator studio automations.",
  },
  social: [
    { name: "LinkedIn", icon: "linkedin", link: "https://linkedin.com/in/umutxyp" },
    { name: "Twitter", icon: "twitter", link: "https://twitter.com/devbayraktar" },
    { name: "Instagram", icon: "instagram", link: "https://instagram.com/umutxyp" },
    { name: "YouTube", icon: "youtube", link: "https://youtube.com/@umutxyp" },
    { name: "Email", icon: "email", link: "mailto:pixelshieldagency@gmail.com" },
  ],
  about: {
    introTitle: "Who We Are",
    introDescription:
      "PixelShield Agency is a tech-driven team creating custom AI-powered plugins, improving website performance and providing reliable 24/7 maintenance. Founded by two Computer Engineer students, we combine innovation, efficiency and modern web solutions to help business enhance and secure their online presence.",
    experiences: [
      {
        company: "EntuPunto",
        timeframe: "2025 - Present",
        role: "External Tech Provider",
        achievements: [
          "Designed custom plugins to improve their websites flow and automate key processes , verification workflows and reliable 24/7 maintenance.",
          "Oversee AI-assisted workflows, support and automation.",
        ],
        images: [],
        link: "https://entupunto.com/",
      },
    ],
    studies: [
      {
        name: "Alex Rosado Rodriguez",
        description:
          "Computer Engineering student and Founder of PixelShield Agency, specializing in custom plugin development, AI-powered solutions, and continuous web improvement.",
      },
      {
        name: "Ferran Calmaestra Feixa",
        description:
          "Computer Engineer student and Cofounder of PixelShield Agency, focused on custom plugin development, AI-powered tools, and continuous web enhancement",
      },
    ],
    technical: [
      {
        title: "Plugin Development",
        description: "95% proficiency",
        images: [],
        tags: [
          { name: "React.js", icon: "react" },
          { name: "Next.js", icon: "nextjs" },
          { name: "JavaScript", icon: "javascript" },
          { name: "TypeScript", icon: "typescript" },
          { name: "HTML5", icon: "html" },
          { name: "Python", icon: "python" },
          { name: "OpenAI API", icon: "openai" },
          { name: "TensorFlow.js", icon: "tensorflow" },
          { name: "CSS3", icon: "css3" }

        ],
      },
      {
        title: "Backend Development",
        description: "90% proficiency",
        images: [],
        tags: [
          { name: "Node.js", icon: "nodejs" },
          { name: "Express.js", icon: "javascript" },
          { name: "Socket.IO", icon: "javascript" },
          { name: "Go", icon: "code" },
        ],
      },
      {
        title: "DevOps & Tools",
        description: "90% proficiency",
        images: [],
        tags: [
          { name: "Git", icon: "github" },
          { name: "GitHub", icon: "github" },
          { name: "Linux", icon: "terminal" },
          { name: "Windows", icon: "terminal" },
          { name: "Vercel", icon: "vercel" },
        ],
      },
    ],
  },
  gallery: [
    "/images/projects/codeshare.png",
    "/images/projects/beatra.png",
    "/images/projects/viptransfertr.png",
    "/images/projects/dnzgeridonusum.png",
    "/images/projects/umutxyp.jpg",
  ],
  github: {
    username: "alexrosado5",
    highlight: [
      "TR_cine",
    ],
    description:
      "Open-sourcing Discord bots, automation pipelines, and production-ready SaaS starters used inside CodeShare.",
  },
};

export default siteData;
