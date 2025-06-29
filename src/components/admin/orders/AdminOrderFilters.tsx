
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Search } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types/order';

interface AdminOrderFiltersProps {
  filters: {
    search: string;
    status: OrderStatus | '';
    bookFormat: string;
    paymentMethod: string;
    dateFrom: Date | null;
    dateTo: Date | null;
  };
  onFilterChange: (key: string, value: any) => void;
}

export const AdminOrderFilters: React.FC<AdminOrderFiltersProps> = ({
  filters,
  onFilterChange
}) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher..."
              value={filters.search}
              onChange={(e) => onFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={filters.status}
            onValueChange={(value) => onFilterChange('status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Statut" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les statuts</SelectItem>
              <SelectItem value="PENDING_PAYMENT">En attente de paiement</SelectItem>
              <SelectItem value="PAID">Payé</SelectItem>
              <SelectItem value="PROCESSING">En traitement</SelectItem>
              <SelectItem value="SHIPPED">Expédié</SelectItem>
              <SelectItem value="DELIVERED">Livré</SelectItem>
              <SelectItem value="CANCELLED">Annulé</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.bookFormat}
            onValueChange={(value) => onFilterChange('bookFormat', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Format" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Tous les formats</SelectItem>
              <SelectItem value="EBOOK">eBook</SelectItem>
              <SelectItem value="PRINT_STANDARD">Standard</SelectItem>
              <SelectItem value="PRINT_PREMIUM">Premium</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.paymentMethod}
            onValueChange={(value) => onFilterChange('paymentMethod', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Paiement" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Toutes les méthodes</SelectItem>
              <SelectItem value="MOBILE_MONEY">Mobile Money</SelectItem>
              <SelectItem value="CREDIT_CARD">Carte bancaire</SelectItem>
              <SelectItem value="BANK_TRANSFER">Virement</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !filters.dateFrom && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, 'dd/MM/yyyy') : "Date début"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateFrom || undefined}
                onSelect={(date) => onFilterChange('dateFrom', date)}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !filters.dateTo && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, 'dd/MM/yyyy') : "Date fin"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={filters.dateTo || undefined}
                onSelect={(date) => onFilterChange('dateTo', date)}
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardContent>
    </Card>
  );
};
