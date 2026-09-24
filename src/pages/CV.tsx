import { Link } from "react-router";
import LinkButton from "../components/LinkButton";
import PageHeader from "../components/PageHeader";
import Placeholder from "../components/Placeholder";
import { site } from "../data/site";

export default function CV() {
  return (
    <>
      <PageHeader title="Curriculum Vitae" />

      {/* To enable the download, set `cvUrl` in src/data/site.ts. */}
      <p>
        <LinkButton href={site.cvUrl} download>
          Download CV (PDF)
        </LinkButton>
      </p>

      {!site.cvUrl && (
        <p className="mt-4 text-sm text-muted">
          <Placeholder>[PLACEHOLDER]</Placeholder> The CV file has not been added yet.
        </p>
      )}

      <p className="mt-10 max-w-2xl text-muted">
        Education and coursework are listed on the{" "}
        <Link to="/about" className="link">
          About
        </Link>{" "}
        page, and current work on the{" "}
        <Link to="/projects" className="link">
          Projects
        </Link>{" "}
        page.
      </p>
    </>
  );
}
