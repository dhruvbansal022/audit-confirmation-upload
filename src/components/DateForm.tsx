import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface DateFormProps {
  onSubmit: (date: string) => void;
}

const DateForm: React.FC<DateFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState<Date>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    setError('');
    // Format date as ISO string for consistency
    onSubmit(format(date, 'yyyy-MM-dd'));
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (selectedDate) {
      setError('');
      setOpen(false); // Auto-close the calendar
    }
  };

  const handleMonthChange = (monthIndex: string) => {
    const newMonth = new Date(currentMonth.getFullYear(), parseInt(monthIndex), 1);
    setCurrentMonth(newMonth);
  };

  const handleYearChange = (year: string) => {
    const newMonth = new Date(parseInt(year), currentMonth.getMonth(), 1);
    setCurrentMonth(newMonth);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - 50 + i);
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal border-gray-300 hover:border-gray-300 hover:bg-white",
                !date && "text-muted-foreground",
                error && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <div className="p-3 border-b">
              <div className="flex items-center justify-between gap-2">
                <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
      
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 h-12 text-white font-medium">
        Continue
      </Button>
    </form>
  );
};

export default DateForm;