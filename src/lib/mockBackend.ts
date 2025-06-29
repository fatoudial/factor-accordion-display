
// Mock Backend API - Simule toutes les fonctionnalités backend
import type { Order, OrderStatus } from '@/types/order';
import type { ProcessedMessage } from '@/components/extractor/types';

// Interfaces pour les mocks
export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export interface MockBook {
  id: string;
  userId: string;
  title: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  format: 'EBOOK' | 'PRINT_STANDARD' | 'PRINT_PREMIUM';
  pages: number;
  messages: ProcessedMessage[];
  createdAt: Date;
  updatedAt: Date;
  previewUrl?: string;
  downloadUrl?: string;
}

export interface MockPayment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  method: 'MOBILE_MONEY' | 'CREDIT_CARD' | 'BANK_TRANSFER';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: Date;
  completedAt?: Date;
}

export interface DateFilter {
  from: Date;
  to: Date;
}

export interface AdminFilters {
  status?: OrderStatus;
  dateRange?: DateFilter;
  search?: string;
  bookFormat?: string;
  paymentMethod?: string;
}

// Storage simulé
class MockStorage {
  private users: MockUser[] = [];
  private orders: Order[] = [];
  private books: MockBook[] = [];
  private payments: MockPayment[] = [];

  constructor() {
    this.initializeMockData();
  }

  private initializeMockData() {
    // Utilisateurs mock
    this.users = [
      {
        id: 'user_1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
        createdAt: new Date('2023-01-01'),
        lastLogin: new Date(),
        isActive: true
      },
      {
        id: 'user_2',
        email: 'john@example.com',
        name: 'John Doe',
        role: 'user',
        createdAt: new Date('2023-03-15'),
        lastLogin: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isActive: true
      },
      {
        id: 'user_3',
        email: 'jane@example.com',
        name: 'Jane Smith',
        role: 'user',
        createdAt: new Date('2023-05-20'),
        lastLogin: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        isActive: true
      }
    ];

    // Commandes mock (étendues)
    this.orders = [
      {
        id: 'ord_1',
        orderReference: 'ORD-2024-001',
        userId: 'user_2',
        userEmail: 'john@example.com',
        userName: 'John Doe',
        items: [{
          id: 'item_1',
          productId: 'book_1',
          name: 'Mon livre souvenir',
          quantity: 1,
          unitPrice: 25000
        }],
        totalAmount: 25000,
        status: 'DELIVERED',
        shippingAddress: {
          firstName: 'John',
          lastName: 'Doe',
          fullName: 'John Doe',
          address: '123 Main St',
          addressLine1: '123 Main St',
          city: 'Abidjan',
          state: 'Lagunes',
          postalCode: '00225',
          country: 'Côte d\'Ivoire',
          phone: '+225 0102030405',
          email: 'john.doe@example.com'
        },
        paymentMethod: 'MOBILE_MONEY',
        paymentId: 'pay_123456',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-01-20'),
        completedAt: new Date('2024-01-20'),
        trackingNumber: 'TRK12345678',
        bookFormat: 'PRINT_PREMIUM',
        bookId: 'book_1'
      },
      {
        id: 'ord_2',
        orderReference: 'ORD-2024-002',
        userId: 'user_3',
        userEmail: 'jane@example.com',
        userName: 'Jane Smith',
        items: [{
          id: 'item_2',
          productId: 'book_2',
          name: 'Voyage en Afrique',
          quantity: 1,
          unitPrice: 15000
        }],
        totalAmount: 15000,
        status: 'SHIPPED',
        shippingAddress: {
          firstName: 'Jane',
          lastName: 'Smith',
          fullName: 'Jane Smith',
          address: '456 Park Ave',
          addressLine1: '456 Park Ave',
          city: 'Dakar',
          state: 'Dakar',
          postalCode: '00221',
          country: 'Sénégal',
          phone: '+221 771234567',
          email: 'jane.smith@example.com'
        },
        paymentMethod: 'CREDIT_CARD',
        paymentId: 'pay_789012',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-05'),
        completedAt: null,
        trackingNumber: 'TRK98765432',
        bookFormat: 'PRINT_STANDARD',
        bookId: 'book_2'
      },
      // Plus de commandes pour tester les filtres
      ...this.generateMoreOrders()
    ];

    // Livres mock
    this.books = [
      {
        id: 'book_1',
        userId: 'user_2',
        title: 'Mon livre souvenir',
        status: 'completed',
        format: 'PRINT_PREMIUM',
        pages: 120,
        messages: [],
        createdAt: new Date('2024-01-10'),
        updatedAt: new Date('2024-01-15'),
        previewUrl: '/preview/book_1.pdf',
        downloadUrl: '/download/book_1.pdf'
      },
      {
        id: 'book_2',
        userId: 'user_3',
        title: 'Voyage en Afrique',
        status: 'completed',
        format: 'PRINT_STANDARD',
        pages: 80,
        messages: [],
        createdAt: new Date('2024-01-25'),
        updatedAt: new Date('2024-02-01'),
        previewUrl: '/preview/book_2.pdf'
      }
    ];

    // Paiements mock
    this.payments = [
      {
        id: 'pay_123456',
        orderId: 'ord_1',
        amount: 25000,
        currency: 'XOF',
        method: 'MOBILE_MONEY',
        status: 'completed',
        createdAt: new Date('2024-01-15'),
        completedAt: new Date('2024-01-15')
      },
      {
        id: 'pay_789012',
        orderId: 'ord_2',
        amount: 15000,
        currency: 'XOF',
        method: 'CREDIT_CARD',
        status: 'completed',
        createdAt: new Date('2024-02-01'),
        completedAt: new Date('2024-02-01')
      }
    ];
  }

