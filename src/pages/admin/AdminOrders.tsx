
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { orderApi } from '@/lib/orderApi';
import { AdminOrderFilters } from '@/components/admin/orders/AdminOrderFilters';
import { AdminOrdersList } from '@/components/admin/orders/AdminOrdersList';
import { AdminOrderStats } from '@/components/admin/orders/AdminOrderStats';
import { useAdminOrderFilters } from '@/hooks/useAdminOrderFilters';

const AdminOrders: React.FC = () => {
  const {
    filters,
    updateFilter,
    resetFilters,
    getFilteredQuery
  } = useAdminOrderFilters();

  const { data: orders = [], isLoading, error } = useQuery({
    queryKey: ['admin-orders', getFilteredQuery()],
    queryFn: () => orderApi.getAllOrders('admin-token', getFilteredQuery()),
  });

  const handleExportOrders = () => {
    console.log('Exporting orders...', orders);
  };

  if (error) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-red-600">Erreur lors du chargement des commandes</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des commandes</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={resetFilters}>
            Réinitialiser filtres
          </Button>
          <Button onClick={handleExportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <AdminOrderStats orders={orders} />
      
      <AdminOrderFilters 
        filters={filters}
        onFilterChange={updateFilter}
      />

      <AdminOrdersList 
        orders={orders}
        isLoading={isLoading}
      />
    </div>
  );
};

export default AdminOrders;
