
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  lastLogin?: Date;
  phoneNumber?: string;
  address?: UserAddress;
  preferredLanguage?: 'fr' | 'en' | 'es' | 'ar';
  // Informations spécifiques pour le back-office administrateur
  isVerified?: boolean;
  totalOrders?: number;
  totalSpent?: number;
}

export interface UserAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
  state?: string;
}

export type UserRole = 'USER' | 'ADMIN' | 'MANAGER';

export interface UserSession {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

// Modèle pour les statistiques utilisateur (pour le dashboard administrateur)
export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  usersByCountry: Record<string, number>;
  registrationsByMonth: Record<string, number>;
}
