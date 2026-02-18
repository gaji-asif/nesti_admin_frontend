import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AllEventsTable from "../../components/tables/BasicTables/AllEventsTable";

export default function AllEvents() {
  return (
    <>
      <PageMeta
        title="React.js All Events Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js All Events Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="All events" />
      <div className="space-y-6">
        <ComponentCard title="All Events Table">
          <AllEventsTable />
        </ComponentCard>
      </div>
    </>
  );
}
