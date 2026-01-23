// import EcommerceMetrics from "../../components/ecommerce/EcommerceMetrics";
// import MonthlySalesChart from "../../components/ecommerce/MonthlySalesChart";
// import StatisticsChart from "../../components/ecommerce/StatisticsChart";
// import MonthlyTarget from "../../components/ecommerce/MonthlyTarget";
// import RecentOrders from "../../components/ecommerce/RecentOrders";
// import DemographicCard from "../../components/ecommerce/DemographicCard";
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
          {/* <EcommerceMetrics /> */}

          {/* Community Activity Chart - repurposed from MonthlySalesChart */}
          {/* <MonthlySalesChart /> */}
        </div>

        <div className="col-span-12 xl:col-span-5">
          {/* Community Goals - repurposed from MonthlyTarget */}
          {/* <MonthlyTarget /> */}
        </div>

        <div className="col-span-12">
          {/* Basic Nesti Info */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">Nesti Community Dashboard</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Welcome to the Nesti Community Admin Panel. This dashboard is designed for managing categories and services, monitoring community engagement, and overseeing platform activities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">Active Services</h3>
                <p className="text-3xl font-bold text-blue-600">40+</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-green-900 dark:text-green-100">Community Members</h3>
                <p className="text-3xl font-bold text-green-600">50+</p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100">Active Communities</h3>
                <p className="text-3xl font-bold text-purple-600">10+</p>
              </div>
            </div>
          </div>
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
