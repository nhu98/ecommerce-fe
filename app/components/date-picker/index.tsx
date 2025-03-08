'use client';
import * as React from 'react';
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { vi } from 'date-fns/locale';
import { SelectSingleEventHandler } from 'react-day-picker';

interface DatePickerDemoProps {
  handleValueChange: (date: Date) => void;
}

const DatePickerComponent = ({ handleValueChange }: DatePickerDemoProps) => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const [date, setDate] = React.useState<Date>();

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    handleValueChange(selectedDate);
    setIsCalendarOpen(false);
  };

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal hover:bg-gray-100',
            !date && 'text-muted-foreground',
          )}
        >
          <CalendarIcon />
          {date ? (
            format(date, 'dd MMMM yyyy', { locale: vi })
          ) : (
            <span>Chọn ngày</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateChange as SelectSingleEventHandler}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePickerComponent;
