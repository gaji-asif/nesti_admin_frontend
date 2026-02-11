import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { useState } from "react";
import { useServices } from "../../../hooks/useApiData";

interface ReportData {
  id: number;
  serviceName: string;
  discountCodeClicks: number;
  visitWebsiteClicks: number;
}

export default function ServiceAnalyticsTable() {
  const { services, loading, error } = useServices();
  const [searchTerm, setSearchTerm] = useState('');

  // Create reports data from services with mock click counts
  const reportsData: ReportData[] = services.map(service => {
    // Generate consistent mock data per service
    const baseSeed = service.id * 37;
    const discountClicks = Math.floor((baseSeed % 150) + Math.random() * 50) + 20;
    const visitClicks = Math.floor((baseSeed % 200) + Math.random() * 80) + 30;

    return {
      id: service.id,
      serviceName: service.name,
      discountCodeClicks: discountClicks,
      visitWebsiteClicks: visitClicks,
    };
  });

  const filteredReports = reportsData.filter(report => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return report.serviceName.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500 dark:text-gray-400">Loading services...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-red-500 dark:text-red-400">Error loading services: {error}</div>
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
            {filteredReports.length} of {reportsData.length} services
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
            {filteredReports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                  {report.serviceName}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {report.discountCodeClicks}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {report.visitWebsiteClicks}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}