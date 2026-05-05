import { useEffect, useState, useMemo } from "react";
import { getAllReviews, updateReviewStatus, Review } from "../../../api/reviewsApi";
import { getServices, Service } from "../../../api/servicesAPI"; 
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";

export default function AllReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedCount, setLoadedCount] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reviewData, serviceData] = await Promise.all([
          getAllReviews(),
          getServices(), // Fetch toàn bộ service để map tên
        ]);
        setReviews(reviewData);
        setServices(serviceData);
      } catch (error) {
        console.error("Failed to load table data", error);
      }
    };
    fetchData();

    // Poll for new reviews every 5 seconds
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const serviceMap = useMemo(() => {
    return new Map(services.map(s => [s.id, s.name]));
  }, [services]);

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected") => {
    if (!window.confirm(`Are you sure you want to ${status} this review?`)) return;
    try {
      await updateReviewStatus(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert("Update failed!");
    }
  };

  const filtered = reviews.filter(r => {
    const s = searchTerm.toLowerCase();
    return (
      r.id.toString().includes(s) ||
      (serviceMap.get(r.service_id) || "").toLowerCase().includes(s) ||
      (r.review || "").toLowerCase().includes(s)
    );
  });

  const displayed = filtered.slice(0, loadedCount);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setLoadedCount(10); }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
          <div className="text-sm text-gray-500 whitespace-nowrap">
            {displayed.length} of {filtered.length}
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
                ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Service
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Reviewer
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Comment
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Rating
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Status
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Actions
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {displayed.length > 0 ? (
              displayed.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                    {r.id}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {serviceMap.get(r.service_id) || `ID: ${r.service_id}`}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {r.user?.name || `User ${r.user_id}`}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 max-w-xs truncate">
                    {r.review || '-'}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {r.rating} / 5
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === 'approved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
                      r.status === 'rejected' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {r.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start text-theme-sm">
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleUpdateStatus(r.id, 'approved')}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600" onClick={() => handleUpdateStatus(r.id, 'rejected')}>Decline</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="px-5 py-10 text-center text-gray-500 dark:text-gray-400">No reviews found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {loadedCount < filtered.length && (
        <div className="p-4 border-t dark:border-white/[0.05] flex justify-center">
          <Button onClick={() => setLoadedCount(p => p + 10)}>Load More</Button>
        </div>
      )}
    </div>
  );
}