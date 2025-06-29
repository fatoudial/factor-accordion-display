
import React from "react";
import { formatDate } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CreditCard, Package, Check, AlertTriangle } from "lucide-react";
import type { Order } from "@/types/order";

interface RecentOrdersListProps {
  orders: Order[];
  emptyMessage?: string;
  currency?: string;
}

const RecentOrdersList: React.FC<RecentOrdersListProps> = ({ 
  orders, 
  emptyMessage = "Aucune commande récente",
  currency = "CFA"
}) => {
  // Format money amount
  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 0
    }).format(amount / 100);
  };

  // Display appropriate status badge
  const getStatusBadge = (status: string) => {
    const statusConfigs: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      PENDING_PAYMENT: { label: "En attente de paiement", variant: "outline" },
      PAID: { label: "Payé", variant: "default" },
      PROCESSING: { label: "En préparation", variant: "secondary" },
      SHIPPED: { label: "Expédié", variant: "default" },
      DELIVERED: { label: "Livré", variant: "default" },
      CANCELLED: { label: "Annulé", variant: "destructive" },
      REFUNDED: { label: "Remboursé", variant: "destructive" },
    };

    const config = statusConfigs[status] || { label: status, variant: "default" };
    
    return (
      <Badge variant={config.variant} className="whitespace-nowrap">
        {config.label}
      </Badge>
    );
  };

  // Display appropriate status icon
  const getStatusIcon = (status: string) => {
    switch(status) {
      case "PENDING_PAYMENT":
        return <Clock className="h-4 w-4" />;
      case "PAID":
        return <CreditCard className="h-4 w-4" />;
      case "PROCESSING":
        return <Package className="h-4 w-4" />;
      case "SHIPPED":
      case "DELIVERED":
        return <Check className="h-4 w-4" />;
      case "CANCELLED":
      case "REFUNDED":
        return <AlertTriangle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  if (orders.length === 0) {
    return <p className="text-center py-4 text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between border-b pb-2">
          <div className="flex items-center gap-2">
            <div className="bg-gray-100 p-2 rounded-full">
              {getStatusIcon(order.status)}
            </div>
            <div>
              <p className="font-medium">#{order.orderReference}</p>
              <p className="text-sm text-gray-500">{formatDate(order.createdAt.toString())}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>{getStatusBadge(order.status)}</div>
            <div className="font-medium">{formatPrice(order.totalAmount)}</div>
            <Link to={`/orders/${order.id}`}>
              <Button variant="ghost" size="sm">Voir</Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrdersList;
