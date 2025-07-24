import { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DateRange } from '@/hooks/useAnalytics';

interface DateRangeSelectorProps {
  dateRange: DateRange;
  onDateRangeChange: (range: DateRange) => void;
}

const PRESET_RANGES = [
  { label: 'Today', days: 0 },
  { label: 'Last 7 days', days: 7 },
  { label: 'Last 30 days', days: 30 },
  { label: 'Last 90 days', days: 90 },
  { label: 'Last year', days: 365 }
];

export function DateRangeSelector({ dateRange, onDateRangeChange }: DateRangeSelectorProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({});

  const handlePresetClick = (days: number) => {
    const to = new Date();
    const from = new Date();
    
    if (days === 0) {
      // Today
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
    } else {
      from.setDate(from.getDate() - days);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
    }

    onDateRangeChange({ from, to });
    setIsOpen(false);
  };

  const handleCustomRangeApply = () => {
    if (customRange.from && customRange.to) {
      const from = new Date(customRange.from);
      const to = new Date(customRange.to);
      from.setHours(0, 0, 0, 0);
      to.setHours(23, 59, 59, 999);
      
      onDateRangeChange({ from, to });
      setIsOpen(false);
    }
  };

  const formatDateRange = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const fromToday = new Date(dateRange.from);
    fromToday.setHours(0, 0, 0, 0);
    
    // Check if it's today
    if (fromToday.getTime() === today.getTime() && 
        dateRange.to.getTime() >= today.getTime() + 24 * 60 * 60 * 1000 - 1) {
      return t('Today');
    }
    
    // Check for other presets
    const daysDiff = Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24));
    const preset = PRESET_RANGES.find(p => p.days === daysDiff && p.days > 0);
    
    if (preset) {
      return t(preset.label);
    }
    
    // Custom range
    return `${format(dateRange.from, 'MMM dd')} - ${format(dateRange.to, 'MMM dd, yyyy')}`;
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full sm:w-auto justify-start text-left font-normal",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Preset ranges */}
          <div className="border-r border-border p-3 space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {t('Quick ranges')}
            </div>
            {PRESET_RANGES.map((preset) => (
              <Button
                key={preset.label}
                variant="ghost"
                size="sm"
                className="w-full justify-start"
                onClick={() => handlePresetClick(preset.days)}
              >
                {t(preset.label)}
              </Button>
            ))}
          </div>
          
          {/* Custom calendar */}
          <div className="p-3">
            <div className="text-sm font-medium text-muted-foreground mb-2">
              {t('Custom range')}
            </div>
            <Calendar
              mode="range"
              selected={{
                from: customRange.from || dateRange.from,
                to: customRange.to || dateRange.to
              }}
              onSelect={(range) => {
                setCustomRange({
                  from: range?.from,
                  to: range?.to
                });
              }}
              numberOfMonths={2}
              className="pointer-events-auto"
            />
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleCustomRangeApply}
                disabled={!customRange.from || !customRange.to}
                className="flex-1"
              >
                {t('Apply')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="flex-1"
              >
                {t('Cancel')}
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}