import { useEffect, useState } from "react";
// navigate removed until edit-event is implemented
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";
import Button from "../../ui/button/Button";
import { TrashBinIcon } from "../../../icons";
import { getAllEvents, deleteEvent, Event } from "../../../api/eventsApi";

export default function AllEventsTable() {
  const [events, setEvents] = useState<Event[] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadedCount, setLoadedCount] = useState(10);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getAllEvents();
        setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Failed to load events:", error);
        setEvents([]);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: number) => {
    const ev = events?.find((e) => e.id === id);
    const title = ev?.name || `Event ${id}`;
    const confirmed = window.confirm(`Are you sure you want to delete \"${title}\"? This action cannot be undone.`);
    if (!confirmed) return;
    try {
      await deleteEvent(id);
      setEvents((prev) => (prev ? prev.filter((e) => e.id !== id) : []));
    } catch (error: any) {
      console.error("Error deleting event:", error);
      alert(`Failed to delete event: ${error.response?.data?.message || error.message}`);
    }
  };


  const filtered = (events || []).filter((e) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (
      e.id.toString().includes(s) ||
      (e.name || "").toLowerCase().includes(s) ||
      (e.short_description || "").toLowerCase().includes(s) ||
      (e.location || "").toLowerCase().includes(s)
    );
  });

  const displayed = filtered.slice(0, loadedCount);
  const hasMore = loadedCount < filtered.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              style={{ fontFamily: '"Outfit", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {displayed.length} of {filtered.length} events
          </div>
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <Table>
          <TableHeader className="border-b border-gray-200 bg-gray-50 dark:border-white/[0.1] dark:bg-gray-800">
            <TableRow>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">ID</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Title</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Short Description</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">When</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Location</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Creator</TableCell>
              <TableCell isHeader className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white">Actions</TableCell>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {displayed.length > 0 ? (
              displayed.map((ev) => (
                <TableRow key={ev.id}>
                  <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">{ev.id}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ev.name || 'Untitled event'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ev.short_description || '—'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[200px]">{ev.start_time ? new Date(ev.start_time).toLocaleString() : ev.event_date_time || '—'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ev.location || '—'}</TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">{ev.creator?.name || '—'}</TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 space-x-2">
                    
                    {/* <Button size="sm" onClick={() => handleEdit(ev.id)}>Edit</Button> */}
                    <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(ev.id)}><TrashBinIcon /></Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-gray-500">
                  {events === null ? 'Loading events...' : (searchTerm ? 'No events match your search' : 'No events found')}
                </TableCell>
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
