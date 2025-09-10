import { About, Blog, Gallery, Home, Newsletter, Person, Social, Work } from "@/types";
import { Line, Logo, Row, Text } from "@once-ui-system/core";

const person: Person = {
  firstName: "Nathanael",
  lastName: "Johnson",
  name: `Nathanael Johnson`,
  role: "Applied AI Graduate Student",
  avatar: "/images/avatar.jpg",
  email: "njjohnson1@mail.lipscomb.edu",
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
    icon: "x",
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
  image: "/images/projects/mental-health-llm/cover.png",
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
      I&apos;m Nathanael, an Applied AI graduate student from Saba, Netherlands Antilles, currently studying at Lipscomb University.
      <br /> I&apos;m passionate about AI applications in healthcare, finance, and data science.
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
        Nathanael is a passionate Applied AI graduate student from Saba, Netherlands Antilles, currently pursuing his M.S. in Applied Artificial Intelligence at Lipscomb University. 
        With a strong background in Data Science and a keen interest in AI applications across healthcare, finance, and data analytics, 
        he enjoys working out, hiking, cinematography, drawing, video games, and board games in his free time.
      </>
    ),
  },
  work: {
    display: true, // set to false to hide this section
    title: "Academic & Research Experience",
    experiences: [
      {
        company: "Lipscomb University",
        timeframe: "2023 - Present",
        role: "M.S. Applied AI Student",
        achievements: [
          <>
            Conducting research on bias and fairness in Large Language Models for mental health applications,
            contributing to advancing responsible AI deployment in healthcare.
          </>,
          <>
            Developing predictive models and machine learning systems across various domains including
            healthcare, finance, and transportation optimization.
          </>,
        ],
        images: [],
      },
      {
        company: "Middle Tennessee State University",
        timeframe: "2022 - 2023",
        role: "M.S. Data Science Student",
        achievements: [
          <>
            Completed advanced coursework in statistical methods, predictive modeling, and large-scale
            data analysis, building expertise in applied analytics.
          </>,
          <>
            Developed multiple data science projects including market analysis, customer segmentation,
            and business intelligence dashboards.
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
        description: <>M.S. - Applied Artificial Intelligence (Currently enrolled, expected July 2025)</>,
      },
      {
        name: "Middle Tennessee State University",
        description: <>M.S. - Data Science</>,
      },
      {
        name: "Lipscomb University",
        description: <>B.S. - Data Science (Graduated December 2022)</>,
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
  title: "Writing about design and tech...",
  description: `Read what ${person.name} has been up to recently`,
  // Create new blog posts by adding a new .mdx file to app/blog/posts
  // All posts will be listed on the /blog route
};

const work: Work = {
  path: "/work",
  label: "Work",
  title: `Projects – ${person.name}`,
  description: `Design and dev projects by ${person.name}`,
  // Create new project pages by adding a new .mdx file to app/blog/posts
  // All projects will be listed on the /home and /work routes
};

const gallery: Gallery = {
  path: "/gallery",
  label: "Gallery",
  title: `Photo gallery – ${person.name}`,
  description: `A photo collection by ${person.name}`,
  // Images by https://lorant.one
  // These are placeholder images, replace with your own
  images: [
    {
      src: "/images/gallery/horizontal-1.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-4.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-3.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-1.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/vertical-2.jpg",
      alt: "image",
      orientation: "vertical",
    },
    {
      src: "/images/gallery/horizontal-2.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/horizontal-4.jpg",
      alt: "image",
      orientation: "horizontal",
    },
    {
      src: "/images/gallery/vertical-3.jpg",
      alt: "image",
      orientation: "vertical",
    },
  ],
};

export { person, social, newsletter, home, about, blog, work, gallery };
