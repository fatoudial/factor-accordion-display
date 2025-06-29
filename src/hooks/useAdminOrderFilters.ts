
import { useState, useCallback } from 'react';
import type { OrderStatus } from '@/types/order';

interface AdminOrderFilters {
  search: string;
  status: OrderStatus | '';
  bookFormat: string;
  paymentMethod: string;
  dateFrom: Date | null;
  dateTo: Date | null;
}

export const useAdminOrderFilters = () => {
  const [filters, setFilters] = useState<AdminOrderFilters>({
    search: '',
    status: '',
    bookFormat: '',
    paymentMethod: '',
    dateFrom: null,
    dateTo: null,
  });

  const updateFilter = useCallback((key: keyof AdminOrderFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      status: '',
      bookFormat: '',
      paymentMethod: '',
      dateFrom: null,
      dateTo: null,
    });
  }, []);

  const getFilteredQuery = useCallback(() => {
    const query: any = {};
    
    if (filters.search) query.search = filters.search;
    if (filters.status) query.status = filters.status;
    if (filters.bookFormat) query.bookFormat = filters.bookFormat;
    if (filters.paymentMethod) query.paymentMethod = filters.paymentMethod;
    if (filters.dateFrom) query.dateFrom = filters.dateFrom;
    if (filters.dateTo) query.dateTo = filters.dateTo;
    
    return query;
  }, [filters]);

  return {
    filters,
    updateFilter,
    resetFilters,
    getFilteredQuery
  };
};
