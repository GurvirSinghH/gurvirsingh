import { Link } from "react-router";
import PageHeader from "../components/PageHeader";

export default function NotFound() {
  return (
    <>
      <PageHeader title="Page not found">
        <p>The page you are looking for does not exist.</p>
      </PageHeader>
      <p>
        <Link to="/" className="link">
          Go to the home page
        </Link>
      </p>
    </>
  );
}
