import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ComponentCard from "../../components/common/ComponentCard";
import PageMeta from "../../components/common/PageMeta";
import AllReviewsTable from "../../components/tables/BasicTables/AllReviews";

export default function AllReviews() {
	return (
		<>
			<PageMeta
				title="React.js All Reviews Dashboard | TailAdmin - Next.js Admin Dashboard Template"
				description="This is React.js All Reviews Dashboard page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
			/>
			<PageBreadcrumb pageTitle="All reviews" />
			<div className="space-y-6">
				<ComponentCard title="All Reviews Table">
					<AllReviewsTable />
				</ComponentCard>
			</div>
		</>
	);
}
