
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, Check, X, ArrowRight, Clock, Package, CreditCard } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Types
interface Transaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  orderId: string;
  amount: number;
  method: 'mobile_money' | 'card' | 'bank';
  provider?: string;
  status: 'pending' | 'success' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
  reference: string;
  bookTitle?: string;
  bookFormat?: string;
}

const AdminTransactions = () => {
  const { token } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Simuler une requête API avec des données fictives
    const fetchMockTransactions = () => {
      setIsLoading(true);
      
      // Générer des transactions fictives
      const mockTransactions: Transaction[] = [
        {
          id: "tx_123456789",
          userId: "user_123",
          userName: "Thomas Dubois",
          userEmail: "thomas.dubois@example.com",
          orderId: "ord_15478",
          amount: 3990,
          method: "card",
          status: "success",
          createdAt: new Date(2025, 4, 10),
          completedAt: new Date(2025, 4, 10),
          reference: "PAY-7896541",
          bookTitle: "Notre histoire",
          bookFormat: "Couverture rigide"
        },
        {
          id: "tx_987654321",
          userId: "user_456",
          userName: "Marie Laurent",
          userEmail: "marie.l@example.com",
          orderId: "ord_15479",
          amount: 2990,
          method: "mobile_money",
          provider: "Orange Money",
          status: "pending",
          createdAt: new Date(2025, 4, 14),
          reference: "PAY-4563217",
          bookTitle: "Souvenirs d'été",
          bookFormat: "Couverture souple"
        },
        {
          id: "tx_456789123",
          userId: "user_789",
          userName: "Pierre Martin",
          userEmail: "p.martin@example.com",
          orderId: "ord_15480",
          amount: 4990,
          method: "bank",
          status: "failed",
          createdAt: new Date(2025, 4, 13),
          reference: "PAY-1234567",
          bookTitle: "Messages d'amour",
          bookFormat: "Format deluxe"
        },
        {
          id: "tx_789123456",
          userId: "user_101",
          userName: "Sophie Leclerc",
          userEmail: "sophie.l@example.com",
          orderId: "ord_15481",
          amount: 3490,
          method: "mobile_money",
          provider: "MTN Money",
          status: "success",
          createdAt: new Date(2025, 4, 12),
          completedAt: new Date(2025, 4, 12),
          reference: "PAY-7539514",
          bookTitle: "Conversations familiales",
          bookFormat: "Couverture rigide"
        },
        {
          id: "tx_321654987",
          userId: "user_202",
          userName: "Jean Dupont",
          userEmail: "jean.d@example.com",
          orderId: "ord_15482",
          amount: 3990,
          method: "card",
          status: "refunded",
          createdAt: new Date(2025, 4, 8),
          completedAt: new Date(2025, 4, 11),
          reference: "PAY-9517536",
          bookTitle: "Amis pour la vie",
          bookFormat: "Couverture rigide"
        },
        {
          id: "tx_654987321",
          userId: "user_303",
          userName: "Claude Bernard",
          userEmail: "c.bernard@example.com",
          orderId: "ord_15483",
          amount: 2990,
          method: "mobile_money",
          provider: "Wave",
          status: "pending",
          createdAt: new Date(2025, 4, 14),
          reference: "PAY-3698521",
          bookTitle: "Messages de groupe",
          bookFormat: "Couverture souple"
        }
      ];
      
      setTransactions(mockTransactions);
      setFilteredTransactions(mockTransactions);
      setIsLoading(false);
    };

    // Simuler un délai réseau
    setTimeout(fetchMockTransactions, 800);
  }, []);

  useEffect(() => {
    let result = transactions;
    
    if (searchTerm) {
      result = result.filter(
        transaction => 
          transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.reference.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter) {
      result = result.filter(transaction => transaction.status === statusFilter);
    }
    
    if (methodFilter) {
      result = result.filter(transaction => transaction.method === methodFilter);
    }
    
    setFilteredTransactions(result);
  }, [transactions, searchTerm, statusFilter, methodFilter]);

  const handleApproveTransaction = (transactionId: string) => {
    setIsUpdating(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction.id === transactionId 
            ? { 
                ...transaction, 
                status: 'success',
                completedAt: new Date()
              } 
            : transaction
        )
      );
      
      toast({
        title: "Transaction approuvée",
        description: "La transaction a été approuvée avec succès."
      });
      
      setIsUpdating(false);
    }, 1000);
  };

  const handleRejectTransaction = (transactionId: string) => {
    setIsUpdating(true);
    
    // Simuler une requête API
    setTimeout(() => {
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, status: 'failed' } 
            : transaction
        )
      );
      
      toast({
        title: "Transaction rejetée",
        description: "La transaction a été rejetée."
      });
      
      setIsUpdating(false);
    }, 1000);
  };

  const formatDate = (dateString: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(dateString);
  };

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount / 100);
  };

  const getStatusBadge = (status: string) => {
    const statusConfigs: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      pending: { label: "En attente", variant: "outline" },
      success: { label: "Réussi", variant: "default" },
      failed: { label: "Échoué", variant: "destructive" },
      refunded: { label: "Remboursé", variant: "secondary" }
    };

    const config = statusConfigs[status] || { label: status, variant: "default" };
    
    return (
      <Badge variant={config.variant} className="whitespace-nowrap">
        {config.label}
      </Badge>
    );
  };

  const getPaymentMethodLabel = (method: string, provider?: string) => {
    switch(method) {
      case 'mobile_money':
        return `Mobile Money ${provider ? `(${provider})` : ''}`;
      case 'card':
        return 'Carte bancaire';
      case 'bank':
        return 'Virement bancaire';
      default:
        return method;
    }
  };

  // Calculer les statistiques pour le tableau de bord
  const stats = {
    totalTransactions: transactions.length,
    pendingTransactions: transactions.filter(t => t.status === 'pending').length,
    successfulTransactions: transactions.filter(t => t.status === 'success').length,
    totalRevenue: transactions
      .filter(t => t.status === 'success')
      .reduce((sum, t) => sum + t.amount, 0)
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des transactions</h1>
      
      {/* Cartes de statistiques */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total des transactions</CardDescription>
            <CardTitle className="text-2xl">{stats.totalTransactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Package className="h-4 w-4 inline-block mr-1" />
              Transactions enregistrées
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>En attente</CardDescription>
            <CardTitle className="text-2xl">{stats.pendingTransactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Clock className="h-4 w-4 inline-block mr-1" />
              À traiter rapidement
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Transactions réussies</CardDescription>
            <CardTitle className="text-2xl">{stats.successfulTransactions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <Check className="h-4 w-4 inline-block mr-1" />
              Paiements validés
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Chiffre d'affaires</CardDescription>
            <CardTitle className="text-2xl">{formatPrice(stats.totalRevenue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              <CreditCard className="h-4 w-4 inline-block mr-1" />
              Revenus totaux
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
          <CardDescription>Recherchez et filtrez les transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par référence, email, nom ou ID..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tous</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="success">Réussi</SelectItem>
                  <SelectItem value="failed">Échoué</SelectItem>
                  <SelectItem value="refunded">Remboursé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Méthode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="mobile_money">Mobile Money</SelectItem>
                  <SelectItem value="card">Carte</SelectItem>
                  <SelectItem value="bank">Banque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Liste des transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} trouvée{filteredTransactions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucune transaction trouvée</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Référence</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Livre</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.reference}</TableCell>
                      <TableCell>
                        <div>
                          <div>{transaction.userName}</div>
                          <div className="text-sm text-gray-500">{transaction.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{transaction.bookTitle}</div>
                          <div className="text-sm text-gray-500">{transaction.bookFormat}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatPrice(transaction.amount)}</TableCell>
                      <TableCell>
                        {getPaymentMethodLabel(transaction.method, transaction.provider)}
                      </TableCell>
                      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right space-x-2">
                        {transaction.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleApproveTransaction(transaction.id)}
                              disabled={isUpdating}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Approuver
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleRejectTransaction(transaction.id)}
                              disabled={isUpdating}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Rejeter
                            </Button>
                          </>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => setSelectedTransaction(transaction)}
                            >
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Détails de la transaction</DialogTitle>
                              <DialogDescription>
                                Informations complètes sur la transaction {transaction.reference}
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTransaction && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">ID Transaction</p>
                                    <p className="text-xs font-mono bg-gray-100 p-1 rounded">{selectedTransaction.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">ID Commande</p>
                                    <p className="text-xs font-mono bg-gray-100 p-1 rounded">{selectedTransaction.orderId}</p>
                                  </div>
                                </div>
                                <div>
                                  <p className="text-sm font-medium mb-1">Client</p>
                                  <p>{selectedTransaction.userName} ({selectedTransaction.userEmail})</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">Livre</p>
                                    <p>{selectedTransaction.bookTitle} ({selectedTransaction.bookFormat})</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Montant</p>
                                    <p className="font-bold">{formatPrice(selectedTransaction.amount)}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">Méthode</p>
                                    <p>{getPaymentMethodLabel(selectedTransaction.method, selectedTransaction.provider)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Statut</p>
                                    <p>{getStatusBadge(selectedTransaction.status)}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">Date de création</p>
                                    <p>{formatDate(selectedTransaction.createdAt)}</p>
                                  </div>
                                  {selectedTransaction.completedAt && (
                                    <div>
                                      <p className="text-sm font-medium mb-1">Date de validation</p>
                                      <p>{formatDate(selectedTransaction.completedAt)}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" type="button">
                                Fermer
                              </Button>
                              <Button className="ml-2">
                                Voir la commande
                                <ArrowRight className="ml-2 h-4 w-4" />
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
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

export default AdminTransactions;
