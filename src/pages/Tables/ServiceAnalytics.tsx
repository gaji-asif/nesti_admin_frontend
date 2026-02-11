import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ServiceAnalyticsTable from "../../components/tables/BasicTables/ServiceAnalyticsTable";

export default function ServiceAnalytics() {
  return (
    <>
      <PageMeta
        title="Service Analytics Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is Service Analytics Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Service Analytics" />
      <div className="space-y-6">
        <ComponentCard title="Service Click Analytics">
          <ServiceAnalyticsTable />
        </ComponentCard>
      </div>
    </>
  );
}