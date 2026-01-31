import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AllServicesTable from "../../components/tables/BasicTables/AllServices";

export default function AllServices() {
  return (
    <>
      <PageMeta
        title="React.js All Services Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js All Services Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="All services" />
      <div className="space-y-6">
        <ComponentCard title="All Services Table">
          <AllServicesTable />
        </ComponentCard>
      </div>
    </>
  );
}
