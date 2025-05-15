
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
      {/* Fundo opaco para seleção - mais visível */}
      {selected && (
        <div className="absolute inset-0 bg-primary/70 dark:bg-primary/70 rounded-md -z-10" />
      )}
      
      <span className={cn(
        "relative z-10 font-semibold text-lg", // Aumentando tamanho da fonte
        selected ? "text-primary-foreground dark:text-primary-foreground" : "text-foreground",
        disabled && "opacity-50",
        outside && "text-muted-foreground"
      )}>
        {displayValue || date.getDate()}
      </span>
      
      {/* Indicador de evento abaixo do número - maior e mais visível */}
      {hasEvent && (
        <div className={cn(
          "absolute bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full",
          selected ? "bg-primary-foreground dark:bg-primary-foreground" : "bg-primary"
        )} />
      )}
    </div>
  );
};

export default CalendarDayContent;
