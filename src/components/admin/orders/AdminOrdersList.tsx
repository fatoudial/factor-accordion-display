
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import { format } from 'date-fns';
import type { Order } from '@/types/order';
import { orderStatusConfig } from '@/lib/orderUtils';

interface AdminOrdersListProps {
  orders: Order[];
  isLoading: boolean;
}

export const AdminOrdersList: React.FC<AdminOrdersListProps> = ({
  orders,
  isLoading
}) => {
  const handleViewOrder = (orderId: string) => {
    console.log('Viewing order:', orderId);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes ({orders.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => {
            const statusConfig = orderStatusConfig[order.status];
            
            return (
              <div key={order.id} className="border rounded-lg p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">{order.orderReference}</p>
                      <p className="text-sm text-gray-500">{order.userEmail}</p>
                    </div>
                    <Badge className={statusConfig.className}>
                      {statusConfig.label}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-medium">{order.totalAmount.toLocaleString()} FCFA</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(order.createdAt), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewOrder(order.id)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="mt-2 text-sm text-gray-600">
                  <span>Format: {order.bookFormat}</span>
                  <span className="mx-2">•</span>
                  <span>Paiement: {order.paymentMethod}</span>
                  {order.trackingNumber && (
                    <>
                      <span className="mx-2">•</span>
                      <span>Suivi: {order.trackingNumber}</span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
          
          {orders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Aucune commande trouvée
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
