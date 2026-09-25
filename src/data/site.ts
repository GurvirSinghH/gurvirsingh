/** Personal information used across the site. */

export const site = {
  name: "Gurvir Singh",
  // Short form shown on the home page, under the name.
  shortDegree: "B.Tech CSE (AI & Data Science)",

  // Address of the live site, without a trailing slash. Used for canonical URLs,
  // Open Graph tags and the sitemap.
  url: "https://gurvir-singh-website.vercel.app",

  github: "https://github.com/GurvirSinghH",

  // LinkedIn profile URL, e.g. "https://www.linkedin.com/in/…". Hidden while null.
  linkedin: null as string | null,

  email: "gurvir.singh.panesar@gmail.com",

  // Path of the CV PDF in /public. Source: cv/gurvir-singh-cv.tex (see README).
  cvUrl: "/files/gurvir-singh-cv.pdf",

  education: {
    degree: "B.Tech Computer Science & Engineering",
    specialization: "Artificial Intelligence & Data Science",
    institution: "GNA University, Phagwara, Punjab, India",
    year: "3rd year",
    cgpa: "8.13/10",
    expectedGraduation: "2028",
  },

  coursework: [
    "Data Visualization",
    "Theory of Computation",
    "Software Engineering",
    "Computer Graphics",
  ],

  // Shown on the About page: what I am focused on now, then broader interests.
  interests: {
    current: [
      "Machine Learning",
      "Physics-Informed Machine Learning",
      "Data Science",
      "Artificial Intelligence",
    ],
    broader: ["Scientific Computing", "Software Engineering"],
  },

  languages: ["Python", "C++", "C", "Java", "HTML", "CSS"],
  mlTools: ["NumPy", "Pandas", "Scikit-learn", "Matplotlib", "Seaborn", "Plotly", "Streamlit"],
};
