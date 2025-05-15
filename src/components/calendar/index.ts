
import Calendar from './Calendar';
import type { CalendarProps as CalendarComponentProps } from '@/components/ui/calendar';

export type CalendarProps = CalendarComponentProps & {
  className?: string;
};

export default Calendar;
