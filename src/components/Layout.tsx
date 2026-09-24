import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { pageMeta } from "../lib/pageMeta";
import Footer from "./Footer";
import Navbar from "./Navbar";

export default function Layout() {
  const { pathname } = useLocation();

  // Start each new page at the top (in-page #anchor links are unaffected),
  // and update the browser tab title.
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = pageMeta(pathname).title;
  }, [pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-10 focus:bg-white focus:px-3 focus:py-2"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="container-page flex-1 pt-12 sm:pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
