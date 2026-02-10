import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";
import { useState, useEffect } from "react";
import { useUsers } from "../../../hooks/useApiData";

export default function AllUsers() {
  const { users } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedCount, setLoadedCount] = useState(10);
  const itemsPerPage = 10;

  const filteredUsers = users.filter(user => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      user.id.toString().includes(searchLower) ||
      (user.name || '').toLowerCase().includes(searchLower) ||
      (user.email || '').toLowerCase().includes(searchLower) ||
      (user.profile?.postcode || '').toLowerCase().includes(searchLower) ||
      (user.profile?.location || '').toLowerCase().includes(searchLower)
    );
  });

  // Reset loaded count when search changes
  useEffect(() => {
    setLoadedCount(10);
  }, [searchTerm]);

  const displayedUsers = filteredUsers.slice(0, loadedCount);
  const hasMore = loadedCount < filteredUsers.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {displayedUsers.length} of {filteredUsers.length} users
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
                Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                First Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Last Name
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Image
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Postcode
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Location
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Children
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Interests
              </TableCell>
            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.isArray(displayedUsers) && displayedUsers.length > 0 ? displayedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                  {user.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.name ? user.name.replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.first_name || 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.last_name || 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.profile?.users_img_url ? (
                    <img src={user.profile.users_img_url} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <span className="text-gray-400">No image</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.profile?.postcode || 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.profile?.location ? user.profile.location.replace(/\b\w/g, l => l.toUpperCase()) : 'N/A'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.profile?.children_age_range && user.profile.children_age_range.length > 0 ? (
                    <span>
                      {user.profile.children_age_range.length} children: {user.profile.children_age_range.map(age => age.replace('language.', '')).join(', ')}
                    </span>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {user.profile?.interests && user.profile.interests.length > 0 ? (
                    <div className="max-w-xs">
                      {user.profile.interests.slice(0, 3).map((interest, index) => (
                        <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                          {interest.replace('interest.', '')}
                        </span>
                      ))}
                      {user.profile.interests.length > 3 && (
                        <span className="text-xs text-gray-500">+{user.profile.interests.length - 3} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <td colSpan={9} className="px-4 py-8 text-center text-gray-500">
                  No users found
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