  private generateMoreOrders(): Order[] {
    const moreOrders: Order[] = [];
    const statuses: OrderStatus[] = ['PENDING_PAYMENT', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    const formats = ['EBOOK', 'PRINT_STANDARD', 'PRINT_PREMIUM'];
    const paymentMethods = ['MOBILE_MONEY', 'CREDIT_CARD', 'BANK_TRANSFER'];

    for (let i = 3; i <= 20; i++) {
      const createdDate = new Date();
      createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 90)); // Derniers 90 jours

      moreOrders.push({
        id: `ord_${i}`,
        orderReference: `ORD-2024-${i.toString().padStart(3, '0')}`,
        userId: `user_${Math.floor(Math.random() * 3) + 1}`,
        userEmail: `user${i}@example.com`,
        userName: `User ${i}`,
        items: [{
          id: `item_${i}`,
          productId: `book_${i}`,
          name: `Livre ${i}`,
          quantity: 1,
          unitPrice: Math.floor(Math.random() * 30000) + 5000
        }],
        totalAmount: Math.floor(Math.random() * 30000) + 5000,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        shippingAddress: {
          firstName: `User`,
          lastName: `${i}`,
          fullName: `User ${i}`,
          address: `${i} Street`,
          addressLine1: `${i} Street`,
          city: 'City',
          state: 'State',
          postalCode: '00000',
          country: 'Pays',
          phone: `+225 ${i.toString().padStart(8, '0')}`,
          email: `user${i}@example.com`
        },
        paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        paymentId: `pay_${i}`,
        createdAt: createdDate,
        updatedAt: createdDate,
        completedAt: Math.random() > 0.5 ? createdDate : null,
        trackingNumber: Math.random() > 0.5 ? `TRK${i}` : null,
        bookFormat: formats[Math.floor(Math.random() * formats.length)],
        bookId: `book_${i}`
      });
    }

