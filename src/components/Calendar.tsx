
import React, { useEffect, useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { format, isSameDay, isWeekend, isToday } from 'date-fns';
import { getEvents, Event } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import EventDialog from './EventDialog';

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const { toast } = useToast();
  
  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const fetchedEvents = await getEvents();
      setEvents(fetchedEvents);
      
      // Check for today's events and notify user
      const todaysEvents = fetchedEvents.filter(event => 
        isToday(new Date(event.start_time))
      );
      
      if (todaysEvents.length > 0) {
        toast({
          title: `${todaysEvents.length} evento${todaysEvents.length > 1 ? 's' : ''} hoje!`,
          description: todaysEvents.map(e => e.title).join(", ")
        });
      }
      
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    
    // Set up a check for today's events when component mounts
    const checkTodaysEvents = () => {
      const todaysEvents = events.filter(event => 
        isToday(new Date(event.start_time))
      );
      
      if (todaysEvents.length > 0) {
        toast({
          title: `Lembrete: ${todaysEvents.length} evento${todaysEvents.length > 1 ? 's' : ''} hoje!`,
          description: todaysEvents.map(e => e.title).join(", ")
        });
      }
    };
    
    // Check once when component mounts
    checkTodaysEvents();
    
    // Set up interval to check periodically (e.g., every hour)
    const intervalId = setInterval(checkTodaysEvents, 3600000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  // Filtra eventos para o dia selecionado
  const selectedDayEvents = events.filter(event => 
    date && isSameDay(new Date(event.start_time), date)
  );

  // Define a classe de estilo com base no tipo de evento
  const getEventTypeClass = (eventType: string) => {
    switch(eventType) {
      case 'ensaio':
        return 'bg-blue-100 dark:bg-blue-900';
      case 'show':
        return 'bg-green-100 dark:bg-green-900';
      case 'gravacao':
        return 'bg-purple-100 dark:bg-purple-900';
      default:
        return 'bg-gray-100 dark:bg-gray-800';
    }
  };

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
                modifiers={{ event: events.map(event => new Date(event.start_time)) }}
                modifiersStyles={{
                  event: { fontWeight: 'bold' }
                }}
                components={{
                  DayContent: (props) => {
                    const dayDate = props.date;
                    const hasEvent = events.some(event => 
                      isSameDay(new Date(event.start_time), dayDate)
                    );
                    const isWeekendDay = isWeekend(dayDate);
                    const isTodayDay = isToday(dayDate);
                    
                    return (
                      <div 
                        className={cn(
                          "relative flex h-full w-full items-center justify-center",
                          isWeekendDay && "weekend-day bg-secondary/80 dark:bg-secondary/30",
                          isTodayDay && "dark:text-white font-bold text-primary",
                          // Garantir que texto seja visível no modo escuro quando selecionado
                          props.selected && "dark:text-black font-bold"
                        )}
                      >
                        {props.date.getDate()}
                        {hasEvent && (
                          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                        )}
                      </div>
                    );
                  }
                }}
              />
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedDayEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg dark:text-white">
              Eventos do dia {date && format(date, "dd 'de' MMMM", { locale: ptBR })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDayEvents.map(event => (
                <div 
                  key={event.id} 
                  className={cn(
                    "event-item p-3 rounded-md cursor-pointer transition-colors hover:opacity-80", 
                    getEventTypeClass(event.event_type)
                  )}
                  onClick={() => handleEventClick(event)}
                >
                  <div className="flex justify-between">
                    <h4 className="font-medium dark:text-white">{event.title}</h4>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/50 dark:bg-white/20 dark:text-white">
                      {event.event_type === 'ensaio' ? 'Ensaio' : 
                       event.event_type === 'show' ? 'Show' : 
                       event.event_type === 'gravacao' ? 'Gravação' : 'Outro'}
                    </span>
                  </div>
                  <p className="text-sm dark:text-gray-300">
                    {format(new Date(event.start_time), "HH:mm")} - {format(new Date(event.end_time), "HH:mm")}
                  </p>
                  {event.venue_name && (
                    <p className="text-sm mt-1 dark:text-gray-300">{event.venue_name}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

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
