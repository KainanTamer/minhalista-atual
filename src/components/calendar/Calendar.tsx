
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { PlusCircle } from 'lucide-react';
import { Event } from '@/services/api';
import { useCalendarEvents } from '@/hooks/useCalendarEvents';
import EventDialog from '@/components/EventDialog';
import EventListCard from './EventListCard';
import CalendarDayContent from './CalendarDayContent';
import { DayContentProps } from 'react-day-picker';

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  
  const { events, isLoading, fetchEvents } = useCalendarEvents();

  const handleDayClick = (day: Date) => {
    setDate(day);
    setSelectedEvent(undefined);
    setEventDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const handleAddEvent = () => {
    setSelectedEvent(undefined);
    setEventDialogOpen(true);
  };

  return (
    <div className={cn("grid gap-4", className)}>
      <Card>
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle>Calendário</CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleAddEvent}
          >
            <PlusCircle size={16} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="calendar-container p-3">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                onDayClick={handleDayClick}
                className="border-none pointer-events-auto"
                locale={ptBR}
                components={{
                  DayContent: (props: DayContentProps) => (
                    <CalendarDayContent
                      date={props.date}
                      events={events}
                      selected={Boolean(props.selected)}
                      today={Boolean(props.today)}
                      outside={Boolean(props.outside)}
                      disabled={Boolean(props.disabled)}
                      displayValue={props.displayValue}
                    />
                  )
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      <EventListCard 
        events={events} 
        date={date} 
        onEventClick={handleEventClick} 
      />

      <EventDialog 
        open={eventDialogOpen} 
        onOpenChange={setEventDialogOpen} 
        event={selectedEvent}
        onEventUpdated={fetchEvents}
        defaultDate={date}
      />
    </div>
  );
};

export default Calendar;