    return moreOrders;
  }

  // API methods
  async getOrders(filters?: AdminFilters): Promise<Order[]> {
    await this.delay(300); // Simulate network delay
    
    let filteredOrders = [...this.orders];

    if (filters) {
      if (filters.status) {
        filteredOrders = filteredOrders.filter(order => order.status === filters.status);
      }

      if (filters.dateRange) {
        filteredOrders = filteredOrders.filter(order => {
          const orderDate = new Date(order.createdAt);
          return orderDate >= filters.dateRange!.from && orderDate <= filters.dateRange!.to;
        });
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredOrders = filteredOrders.filter(order =>
          order.orderReference.toLowerCase().includes(searchLower) ||
          order.userEmail?.toLowerCase().includes(searchLower) ||
          order.userName?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.bookFormat) {
        filteredOrders = filteredOrders.filter(order => order.bookFormat === filters.bookFormat);
      }

      if (filters.paymentMethod) {
        filteredOrders = filteredOrders.filter(order => order.paymentMethod === filters.paymentMethod);
      }
    }

    return filteredOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(id: string): Promise<Order | null> {
    await this.delay(200);
    return this.orders.find(order => order.id === id) || null;
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order | null> {
    await this.delay(500);
    const orderIndex = this.orders.findIndex(order => order.id === id);
    if (orderIndex === -1) return null;

    this.orders[orderIndex] = {
      ...this.orders[orderIndex],
      status,
      updatedAt: new Date()
    };

    return this.orders[orderIndex];
  }

  async getUsers(): Promise<MockUser[]> {
    await this.delay(300);
    return [...this.users];
  }

  async getBooks(filters?: { userId?: string; status?: string }): Promise<MockBook[]> {
    await this.delay(300);
    let filteredBooks = [...this.books];

    if (filters?.userId) {
      filteredBooks = filteredBooks.filter(book => book.userId === filters.userId);
    }

    if (filters?.status) {
      filteredBooks = filteredBooks.filter(book => book.status === filters.status);
    }

    return filteredBooks;
  }

  async getPayments(filters?: { orderId?: string; status?: string }): Promise<MockPayment[]> {
    await this.delay(300);
    let filteredPayments = [...this.payments];

    if (filters?.orderId) {
      filteredPayments = filteredPayments.filter(payment => payment.orderId === filters.orderId);
    }

    if (filters?.status) {
      filteredPayments = filteredPayments.filter(payment => payment.status === filters.status);
    }

    return filteredPayments;
  }

  // Statistiques pour le dashboard admin
  async getDashboardStats(): Promise<{
    totalOrders: number;
    totalRevenue: number;
    activeUsers: number;
    completedBooks: number;
    pendingOrders: number;
    recentOrders: Order[];
  }> {
    await this.delay(400);
    
    const totalRevenue = this.orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    const pendingOrders = this.orders.filter(order => 
      ['PENDING_PAYMENT', 'PAID', 'PROCESSING'].includes(order.status)
    ).length;

    const recentOrders = this.orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      totalOrders: this.orders.length,
      totalRevenue,
      activeUsers: this.users.filter(user => user.isActive).length,
      completedBooks: this.books.filter(book => book.status === 'completed').length,
      pendingOrders,
      recentOrders
    };
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Instance singleton
export const mockBackend = new MockStorage();

// Export des fonctions API
export const mockApi = {
  orders: {
    getAll: (filters?: AdminFilters) => mockBackend.getOrders(filters),
    getById: (id: string) => mockBackend.getOrderById(id),
    updateStatus: (id: string, status: OrderStatus) => mockBackend.updateOrderStatus(id, status)
  },
  users: {
    getAll: () => mockBackend.getUsers()
  },
  books: {
    getAll: (filters?: { userId?: string; status?: string }) => mockBackend.getBooks(filters)
  },
  payments: {
    getAll: (filters?: { orderId?: string; status?: string }) => mockBackend.getPayments(filters)
  },
  dashboard: {
    getStats: () => mockBackend.getDashboardStats()
  }
};
