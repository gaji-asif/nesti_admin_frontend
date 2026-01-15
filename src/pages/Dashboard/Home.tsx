import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
import StatisticsChart from "../../components/ecommerce/StatisticsChart";
import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
import RecentOrders from "../../components/ecommerce/RecentOrders";
import DemographicCard from "../../components/ecommerce/DemographicCard";
import PageMeta from "../../components/common/PageMeta";

export default function Home() {
  return (
    <>
      <PageMeta
        title="Nesti Community Dashboard | Admin Panel"
        description="This is the Nesti Community Dashboard page for managing community services, metrics, and activities."
      />
      <div className="grid grid-cols-12 gap-4 md:gap-6">
        <div className="col-span-12 space-y-6 xl:col-span-7">
          {/* Community Metrics - repurposed from EcommerceMetrics */}
          <EcommerceMetrics />

          {/* Community Activity Chart - repurposed from MonthlySalesChart */}
          <MonthlySalesChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* Community Goals - repurposed from MonthlyTarget */}
          <MonthlyTarget />
        </div>

        <div className="col-span-12">
          {/* Service Statistics - repurposed from StatisticsChart */}
          <StatisticsChart />
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* Community Demographics - repurposed from DemographicCard */}
          {/* <DemographicCard /> */}
        </div>

        <div className="col-span-12 xl:col-span-7">
          {/* Recent Community Activities - repurposed from RecentOrders */}
          {/* <RecentOrders /> */}
        </div>
      </div>
    </>
  );
}
