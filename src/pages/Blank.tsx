import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";
import ComponentCard from "../components/common/ComponentCard";
import Button from "../components/ui/button/Button";
import { Link } from "react-router";

export default function Blank() {
  return (
    <>
      <PageMeta
        title="Blank — Nesti Dashboard"
        description="Blank helper page for the admin dashboard"
      />

      <PageBreadcrumb pageTitle="Blank Page" />

      <div className="space-y-6">
        <ComponentCard title="Blank Page — Start Here">
          <div className="mx-auto w-full max-w-[720px] text-center">
            <h3 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
              Blank Page Template
            </h3>

            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
              Use this page as a starting point for new pages. Add your
              components, forms or tables inside the card below.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/new-event">
                <Button size="md" variant="primary">Create Event</Button>
              </Link>
              <Link to="/all-events">
                <Button size="md" variant="outline">View All Events</Button>
              </Link>
            </div>
          </div>
        </ComponentCard>
      </div>
    </>
  );
}
