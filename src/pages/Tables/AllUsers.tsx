import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AllUsersTable from "../../components/tables/BasicTables/AllUsers";
import { Link } from "react-router";
import Button from "../../components/ui/button/Button";

export default function AllUsers() {
  return (
    <>
      <PageMeta
        title="React.js All Users Dashboard | TailAdmin - Next.js Admin Dashboard Template"
        description="This is React.js All Users Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="All users" />
      <div className="mb-4">
        <Link to="/all-reviews">
          <Button size="sm" className="px-3 py-1 bg-gray-100 hover:bg-gray-200">All Reviews</Button>
        </Link>
      </div>
      <div className="space-y-6">
        <ComponentCard title="All Users Table">
          <AllUsersTable />
        </ComponentCard>
      </div>
    </>
  );
}