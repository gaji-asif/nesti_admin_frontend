import { useState, useEffect } from 'react';
import { getServices, Service } from '../api/servicesApi';
import { parseId } from '../utils/parseId';
import { normalizeServiceResponse } from '../utils/apiNormalize';
import { getAllCategories, Category } from '../api/categoriesApi';
import { getUsers, User } from '../api/usersApi';
import { getServiceClickSummary, ServiceClickSummary } from '../api/analyticsApi';

// Custom hook for fetching categories
export const useCategories = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);

            const data: any = await getAllCategories();
            console.log('Categories API response:', data);

            // Handle different response structures
            let categoriesArray: Category[] = [];
            if (Array.isArray(data)) {
                categoriesArray = data;
            } else if (data && Array.isArray(data.categories)) {
                categoriesArray = data.categories;
            } else if (data && Array.isArray(data.data)) {
                categoriesArray = data.data;
            } else {
                console.warn('Unexpected categories API response structure:', data);
            }

            setCategories(categoriesArray);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Failed to fetch categories');
            // Fallback to mock data
            setCategories([
                { id: 1, name: "Uniohjaus", description: "", created_at: "", updated_at: "" },
                { id: 2, name: "Imetysohjaus", description: "", created_at: "", updated_at: "" },
                { id: 3, name: "Doula", description: "", created_at: "", updated_at: "" },
                { id: 4, name: "Synnytysvalmennus", description: "", created_at: "", updated_at: "" },
                { id: 5, name: "Fysioterapia (äidit/lapset)", description: "", created_at: "", updated_at: "" },
                { id: 6, name: "Synnytyksen käynnistys", description: "", created_at: "", updated_at: "" },
                { id: 7, name: "Vyöhyketerapia", description: "", created_at: "", updated_at: "" },
                { id: 8, name: "Kahvila", description: "", created_at: "", updated_at: "" },
                { id: 9, name: "Muu", description: "", created_at: "", updated_at: "" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return { categories, loading, error, refetch: fetchCategories, setCategories };
};

// Custom hook for fetching services
export const useServices = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchServices = async () => {
        try {
            setLoading(true);
            setError(null);

            const data: any = await getServices();
            console.log('Services API response:', data);

            // Handle different response structures
            let servicesArray: Service[] = [];
            if (Array.isArray(data)) {
                servicesArray = data;
            } else if (data && Array.isArray(data.services)) {
                servicesArray = data.services;
            } else if (data && Array.isArray(data.data)) {
                servicesArray = data.data;
            } else {
                console.warn('Unexpected services API response structure:', data);
            }

            setServices(servicesArray);
        } catch (error) {
            console.error('Error fetching services:', error);
            setError('Failed to fetch services');
            setServices([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    // Return refetch function for manual refresh
    return { services, loading, error, refetch: fetchServices, setServices };
};

// Utility function to get category names from IDs
export const getCategoryNames = (categoryIds: number[] | string[] | null, categories: Category[]): string => {
    if (!categoryIds || !Array.isArray(categoryIds) || categoryIds.length === 0) {
        return 'No categories';
    }

    const categoryNames = categoryIds
        .map(id => {
            // Convert string IDs to numbers for comparison
            const numId = typeof id === 'string' ? parseInt(id) : id;
            const category = categories.find(cat => cat.id === numId);
            return category ? category.name : `ID: ${id}`;
        })
        .filter(name => name); // Remove any undefined values

    return categoryNames.length > 0 ? categoryNames.join(', ') : 'Unknown categories';
};

// Utility function to format category options for forms
export const formatCategoryOptions = (categories: Category[]) => {
    return categories.map(category => ({
        text: category.name,
        value: category.id.toString()
    }));
};

// Custom hook for getting a single service by ID
export const useService = (serviceId?: number | string) => {
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchService = async () => {
            if (serviceId === undefined || serviceId === null || serviceId === '') { setService(null); setLoading(false); return; }
            const idNumber = parseId(serviceId);
            if (idNumber === undefined) { setService(null); setLoading(false); return; }

            try {
                setLoading(true);
                setError(null);

                const data: any = await getServices();

                const normalized = normalizeServiceResponse(data);
                if (Array.isArray(normalized)) {
                    const found = normalized.find((s: Service) => s.id === idNumber);
                    setService(found || null);
                } else {
                    setService(normalized || null);
                }
            } catch (error) {
                console.error('Error fetching service by id:', error);
                setError('Failed to fetch service');
                setService(null);
            } finally {
                setLoading(false);
            }
        };

        fetchService();
    }, [serviceId]);

    return { service, loading, error };
};

// Custom hook for fetching users
export const useUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);

            const data: any = await getUsers();
            console.log('Users API response:', data);

            // Handle different response structures
            let usersArray: User[] = [];
            if (Array.isArray(data)) {
                usersArray = data;
            } else if (data && Array.isArray(data.data)) {
                usersArray = data.data;
            } else if (data && Array.isArray(data.users)) {
                usersArray = data.users;
            } else {
                console.warn('Unexpected users API response structure:', data);
            }

            setUsers(usersArray);
        } catch (error) {
            console.error('Error fetching users:', error);
            setError('Failed to fetch users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Return refetch function for manual refresh
    return { users, loading, error, refetch: fetchUsers, setUsers };
};

// Custom hook for fetching service click summary analytics
export const useServiceClickSummary = () => {
    const [clickSummary, setClickSummary] = useState<ServiceClickSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchClickSummary = async () => {
        try {
            setLoading(true);
            setError(null);

            const data: ServiceClickSummary[] = await getServiceClickSummary();
            console.log('Service click summary API response:', data);

            setClickSummary(data);
        } catch (error) {
            console.error('Error fetching service click summary:', error);
            setError('Failed to fetch service click summary');
            setClickSummary([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClickSummary();
    }, []);

    // Return refetch function for manual refresh
    return { clickSummary, loading, error, refetch: fetchClickSummary };
};