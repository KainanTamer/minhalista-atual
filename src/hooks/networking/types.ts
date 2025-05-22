
import { ToastActionElement } from '@/components/ui/toast';

export interface ToastProps {
  title?: string;
  description?: React.ReactNode;
  action?: ToastActionElement;
  variant?: 'default' | 'destructive';
}

export interface Toast {
  (props: ToastProps): void;
}
