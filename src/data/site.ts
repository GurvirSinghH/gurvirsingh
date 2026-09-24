/**
 * Personal information used across the site.
 *
 * Anything written as "[TODO]" or "[PLACEHOLDER]" is rendered with a
 * highlighted marker so it is easy to spot. Replace it with the real value.
 */

export const TODO = "[TODO]";
export const PLACEHOLDER = "[PLACEHOLDER]";

/** True for strings that are still waiting for real content. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return value == null || /^\[[^\]]*\b(TODO|PLACEHOLDER)\b/.test(value);
}

export const site = {
  name: "Gurvir Singh",
  degree: "B.Tech Computer Science & Engineering",
  specialization: "Artificial Intelligence & Data Science",
  shortDegree: "B.Tech CSE — AI & Data Science",
  location: "India",

  // Address of the live site, without a trailing slash. Used for canonical URLs,
  // Open Graph tags and the sitemap.
  url: "https://gurvir-singh-website.vercel.app",

  github: "https://github.com/GurvirSinghH",

  // LinkedIn profile URL, e.g. "https://www.linkedin.com/in/…". Hidden while null.
  linkedin: null as string | null,

  // TODO: replace with your email address, e.g. "name@example.com".
  email: "gurvir.singh.panesar@gmail.com",

  // Path of the CV PDF in /public. Source: cv/gurvir-singh-cv.tex (see README).
  // Set to null to show a placeholder instead of the download link.
  cvUrl: "/files/gurvir-singh-cv.pdf" as string | null,

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
