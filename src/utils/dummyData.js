// Dummy Data for Services
export const SERVICES_DATA = [
  {
    _id: "1",
    title: "Web Application Development",
    slug: "web-application-development",
    shortDescription: "Custom web applications built with modern technologies",
    description:
      "We build scalable, secure, and high-performance web applications using React, Node.js, and cloud technologies. Our team follows best practices to deliver robust solutions that grow with your business.",
    icon: "Globe",
    features: [
      "Custom Web Apps",
      "Progressive Web Apps",
      "E-commerce Solutions",
      "CMS Development",
    ],
    price: "From $2,000",
    duration: "4-8 weeks",
    category: "Web Development",
    isFeatured: true,
    status: "active",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    createdAt: "2024-01-15",
  },
  {
    _id: "2",
    title: "Mobile App Development",
    slug: "mobile-app-development",
    shortDescription: "Native and cross-platform mobile applications",
    description:
      "From concept to deployment, we create intuitive mobile experiences for iOS and Android. Whether you need a native app or cross-platform solution, we deliver apps that engage users and drive business growth.",
    icon: "Smartphone",
    features: [
      "iOS Development",
      "Android Development",
      "Cross-platform Apps",
      "App Store Optimization",
    ],
    price: "From $3,000",
    duration: "6-12 weeks",
    category: "Mobile App Development",
    isFeatured: true,
    status: "active",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    createdAt: "2024-01-20",
  },
  {
    _id: "3",
    title: "UI/UX Design",
    slug: "ui-ux-design",
    shortDescription:
      "User-centered design that converts visitors to customers",
    description:
      "Our design team creates beautiful, intuitive interfaces that enhance user experience. From wireframes to high-fidelity prototypes, we ensure every interaction feels natural and engaging.",
    icon: "Palette",
    features: ["UI Design", "UX Research", "Prototyping", "Design Systems"],
    price: "From $1,500",
    duration: "2-4 weeks",
    category: "UI/UX Design",
    isFeatured: true,
    status: "active",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    createdAt: "2024-02-01",
  },
  {
    _id: "4",
    title: "SaaS Development",
    slug: "saas-development",
    shortDescription:
      "Build recurring revenue with cloud-based software products",
    description:
      "We help entrepreneurs and businesses build SaaS products from idea to launch. Our expertise in multi-tenant architecture, subscription billing, and cloud infrastructure ensures scalable solutions.",
    icon: "Cloud",
    features: [
      "Product Strategy",
      "Multi-tenant Architecture",
      "Subscription Billing",
      "Analytics Dashboard",
    ],
    price: "From $5,000",
    duration: "8-16 weeks",
    category: "SaaS Development",
    isFeatured: false,
    status: "active",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    createdAt: "2024-02-10",
  },
  {
    _id: "5",
    title: "E-commerce Solutions",
    slug: "ecommerce-solutions",
    shortDescription: "Online stores that drive sales and customer loyalty",
    description:
      "We build powerful e-commerce platforms that combine beautiful design with robust functionality. From product catalogs to payment processing, we create shopping experiences that convert.",
    icon: "ShoppingCart",
    features: [
      "Custom Stores",
      "Payment Integration",
      "Inventory Management",
      "Marketing Tools",
    ],
    price: "From $2,500",
    duration: "4-8 weeks",
    category: "E-commerce Solutions",
    isFeatured: false,
    status: "active",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    createdAt: "2024-02-15",
  },
  {
    _id: "6",
    title: "API Development & Integration",
    slug: "api-development-integration",
    shortDescription: "Connect your systems with robust APIs",
    description:
      "We design and build RESTful and GraphQL APIs that power modern applications. Our expertise in API security, documentation, and integration ensures seamless data flow across your tech stack.",
    icon: "Code",
    features: [
      "REST API",
      "GraphQL",
      "API Security",
      "Third-party Integration",
    ],
    price: "From $1,000",
    duration: "1-3 weeks",
    category: "API Development",
    isFeatured: false,
    status: "active",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
    createdAt: "2024-02-20",
  },
];

