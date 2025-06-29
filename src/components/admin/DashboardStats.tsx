
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Users, CreditCard, Clock } from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, description, icon }: StatCardProps) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription>{title}</CardDescription>
      <CardTitle className="text-2xl">{value}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-xs text-muted-foreground flex items-center">
        {icon}
        {description}
      </div>
    </CardContent>
  </Card>
);

interface DashboardStatsProps {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  activeUsers: number;
  currency?: string;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ 
  totalOrders, 
  pendingOrders, 
  totalRevenue, 
  activeUsers,
  currency = "CFA"
}) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total des commandes"
        value={totalOrders}
        description="Commandes enregistrées"
        icon={<Package className="h-4 w-4 inline-block mr-1" />}
      />
      <StatCard
        title="Commandes en attente"
        value={pendingOrders}
        description="À traiter"
        icon={<Clock className="h-4 w-4 inline-block mr-1" />}
      />
      <StatCard
        title="Revenu total"
        value={formatPrice(totalRevenue, currency)}
        description="Hors commandes annulées"
        icon={<CreditCard className="h-4 w-4 inline-block mr-1" />}
      />
      <StatCard
        title="Clients actifs"
        value={activeUsers}
        description="Clients avec commandes"
        icon={<Users className="h-4 w-4 inline-block mr-1" />}
      />
    </div>
  );
};

export default DashboardStats;
