import { useEffect, useState } from "react";
import { getAllReviews, updateReviewStatus } from "../../../api/reviewsApi";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "../../ui/table";
import Button from "../../ui/button/Button";

interface Review {
  id: number;
  service_id: number;
  user_id: number;
  rating: number;
  review: string | null;
  starts_at: string;
  created_at: string;
  updated_at: string;
  status?: string;
  service_name?: string;
  user_name?: string;
}


export default function AllReviewsTable() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedCount, setLoadedCount] = useState(10);

  const fetchReviews = async () => {
    try {
      const data = await getAllReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to load reviews", error);
    }
  };

  useEffect(() => { fetchReviews(); }, []);

  const handleUpdateStatus = async (id: number, status: "approved" | "rejected") => {
    if (!window.confirm(`Are you sure you want to ${status} this review?`)) return;

    try {
      await updateReviewStatus(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (error) {
      console.error('Failed to update review status', error);
      alert("Update failed!");
    }
  };

  const filtered = reviews.filter(r => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      r.id.toString().includes(s) ||
      (r.service_name || "").toLowerCase().includes(s) ||
      (r.user_name || "").toLowerCase().includes(s) ||
      ((r.review as string) || "").toLowerCase().includes(s)
    );
  });

  const displayed = filtered.slice(0, loadedCount);

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setLoadedCount(10); }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {displayed.length} of {filtered.length} reviews
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-white/[0.1] dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Service</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Reviewer</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Comment</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Status</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.isArray(displayed) && displayed.length > 0 ? (
              displayed.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">{r.id}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.service_id || 'N/A'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.user_id || 'Anonymous'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.review || '-'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.rating} / 5</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {r.status === 'approved' ? (
                      <span className="text-green-600 dark:text-green-400">Approved</span>
                    ) : r.status === 'rejected' || r.status === 'declined' ? (
                      <span className="text-red-600 dark:text-red-400">Declined</span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-300">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button size="sm" className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600" onClick={() => handleUpdateStatus(r.id, 'approved')}>Approve</Button>
                      <Button size="sm" className="px-3 py-1 text-red-600 ring-red-200 hover:bg-red-50 dark:hover:bg-red-900" variant="outline" onClick={() => handleUpdateStatus(r.id, 'rejected')}>Decline</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">No reviews found</td>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {loadedCount < filtered.length && (
        <div className="flex justify-center px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <Button size="sm" onClick={() => setLoadedCount(prev => prev + 10)} className="px-4 py-1 bg-blue-500 text-white hover:bg-blue-600">Load More</Button>
        </div>
      )}
    </div>
  );
}