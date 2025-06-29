
/**
 * Utilitaires pour les paiements
 */

// Formater le prix en CFA
export const formatCfa = (amount: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    maximumFractionDigits: 0
  }).format(amount / 100) + ' CFA';
};

// Convertir EUR en CFA (taux fixe pour la démonstration)
export const convertEurToCfa = (amountEur: number): number => {
  // Taux de conversion approximatif (1 EUR ≈ 655.957 CFA)
  const exchangeRate = 655.957;
  return Math.round(amountEur * exchangeRate);
};

// Obtenir le taux de conversion
export const getExchangeRate = (): number => {
  return 655.957; // Taux fixe pour la démonstration
};

// Obtenir les méthodes de paiement disponibles
export const getPaymentMethods = () => {
  return [
    { id: 'mobile_money', name: 'Mobile Money', providers: ['Orange Money', 'MTN Mobile Money', 'Wave'] },
    { id: 'card', name: 'Carte bancaire', providers: [] },
    { id: 'bank', name: 'Virement bancaire', providers: [] }
  ];
};

// Vérifier si le paiement est valide
export const validatePayment = (amount: number, method: string, provider?: string): boolean => {
  // Logique de validation simple
  return amount > 0 && !!method;
};

// Statuts de paiement disponibles
export const paymentStatuses = {
  pending: { label: 'En attente', color: 'amber' },
  success: { label: 'Réussi', color: 'green' },
  failed: { label: 'Échoué', color: 'red' },
  refunded: { label: 'Remboursé', color: 'purple' }
};
