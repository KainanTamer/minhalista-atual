
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
        "relative flex h-full w-full items-center justify-center transition-all duration-200",
        isWeekendDay && "weekend-day",
        isTodayDay && "font-bold text-primary"
      )}
    >
      {/* Atualizamos o estilo da seleção para garantir contraste */}
      <span className={cn(
        "relative z-10 flex items-center justify-center w-8 h-8 rounded-full transition-all",
        selected ? "border-2 border-primary font-bold text-foreground" : "", /* Garante contraste do texto */
        disabled && "opacity-50",
        outside && "text-muted-foreground"
      )}>
        {displayValue || date.getDate()}
      </span>
      
      {/* Indicador de evento abaixo do número */}
      {hasEvent && (
        <div className={cn(
          "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
          selected ? "bg-primary" : "bg-primary/80"
        )} />
      )}
    </div>
  );
};

export default CalendarDayContent;
