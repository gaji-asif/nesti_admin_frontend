import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";
import { TrashBinIcon, PencilIcon } from "../../../icons";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { deleteCategory } from "../../../api/categoriesApi";
import { useCategories } from "../../../hooks/useApiData";

export default function AllCategories() {
  const navigate = useNavigate();
  const { categories, setCategories } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [loadedCount, setLoadedCount] = useState(10);
  const itemsPerPage = 10;

  const handleDelete = async (id: number) => {
    try {
      await deleteCategory(id);
      setCategories(categories.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories.filter(category => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      category.id.toString().includes(searchLower) ||
      (category.name || '').toLowerCase().includes(searchLower) ||
      (category.description || '').toLowerCase().includes(searchLower)
    );
  });

  // Reset loaded count when search changes
  useEffect(() => {
    setLoadedCount(10);
  }, [searchTerm]);

  const displayedCategories = filteredCategories.slice(0, loadedCount);
  const hasMore = loadedCount < filteredCategories.length;

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 dark:border-white/[0.05]">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              style={{ fontFamily: '"Outfit", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif' }}
            />
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {displayedCategories.length} of {filteredCategories.length} categories
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
                IDDDDDD
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Names  tesgggf
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Description
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Edit
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Delete
              </TableCell>

            </TableRow>
          </TableHeader>

          {/* Table Body */}
          <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
            {Array.isArray(displayedCategories) && displayedCategories.length > 0 ? displayedCategories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                  {category.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {category.name ? category.name.replace(/\b\w/g, l => l.toUpperCase()) : 'Unnamed Category'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400 min-w-[250px]">
                  {category.description ? category.description : 'No description'}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Button size="sm" onClick={() => navigate(`/edit-category/${category.id}`)}><PencilIcon /></Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-red-500 text-start text-theme-sm dark:text-red-400">
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(category.id)}><TrashBinIcon /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-gray-500">
                  {Array.isArray(categories)
                    ? (searchTerm ? 'No categories match your search' : 'No categories found')
                    : 'Loading categories...'
                  }
                </TableCell>
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
