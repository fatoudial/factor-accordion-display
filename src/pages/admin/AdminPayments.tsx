
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, Search, Check, X, Eye } from "lucide-react";
import { paymentApi, TransactionHistory } from "@/lib/paymentApi";
import { toast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/utils";
import BookPreviewEditor from "@/components/admin/BookPreviewEditor";
import NavigationBackButton from "@/components/NavigationBackButton";
import { useLanguage } from "@/context/LanguageContext";

const AdminPayments = () => {
  const { session } = useAuth();
  const [transactions, setTransactions] = useState<TransactionHistory[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<TransactionHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const { language } = useLanguage();
  
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionHistory | null>(null);
  const [showBookPreview, setShowBookPreview] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Translations
  const translations = {
    title: {
      fr: "Gestion des paiements",
      en: "Payment Management",
      es: "Gestión de pagos",
      ar: "إدارة المدفوعات"
    },
    filters: {
      fr: "Filtres",
      en: "Filters",
      es: "Filtros",
      ar: "مرشحات"
    },
    filtersDesc: {
      fr: "Recherchez et filtrez les transactions",
      en: "Search and filter transactions",
      es: "Buscar y filtrar transacciones",
      ar: "ابحث وقم بتصفية المعاملات"
    },
    search: {
      fr: "Rechercher par email, nom ou ID...",
      en: "Search by email, name or ID...",
      es: "Buscar por email, nombre o ID...",
      ar: "البحث بالبريد الإلكتروني أو الاسم أو المعرف..."
    },
    status: {
      fr: "Statut",
      en: "Status",
      es: "Estado",
      ar: "الحالة"
    },
    method: {
      fr: "Méthode",
      en: "Method",
      es: "Método",
      ar: "طريقة"
    },
    all: {
      fr: "Tous",
      en: "All",
      es: "Todos",
      ar: "الكل"
    },
    pending: {
      fr: "En attente",
      en: "Pending",
      es: "Pendiente",
      ar: "قيد الانتظار"
    },
    success: {
      fr: "Réussi",
      en: "Successful",
      es: "Exitoso",
      ar: "ناجح"
    },
    failed: {
      fr: "Échoué",
      en: "Failed",
      es: "Fallido",
      ar: "فشل"
    },
    refunded: {
      fr: "Remboursé",
      en: "Refunded",
      es: "Reembolsado",
      ar: "تم استرداده"
    },
    allMethods: {
      fr: "Toutes",
      en: "All",
      es: "Todos",
      ar: "الكل"
    },
    mobileMoney: {
      fr: "Mobile Money",
      en: "Mobile Money",
      es: "Dinero Móvil",
      ar: "المال المحمول"
    },
    card: {
      fr: "Carte",
      en: "Card",
      es: "Tarjeta",
      ar: "بطاقة"
    },
    bank: {
      fr: "Banque",
      en: "Bank",
      es: "Banco",
      ar: "بنك"
    }
  };

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!session) return;
      
      try {
        const data = await paymentApi.getPaymentHistory(session.access_token);
        setTransactions(data);
        setFilteredTransactions(data);
      } catch (err: any) {
        setError("Impossible de charger les transactions");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [session]);

  useEffect(() => {
    let result = transactions;
    
    if (searchTerm) {
      result = result.filter(
        transaction => 
          transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.orderId.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleApproveTransaction = async (transactionId: string) => {
    if (!session) return;
    
    setIsUpdating(true);
    try {
      await paymentApi.approveTransaction(session.access_token, transactionId);
      
      // Mettre à jour le statut dans l'interface
      setTransactions(prevTransactions => 
        prevTransactions.map(transaction => 
          transaction.id === transactionId 
            ? { ...transaction, status: 'success' } 
            : transaction
        )
      );
      
      toast({
        title: "Transaction approuvée",
        description: "La transaction a été approuvée avec succès."
      });
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible d'approuver la transaction",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRejectTransaction = async (transactionId: string) => {
    if (!session) return;
    
    setIsUpdating(true);
    try {
      await paymentApi.rejectTransaction(session.access_token, transactionId, "Rejeté par l'administrateur");
      
      // Mettre à jour le statut dans l'interface
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
    } catch (err: any) {
      toast({
        title: "Erreur",
        description: "Impossible de rejeter la transaction",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    const statusConfigs: Record<string, { label: string; variant: "default" | "outline" | "secondary" | "destructive" }> = {
      pending: { label: translations.pending[language as keyof typeof translations.pending] || "En attente", variant: "outline" },
      success: { label: translations.success[language as keyof typeof translations.success] || "Réussi", variant: "default" },
      failed: { label: translations.failed[language as keyof typeof translations.failed] || "Échoué", variant: "destructive" },
      refunded: { label: translations.refunded[language as keyof typeof translations.refunded] || "Remboursé", variant: "secondary" }
    };

    const config = statusConfigs[status] || { label: status, variant: "default" };
    
    return (
      <Badge variant={config.variant} className="whitespace-nowrap">
        {config.label}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex items-center mb-6">
        <NavigationBackButton to="/admin" className="mr-4" />
        <h1 className="text-3xl font-bold">{translations.title[language as keyof typeof translations.title] || "Gestion des paiements"}</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{translations.filters[language as keyof typeof translations.filters] || "Filtres"}</CardTitle>
          <CardDescription>{translations.filtersDesc[language as keyof typeof translations.filtersDesc] || "Recherchez et filtrez les transactions"}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={translations.search[language as keyof typeof translations.search] || "Rechercher par email, nom ou ID..."}
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="w-full md:w-40">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.status[language as keyof typeof translations.status] || "Statut"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.all[language as keyof typeof translations.all] || "Tous"}</SelectItem>
                  <SelectItem value="pending">{translations.pending[language as keyof typeof translations.pending] || "En attente"}</SelectItem>
                  <SelectItem value="success">{translations.success[language as keyof typeof translations.success] || "Réussi"}</SelectItem>
                  <SelectItem value="failed">{translations.failed[language as keyof typeof translations.failed] || "Échoué"}</SelectItem>
                  <SelectItem value="refunded">{translations.refunded[language as keyof typeof translations.refunded] || "Remboursé"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={methodFilter} onValueChange={setMethodFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={translations.method[language as keyof typeof translations.method] || "Méthode"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{translations.allMethods[language as keyof typeof translations.allMethods] || "Toutes"}</SelectItem>
                  <SelectItem value="mobile_money">{translations.mobileMoney[language as keyof typeof translations.mobileMoney] || "Mobile Money"}</SelectItem>
                  <SelectItem value="card">{translations.card[language as keyof typeof translations.card] || "Carte"}</SelectItem>
                  <SelectItem value="bank">{translations.bank[language as keyof typeof translations.bank] || "Banque"}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? "s" : ""} trouvée{filteredTransactions.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center my-8">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-red-500">{error}</div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Aucune transaction trouvée</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Commande</TableHead>
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
                      <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{transaction.userName}</div>
                          <div className="text-sm text-gray-500">{transaction.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>{transaction.orderId}</TableCell>
                      <TableCell>{formatPrice(transaction.amount)}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {transaction.method === 'mobile_money' ? (
                            <div className="flex items-center">
                              <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                                Mobile Money
                              </div>
                              {transaction.provider && (
                                <span className="ml-2 text-xs text-gray-500">{transaction.provider}</span>
                              )}
                            </div>
                          ) : transaction.method === 'card' ? (
                            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                              Carte
                            </div>
                          ) : (
                            transaction.method
                          )}
                        </div>
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
                              <Eye className="h-4 w-4 mr-1" />
                              Détails
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>Détails de la transaction</DialogTitle>
                              <DialogDescription>
                                Informations complètes sur la transaction
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
                                    <p className="text-sm font-medium mb-1">Montant</p>
                                    <p className="font-bold">{formatPrice(selectedTransaction.amount)}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Statut</p>
                                    <p>{getStatusBadge(selectedTransaction.status)}</p>
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <p className="text-sm font-medium mb-1">Méthode</p>
                                    <p>{selectedTransaction.method} {selectedTransaction.provider ? `(${selectedTransaction.provider})` : ''}</p>
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium mb-1">Date</p>
                                    <p>{formatDate(selectedTransaction.createdAt)}</p>
                                  </div>
                                </div>
                                <Button 
                                  onClick={() => setShowBookPreview(true)} 
                                  className="w-full mt-4"
                                >
                                  Visualiser le livre
                                </Button>
                              </div>
                            )}
                            <DialogFooter>
                              <Button variant="outline" type="button">
                                Fermer
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {/* Dialog pour la prévisualisation du livre */}
                        <Dialog open={showBookPreview} onOpenChange={setShowBookPreview}>
                          <DialogContent className="sm:max-w-xl">
                            <DialogHeader>
                              <DialogTitle>Prévisualisation du livre</DialogTitle>
                              <DialogDescription>
                                Visualisez et modifiez la maquette du livre
                              </DialogDescription>
                            </DialogHeader>
                            {selectedTransaction && (
                              <BookPreviewEditor 
                                orderId={selectedTransaction.orderId} 
                                initialFormat="STANDARD"
                                bookId={`BOOK-${selectedTransaction.orderId}`}
                              />
                            )}
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

export default AdminPayments;
