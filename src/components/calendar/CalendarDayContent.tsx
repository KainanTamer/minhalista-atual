
import React from 'react';
import { cn } from '@/lib/utils';
import { isWeekend, isToday, isSameDay } from 'date-fns';

// Updated interface to match what's actually used in the component
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
        selected && "bg-primary/10 rounded-md", // Destaque sutil para o dia selecionado
        // Garantir que texto seja sempre visível nos modos claro e escuro
        selected && "text-foreground dark:text-foreground font-medium"
      )}
    >
      <span className={cn(
        selected && "relative z-10",
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
