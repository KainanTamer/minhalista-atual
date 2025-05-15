
import React from 'react';
import { cn } from '@/lib/utils';
import { isWeekend, isToday, isSameDay } from 'date-fns';

// Interface atualizada para o componente
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
        isWeekendDay && "weekend-day",
        isTodayDay && "font-bold text-primary"
      )}
    >
      <span className={cn(
        "relative z-10 text-foreground", // Aumentei a prioridade z-index
        selected && "font-bold opacity-100",
        disabled && "opacity-50",
        outside && "text-muted-foreground"
      )}>
        {displayValue || date.getDate()}
      </span>
      
      {/* Indicador de evento abaixo do número */}
      {hasEvent && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
      
      {/* Fundo opaco para seleção */}
      {selected && (
        <div className="absolute inset-0 bg-primary/30 dark:bg-primary/40 rounded-md -z-10" />
      )}
    </div>
  );
};

export default CalendarDayContent;
