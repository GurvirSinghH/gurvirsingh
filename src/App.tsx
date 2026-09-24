import { Navigate, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPostPage from "./pages/BlogPost";
import CV from "./pages/CV";
import Home from "./pages/Home";
import NotePage from "./pages/Note";
import Notes from "./pages/Notes";
import NotFound from "./pages/NotFound";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/project-details";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:slug" element={<ProjectDetails />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
        <Route path="notes" element={<Notes />} />
        <Route path="notes/:slug" element={<NotePage />} />
        <Route path="about" element={<About />} />
        <Route path="cv" element={<CV />} />
        {/* Contact details now live on the About page. */}
        <Route path="contact" element={<Navigate to="/about" replace />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
