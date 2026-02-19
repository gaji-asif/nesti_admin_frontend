import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import ServiceAnalyticsTable from "../../components/tables/BasicTables/ServiceAnalyticsTable";

export default function ServiceAnalytics() {
  return (
    <>
      <PageMeta
        title="Service Analytics Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="Service analytics and metrics for the Nesti admin dashboard"
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