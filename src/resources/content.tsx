import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";
import { getImagePath } from "@/utils/image";

const person: Person = {
  firstName: "Nathanael",
  lastName: "Johnson",
  name: `Nathanael Johnson`,
  role: "Applied AI & Data Science Professional",
  avatar: getImagePath("/images/avatar.jpg"),
  email: "nathanaeljdj@gmail.com",
  location: "America/Chicago", // Expecting the IANA time zone identifier, e.g., 'Europe/Vienna'
  languages: ["English"], // optional: Leave the array empty if you don't want to display languages
};

const newsletter: Newsletter = {
  display: false,
  title: <>Subscribe to {person.firstName}&apos;s Newsletter</>,
  description: <>Updates on AI research and data science projects</>,
};

const social: Social = [
  // Links are automatically displayed.
  // Import new icons in /once-ui/icons.ts
  {
    name: "GitHub",
    icon: "github",
    link: "https://github.com/nathanaelhub",
  },
  {
    name: "LinkedIn",
    icon: "linkedin",
    link: "https://www.linkedin.com/in/nathanaeljdjohnson/",
  },
  {
    name: "Medium",
    icon: "link",
    link: "https://medium.com/@nathanaeljdj",
  },
  {
    name: "Twitter",
    icon: "twitter",
    link: "https://x.com/Natex07",
  },
  {
    name: "Email",
    icon: "email",
    link: `mailto:${person.email}`,
  },
];

const home: Home = {
  path: "/",
  image: getImagePath("/images/projects/mental-health-llm/cover.jpg"),
  label: "Home",
  title: `${person.name}'s Portfolio`,
  description: `Portfolio website showcasing my work as a ${person.role}`,
  headline: <>Building AI solutions for tomorrow&apos;s challenges</>,
  featured: {
    display: true,
    title: (
      <Row gap="12" vertical="center">
        <strong className="ml-4">Mental Health LLM Evaluation</strong>{" "}
        <Line background="brand-alpha-strong" vert height="20" />
        <Text marginRight="4" onBackground="brand-medium">
          Featured work
        </Text>
      </Row>
    ),
    href: "/work/mental-health-llm-evaluation",
  },
  subline: (
    <>
      I&apos;m Nathanael, an Applied AI and Data Science professional from Saba, Netherlands Antilles, based in Nashville, TN.
      <br /> I&apos;m passionate about building AI solutions across healthcare, finance, and data science.
    </>
  ),
};

const about: About = {
  path: "/about",
  label: "About",
  title: `About – ${person.name}`,
  description: `Meet ${person.name}, ${person.role} from Saba, Netherlands Antilles`,
  tableOfContent: {
    display: true,
    subItems: false,
  },
  avatar: {
    display: true,
  },
  calendar: {
    display: false,
    link: "https://cal.com",
  },
  intro: {
    display: true,
    title: "Introduction",
    description: (
      <>
        Nathanael is an Applied AI and Data Science professional from Saba, Netherlands Antilles, based in Nashville, TN.
        He holds an M.S. in Applied Artificial Intelligence and a B.S. in Data Science from Lipscomb University.
        With a background spanning business intelligence, machine learning, and healthcare AI research,
        he is passionate about building data-driven solutions that create real-world impact.
        Outside of work, he enjoys working out, hiking, cinematography, drawing, video games, and board games.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Work Experience",
    experiences: [
      {
        company: "Lipscomb University",
        timeframe: "December 2025 – Present",
        role: "College of Computing Assistant",
        achievements: [
          <>
            Built AI demonstration projects including a physical therapy pose estimation system and a
            message routing interface to teach AI concepts to diverse audiences.
          </>,
        ],
        images: [],
      },
      {
        company: "ROX Analytics",
        timeframe: "Jan 2025 – October 2025",
        role: "Business Intelligence Developer Intern",
        achievements: [
          <>
            Built and maintained operational Power BI dashboards (Power Query, M-code, DAX) with advanced
            visualization techniques to track financial and service-line KPIs.
          </>,
          <>
            Executed data integrity routines and SQL-based model testing on large healthcare datasets,
            troubleshooting sources and triaging BI support requests.
          </>,
          <>
            Presented data-driven insights in client-facing reports and meetings, driving informed
            decision-making and adoption of analytics outputs.
          </>,
        ],
        images: [],
      },
      {
        company: "Amplion, Clinical Communications, Inc.",
        timeframe: "October 2022 – March 2023",
        role: "Business Intelligence Intern",
        achievements: [
          <>
            Developed four comprehensive reports using Power BI and Tableau, streamlining nursing data
            from multiple locations and reducing analysis time by 75%.
          </>,
          <>
            Created interactive data visualization dashboards using JavaScript, HTML, and Plotly,
            improving stakeholder engagement and decision-making processes.
          </>,
        ],
        images: [],
      },
    ],
  },
  studies: {
    display: true, // set to false to hide this section
    title: "Education",
    institutions: [
      {
        name: "Lipscomb University",
        description: <>M.S. - Applied Artificial Intelligence — Graduated August 2025 | GPA: 3.7</>,
      },
      {
        name: "Lipscomb University",
        description: <>B.S. - Data Science — Graduated December 2022</>,
      },
    ],
  },
  technical: {
    display: true, // set to false to hide this section
    title: "Technical skills",
    skills: [
      {
        title: "Python & Machine Learning",
        description: (
          <>Proficient in Python for data science, machine learning, and AI applications including predictive modeling, data analysis, and neural networks.</>
        ),
        tags: [
          {
            name: "Python",
            icon: "python",
          },
          {
            name: "TensorFlow",
            icon: "tensorflow",
          },
          {
            name: "Scikit-learn",
            icon: "scikitlearn",
          },
        ],
        images: [],
      },
      {
        title: "Data Science & Analytics",
        description: (
          <>Experienced in statistical analysis, data visualization, and building predictive models for business insights and decision-making.</>
        ),
        tags: [
          {
            name: "Tableau",
            icon: "tableau",
          },
          {
            name: "SQL",
            icon: "sql",
          },
          {
            name: "R",
            icon: "r",
          },
        ],
        images: [],
      },
      {
        title: "Web Development",
        description: (
          <>Building responsive web applications and dashboards using modern frameworks and technologies.</>
        ),
        tags: [
          {
            name: "JavaScript",
            icon: "javascript",
          },
          {
            name: "React",
            icon: "react",
          },
          {
            name: "HTML/CSS",
            icon: "html",
          },
        ],
        images: [],
      },  
    ],
  },
};

const blog: Blog = {
  path: "/blog",
  label: "Blog",
  title: "Writing about AI and data science...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `AI, machine learning, and data science projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Japan 2025 photos
  images: [
    {
      src: getImagePath("/images/gallery/japan-1.jpg"),
      alt: "Japan travel photo 1",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-2.jpg"),
      alt: "Japan travel photo 2",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-3.jpg"),
      alt: "Japan travel photo 3",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-4.jpg"),
      alt: "Japan travel photo 4",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-5.jpg"),
      alt: "Japan travel photo 5",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-6.jpg"),
      alt: "Japan travel photo 6",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-7.jpg"),
      alt: "Japan travel photo 7",
      orientation: "horizontal",
    },
    {
      src: getImagePath("/images/gallery/japan-8.jpg"),
      alt: "Japan travel photo 8",
      orientation: "horizontal",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
