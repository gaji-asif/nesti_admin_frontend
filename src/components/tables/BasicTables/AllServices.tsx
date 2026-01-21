import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import Button from "../../ui/button/Button";
import { PencilIcon, TrashBinIcon } from "../../../icons";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import { getServices, deleteService, Service } from "../../../api/servicesAPI";

export default function AllServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data: any = await getServices();
        console.log('Full API response:', data);
        console.log('Type of data:', typeof data);
        console.log('Is array?', Array.isArray(data));
        
        // Handle different response structures
        let servicesArray: Service[] = [];
        if (Array.isArray(data)) {
          servicesArray = data;
        } else if (data && Array.isArray(data.services)) {
          servicesArray = data.services;
        } else if (data && Array.isArray(data.data)) {
          servicesArray = data.data;
        } else {
          console.warn('Unexpected API response structure:', data);
        }
        
        console.log('Services array:', servicesArray);
        setServices(servicesArray);
      } catch (error) {
        console.error('Error fetching services:', error);
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
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
                Category ID
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                City
              </TableCell>
              <TableCell
                isHeader
                className="px-5 py-3 font-bold text-gray-900 text-start text-theme-sm dark:text-white"
              >
                Contact
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
            {Array.isArray(services) && services.length > 0 ? services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="px-5 py-4 sm:px-6 text-start text-theme-sm dark:text-white">
                  {service.id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.name}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.category_id}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.city}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.address}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <a href={service.website} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Contact
                  </a>
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  {service.rating}
                </TableCell>
                <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                  <Button size="sm" onClick={() => navigate(`/edit-service/${service.id}`)}><PencilIcon /></Button>
                </TableCell>
                <TableCell className="px-4 py-3 text-red-500 text-start text-theme-sm dark:text-red-400">
                  <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => handleDelete(service.id)}><TrashBinIcon /></Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell className="px-4 py-8 text-center text-gray-500">
                  {Array.isArray(services) ? 'No services found' : 'Loading services...'}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
