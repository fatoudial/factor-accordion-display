
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, FileText, Package, Search } from 'lucide-react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination';
import { Link } from 'react-router-dom';

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface MockOrder {
  id: string;
  date: string;
  total: number;
  status: OrderStatus;
  items: number;
  format: 'EBOOK' | 'PRINT_STANDARD' | 'PRINT_PREMIUM';
  pages: number;
}

const MockOrders = () => {
  const { language } = useLanguage();
  const [orders, setOrders] = useState<MockOrder[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredOrders, setFilteredOrders] = useState<MockOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const ordersPerPage = 5;

  const translations = {
    fr: {
      title: "Mes commandes",
      searchPlaceholder: "Rechercher par ID...",
      orderID: "Référence",
      date: "Date",
      items: "Articles",
      total: "Total",
      status: "Statut",
      format: "Format",
      pages: "Pages",
      actions: "Actions",
      view: "Voir",
      all: "Tous",
      pending: "En attente",
      processing: "En traitement",
      shipped: "Expédié",
      delivered: "Livré",
      cancelled: "Annulé",
      filterByStatus: "Filtrer par statut",
      noOrders: "Aucune commande trouvée",
      searchResults: "Résultats de recherche pour",
      ebook: "Livre numérique",
      printStandard: "Livre imprimé",
      printPremium: "Livre premium",
      currency: "FCFA"
    },
    en: {
      title: "My Orders",
      searchPlaceholder: "Search by ID...",
      orderID: "Reference",
      date: "Date",
      items: "Items",
      total: "Total",
      status: "Status",
      format: "Format",
      pages: "Pages",
      actions: "Actions",
      view: "View",
      all: "All",
      pending: "Pending",
      processing: "Processing",
      shipped: "Shipped",
      delivered: "Delivered",
      cancelled: "Cancelled",
      filterByStatus: "Filter by status",
      noOrders: "No orders found",
      searchResults: "Search results for",
      ebook: "Digital book",
      printStandard: "Printed book",
      printPremium: "Premium book",
      currency: "FCFA"
    },
    es: {
      title: "Mis Pedidos",
      searchPlaceholder: "Buscar por ID...",
      orderID: "Referencia",
      date: "Fecha",
      items: "Artículos",
      total: "Total",
      status: "Estado",
      format: "Formato",
      pages: "Páginas",
      actions: "Acciones",
      view: "Ver",
      all: "Todos",
      pending: "Pendiente",
      processing: "Procesando",
      shipped: "Enviado",
      delivered: "Entregado",
      cancelled: "Cancelado",
      filterByStatus: "Filtrar por estado",
      noOrders: "No se encontraron pedidos",
      searchResults: "Resultados de búsqueda para",
      ebook: "Libro digital",
      printStandard: "Libro impreso",
      printPremium: "Libro premium",
      currency: "FCFA"
    },
    ar: {
      title: "طلباتي",
      searchPlaceholder: "البحث بالمعرف...",
      orderID: "المرجع",
      date: "التاريخ",
      items: "العناصر",
      total: "الإجمالي",
      status: "الحالة",
      format: "التنسيق",
      pages: "الصفحات",
      actions: "الإجراءات",
      view: "عرض",
      all: "الكل",
      pending: "قيد الانتظار",
      processing: "قيد المعالجة",
      shipped: "تم الشحن",
      delivered: "تم التسليم",
      cancelled: "ملغي",
      filterByStatus: "تصفية حسب الحالة",
      noOrders: "لم يتم العثور على طلبات",
      searchResults: "نتائج البحث عن",
      ebook: "كتاب رقمي",
      printStandard: "كتاب مطبوع",
      printPremium: "كتاب فاخر",
      currency: "فرنك"
    }
  };
  
  // Get translations for current language
  const t = translations[language as keyof typeof translations] || translations.fr;

  // Generate mock orders
  useEffect(() => {
    const mockData: MockOrder[] = [];
    const formats: Array<'EBOOK' | 'PRINT_STANDARD' | 'PRINT_PREMIUM'> = ['EBOOK', 'PRINT_STANDARD', 'PRINT_PREMIUM'];
    const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    const today = new Date();
    
    for (let i = 1; i <= 15; i++) {
      const orderDate = new Date(today);
      orderDate.setDate(today.getDate() - Math.floor(Math.random() * 60)); // Random date within last 60 days
      
      const format = formats[Math.floor(Math.random() * formats.length)];
      const pages = Math.floor(Math.random() * 150) + 50; // Between 50 and 200 pages
      
      let price;
      if (format === 'EBOOK') price = 8000;
      else if (format === 'PRINT_STANDARD') price = 15000;
      else price = 25000;
      
      mockData.push({
        id: `ORD${String(i).padStart(5, '0')}`,
        date: orderDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : language === 'en' ? 'en-US' : language === 'es' ? 'es-ES' : 'ar-SA'),
        total: price,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        items: 1,
        format,
        pages
      });
    }
    
    // Sort by date, newest first
    mockData.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return dateB - dateA;
    });
    
    setOrders(mockData);
    setFilteredOrders(mockData);
  }, [language]);

  // Filter orders based on search term and status filter
  useEffect(() => {
    let result = orders;
    
    if (searchTerm) {
      result = result.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    setFilteredOrders(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, orders]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  // Status badges
  const getStatusBadge = (status: OrderStatus) => {
    let variant = '';
    let text = '';
    
    switch(status) {
      case 'pending':
        variant = 'bg-yellow-100 text-yellow-800';
        text = t.pending;
        break;
      case 'processing':
        variant = 'bg-blue-100 text-blue-800';
        text = t.processing;
        break;
      case 'shipped':
        variant = 'bg-purple-100 text-purple-800';
        text = t.shipped;
        break;
      case 'delivered':
        variant = 'bg-green-100 text-green-800';
        text = t.delivered;
        break;
      case 'cancelled':
        variant = 'bg-red-100 text-red-800';
        text = t.cancelled;
        break;
    }
    
    return <Badge className={variant}>{text}</Badge>;
  };
  
  // Format translator
  const getFormatText = (format: 'EBOOK' | 'PRINT_STANDARD' | 'PRINT_PREMIUM') => {
    switch(format) {
      case 'EBOOK':
        return t.ebook;
      case 'PRINT_STANDARD':
        return t.printStandard;
      case 'PRINT_PREMIUM':
        return t.printPremium;
    }
  };
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-serif font-bold text-ts-indigo mb-8">{t.title}</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          {/* Search box */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
            <Input 
              type="search" 
              placeholder={t.searchPlaceholder} 
              className="pl-10 w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Status filter */}
          <Select onValueChange={(value: OrderStatus | 'all') => setStatusFilter(value)} defaultValue="all">
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t.filterByStatus} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="pending">{t.pending}</SelectItem>
              <SelectItem value="processing">{t.processing}</SelectItem>
              <SelectItem value="shipped">{t.shipped}</SelectItem>
              <SelectItem value="delivered">{t.delivered}</SelectItem>
              <SelectItem value="cancelled">{t.cancelled}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {searchTerm && (
          <p className="text-sm text-gray-600 mb-4">
            {t.searchResults} "{searchTerm}": {filteredOrders.length} {filteredOrders.length === 1 ? 'résultat' : 'résultats'}
          </p>
        )}
        
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">{t.noOrders}</div>
        ) : (
          <>
            {/* Orders Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.orderID}</TableHead>
                    <TableHead>{t.date}</TableHead>
                    <TableHead>{t.format}</TableHead>
                    <TableHead>{t.pages}</TableHead>
                    <TableHead>{t.total}</TableHead>
                    <TableHead>{t.status}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>{getFormatText(order.format)}</TableCell>
                      <TableCell>{order.pages}</TableCell>
                      <TableCell>{order.total.toLocaleString()} {t.currency}</TableCell>
                      <TableCell>{getStatusBadge(order.status)}</TableCell>
                      <TableCell className="text-right">
                        <Link to={`/orders/${order.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {t.view}
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-8">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage - 1);
                      }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const pageNum = index + 1;
                    // Show current page, first, last, and adjacent pages
                    if (
                      pageNum === 1 || 
                      pageNum === totalPages || 
                      (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink 
                            href="#" 
                            onClick={(e) => {
                              e.preventDefault();
                              handlePageChange(pageNum);
                            }}
                            isActive={pageNum === currentPage}
                          >
                            {pageNum}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    
                    // Show ellipsis for gaps
                    if (
                      (pageNum === currentPage - 2 && currentPage > 3) || 
                      (pageNum === currentPage + 2 && currentPage < totalPages - 2)
                    ) {
                      return (
                        <PaginationItem key={index}>
                          <span className="flex h-10 w-10 items-center justify-center">...</span>
                        </PaginationItem>
                      );
                    }
                    
                    return null;
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      href="#" 
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(currentPage + 1);
                      }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MockOrders;
