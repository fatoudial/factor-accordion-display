import React from 'react';
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Upload } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/context/LanguageContext';
import { Input } from "@/components/ui/input";
import { useState } from 'react';

// Example book data
const booksData = [
  {
    id: 1,
    title: "Notre histoire d'amour",
    coverImage: "/covers/book-cover-1.png",
    format: "Standard",
    pages: 120,
    status: "Completed",
    creationDate: "2023-05-15",
    orderId: "ORD-12345"
  },
  {
    id: 2,
    title: "Souvenirs de vacances",
    coverImage: "/covers/book-cover-2.png",
    format: "Premium",
    pages: 80,
    status: "In Progress",
    creationDate: "2023-06-20",
    orderId: "ORD-23456"
  },
  {
    id: 3,
    title: "Conversation avec Mamie",
    coverImage: "/covers/book-cover-3.jpeg",
    format: "Digital",
    pages: 50,
    status: "Draft",
    creationDate: "2023-07-10",
    orderId: null
  },
  {
    id: 4,
    title: "Les blagues de Papa",
    coverImage: "/covers/book-cover-4.jpeg",
    format: "Premium",
    pages: 150,
    status: "Archived",
    creationDate: "2023-04-05",
    orderId: "ORD-34567"
  }
];

// Type for book status
type BookStatus = 'Draft' | 'In Progress' | 'Completed' | 'Archived' | 'All';
type BookFormat = 'Standard' | 'Premium' | 'Digital' | 'All';
type BooksTab = 'all' | 'templates' | 'ordered';

// Define the translation interface to prevent type errors
interface Translations {
  title: string;
  fileImported: string;
  fileImportedDesc: string;
  draft: string;
  inProgress: string;
  completed: string;
  archived: string;
  back: string;
  allBooks: string;
  templates: string;
  orderedBooks: string;
  importFile: string;
  importTitle: string;
  importDesc: string;
  dragDrop: string;
  browse: string;
  cancel: string;
  createBook: string;
  filters: string;
  search: string;
  allStatuses: string;
  allFormats: string;
  standard: string;
  premium: string;
  ebook: string;
  noBooks: string;
  cover: string;
  format: string;
  pages: string;
  creationDate: string;
  status: string;
  order: string;
  actions: string;
  preview: string;
  edit: string;
  delete: string;
  noTemplates: string;
  createTemplate: string;
  orderedBooksDesc: string;
  bookPreview: string;
  bookPreviewDesc: string;
  editBook: string;
  editBookDesc: string;
}

