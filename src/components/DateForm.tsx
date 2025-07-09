import React, { useState } from 'react';
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface DateFormProps {
  onSubmit: (date: string) => void;
}

const DateForm: React.FC<DateFormProps> = ({ onSubmit }) => {
  const [date, setDate] = useState<Date>();
  const [error, setError] = useState('');
  
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
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full h-12 justify-start text-left font-normal",
                !date && "text-muted-foreground",
                error && "border-red-500"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
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