// Dummy Data for Projects
export const PROJECTS_DATA = [
  {
    _id: "1",
    title: "E-commerce Platform for Fashion Brand",
    slug: "ecommerce-platform-fashion",
    client: "StyleHub Bangladesh",
    shortDescription:
      "A modern e-commerce platform with advanced filtering and payment integration",
    description:
      "Built a complete e-commerce solution for a fashion brand including product catalog, shopping cart, checkout process, and admin dashboard. Integrated with local payment gateways and implemented real-time inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400",
    category: "E-commerce",
    status: "completed",
    isFeatured: true,
    liveUrl: "https://stylehub.bd",
    completionDate: "2024-06-15",
    duration: "3 months",
  },
  {
    _id: "2",
    title: "Healthcare Management System",
    slug: "healthcare-management-system",
    client: "MedCare Hospital",
    shortDescription:
      "Comprehensive hospital management software with patient records and appointment scheduling",
    description:
      "Developed a full-featured healthcare management system including patient registration, appointment scheduling, medical records, billing, and reporting. Implemented HIPAA-compliant data security.",
    technologies: ["React", "Express", "MongoDB", "Redis", "Docker"],
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
    category: "Healthcare",
    status: "completed",
    isFeatured: true,
    liveUrl: "",
    completionDate: "2024-08-20",
    duration: "4 months",
  },
  {
    _id: "3",
    title: "Real Estate Platform",
    slug: "real-estate-platform",
    client: "PropertyHub Bangladesh",
    shortDescription:
      "Property listing platform with advanced search and virtual tours",
    description:
      "Created a modern real estate platform with property listings, advanced search filters, virtual tours, agent profiles, and inquiry system. Integrated map view and neighborhood analytics.",
    technologies: ["Next.js", "PostgreSQL", "Leaflet", "Three.js", "AWS"],
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400",
    category: "Real Estate",
    status: "completed",
    isFeatured: true,
    liveUrl: "https://propertyhub.bd",
    completionDate: "2024-10-10",
    duration: "3 months",
  },
  {
    _id: "4",
    title: "Restaurant Management App",
    slug: "restaurant-management-app",
    client: "Taste of Bangladesh",
    shortDescription:
      "Complete restaurant management with ordering, table reservation, and kitchen display",
    description:
      "Built a comprehensive restaurant management system including online ordering, table reservation, kitchen display system, inventory management, and analytics dashboard.",
    technologies: ["React Native", "Node.js", "MongoDB", "Socket.io"],
    image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
    category: "Mobile App",
    status: "completed",
    isFeatured: false,
    liveUrl: "",
    completionDate: "2024-11-05",
    duration: "2 months",
  },
  {
    _id: "5",
    title: "Educational LMS Platform",
    slug: "educational-lms-platform",
    client: "EduTech Bangladesh",
    shortDescription:
      "Learning management system with courses, quizzes, and progress tracking",
    description:
      "Developed a full-featured LMS platform with course creation, video lessons, quizzes, assignments, progress tracking, and certification. Implemented gamification elements.",
    technologies: ["React", "Express", "MongoDB", "AWS S3", "CloudFront"],
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400",
    category: "Education",
    status: "completed",
    isFeatured: false,
    liveUrl: "https://edutech.bd",
    completionDate: "2024-12-15",
    duration: "4 months",
  },
  {
    _id: "6",
    title: "Fleet Management System",
    slug: "fleet-management-system",
    client: "LogiMove Bangladesh",
    shortDescription:
      "Vehicle tracking and fleet management with real-time GPS",
    description:
      "Created a fleet management solution with real-time GPS tracking, route optimization, driver management, fuel monitoring, and maintenance scheduling. Integrated with telematics devices.",
    technologies: ["React", "Node.js", "PostgreSQL", "Mapbox", "Socket.io"],
    image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800",
    thumbnail:
      "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
    category: "Logistics",
    status: "completed",
    isFeatured: false,
    liveUrl: "",
    completionDate: "2025-01-20",
    duration: "3 months",
  },
];