const AdminBooks = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // State for filtering and viewing
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookStatus>('All');
  const [formatFilter, setFormatFilter] = useState<BookFormat>('All');
  const [activeTab, setActiveTab] = useState<BooksTab>('all');
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activeBookId, setActiveBookId] = useState<number | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  // Translations
  const translations: Record<string, Translations> = {
    fr: {
      title: "Titre du livre",
      fileImported: "Fichier importé avec succès!",
      fileImportedDesc: "Votre fichier a été importé et est prêt à être traité.",
      draft: "Brouillon",
      inProgress: "En cours",
      completed: "Terminé",
      archived: "Archivé",
      back: "Retour",
      allBooks: "Tous les livres",
      templates: "Modèles",
      orderedBooks: "Livres commandés",
      importFile: "Importer un fichier",
      importTitle: "Importer une conversation",
      importDesc: "Importez un fichier d'export de conversation pour créer un nouveau livre",
      dragDrop: "Glissez-déposez votre fichier ici ou",
      browse: "Parcourir",
      cancel: "Annuler",
      createBook: "Créer un livre",
      filters: "Filtres",
      search: "Rechercher un livre...",
      allStatuses: "Tous les statuts",
      allFormats: "Tous les formats",
      standard: "Standard",
      premium: "Premium",
      ebook: "Numérique",
      noBooks: "Aucun livre trouvé avec les filtres actuels",
      cover: "Couverture",
      format: "Format",
      pages: "Pages",
      creationDate: "Date de création",
      status: "Statut",
      order: "Commande",
      actions: "Actions",
      preview: "Aperçu",
      edit: "Éditer",
      delete: "Supprimer",
      noTemplates: "Aucun modèle disponible actuellement",
      createTemplate: "Créer un modèle",
      orderedBooksDesc: "Livres qui ont été commandés par les clients",
      bookPreview: "Aperçu du livre",
      bookPreviewDesc: "Prévisualisez le livre avant l'impression",
      editBook: "Éditer le livre",
      editBookDesc: "Modifier les détails et le contenu du livre"
    },
    en: {
      title: "Books Management",
      fileImported: "File successfully imported!",
      fileImportedDesc: "Your file has been imported and is ready to be processed.",
      draft: "Draft",
      inProgress: "In Progress",
      completed: "Completed",
      archived: "Archived",
      back: "Back",
      allBooks: "All Books",
      templates: "Templates",
      orderedBooks: "Ordered Books",
      importFile: "Import File",
      importTitle: "Import Conversation",
      importDesc: "Import a conversation export file to create a new book",
      dragDrop: "Drag and drop your file here or",
      browse: "Browse",
      cancel: "Cancel",
      createBook: "Create Book",
      filters: "Filters",
      search: "Search for a book...",
      allStatuses: "All Statuses",
      allFormats: "All Formats",
      standard: "Standard",
      premium: "Premium",
      ebook: "Digital",
      noBooks: "No books found with current filters",
      cover: "Cover",
      format: "Format",
      pages: "Pages",
      creationDate: "Creation Date",
      status: "Status",
      order: "Order",
      actions: "Actions",
      preview: "Preview",
      edit: "Edit",
      delete: "Delete",
      noTemplates: "No templates available currently",
      createTemplate: "Create Template",
      orderedBooksDesc: "Books that have been ordered by customers",
      bookPreview: "Book Preview",
      bookPreviewDesc: "Preview the book before printing",
      editBook: "Edit Book",
      editBookDesc: "Modify the book details and content"
    },
    es: {
      title: "Gestión de Libros",
      fileImported: "¡Archivo importado con éxito!",
      fileImportedDesc: "Tu archivo ha sido importado y está listo para ser procesado.",
      draft: "Borrador",
      inProgress: "En Progreso",
      completed: "Completado",
      archived: "Archivado",
      back: "Volver",
      allBooks: "Todos los Libros",
      templates: "Plantillas",
      orderedBooks: "Libros Ordenados",
      importFile: "Importar Archivo",
      importTitle: "Importar Conversación",
      importDesc: "Importar un archivo de exportación de conversación para crear un nuevo libro",
      dragDrop: "Arrastra y suelta tu archivo aquí o",
      browse: "Explorar",
      cancel: "Cancelar",
      createBook: "Crear Libro",
      filters: "Filtros",
      search: "Buscar un libro...",
      allStatuses: "Todos los Estados",
      allFormats: "Todos los Formatos",
      standard: "Estándar",
      premium: "Premium",
      ebook: "Digital",
      noBooks: "No se encontraron libros con los filtros actuales",
      cover: "Portada",
      format: "Formato",
      pages: "Páginas",
      creationDate: "Fecha de Creación",
      status: "Estado",
      order: "Orden",
      actions: "Acciones",
      preview: "Vista Previa",
      edit: "Editar",
      delete: "Eliminar",
      noTemplates: "No hay plantillas disponibles actualmente",
      createTemplate: "Crear Plantilla",
      orderedBooksDesc: "Libros que han sido ordenados por clientes",
      bookPreview: "Vista previa del libro",
      bookPreviewDesc: "Previsualiza el libro antes de imprimir",
      editBook: "Editar libro",
      editBookDesc: "Modificar los detalles y contenido del libro"
    },
    ar: {
      title: "إدارة الكتب",
      fileImported: "تم استيراد الملف بنجاح!",
      fileImportedDesc: "تم استيراد ملفك وهو جاهز للمعالجة.",
      draft: "مسودة",
      inProgress: "قيد التقدم",
      completed: "مكتمل",
      archived: "مؤرشف",
      back: "رجوع",
      allBooks: "جميع الكتب",
      templates: "قوالب",
      orderedBooks: "الكتب المطلوبة",
      importFile: "استيراد ملف",
      importTitle: "استيراد محادثة",
      importDesc: "استيراد ملف تصدير محادثة لإنشاء كتاب جديد",
      dragDrop: "اسحب وأفلت ملفك هنا أو",
      browse: "تصفح",
      cancel: "إلغاء",
      createBook: "إنشاء كتاب",
      filters: "المرشحات",
      search: "البحث عن كتاب...",
      allStatuses: "جميع الحالات",
      allFormats: "جميع التنسيقات",
      standard: "قياسي",
      premium: "متميز",
      ebook: "رقمي",
      noBooks: "لم يتم العثور على كتب بالمرشحات الحالية",
      cover: "غلاف",
      format: "تنسيق",
      pages: "صفحات",
      creationDate: "تاريخ الإنشاء",
      status: "الحالة",
      order: "طلب",
      actions: "إجراءات",
      preview: "معاينة",
      edit: "تعديل",
      delete: "حذف",
      noTemplates: "لا توجد قوالب متاحة حالياً",
      createTemplate: "إنشاء قالب",
      orderedBooksDesc: "الكتب التي تم طلبها من قبل العملاء",
      bookPreview: "معاينة الكتاب",
      bookPreviewDesc: "معاينة الكتاب قبل الطباعة",
      editBook: "تعديل الكتاب",
      editBookDesc: "تعديل تفاصيل ومحتوى الكتاب"
    }
  };

  const t = translations[language as keyof typeof translations] || translations.fr;

  // Filter books based on selected filters
  const filteredBooks = booksData.filter(book => {
    // Apply search filter
    if (searchQuery && !book.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply status filter
    if (statusFilter !== 'All' && book.status !== statusFilter) {
      return false;
    }
    
    // Apply format filter
    if (formatFilter !== 'All' && book.format !== formatFilter) {
      return false;
    }
    
    // Apply tab filter
    if (activeTab === 'templates') {
      // For demo purposes, let's say we have no templates yet
      return false;
    } else if (activeTab === 'ordered') {
      return book.orderId !== null;
    }
    
    return true;
  });

  const handleBookPreview = (bookId: number) => {
    setActiveBookId(bookId);
    setPreviewDialogOpen(true);
  };

  const handleBookEdit = (bookId: number) => {
    setActiveBookId(bookId);
    setEditDialogOpen(true);
  };

  const handleBookDelete = (bookId: number) => {
    setActiveBookId(bookId);
    setDeleteConfirmOpen(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t.title}</h1>
      
      {/* Tabs */}
      <div className="mb-6">
        <div className="flex space-x-1 rounded-lg bg-muted p-1 max-w-md">
          <Button
            variant={activeTab === 'all' ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setActiveTab('all')}
          >
            {t.allBooks}
          </Button>
          <Button
            variant={activeTab === 'templates' ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setActiveTab('templates')}
          >
            {t.templates}
          </Button>
          <Button
            variant={activeTab === 'ordered' ? "default" : "ghost"}
            className="flex-1"
            onClick={() => setActiveTab('ordered')}
          >
            {t.orderedBooks}
          </Button>
        </div>
      </div>
      
      {/* Import button and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <Button 
          onClick={() => setImportDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Upload size={16} />
          {t.importFile}
        </Button>
        
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <div className="relative max-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Rechercher un livre..."
              className="pl-8"
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          
          <Select
            value={statusFilter}
            onValueChange={(value) => setStatusFilter(value as BookStatus)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.allStatuses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t.allStatuses}</SelectItem>
              <SelectItem value="Draft">{t.draft}</SelectItem>
              <SelectItem value="In Progress">{t.inProgress}</SelectItem>
              <SelectItem value="Completed">{t.completed}</SelectItem>
              <SelectItem value="Archived">{t.archived}</SelectItem>
            </SelectContent>
          </Select>
          
          <Select
            value={formatFilter}
            onValueChange={(value) => setFormatFilter(value as BookFormat)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder={t.allFormats} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">{t.allFormats}</SelectItem>
              <SelectItem value="Standard">{t.standard}</SelectItem>
              <SelectItem value="Premium">{t.premium}</SelectItem>
              <SelectItem value="Digital">{t.ebook}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Books table for 'all' and 'ordered' tabs */}
      {(activeTab === 'all' || activeTab === 'ordered') && (
        <div className="overflow-x-auto">
          {filteredBooks.length > 0 ? (
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">{t.cover}</th>
                  <th className="text-left py-3 px-4">{t.title}</th>
                  <th className="text-left py-3 px-4">{t.format}</th>
                  <th className="text-left py-3 px-4">{t.pages}</th>
                  <th className="text-left py-3 px-4">{t.creationDate}</th>
                  <th className="text-left py-3 px-4">{t.status}</th>
                  <th className="text-left py-3 px-4">{t.order}</th>
                  <th className="text-right py-3 px-4">{t.actions}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBooks.map(book => (
                  <tr key={book.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="h-14 w-14 rounded overflow-hidden">
                        <img 
                          src={book.coverImage} 
                          alt={book.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-3 px-4 font-medium">{book.title}</td>
                    <td className="py-3 px-4">{book.format}</td>
                    <td className="py-3 px-4">{book.pages}</td>
                    <td className="py-3 px-4">{new Date(book.creationDate).toLocaleDateString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        book.status === 'Completed' ? 'bg-green-100 text-green-800' :
                        book.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        book.status === 'Draft' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {book.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{book.orderId || '-'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleBookPreview(book.id)}
                        >
                          {t.preview}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleBookEdit(book.id)}
                        >
                          {t.edit}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleBookDelete(book.id)}
                        >
                          {t.delete}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t.noBooks}
            </div>
          )}
        </div>
      )}
      
      {/* Templates tab content */}
      {activeTab === 'templates' && (
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 mb-4">{t.noTemplates}</p>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t.createTemplate}
          </Button>
        </div>
      )}
      
      {/* Import Dialog */}
      <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.importTitle}</DialogTitle>
            <DialogDescription>{t.importDesc}</DialogDescription>
          </DialogHeader>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-500 mb-4">
              {t.dragDrop} <span className="text-primary font-medium">{t.browse}</span>
            </p>
            <Input type="file" className="hidden" id="fileUpload" />
            <Button variant="outline" onClick={() => document.getElementById('fileUpload')?.click()}>
              {t.browse}
            </Button>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setImportDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={() => {
              setImportDialogOpen(false);
              // Here you would handle the file processing
            }}>
              {t.createBook}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Book Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t.bookPreview}</DialogTitle>
            <DialogDescription>{t.bookPreviewDesc}</DialogDescription>
          </DialogHeader>
          
          {/* Book preview content would go here */}
          <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Book preview placeholder</p>
          </div>
          
          <DialogFooter>
            <Button onClick={() => setPreviewDialogOpen(false)}>
              {t.back}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Book Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{t.editBook}</DialogTitle>
            <DialogDescription>{t.editBookDesc}</DialogDescription>
          </DialogHeader>
          
          {/* Book editing form would go here */}
          <div className="h-96 flex items-center justify-center bg-gray-100 rounded">
            <p className="text-gray-500">Book editor placeholder</p>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={() => setEditDialogOpen(false)}>
              {t.back}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminBooks;
