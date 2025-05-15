
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/services/api';
import { CalendarDays } from 'lucide-react';

interface EventListCardProps {
  events: Event[];
  date: Date | undefined;
  onEventClick: (event: Event) => void;
}

const EventListCard: React.FC<EventListCardProps> = ({ events, date, onEventClick }) => {
  // Filtra eventos para o dia selecionado
  const selectedDayEvents = events.filter(event => 
    date && isSameDay(new Date(event.start_time), date)
  );

  if (!date) {
    return null;
  }

  // Define a classe de estilo com base no tipo de evento
  const getEventTypeClass = (eventType: string) => {
    switch(eventType) {
      case 'ensaio':
        return 'bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100 border-l-blue-500';
      case 'show':
        return 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100 border-l-green-500';
      case 'gravacao':
        return 'bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 border-l-purple-500';
      default:
        return 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-l-gray-500';
    }
  };

  return (
    <Card className="event-list-card shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CalendarDays size={20} className="text-primary" />
          <CardTitle className="text-lg">
            {selectedDayEvents.length > 0 
              ? `Eventos: ${date && format(date, "dd 'de' MMMM", { locale: ptBR })}`
              : `Sem eventos em ${date && format(date, "dd 'de' MMMM", { locale: ptBR })}`
            }
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        {selectedDayEvents.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Nenhum evento nesta data. Clique no + para adicionar.
          </div>
        ) : (
          <div className="space-y-3">
            {selectedDayEvents.map(event => (
              <div 
                key={event.id} 
                className={cn(
                  "event-item p-3 rounded-md cursor-pointer transition-all border-l-4",
                  getEventTypeClass(event.event_type)
                )}
                onClick={() => onEventClick(event)}
              >
                <div className="flex justify-between">
                  <h4 className="font-medium">{event.title}</h4>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/80 dark:bg-background/30">
                    {event.event_type === 'ensaio' ? 'Ensaio' : 
                     event.event_type === 'show' ? 'Show' : 
                     event.event_type === 'gravacao' ? 'Gravação' : 'Outro'}
                  </span>
                </div>
                <p className="text-sm mt-1">
                  {format(new Date(event.start_time), "HH:mm")} - {format(new Date(event.end_time), "HH:mm")}
                </p>
                {event.venue_name && (
                  <p className="text-sm mt-1 font-medium">{event.venue_name}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EventListCard;
