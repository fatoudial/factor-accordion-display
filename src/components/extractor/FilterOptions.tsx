
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import type { DateRange } from "react-day-picker";
import type { FilterOptions as FilterOptionsType } from './types';

interface FilterOptionsProps {
  dateRange: DateRange | undefined;
  filterOptions: FilterOptionsType;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onFilterOptionChange: (option: keyof FilterOptionsType) => void;
}

export const FilterOptions = ({
  dateRange,
  filterOptions,
  onDateRangeChange,
  onFilterOptionChange
}: FilterOptionsProps) => {
  return (
    <div>
      <h3 className="text-lg font-medium text-ts-indigo mb-4">Filtres et personnalisation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label className="text-base">Période à inclure</Label>
          <div className="grid gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "P", { locale: fr })} -{" "}
                        {format(dateRange.to, "P", { locale: fr })}
                      </>
                    ) : (
                      format(dateRange.from, "P", { locale: fr })
                    )
                  ) : (
                    <span>Choisir une période</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  locale={fr}
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={onDateRangeChange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-4">
          <Label className="text-base">Types de contenu à inclure</Label>
          
          <div className="space-y-2">
            {Object.entries(filterOptions).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="cursor-pointer">
                  {key === 'includePhotos' && 'Photos'}
                  {key === 'includeVideos' && 'Vidéos'}
                  {key === 'includeVoiceNotes' && 'Notes vocales'}
                  {key === 'includeEmojis' && 'Émojis'}
                  {key === 'includeAttachments' && 'Pièces jointes'}
                </Label>
                <Switch 
                  id={key}
                  checked={value}
                  onCheckedChange={() => onFilterOptionChange(key as keyof FilterOptionsType)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
