import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";
import { useState, useEffect } from "react";

export type Review = {
  id: number;
  service_id?: number;
  service_name?: string;
  user_name?: string;
  rating?: number | null;
  comment?: string | null;
  created_at?: string;
  status?: "pending" | "approved" | "declined";
};

export default function AllReviewsTable() {
  // Placeholder: reviews will come from an API in the future
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 101,
      service_id: 12,
      service_name: "Sunny Cafe",
      user_name: "Alice Johnson",
      rating: 4,
      comment: "Great brunch spot — friendly staff and good coffee.",
      created_at: "2026-03-10",
      status: "pending",
    },
    {
      id: 102,
      service_id: 7,
      service_name: "Green Toys Playroom",
      user_name: "Mark Lee",
      rating: 5,
      comment: "Kids loved it. Clean and well-supervised.",
      created_at: "2026-03-12",
      status: "approved",
    },
    {
      id: 103,
      service_id: 3,
      service_name: "Happy Paws Grooming",
      user_name: "Sophie Martinez",
      rating: 3,
      comment: "Good service but a bit pricey.",
      created_at: "2026-03-15",
      status: "declined",
    },
    {
      id: 104,
      service_id: 5,
      service_name: "City Yoga Studio",
      user_name: "Daniel Kim",
      rating: null,
      comment: null,
      created_at: "2026-03-18",
      status: "pending",
    },
  ]);

  const handleApprove = (id: number) => {
    if (!window.confirm('Approve this review?')) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'approved' } : r)));
  };

  const handleDecline = (id: number) => {
    if (!window.confirm('Decline this review?')) return;
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'declined' } : r)));
  };
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedCount, setLoadedCount] = useState(10);
  const itemsPerPage = 10;

  const filtered = reviews.filter((r) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      r.id.toString().includes(s) ||
      (r.service_name || "").toLowerCase().includes(s) ||
      (r.user_name || "").toLowerCase().includes(s) ||
      (r.comment || "").toLowerCase().includes(s) ||
      (r.rating !== null && r.rating !== undefined && r.rating.toString().includes(s))
    );
  });

  useEffect(() => {
    setLoadedCount(10);
  }, [searchTerm]);

  const displayed = filtered.slice(0, loadedCount);
  const hasMore = loadedCount < filtered.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Rating</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Comment</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Date</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Status</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.isArray(displayed) && displayed.length > 0 ? (
              displayed.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">{r.id}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.service_name || `Service ${r.service_id ?? 'N/A'}`}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.user_name || 'Anonymous'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.rating !== null && r.rating !== undefined ? r.rating : 'N/A'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.comment || '-'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{r.created_at || '-'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {r.status === 'approved' ? (
                      <span className="text-green-600 dark:text-green-400">Approved</span>
                    ) : r.status === 'declined' ? (
                      <span className="text-red-600 dark:text-red-400">Declined</span>
                    ) : (
                      <span className="text-gray-600 dark:text-gray-300">Pending</span>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    <div className="flex gap-2">
                      <Button size="sm" variant="primary" onClick={() => handleApprove(r.id)}>Approve</Button>
                      <Button size="sm" variant="outline" className="text-red-600 ring-red-200 hover:bg-red-50 dark:hover:bg-red-900" onClick={() => handleDecline(r.id)}>Decline</Button>
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

      {hasMore && (
        <div className="flex justify-center px-4 py-3 bg-white border-t border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <Button size="sm" onClick={() => setLoadedCount((p) => p + itemsPerPage)} className="px-4 py-1 bg-blue-500 text-white hover:bg-blue-600">Load More</Button>
        </div>
      )}
    </div>
  );
}
