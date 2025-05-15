
import React, { useState } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { PlusCircle, Calendar as CalendarIcon } from 'lucide-react';
import { Event } from '@/services/api';
import { useCalendarEvents } from '@/hooks';
import EventDialog from '@/components/EventDialog';
import EventListCard from './EventListCard';
import CalendarDayContent from './CalendarDayContent';

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  
  const { events, isLoading, fetchEvents } = useCalendarEvents();

  // Função para lidar com o clique em um dia do calendário
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

  // Função para renderizar o conteúdo do dia
  const renderDayContent = (props: any) => {
    return (
      <CalendarDayContent
        date={props.date}
        events={events}
        selected={Boolean(props.selected)}
        today={Boolean(props.today)}
        outside={Boolean(props.outside)}
        disabled={Boolean(props.disabled)}
        displayValue={props.displayValue}
      />
    );
  };

  return (
    <div className={cn("flex flex-col items-center calendar-wrapper", className)}>
      <Card className="overflow-hidden calendar-card w-full max-w-3xl">
        <CardHeader className="pb-2 flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <CalendarIcon className="h-5 w-5" />
            Calendário
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={handleAddEvent}
          >
            <PlusCircle size={18} />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="calendar-container p-2 md:w-3/5 w-full">
              {isLoading ? (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <CalendarComponent
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  onDayClick={handleDayClick}
                  className="border-none pointer-events-auto mx-auto" 
                  locale={ptBR}
                  components={{
                    DayContent: renderDayContent
                  }}
                />
              )}
            </div>
            
            <div className="md:w-2/5 w-full">
              {/* Legenda de cores para tipos de eventos */}
              <div className="event-legend mb-3 flex flex-wrap">
                <div className="event-legend-item">
                  <span className="event-legend-color" style={{backgroundColor: '#4ade80'}}></span>
                  <span>Show</span>
                </div>
                <div className="event-legend-item">
                  <span className="event-legend-color" style={{backgroundColor: '#60a5fa'}}></span>
                  <span>Ensaio</span>
                </div>
                <div className="event-legend-item">
                  <span className="event-legend-color" style={{backgroundColor: '#c084fc'}}></span>
                  <span>Gravação</span>
                </div>
                <div className="event-legend-item">
                  <span className="event-legend-color" style={{backgroundColor: '#94a3b8'}}></span>
                  <span>Outro</span>
                </div>
              </div>
              
              <EventListCard 
                events={events} 
                date={date} 
                onEventClick={handleEventClick} 
              />
            </div>
          </div>
        </CardContent>
      </Card>

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
