// Page de test des paiements backend
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import { useBackendAuth } from '@/context/BackendAuthContext';
import { backendPaymentService } from '@/lib/backendPaymentApi';
import BackendPaymentForm from '@/components/payment/BackendPaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';

const BackendTestPayment = () => {
  const navigate = useNavigate();
  const { items, total, addItem } = useCart();
  const { user, isAuthenticated } = useBackendAuth();
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);

  // Ajouter des articles de test au panier
  const addTestItems = () => {
    addItem({
      title: "Livre Photo Test",
      format: "PRINT_STANDARD",
      price: 15000,
      imageUrl: "/covers/book-cover-1.png"
    });
    
    addItem({
      title: "Album Souvenir Digital",
      format: "EBOOK",
      price: 5000
    });
  };

  // Simuler un callback mobile money
  const simulateCallback = async (transactionId: string, status: 'SUCCESS' | 'FAILED') => {
    try {
      await backendPaymentService.simulateMobileMoneyCallback(transactionId, status);
      loadTransactions();
    } catch (error) {
      console.error('Callback simulation failed:', error);
    }
  };

  // Charger l'historique des transactions
  const loadTransactions = async () => {
    try {
      const history = await backendPaymentService.getPaymentHistory();
      setTransactions(history);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    }
  };

  // Gestionnaire de succès de paiement
  const handlePaymentSuccess = (transactionId: string) => {
    setPaymentResult({
      success: true,
      transactionId,
      message: "Paiement initié avec succès"
    });
    loadTransactions();
  };

  // Gestionnaire d'erreur de paiement
  const handlePaymentError = (error: string) => {
    setPaymentResult({
      success: false,
      error,
      message: "Échec du paiement"
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'default';
      case 'FAILED':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold">Test Paiements Backend</h1>
        </div>

        {/* État de connexion */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>État de la connexion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Connecté" : "Non connecté"}
              </Badge>
              {user && (
                <p>
                  <span className="font-medium">{user.firstName} {user.lastName}</span>
                  <span className="text-muted-foreground"> - {user.email}</span>
                  {user.role === 'ADMIN' && (
                    <Badge variant="outline" className="ml-2">Admin</Badge>
                  )}
                </p>
              )}
              {!isAuthenticated && (
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Se connecter
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2 space-y-6">
            {/* Panier de test */}
            <Card>
              <CardHeader>
                <CardTitle>Panier de test</CardTitle>
              </CardHeader>
              <CardContent>
                {items.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="mb-4">Aucun article dans le panier</p>
                    <Button onClick={addTestItems}>
                      Ajouter des articles de test
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="mb-4">
                      {items.length} article(s) - Total: {total.toLocaleString()} FCFA
                    </p>
                    <Button variant="outline" onClick={() => window.location.href = '/cart'}>
                      Voir le panier complet
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Formulaire de paiement */}
            {items.length > 0 && (
              <BackendPaymentForm 
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            )}

            {/* Résultat du paiement */}
            {paymentResult && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    {paymentResult.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                    Résultat du paiement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="mb-2">{paymentResult.message}</p>
                  {paymentResult.transactionId && (
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Transaction: {paymentResult.transactionId}
                      </p>
                      <div className="flex gap-2 mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateCallback(paymentResult.transactionId, 'SUCCESS')}
                        >
                          Simuler Succès
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => simulateCallback(paymentResult.transactionId, 'FAILED')}
                        >
                          Simuler Échec
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Récapitulatif et historique */}
          <div className="space-y-6">
            {items.length > 0 && <OrderSummary items={items.map(item => ({
              id: item.id,
              name: item.title,
              description: item.format,
              price: item.price,
              quantity: item.quantity
            }))} />}

            {/* Historique des transactions */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Transactions récentes</CardTitle>
                  <Button variant="outline" size="sm" onClick={loadTransactions}>
                    Actualiser
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {transactions.length === 0 ? (
                  <p className="text-center text-muted-foreground">
                    Aucune transaction
                  </p>
                ) : (
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {getStatusIcon(tx.status)}
                            <span className="font-medium">{tx.amount.toLocaleString()} FCFA</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {tx.paymentMethod} {tx.provider && `- ${tx.provider}`}
                          </p>
                        </div>
                        <Badge variant={getStatusColor(tx.status)}>
                          {tx.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Liens utiles */}
            <Card>
              <CardHeader>
                <CardTitle>Liens de test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/admin')}
                >
                  Admin Dashboard
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/admin/payments')}
                >
                  Gestion Paiements
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start" 
                  onClick={() => navigate('/admin/transactions')}
                >
                  Historique Transactions
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackendTestPayment;