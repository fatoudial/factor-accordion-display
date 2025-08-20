
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Loader2, Search, TrendingUp, Package, CreditCard } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import NavigationBackButton from "@/components/NavigationBackButton";

interface Partner {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersClassic: number;
  ordersMedium: number;
  totalOrders: number;
  amountToPay: number;
  status: 'active' | 'pending' | 'suspended';
}

const AdminPartners = () => {
  const { session } = useAuth();
  const { toast } = useToast();
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const mockPartners: Partner[] = [
        {
          id: "1",
          name: "Imprimerie Dakar",
          email: "contact@imprimerie-dakar.com",
          phone: "+221 77 123 45 67",
          ordersClassic: 45,
          ordersMedium: 23,
          totalOrders: 68,
          amountToPay: 1250000,
          status: 'active'
        },
        {
          id: "2", 
          name: "Print Solutions",
          email: "info@printsolutions.sn",
          phone: "+221 76 987 65 43",
          ordersClassic: 32,
          ordersMedium: 18,
          totalOrders: 50,
          amountToPay: 890000,
          status: 'active'
        },
        {
          id: "3",
          name: "Graphic Center",
          email: "orders@graphiccenter.sn",
          phone: "+221 78 456 12 34",
          ordersClassic: 28,
          ordersMedium: 35,
          totalOrders: 63,
          amountToPay: 1580000,
          status: 'pending'
        }
      ];
      setPartners(mockPartners);
      setFilteredPartners(mockPartners);
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    let result = partners;
    
    if (searchTerm) {
      result = result.filter(
        partner => 
          partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          partner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredPartners(result);
  }, [partners, searchTerm]);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: "Actif", variant: "default" as const },
      pending: { label: "En attente", variant: "secondary" as const },
      suspended: { label: "Suspendu", variant: "destructive" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    );
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const totalStats = filteredPartners.reduce(
    (acc, partner) => ({
      totalClassic: acc.totalClassic + partner.ordersClassic,
      totalMedium: acc.totalMedium + partner.ordersMedium,
      totalOrders: acc.totalOrders + partner.totalOrders,
      totalDebt: acc.totalDebt + partner.amountToPay
    }),
    { totalClassic: 0, totalMedium: 0, totalOrders: 0, totalDebt: 0 }
  );

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <NavigationBackButton to="/admin" label="Retour au tableau de bord" />
        <h1 className="text-3xl font-bold">Gestion des Partenaires</h1>
        <div className="w-[200px]"></div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Classiques</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalClassic}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commandes Médium</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalMedium}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commandes</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStats.totalOrders}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Montant à payer</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatAmount(totalStats.totalDebt)}</div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtres */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Recherchez et filtrez les partenaires</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom ou email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Liste des partenaires */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Partenaires</CardTitle>
          <CardDescription>
            {filteredPartners.length} partenaire(s) trouvé(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredPartners.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucun partenaire trouvé</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partenaire</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Commandes Classiques</TableHead>
                    <TableHead>Commandes Médium</TableHead>
                    <TableHead>Total Commandes</TableHead>
                    <TableHead>Montant à payer</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPartners.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{partner.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{partner.email}</div>
                          <div className="text-gray-500">{partner.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-medium">{partner.ordersClassic}</TableCell>
                      <TableCell className="text-center font-medium">{partner.ordersMedium}</TableCell>
                      <TableCell className="text-center font-bold">{partner.totalOrders}</TableCell>
                      <TableCell className="font-bold text-red-600">{formatAmount(partner.amountToPay)}</TableCell>
                      <TableCell>{getStatusBadge(partner.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm">
                            Modifier
                          </Button>
                          <Button variant="ghost" size="sm">
                            Détails
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPartners;
