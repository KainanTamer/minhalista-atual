import React, { useState, useEffect } from 'react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ptBR } from 'date-fns/locale';
import { PlusCircle, Calendar as CalendarIcon, Lock, Crown, Trash2 } from 'lucide-react';
import { Event } from '@/services/api';
import { useCalendarEvents } from '@/hooks';
import EventDialog from '@/components/EventDialog';
import EventListCard from './EventListCard';
import CalendarDayContent from './CalendarDayContent';
import { useSubscription } from '@/contexts/subscription';
import { useToast } from '@/hooks/toast';
import ConfirmModal from '@/components/ui/confirm-modal';
import PlanLimitModal from '@/components/subscription/PlanLimitModal';
import LimitsInfo from '@/components/dashboard/LimitsInfo';
import { supabase } from '@/integrations/supabase/client';

interface CalendarProps {
  className?: string;
}

const Calendar: React.FC<CalendarProps> = ({ className }) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventDialogOpen, setEventDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | undefined>(undefined);
  const [isDeleteAllDialogOpen, setIsDeleteAllDialogOpen] = useState(false);
  const [isPlanLimitModalOpen, setIsPlanLimitModalOpen] = useState(false);
  
  const { events, isLoading, refetch } = useCalendarEvents();
  const { subscriptionStatus, checkLimit } = useSubscription();
  const { toast } = useToast();
  
  const isPro = subscriptionStatus.subscription_tier === 'Pro';

  // Função para lidar com o clique em um dia do calendário
  const handleDayClick = (day: Date) => {
    if (!isPro && !checkLimit('events', events.length)) {
      setIsPlanLimitModalOpen(true);
      return;
    }
    
    setDate(day);
    setSelectedEvent(undefined);
    setEventDialogOpen(true);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEventDialogOpen(true);
  };

  const handleAddEvent = () => {
    if (!isPro && !checkLimit('events', events.length)) {
      setIsPlanLimitModalOpen(true);
      return;
    }
    
    setSelectedEvent(undefined);
    setEventDialogOpen(true);
  };

  const handleDeleteAllEvents = async () => {
    try {
      // Delete all events for the current user
      const { error } = await supabase
        .from('events')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all events
      
      if (error) throw error;
      
      toast({
        title: "Sucesso!",
        description: "Todos os eventos foram excluídos.",
      });
      
      refetch();
    } catch (error) {
      console.error("Erro ao excluir eventos:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir os eventos. Tente novamente mais tarde.",
        variant: "destructive",
      });
    }
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

  // Verificação de 80% do limite atingido
  useEffect(() => {
    if (!isPro) {
      const limit = subscriptionStatus.limits.events;
      if (limit > 0 && events.length >= limit * 0.8 && events.length < limit) {
        toast({
          title: "Limite próximo",
          description: `Você já usou ${events.length}/${limit} eventos disponíveis no seu plano.`,
        });
      }
    }
  }, [events.length, subscriptionStatus.limits.events, isPro, toast]);

  return (
    <div className={cn("flex flex-col items-center calendar-wrapper", className)}>
      <LimitsInfo type="events" currentCount={events.length} />
      
      <Card className="overflow-hidden calendar-card w-full max-w-3xl mx-auto bg-card/90 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-primary/10 to-transparent">
          <div className="flex items-center gap-2">
            <div className="bg-primary/20 p-2 rounded-full">
              <CalendarIcon className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-lg">
              Agenda Musical
            </CardTitle>
            {!isPro && (
              <div className="text-sm text-muted-foreground ml-4 bg-background/70 rounded-full px-3 py-0.5 flex items-center">
                <span className="font-medium">{events.length}</span>
                <span className="mx-1">/</span>
                <span>{subscriptionStatus.limits.events === -1 ? '∞' : subscriptionStatus.limits.events}</span>
                {isPro ? (
                  <Crown className="inline-block ml-1 h-4 w-4 text-primary" />
                ) : (
                  <Lock className="inline-block ml-1 h-4 w-4 text-muted-foreground" />
                )}
              </div>
            )}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0 group hover:bg-primary/20 hover:text-primary transition-colors" 
            onClick={handleAddEvent}
            disabled={!isPro && !checkLimit('events', events.length)}
            title={!isPro && !checkLimit('events', events.length) ? "Limite de eventos atingido" : "Adicionar evento"}
          >
            <PlusCircle size={18} className="group-hover:scale-110 transition-transform" />
            {!isPro && !checkLimit('events', events.length) && (
              <Lock className="absolute bottom-0 right-0 h-3 w-3" />
            )}
          </Button>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="calendar-container p-2 md:w-3/5 w-full mx-auto bg-background/30 rounded-lg shadow-inner">
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
              <div className="event-legend mb-3 flex flex-wrap gap-2 justify-center md:justify-start bg-background/30 p-2 rounded-md">
                <div className="event-legend-item flex items-center gap-1">
                  <span className="event-legend-color w-3 h-3 rounded-full" style={{backgroundColor: '#4ade80'}}></span>
                  <span className="text-xs">Show</span>
                </div>
                <div className="event-legend-item flex items-center gap-1">
                  <span className="event-legend-color w-3 h-3 rounded-full" style={{backgroundColor: '#60a5fa'}}></span>
                  <span className="text-xs">Ensaio</span>
                </div>
                <div className="event-legend-item flex items-center gap-1">
                  <span className="event-legend-color w-3 h-3 rounded-full" style={{backgroundColor: '#c084fc'}}></span>
                  <span className="text-xs">Gravação</span>
                </div>
                <div className="event-legend-item flex items-center gap-1">
                  <span className="event-legend-color w-3 h-3 rounded-full" style={{backgroundColor: '#94a3b8'}}></span>
                  <span className="text-xs">Outro</span>
                </div>
              </div>
              
              <EventListCard 
                events={events} 
                date={date} 
                onEventClick={handleEventClick} 
              />
            </div>
          </div>
          
          {events.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                className="border-destructive text-destructive hover:bg-destructive/10 group transition-all"
                onClick={() => setIsDeleteAllDialogOpen(true)}
              >
                <Trash2 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                Limpar Agenda
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <EventDialog 
        open={eventDialogOpen} 
        onOpenChange={setEventDialogOpen} 
        event={selectedEvent}
        onEventUpdated={refetch}
        defaultDate={date}
      />
      
      <ConfirmModal
        open={isDeleteAllDialogOpen}
        onOpenChange={setIsDeleteAllDialogOpen}
        onConfirm={handleDeleteAllEvents}
        title="Limpar agenda"
        description="Tem certeza que deseja excluir TODOS os eventos da sua agenda? Essa ação não pode ser desfeita."
        confirmLabel="Confirmar"
        cancelLabel="Cancelar"
        destructive={true}
      />
      
      <PlanLimitModal
        open={isPlanLimitModalOpen}
        onOpenChange={setIsPlanLimitModalOpen}
        feature="eventos"
      />
    </div>
  );
};

export default Calendar;
