
export interface Project {
  id: number;
  title: string;
  image: string;
  description: string;
  tags: string[];
  videoUrl?: string; // Optional video or gif link
  productLink?: string; // Optional link to the actual product
  github_link?: string; // Changed from githubLink to match the ProductItem structure
}

export const featuredProjects: Project[] = [
  {
    id: 1,
    title: "Task Management Dashboard",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&q=80",
    description: "A beautiful task management system with drag-and-drop functionality.",
    tags: ["React", "Tailwind CSS", "Lovable"],
    videoUrl: "https://example.com/videos/task-dashboard.mp4",
    productLink: "https://task-dashboard.example.com"
  },
  {
    id: 2,
    title: "E-commerce Store",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
    description: "A fully functional e-commerce platform with product listings and cart functionality.",
    tags: ["React", "TypeScript", "Lovable"],
    videoUrl: "https://example.com/videos/ecommerce.mp4",
    productLink: "https://store.example.com"
  },
  {
    id: 3,
    title: "Social Media App",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80",
    description: "A social media application with profile pages and feed updates.",
    tags: ["React", "Tailwind", "Lovable"]
  },
  {
    id: 4,
    title: "Weather Dashboard",
    image: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80",
    description: "A weather application with beautiful visualizations and forecasts.",
    tags: ["React", "Charts", "Lovable"]
  },
  {
    id: 5,
    title: "Portfolio Website",
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80",
    description: "A professional portfolio website showcasing projects and skills.",
    tags: ["React", "Animations", "Lovable"]
  },
  {
    id: 6,
    title: "Recipe App",
    image: "https://images.unsplash.com/photo-1498936178812-4b2e558d2937?auto=format&fit=crop&q=80",
    description: "A recipe application with search and filtering capabilities.",
    tags: ["React", "Filters", "Lovable"]
  }
];

export const webApps: Project[] = [
  {
    id: 7,
    title: "Chat Application",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&q=80",
    description: "A real-time chat application with multiple rooms.",
    tags: ["React", "WebSockets", "Lovable"],
    videoUrl: "https://example.com/videos/chat-app.mp4",
    productLink: "https://chat.example.com"
  },
  {
    id: 8,
    title: "Fitness Tracker",
    image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&q=80",
    description: "Track your fitness goals and progress over time.",
    tags: ["React", "Charts", "Lovable"]
  },
  {
    id: 9,
    title: "Music Player",
    image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&q=80",
    description: "A beautiful music player with playlist management.",
    tags: ["React", "Audio API", "Lovable"]
  },
  {
    id: 10,
    title: "Note Taking App",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80",
    description: "A simple yet powerful note-taking application.",
    tags: ["React", "LocalStorage", "Lovable"]
  },
  {
    id: 11,
    title: "Budget Planner",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80",
    description: "Plan your finances with this intuitive budget application.",
    tags: ["React", "Charts", "Lovable"]
  },
  {
    id: 12,
    title: "Quiz App",
    image: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80",
    description: "Test your knowledge with interactive quizzes.",
    tags: ["React", "TypeScript", "Lovable"]
  }
];

export const designProjects: Project[] = [
  {
    id: 13,
    title: "Admin Dashboard",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&q=80",
    description: "A comprehensive admin dashboard with data visualization.",
    tags: ["Design", "UI/UX", "Lovable"],
    videoUrl: "https://example.com/videos/admin-dashboard.mp4",
    productLink: "https://admin.example.com"
  },
  {
    id: 14,
    title: "Mobile App Design",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&q=80",
    description: "A beautiful mobile app design with attention to detail.",
    tags: ["Mobile", "UI/UX", "Lovable"]
  },
  {
    id: 15,
    title: "Landing Page",
    image: "https://images.unsplash.com/photo-1557426272-fc759fdf7a8d?auto=format&fit=crop&q=80",
    description: "A high-converting landing page design for a product.",
    tags: ["Design", "Conversion", "Lovable"]
  },
  {
    id: 16,
    title: "E-learning Platform",
    image: "https://images.unsplash.com/photo-1434491534298-04dcbce3278c?auto=format&fit=crop&q=80",
    description: "Design for an interactive e-learning platform.",
    tags: ["Education", "UI/UX", "Lovable"]
  },
  {
    id: 17,
    title: "Restaurant Website",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&q=80",
    description: "A modern website design for a restaurant with online ordering.",
    tags: ["Food", "UI/UX", "Lovable"]
  },
  {
    id: 18,
    title: "Travel Blog",
    image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?auto=format&fit=crop&q=80",
    description: "A visually stunning travel blog design with rich media support.",
    tags: ["Travel", "Blog", "Lovable"]
  }
];

export const experiments: Project[] = [
  {
    id: 19,
    title: "3D Graphics Demo",
    image: "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80",
    description: "Experimenting with 3D graphics in the browser.",
    tags: ["WebGL", "3D", "Lovable"],
    videoUrl: "https://example.com/videos/3d-graphics.mp4",
    productLink: "https://3d-demo.example.com"
  },
  {
    id: 20,
    title: "Animation Library",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80",
    description: "A collection of reusable animations for web projects.",
    tags: ["Animation", "CSS", "Lovable"]
  },
  {
    id: 21,
    title: "Interactive Map",
    image: "https://images.unsplash.com/photo-1604357209793-fca5dca89f97?auto=format&fit=crop&q=80",
    description: "An interactive map with custom overlays and markers.",
    tags: ["Maps", "Geolocation", "Lovable"]
  },
  {
    id: 22,
    title: "Data Visualization",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80",
    description: "Beautiful visualizations of complex data sets.",
    tags: ["Charts", "D3.js", "Lovable"]
  },
  {
    id: 23,
    title: "Voice Recognition",
    image: "https://images.unsplash.com/photo-1589254065909-b7086229d08c?auto=format&fit=crop&q=80",
    description: "Experimenting with voice recognition and commands.",
    tags: ["Voice", "API", "Lovable"]
  },
  {
    id: 24,
    title: "AR Experience",
    image: "https://images.unsplash.com/photo-1573167507387-dd4d44561edb?auto=format&fit=crop&q=80",
    description: "An augmented reality experience for the web.",
    tags: ["AR", "WebXR", "Lovable"]
  }
];
