
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Event } from '@/services/api';

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

  if (selectedDayEvents.length === 0) {
    return null;
  }

  // Define a classe de estilo com base no tipo de evento
  const getEventTypeClass = (eventType: string) => {
    switch(eventType) {
      case 'ensaio':
        return 'bg-blue-100 dark:bg-blue-50';
      case 'show':
        return 'bg-green-100 dark:bg-green-50';
      case 'gravacao':
        return 'bg-purple-100 dark:bg-purple-50';
      default:
        return 'bg-gray-100 dark:bg-gray-50';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
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
              onClick={() => onEventClick(event)}
            >
              <div className="flex justify-between">
                <h4 className="font-medium">{event.title}</h4>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-background/50 dark:bg-background/80">
                  {event.event_type === 'ensaio' ? 'Ensaio' : 
                   event.event_type === 'show' ? 'Show' : 
                   event.event_type === 'gravacao' ? 'Gravação' : 'Outro'}
                </span>
              </div>
              <p className="text-sm">
                {format(new Date(event.start_time), "HH:mm")} - {format(new Date(event.end_time), "HH:mm")}
              </p>
              {event.venue_name && (
                <p className="text-sm mt-1">{event.venue_name}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default EventListCard;
