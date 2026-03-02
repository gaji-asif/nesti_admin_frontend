import { useState, useMemo, useEffect } from "react";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";
import { useServices, useServiceClickSummary } from "../../../hooks/useApiData";
import { AnalyticsFilter } from "../../../api/analyticsApi";

export default function ServiceAnalyticsTable() {
  const { services, loading: sLoading, error: sError } = useServices();
  const [timeFilter, setTimeFilter] = useState<AnalyticsFilter | "">("");
  const [selectedServiceId, setSelectedServiceId] = useState<number | "">("");
  const [searchTerm, setSearchTerm] = useState("");
  const [limit, setLimit] = useState(10);

  const { clickSummary, loading: aLoading, error: aError } = useServiceClickSummary({
    service_id: selectedServiceId || undefined,
    filter: timeFilter || undefined,
  });

  useEffect(() => setLimit(10), [searchTerm, timeFilter, selectedServiceId]);

  const filteredData = useMemo(() => {
    return services
      .filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .map((s) => {
        const stats = clickSummary.find((c) => c.service_name === s.name);
        return {
          name: s.name,
          adv: stats?.advantage_clicks || 0,
          web: stats?.website_visit_clicks || 0,
        };
      });
  }, [services, clickSummary, searchTerm]);

  const loading = sLoading || aLoading;
  const error = sError || aError;

  if (loading) return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05] space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
          />
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value as any)}
            className="sm:w-48 px-4 py-2 border rounded-lg dark:bg-gray-700"
          >
            <option value="">All Time</option>
            {["today", "week", "month"].map((f) => (
              <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>
            ))}
          </select>
          <select
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(Number(e.target.value) || "")}
            className="sm:w-48 px-4 py-2 border rounded-lg dark:bg-gray-700"
          >
            <option value="">All Services</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {(timeFilter || selectedServiceId) && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Active filters:</span>
            <button onClick={() => { setTimeFilter(""); setSelectedServiceId(""); }} className="text-blue-500">Clear all</button>
          </div>
        )}
      </div>

      <Table>
        <TableHeader className="bg-gray-50 dark:bg-gray-800">
          <TableRow>
            {["Service Name", "Discount Clicks", "Website Clicks"].map((h) => (
              <TableCell key={h} isHeader className="px-5 py-3 font-bold">{h}</TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.slice(0, limit).map((item, i) => (
            <TableRow key={i}>
              <TableCell className="px-5 py-4">{item.name}</TableCell>
              <TableCell className="px-4 py-3">{item.adv.toLocaleString()}</TableCell>
              <TableCell className="px-4 py-3">{item.web.toLocaleString()}</TableCell>
            </TableRow>
          ))}
          {filteredData.length === 0 && (
            <TableRow><TableCell colSpan={3} className="py-8 text-center text-gray-500">No data found</TableCell></TableRow>
          )}
        </TableBody>
      </Table>

      {limit < filteredData.length && (
        <div className="p-3 text-center border-t">
          <Button onClick={() => setLimit(limit + 20)} size="sm">Load More</Button>
        </div>
      )}
    </div>
  );
}