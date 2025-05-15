
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
        isTodayDay && "font-bold text-primary",
        selected && "calendar-day-selected" // Classe customizada para dias selecionados
      )}
    >
      <span className={cn(
        "text-foreground", // Garante que o texto sempre usa a cor principal de texto
        selected && "relative z-10 font-bold opacity-100",
        disabled && "opacity-50",
        outside && "text-muted-foreground"
      )}>
        {displayValue || date.getDate()}
      </span>
      {hasEvent && (
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
      )}
    </div>
  );
};

export default CalendarDayContent;
