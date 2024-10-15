import { Icons } from "@/components/icons";
import { HomeIcon, NotebookIcon } from "lucide-react";

export const DATA = {
  name: "Mark Fasel",
  initials: "MF",
  url: "https://markfasel.co",
  location: "Tampa Bay, FL",
  locationLink: "https://www.google.com/maps/place/tampa",
  description:
    "Software Engineer turned entrepreneur, passionate about building innovative solutions and helping others succeed. I thrive in developing cutting-edge projects, from full-stack development to scalable systems.",
  summary:
    "At the end of 2024, I wrapped up my role as a Sr. Software Engineer at [Scorpion](https://www.scorpion.co), where I specialized in Front-End Development and UX. I’m passionate about full-stack JavaScript development, scalable solutions, and exploring new innovations in AI and Web3. Currently, I’m providing freelance services while seeking my next challenge. My previous experience includes working with **Publix Super Markets**, **Dave Ramsey**, and **Johns Hopkins All Children's Hospital**. In September, my wife and I launched [Next Level Tutoring](https://www.nextleveltutoring.net), focusing on 1st to 4th graders. Outside of coding, I’m actively engaging on platforms like X, Facebook, Instagram, and exploring my voice on Medium. I enjoy spending time with my family and playing video games, especially Fortnite! Always eager to connect with like-minded individuals, whether through technology, education, or collaboration. Let’s create something amazing together!",
  avatarUrl: "/me.png",
  skills: [
    "React",
    "Next.js",
    "Typescript",
    "Node.js",
    "Python (learning)",
    "Go (learnig)",
    "Postgres",
    "Docker",
    "Kubernetes",
    "Java",
    "C++",
    "C# / .NET",
    "Java",
    "SQL",
    "GraphQL",
    "NoSQL",
    "MongoDB",
    "AWS",
    "Azure",
    "Cloud Soltuions",
    "PHP",
    "Laraval",
    "CakePHP",
    "CodeIgniter",
    "Drupal",
    "WordPress",
    "Click Funnels",
    "Go High Level",
    "Digital Marketing",
    "Angular",
    "HTML/CSS",
    "SASS",
    "Soft-Skills",
    "Great Communicator",
    "Detailed oriented",
    "Team Player",
    "Works Well Independently",
    "Self-starter",
    "UX Design",
    "UI Engineering",
    "UX Certified",
    "B.S. Web Design & Development",
    "M.S. Internet Marketing",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
  ],
  contact: {
    email: "me@markfasel.dev",
    tel: "+19419330998",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/thefaze87",
        icon: Icons.github,
        navbar: true,
      },
      Dribbble: {
        name: "Dribbble",
        url: "https://dribbble.com/thefaze87",
        icon: Icons.dribbble,
        navbar: true,
      },
      Facebook: {
        name: "GitHub",
        url: "https://facebook.com/markfasel",
        icon: Icons.facebook,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/markfasel",
        icon: Icons.linkedin,
        navbar: true,
      },
      X: {
        name: "X",
        url: "https://www.x.com/markfasel",
        icon: Icons.x,

        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "mailto:me@markfasel.dev",
        friendlyUrl: "me@markfasel.dev",
        icon: Icons.email,
        navbar: true,
      },
    },
  },

  work: [
    {
      company: "Sorpion",
      href: "https://scorpion.co",
      badges: [],
      location: "Remote - Valencia, CA",
      title: "Sr. Software Enineer - Front-end",
      logoUrl: "/scorpion.png",
      start: "2020",
      end: "2024",
      description:
        "Implemented the Bitcoin discreet log contract (DLC) protocol specifications as an open source Typescript SDK. Dockerized all microservices and setup production kubernetes cluster. Architected a data lake using AWS S3 and Athena for historical backtesting of bitcoin trading strategies. Built a mobile app using react native and typescript.",
      links: [
        {
          type: "Website",
          href: "https://scorpion.co",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
    {
      company: "Publix Super Marketings",
      badges: [],
      href: "https://publix.com",
      location: "Lakeland, FL",
      title: "Software Engineer - Full Stack",
      logoUrl: "/publix.png",
      start: "2019",
      end: "2020",
      description:
        "Implemented a custom Kubernetes controller in Go to automate the deployment of MySQL and ProxySQL custom resources in order to enable 2,000+ internal developers to instantly deploy their app databases to production. Wrote several scripts in Go to automate MySQL database failovers while maintaining master-slave replication topologies and keeping Zookeeper nodes consistent with changes.",
      links: [
        {
          type: "Website",
          href: "https://publix.co",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
    {
      company: "Differential",
      href: "https://differential.com/",
      badges: [],
      location: "Remote - Chicago, IL",
      title: "Software Engineer - Contract",
      logoUrl: "/differential.png",
      start: "2019",
      end: "2019",
      description:
        "Architected and wrote the entire MVP of the GeForce Now Cloud Gaming internal admin and A/B testing dashboard using React, Redux, TypeScript, and Python.",
      links: [
        {
          type: "Website",
          href: "https://differential.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
    {
      company: "Ramsey Solutions (DaveRamsey.com)",
      href: "https://daveramsey.com",
      badges: [],
      location: "Franklin, TN",
      title: "Software Engineer - Front-end",
      logoUrl: "/ramsey.png",
      start: "2018",
      end: "2019",
      description:
        "Built React and Front-end apps for our internal prodAt Dave Ramsey, I focused on front-end development, migrating legacy jQuery and Handlebars code to React while ensuring ADA compliance, security, and seamless cross-domain checkout functionality. I collaborated with backend teams using KonaKart integrations, contributed to the Gazelle design system, and supported custom styling across web properties. Additionally, I implemented clean coding practices, performed unit testing with JEST, and developed mobile solutions with React Native to ensure high-quality, maintainable, and scalable applications.​",
      links: [
        {
          type: "Website",
          href: "https://daveramsey.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
    {
      company: "Johns Hopkins All Children's Hospital",
      href: "https://hopkinsallchildrens.com/",
      badges: [],
      location: "St. Petersburg, FL",
      title: "Sr. Software Engineer",
      logoUrl: "/johnshopkins.png",
      start: "2014",
      end: "2018",
      description:
        "At Johns Hopkins, as a Senior Software Developer, I managed the internal intranet and led the redesign of the main website, ensuring a seamless user experience. My work involved converting legacy systems, such as ColdFusion and Angular, into modern React front-ends integrated with C# backend APIs. I maintained and enhanced existing Angular applications while streamlining the migration process. Additionally, I collaborated with cross-functional teams to implement new features, optimize performance, and ensure security and scalability across all platforms, focusing on modernizing our tech stack and delivering efficient digital solutions.",
      links: [
        {
          type: "Website",
          href: "https://hopkinsallchildrens.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
    {
      company: "LawLytics",
      href: "https://lawlytics.com/",
      badges: [],
      location: "Remote - AZ",
      title: "Software Developer",
      logoUrl: "/lawlytics.png",
      start: "2012",
      end: "2014",
      description:
        "At LawLytics, I was initially a Senior Frontend Developer, working extensively with PHP, Ruby on Rails, and heavy vanilla JavaScript to build client-facing web applications and CMS solutions. I focused on developing responsive interfaces and optimizing usability. Over time, I was promoted to Creative Director, overseeing the entire creative process, UX design, and frontend development. In this role, I managed a team of developers and designers, ensuring the delivery of cohesive, engaging digital experiences while maintaining high standards for performance and design consistency across all projects.",
      links: [
        {
          type: "Website",
          href: "https://lawlytics.com",
          icon: <Icons.globe className="size-3" />,
        },
      ],
    },
  ],
  education: [
    {
      school: "Full Sail Univerity",
      href: "https://fullsail.edu",
      degree: "M.S. Internet Marketing",
      logoUrl: "/fullsail.png",
      start: "2010",
      end: "2011",
    },
    {
      school: "Full Sail Univerity",
      href: "https://fullsail.edu",
      degree: "B.S. Web Development",
      logoUrl: "/fullsail.png",
      start: "2010",
      end: "2011",
    },
    {
      school: "Nielesen Norman Group",
      href: "https://nielsennormangroup.com",
      degree: "UX Certification",
      logoUrl: "/nng.png",
      start: "2020",
      end: "2020",
    },
  ],
  projects: [
    {
      title: "Scorpion",
      href: "https://scorpion.co",
      dates: "Nov 2020 - Oct 2024",
      active: true,
      description:
        "At Scorpion, I worked on internal sales and marketing tools with CSX and built enterprise solutions like the Enterprise Portal for franchise clients. I also created a responsive site for franchisees and developed a React billing app. My focus was on front-end development, adhering to ADA standards, and ensuring a seamless, accessible user experience across devices.",
      technologies: [
        "React",
        "Typescript",
        "JavaScript",
        "RxJS",
        "HTML5",
        "CSS3",
        "SASS",
      ],
      links: [
        {
          type: "Website",
          href: "https://scorpion.co",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/chat-collect.mp4",
    },
    {
      title: "Scorpion Shared UI",
      href: "https://scorpion.co",
      dates: "2023 -  2024",
      active: true,
      description:
        "I built a full design system and front-end framework using SCSS, CSS3, and modern web standards. Inspired by frameworks like Tailwind, and systems such as Gazelle from Dave Ramsey and IBM’s Carbon, I crafted scalable, responsive components that enhanced user experience and accessibility.",
      technologies: ["React", "HTML5", "CSS3", "SASS"],
      links: [
        {
          type: "Website",
          href: "https://scorpion.co",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.magicui.design/bento-grid.mp4",
    },
    {
      title: "Next Level Tutoring",
      href: "https://nextleveltutoring.net",
      dates: "2024",
      active: true,
      description:
        "Developed a fully responsive online business in 96 hours as a challenge. Focused on business dev, AI/ChatGPT priming, social optimization, and building a website for (Next Level Tutoring)[https://www.nextleveltutoring.net]. Launched with TutorBoss funnel & ad strategy. Reach out to learn more!",
      technologies: [
        "Custom WIX Development",
        "JavaScript",
        "CMS",
        "HTML5",
        "TailwindCSS",
        "CSS3",
        "Cloudflare",
        "Stripe",
        "Funnel Design",
        "Funnel Development",
        "Social Media Marketing",
        "AI Integration",
        "ChatGPT",
      ],
      links: [
        {
          type: "Website",
          href: "https://nextleveltutoring.net",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Funnel",
          href: "https://youronlinetutor.net",
          icon: <Icons.globe className="size-3" />,
        },
      ],
      image: "",
      video: "https://cdn.llm.report/openai-demo.mp4",
    },
    {
      title: "Fortnite X & Discord Bot",
      href: "https://github.com/thefaze87",
      dates: "2023 - Present",
      active: true,
      description:
        "I’m creating a Fortnite bot for Discord and X that auto-posts item shop updates at reset times, keeping communities informed in real-time. It will expand to other platforms, offering creators a complete automated solution for shop updates and enhancing engagement.",
      technologies: [
        "JavaScript",
        "React",
        "Node.js",
        "Discord.js",
        "TwitterAPI",
        "TailwindCSS",
        "Cron Jobs",
        "MongoDB",
        "Netlify",
        "Heroku",
        "OAuth 2.0",
        "Web3",
      ],
      links: [
        {
          type: "Source (coming soon)",
          href: "https://github.com/thefaze87",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
    },
    {
      title: "DaveRamsey.com E-Commerce UX",
      href: "https://github.com/thefaze87",
      dates: "2023 - Present",
      active: true,
      description:
        "I worked on converting legacy jQuery and Handlebars to React for Dave Ramsey’s e-commerce front end, ensuring secure, multi-domain integration. The checkout module, embedded via iframes, was styled dynamically to match each site’s design. It fit within the Gazelle design framework, which I helped develop, allowing customization and consistency across projects.",
      technologies: [
        "JavaScript",
        "React",
        "Node.js",
        "Discord.js",
        "TwitterAPI",
        "TailwindCSS",
        "Cron Jobs",
        "MongoDB",
        "Netlify",
        "Heroku",
        "OAuth 2.0",
        "Web3",
      ],
      links: [
        {
          type: "Source (coming soon)",
          href: "https://github.com/thefaze87",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video:
        "https://pub-83c5db439b40468498f97946200806f7.r2.dev/automatic-chat.mp4",
    },
  ],
  hackathons: [
    {
      title: "Date Night Idea React Native App",
      dates: "Current",
      location: "Tampa, FL",
      description:
        "I am currently developing a fun date night idea generator using React Native and OpenAi and ChatGPT as well as tapping into Google Maps api to provide suggestions near by your location!",
      image: "/flash.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Clue Finder Tour",
      dates: "2024-2025",
      location: "Tampa, FL",
      description:
        "Developing a React application for virtual tours / scavenger hunts that contains both a web and mobile component. This is another side project my wife and I have",
      image: "/clue-finder.png",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "Next Level Tutoring",
      dates: "August 2024",
      location: "Tampa, FL",
      description:
        "Developed a fully responsive Wix site and implemented funnel marketing and launched a complete social media campaign for my wifes online tutoring business.",
      icon: "public",
      image: "/nextlevel.png",
      links: [
        {
          title: "Website",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://www.nextleveltutoring.net",
        },
        {
          title: "Funnel",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://www.youronlinetutor.net",
        },
        {
          title: "Facebook",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://www.facebook.com/nextleveltutor",
        },
      ],
    },
    {
      title: "Custom Design System and UI Framework",
      dates: "2022-2024",
      location: "Remote",
      description:
        "Developed a full design system for Scorpion that focused on ensuring consistency for the user experience across our internal and client facing products. I built a custom framework that utilized Sass and Vanialla CSS and took inspiration from other frameworks like TailwindCss and Bootstrap as well as design systems such as Gazzelle by Dave Ramsey, Carbon by IBM and a few others! In addition, it focuses on an NPM package that can be deployed to all sites and used in the React, Angular, and custom sites. It also features custom UI components!",
      image: "/code.png",
      links: [],
    },
    {
      title: "Gaming eSports Community",
      dates: "October 2023 - Present",
      location: "Florida",
      description:
        "I have been developing as a hobby an eSports (Guardian Gaming) community and organization. The main app is being built with React and integrate several apis including, X, Twitch, and YouTube. I have built a discord server and currently building a python and react app for posting to X my support a creator code and Fortnite item shop image at the reset each day as well as to my discord server as a custom bot. It's been a fun side project and hobby.",
      image: "/guardian-gaming.png",
      win: "Best Data Hack",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2018/white.svg",
      links: [],
    },
    {
      title: "Construction eLink",
      dates: "Jan 2017",
      location: "Remote",
      description:
        "Developed a serverless architecture angular project that allows users to buy and sell construction equipment. The client wanted the architecture to utilize Amazon S3 and maintain a simple build. The entire site was done using Angular and latest standards at the time.",
      image: "/link.png",
      links: [
        {
          title: "Website",
          icon: <Icons.globe className="h-4 w-4" />,
          href: "https://www.constructionelink.com/#!/",
        },
      ],
    },
  ],
} as const;
