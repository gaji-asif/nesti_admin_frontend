
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";

import { useState, useMemo, useEffect } from "react";
import { useServices } from "../../../hooks/useApiData";
import { useServiceClickSummary } from "../../../hooks/useApiData";

interface ReportData {
  serviceName: string;
  advantageClicks: number;
  websiteVisitClicks: number;
}

export default function ServiceAnalyticsTable() {
  const { services, loading: servicesLoading, error: servicesError } = useServices();
  const { clickSummary, loading: analyticsLoading, error: analyticsError } = useServiceClickSummary();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedCount, setLoadedCount] = useState(10);
  const itemsPerPage = 20;

  // Reset loaded count when search changes
  useEffect(() => {
    setLoadedCount(10);
  }, [searchTerm]);

  // Merge services with analytics data
  const reportsData: ReportData[] = useMemo(() => {
    return services.map(service => {
      // Find matching analytics data by service name
      const analytics = clickSummary.find(item => item.service_name === service.name);

      return {
        serviceName: service.name,
        advantageClicks: analytics?.advantage_clicks || 0,
        websiteVisitClicks: analytics?.website_visit_clicks || 0,
      };
    });
  }, [services, clickSummary]);

  const filteredReports = reportsData.filter(report => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return report.serviceName.toLowerCase().includes(searchLower);
  });

  const displayedReports = filteredReports.slice(0, loadedCount);
  const hasMore = loadedCount < filteredReports.length;

  const loading = servicesLoading || analyticsLoading;
  const error = servicesError || analyticsError;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading services and analytics data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500 dark:text-red-400">Error loading data: {error}</div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">No services available</div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {displayedReports.length} of {filteredReports.length} services
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-white/[0.1] dark:bg-gray-800">
            <TableRow>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Service Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Discount Code Button Clicked
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Visit Website Clicked
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.isArray(displayedReports) && displayedReports.length > 0 ? displayedReports.map((report, index) => (
              <TableRow key={`${report.serviceName}-${index}`}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                  {report.serviceName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {report.advantageClicks.toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {report.websiteVisitClicks.toLocaleString()}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  No services found
                </td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <Button
            size="sm"
            onClick={() => setLoadedCount(prev => prev + itemsPerPage)}
            className="px-4 py-1 bg-blue-500 text-white hover:bg-blue-600"
          >
            Load More
          </Button>
        </div>
      )}

    </div>
  );
}