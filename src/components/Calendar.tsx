
import React from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  
  // Example events - in a real app, these would come from an API or state management
  const events = [
    { id: 1, title: 'Ensaio da banda', date: new Date(2025, 4, 15, 19, 0), type: 'rehearsal' },
    { id: 2, title: 'Show no Bar do João', date: new Date(2025, 4, 18, 21, 0), type: 'gig' },
    { id: 3, title: 'Gravação de demo', date: new Date(2025, 4, 20, 14, 0), type: 'recording' }
  ];
  
  // Filter events for the selected day
  const selectedDayEvents = events.filter(event => 
    date && event.date.getDate() === date.getDate() && 
    event.date.getMonth() === date.getMonth() && 
    event.date.getFullYear() === date.getFullYear()
  );
  
  return (
    <div className={cn("grid gap-4", className)}>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="calendar-container p-3">
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border-none"
              locale={ptBR}
            />
          </div>
        </CardContent>
      </Card>
      
      {selectedDayEvents.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Eventos do dia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedDayEvents.map(event => (
                <div key={event.id} className="event-item p-3 rounded-md">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {event.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Calendar;
