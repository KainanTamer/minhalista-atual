
import { useState, useEffect } from 'react';
import { isToday } from 'date-fns';
import { getEvents, Event } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useCalendarEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return {
    events,
    isLoading,
    refetch: fetchEvents  // Expose the fetchEvents function as refetch
  };
};

export default useCalendarEvents;