// Dummy Data for Blogs
export const BLOGS_DATA = [
  {
    _id: "1",
    title: "The Future of Web Development in 2025",
    slug: "future-web-development-2025",
    shortDescription:
      "Exploring emerging trends that will shape web development",
    content: `
## The Future of Web Development in 2025

The web development landscape is evolving rapidly. As we move into 2025, several key trends are emerging that will fundamentally change how we build for the web.

### AI-Powered Development

Artificial intelligence is transforming every aspect of web development. From code generation to automated testing, AI tools are becoming indispensable.

### Edge Computing

Edge computing is bringing computation closer to users, resulting in faster load times and better user experiences.

### WebAssembly Maturity

WebAssembly is enabling near-native performance for web applications, opening new possibilities for complex web apps.

### Progressive Web Apps

PWAs are becoming the standard for delivering app-like experiences on the web.

### Conclusion

The future of web development is exciting. Staying ahead of these trends will be crucial for developers and businesses alike.
    `,
    author: {
      name: "Ahmed Hasan",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    category: "Technology",
    tags: ["Web Development", "Trends", "2025"],
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800",
    status: "published",
    isFeatured: true,
    views: 1250,
    createdAt: "2025-01-10",
  },
  {
    _id: "2",
    title: "Building Scalable React Applications",
    slug: "building-scalable-react-applications",
    shortDescription: "Best practices for large-scale React development",
    content: `
## Building Scalable React Applications

Creating React applications that scale well requires careful planning and adherence to best practices.

### Component Architecture

Proper component architecture is the foundation of scalable React apps.

### State Management

Choosing the right state management solution is crucial for complex applications.

### Performance Optimization

Learn how to optimize rendering and reduce bundle sizes.

### Testing Strategies

Implement comprehensive testing to ensure code quality.
    `,
    author: {
      name: "Sarah Ahmed",
      image:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    },
    category: "Development",
    tags: ["React", "JavaScript", "Best Practices"],
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
    status: "published",
    isFeatured: true,
    views: 980,
    createdAt: "2025-01-15",
  },
  {
    _id: "3",
    title: "Introduction to MERN Stack Development",
    slug: "introduction-mern-stack-development",
    shortDescription: "A comprehensive guide to MERN stack",
    content: `
## Introduction to MERN Stack Development

The MERN stack is one of the most popular technology stacks for building modern web applications.

### MongoDB

Learn about MongoDB's flexible document model and how to design your schema.

### Express.js

Build robust APIs with Express.js middleware and routing.

### React

Create dynamic user interfaces with React's component-based architecture.

### Node.js

Leverage JavaScript on the server side with Node.js.
    `,
    author: {
      name: "Rahman Khan",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    },
    category: "Tutorial",
    tags: ["MERN", "MongoDB", "React", "Node.js"],
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
    status: "published",
    isFeatured: false,
    views: 756,
    createdAt: "2025-01-20",
  },
  {
    _id: "4",
    title: "UI/UX Design Principles for Developers",
    slug: "ui-ux-design-principles-developers",
    shortDescription: "Essential design concepts every developer should know",
    content: `
## UI/UX Design Principles for Developers

Understanding design principles can help developers create more user-friendly applications.

### Visual Hierarchy

Learn how to guide users' attention through effective visual hierarchy.

### Color Theory

Understand how to use color effectively in your applications.

### Typography

Master the art of choosing and pairing fonts.

### Accessibility

Ensure your applications are accessible to all users.
    `,
    author: {
      name: "Fatima Rahman",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    },
    category: "Design",
    tags: ["UI/UX", "Design", "Accessibility"],
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    status: "published",
    isFeatured: false,
    views: 542,
    createdAt: "2025-01-25",
  },
  {
    _id: "5",
    title: "Securing Your Web Applications",
    slug: "securing-web-applications",
    shortDescription: "Essential security practices for web developers",
    content: `
## Securing Your Web Applications

Web security is more important than ever. Learn the essential practices to protect your applications.

### Common Vulnerabilities

Understand the most common security vulnerabilities and how to prevent them.

### Authentication Best Practices

Implement secure authentication mechanisms.

### Data Protection

Learn how to protect sensitive user data.

### Security Headers

Configure proper security headers for your applications.
    `,
    author: {
      name: "Ahmed Hasan",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100",
    },
    category: "Security",
    tags: ["Security", "Web Development", "Best Practices"],
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=800",
    status: "published",
    isFeatured: false,
    views: 823,
    createdAt: "2025-02-01",
  },
];

// Dummy Data for Team Members
export const TEAM_DATA = [
  {
    _id: "1",
    name: "MD. Rahman",
    slug: "md-rahman",
    position: "CEO & Founder",
    shortDescription: "Visionary leader with 10+ years in software industry",
    description:
      "Leading CodeCraft.BD with a vision to transform digital landscape in Bangladesh. Passionate about building great products and nurturing talent.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    email: "rahman@codecraft.bd",
    phone: "+880 1234 567891",
    facebook: "https://facebook.com/rahman",
    linkedin: "https://linkedin.com/in/rahman",
    github: "https://github.com/rahman",
    skills: ["Leadership", "Strategy", "Business Development"],
    status: "active",
    joinDate: "2020-01-01",
  },
  {
    _id: "2",
    name: "Sarah Ahmed",
    slug: "sarah-ahmed",
    position: "CTO",
    shortDescription: "Tech innovator and full-stack expert",
    description:
      "Driving technical excellence at CodeCraft.BD. Expert in scalable architecture and modern web technologies.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    email: "sarah@codecraft.bd",
    phone: "+880 1234 567892",
    facebook: "https://facebook.com/sarah",
    linkedin: "https://linkedin.com/in/sarah",
    github: "https://github.com/sarah",
    skills: ["React", "Node.js", "System Architecture"],
    status: "active",
    joinDate: "2020-03-15",
  },
  {
    _id: "3",
    name: "Ahmed Hasan",
    slug: "ahmed-hasan",
    position: "Lead Developer",
    shortDescription: "Full-stack developer with expertise in MERN stack",
    description:
      "Leading development teams to build robust web applications. Specializes in React, Node.js, and cloud technologies.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    email: "hasan@codecraft.bd",
    phone: "+880 1234 567893",
    facebook: "https://facebook.com/hasan",
    linkedin: "https://linkedin.com/in/hasan",
    github: "https://github.com/hasan",
    skills: ["React", "Node.js", "MongoDB", "AWS"],
    status: "active",
    joinDate: "2021-06-01",
  },
  {
    _id: "4",
    name: "Fatima Rahman",
    slug: "fatima-rahman",
    position: "UI/UX Designer",
    shortDescription: "Creative designer focused on user experience",
    description:
      "Creating beautiful and intuitive user interfaces. Expert in design systems, prototyping, and user research.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    email: "fatima@codecraft.bd",
    phone: "+880 1234 567894",
    facebook: "https://facebook.com/fatima",
    linkedin: "https://linkedin.com/in/fatima",
    github: "",
    skills: ["Figma", "UI Design", "UX Research", "Prototyping"],
    status: "active",
    joinDate: "2021-09-01",
  },
  {
    _id: "5",
    name: "Khalid Mahmud",
    slug: "khalid-mahmud",
    position: "Mobile Developer",
    shortDescription: "Cross-platform mobile app specialist",
    description:
      "Building high-quality mobile applications for iOS and Android. Expert in React Native and native mobile development.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
    email: "khalid@codecraft.bd",
    phone: "+880 1234 567895",
    facebook: "https://facebook.com/khalid",
    linkedin: "https://linkedin.com/in/khalid",
    github: "https://github.com/khalid",
    skills: ["React Native", "iOS", "Android", "Flutter"],
    status: "active",
    joinDate: "2022-01-15",
  },
];

// Dummy Data for Testimonials
export const TESTIMONIALS_DATA = [
  {
    _id: "1",
    name: "MD. Jalal Uddin",
    slug: "md-jalal-uddin",
    position: "CEO, StyleHub Bangladesh",
    company: "StyleHub Bangladesh",
    shortDescription: "E-commerce platform that transformed our business",
    content:
      "CodeCraft.BD delivered an exceptional e-commerce platform that significantly increased our online sales. Their team was professional, responsive, and understood our requirements perfectly.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100",
    rating: 5,
    status: "active",
    isFeatured: true,
    createdAt: "2024-06-20",
  },
  {
    _id: "2",
    name: "Dr. Mohammad Ali",
    slug: "dr-mohammad-ali",
    position: "Director, MedCare Hospital",
    company: "MedCare Hospital",
    shortDescription: "Healthcare system that improved our operations",
    content:
      "The healthcare management system developed by CodeCraft.BD has transformed our hospital operations. From patient registration to billing, everything is now streamlined and efficient.",
    image: "https://images.unsplash.com/photo-1618498082414-a6bb88f77442?w=100",
    rating: 5,
    status: "active",
    isFeatured: true,
    createdAt: "2024-08-25",
  },
  {
    _id: "3",
    name: "Sarah Chowdhury",
    slug: "sarah-chowdhury",
    position: "Founder, PropertyHub",
    company: "PropertyHub Bangladesh",
    shortDescription: "Real estate platform with great user experience",
    content:
      "Our real estate platform has received outstanding feedback from users. The team at CodeCraft.BD truly understands modern design and user experience. Highly recommended!",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100",
    rating: 5,
    status: "active",
    isFeatured: true,
    createdAt: "2024-10-15",
  },
  {
    _id: "4",
    name: "Rahim Khan",
    slug: "rahim-khan",
    position: "Manager, Taste of Bangladesh",
    company: "Taste of Bangladesh",
    shortDescription: "Restaurant app that increased our orders by 40%",
    content:
      "The restaurant management app developed by CodeCraft.BD has been a game-changer for our business. Online orders have increased by 40% and customer satisfaction is at an all-time high.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    rating: 4,
    status: "active",
    isFeatured: false,
    createdAt: "2024-11-10",
  },
];

// Dummy Data for Messages
export const MESSAGES_DATA = [
  {
    _id: "1",
    name: "MD. Jalal Uddin",
    email: "jalal@stylehub.bd",
    phone: "+880 1234 567890",
    subject: "E-commerce Project Inquiry",
    message:
      "Hi, I am interested in building an e-commerce website for my fashion business. Can you provide a quote and timeline?",
    status: "read",
    isRead: true,
    createdAt: "2025-01-15T10:30:00Z",
  },
  {
    _id: "2",
    name: "Dr. Mohammad Ali",
    email: "ali@medcare.bd",
    phone: "+880 1234 567891",
    subject: "Healthcare System Demo",
    message:
      "We would like to schedule a demo of your healthcare management system. Please contact us to discuss further.",
    status: "unread",
    isRead: false,
    createdAt: "2025-01-20T14:45:00Z",
  },
  {
    _id: "3",
    name: "Sarah Chowdhury",
    email: "sarah@propertyhub.bd",
    phone: "+880 1234 567892",
    subject: "Real Estate Platform Development",
    message:
      "We are looking for a team to develop a real estate platform with property listings, map view, and agent profiles. What is your availability?",
    status: "read",
    isRead: true,
    createdAt: "2025-01-22T09:15:00Z",
  },
  {
    _id: "4",
    name: "Ahmed Rahman",
    email: "ahmed@startup.bd",
    phone: "+880 1234 567893",
    subject: "SaaS Product Idea Discussion",
    message:
      "I have a SaaS product idea and would like to discuss the development process. Can we schedule a call?",
    status: "unread",
    isRead: false,
    createdAt: "2025-01-25T16:20:00Z",
  },
];

// Dummy Data for Website Settings
export const SETTINGS_DATA = {
  company: {
    name: "CodeCraft.BD",
    tagline: "Building Digital Excellence",
    description:
      "We craft premium software solutions that transform businesses. From web applications to mobile apps, we bring your digital vision to life.",
    email: "hello@codecraft.bd",
    phone: "+880 1234 567890",
    address: "Dhaka, Bangladesh",
    website: "https://codecraft.bd",
  },
  social: {
    facebook: "https://facebook.com/codecraftbd",
    twitter: "https://twitter.com/codecraftbd",
    linkedin: "https://linkedin.com/company/codecraftbd",
    github: "https://github.com/codecraftbd",
    instagram: "",
  },
  seo: {
    title: "CodeCraft.BD - Premium Software Solutions",
    description:
      "We craft premium software solutions that transform businesses. Web development, mobile apps, SaaS, and UI/UX design.",
    keywords:
      "software development, web development, mobile app, SaaS, UI/UX design",
    ogImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200",
  },
  branding: {
    primaryColor: "#06b6d4",
    secondaryColor: "#1e293b",
    accentColor: "#8b5cf6",
  },
};
