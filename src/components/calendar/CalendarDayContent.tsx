
import React from 'react';
import { cn } from '@/lib/utils';
import { isWeekend, isToday, isSameDay } from 'date-fns';

interface CalendarDayContentProps {
  date: Date;
  displayValue?: string;
  outside?: boolean;
  disabled?: boolean;
  selected?: boolean;
  today?: boolean;
  events: { start_time: string }[];
}

const CalendarDayContent: React.FC<CalendarDayContentProps> = ({ 
  date,
  events,
  selected,
  outside,
  today: todayProp,
  disabled,
  displayValue 
}) => {
  const isWeekendDay = isWeekend(date);
  const isTodayDay = isToday(date);
  const hasEvent = events.some(event => isSameDay(new Date(event.start_time), date));
  
  return (
    <div 
      className={cn(
        "relative flex h-full w-full items-center justify-center",
        isWeekendDay && "weekend-day bg-secondary/80 dark:bg-secondary/30",
        isTodayDay && "dark:text-white font-bold text-primary",
        // Garantir que texto seja visível no modo escuro quando selecionado
        selected && "dark:text-black font-bold"
      )}
    >
      {displayValue || date.getDate()}
      {hasEvent && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
    </div>
  );
};

export default CalendarDayContent;
