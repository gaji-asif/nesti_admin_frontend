import { useState, useEffect, useCallback } from 'react';
import { getServices, Service } from '../api/servicesAPI';
import { parseId } from '../utils/parseId';
import { getAllCategories, Category } from '../api/categoriesApi';
import { getUsers, User } from '../api/usersApi';
import { getServiceClickSummary, ServiceClickSummary } from '../api/analyticsApi';

const useFetch = <T>(fetchFn: () => Promise<any>, deps: any[] = []) => {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await fetchFn();
            const result = res?.data || res?.categories || res?.services || res?.users || (Array.isArray(res) ? res : []);
            setData(result);
        } catch (err) {
            setError("Failed to fetch data");
        } finally {
            setLoading(false);
        }
    }, deps);

    useEffect(() => { execute(); }, [execute]);

    return { data, loading, error, refetch: execute, setData };
};

export const useCategories = () => {
    const { data: categories, ...rest } = useFetch<Category>(getAllCategories);
    return { categories, ...rest };
};

export const useServices = () => {
    const { data: services, ...rest } = useFetch<Service>(getServices);
    return { services, ...rest };
};

export const useUsers = () => {
    const { data: users, ...rest } = useFetch<User>(getUsers);
    return { users, ...rest };
};

export const useServiceClickSummary = (params?: any) => {
    const fetchFn = useCallback(() => getServiceClickSummary(params?.service_id, params?.filter),
        [params?.service_id, params?.filter]);
    const { data: clickSummary, ...rest } = useFetch<ServiceClickSummary>(fetchFn, [fetchFn]);
    return { clickSummary, ...rest };
};

export const useService = (serviceId?: number | string) => {
    const [service, setService] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchId = async () => {
            const id = parseId(serviceId);
            if (!id) { setService(null); setLoading(false); return; }
            try {
                setLoading(true);
                const data = await getServices();
                const list = (data as any)?.data || (data as any)?.services || (Array.isArray(data) ? data : []);
                setService(list.find((s: Service) => s.id === id) || null);
            } catch (err) {
                setError("Failed to fetch service");
            } finally {
                setLoading(false);
            }
        };
        fetchId();
    }, [serviceId]);

    return { service, loading, error };
};

export const getCategoryNames = (ids: (number | string)[] | null, categories: Category[]): string => {
    if (!ids?.length) return 'No categories';
    return ids.map(id => categories.find(c => c.id === Number(id))?.name || `ID: ${id}`).join(', ');
};

export const formatCategoryOptions = (categories: Category[]) =>
    categories.map(c => ({ text: c.name, value: String(c.id) }));