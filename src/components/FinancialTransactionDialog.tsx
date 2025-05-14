
import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';
import { CalendarIcon } from 'lucide-react';
import { 
  createFinancialTransaction, 
  updateFinancialTransaction, 
  deleteFinancialTransaction, 
  FinancialTransactionInsert, 
  FinancialTransaction 
} from '@/services/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';

const transactionFormSchema = z.object({
  description: z.string().min(3, 'A descrição precisa ter pelo menos 3 caracteres'),
  transaction_type: z.enum(['receita', 'despesa']),
  category: z.enum(['show', 'venda_merch', 'equipamento', 'transporte', 'estudio', 'marketing', 'outro']),
  amount: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: 'O valor deve ser maior que zero',
  }),
  transaction_date: z.date({
    required_error: "Por favor selecione uma data",
  }),
  notes: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface FinancialTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transaction?: FinancialTransaction;
  onTransactionUpdated?: () => void;
}

const FinancialTransactionDialog: React.FC<FinancialTransactionDialogProps> = ({
  open,
  onOpenChange,
  transaction,
  onTransactionUpdated
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!transaction;

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      description: transaction?.description || '',
      transaction_type: (transaction?.transaction_type as any) || 'receita',
      category: (transaction?.category as any) || 'show',
      amount: transaction ? transaction.amount.toString() : '',
      transaction_date: transaction?.transaction_date 
        ? new Date(transaction.transaction_date) 
        : new Date(),
      notes: transaction?.notes || '',
    }
  });

  const handleSubmit = async (values: TransactionFormValues) => {
    if (!user) {
      toast({
        title: "Erro",
        description: "Você precisa estar logado para registrar transações.",
        variant: "destructive",
      });
      return;
    }

    try {
      const transactionData: FinancialTransactionInsert = {
        description: values.description,
        transaction_type: values.transaction_type,
        category: values.category,
        amount: parseFloat(values.amount),
        transaction_date: format(values.transaction_date, 'yyyy-MM-dd'),
        notes: values.notes || null,
        user_id: user.id
      };

      if (isEditing && transaction) {
        await updateFinancialTransaction(transaction.id, transactionData);
        toast({
          title: "Transação atualizada",
          description: "A transação foi atualizada com sucesso.",
        });
      } else {
        await createFinancialTransaction(transactionData);
        toast({
          title: "Transação registrada",
          description: "A transação foi registrada com sucesso.",
        });
      }
      
      onOpenChange(false);
      if (onTransactionUpdated) {
        onTransactionUpdated();
      }
    } catch (error) {
      console.error("Erro ao salvar transação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!transaction || !window.confirm('Tem certeza que deseja excluir esta transação?')) {
      return;
    }

    try {
      await deleteFinancialTransaction(transaction.id);
      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      });
      onOpenChange(false);
      if (onTransactionUpdated) {
        onTransactionUpdated();
      }
    } catch (error) {
      console.error("Erro ao excluir transação:", error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a transação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Edite os detalhes da transação financeira.'
              : 'Registre uma nova receita ou despesa.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Descrição da transação" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="transaction_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="receita">Receita</SelectItem>
                        <SelectItem value="despesa">Despesa</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="show">Show</SelectItem>
                        <SelectItem value="venda_merch">Venda de Merchandise</SelectItem>
                        <SelectItem value="equipamento">Equipamento</SelectItem>
                        <SelectItem value="transporte">Transporte</SelectItem>
                        <SelectItem value="estudio">Estúdio</SelectItem>
                        <SelectItem value="marketing">Marketing</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        type="number" 
                        step="0.01" 
                        min="0.01"
                        placeholder="0,00" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="transaction_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal flex justify-between items-center"
                          >
                            {field.value ? (
                              format(field.value, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                            <CalendarIcon className="h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                          locale={ptBR}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Observações</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Observações adicionais"
                      rows={3}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              {isEditing && (
                <Button 
                  variant="destructive" 
                  type="button" 
                  onClick={handleDelete}
                >
                  Excluir
                </Button>
              )}
              <Button type="submit">
                {isEditing ? 'Salvar Alterações' : 'Registrar'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default FinancialTransactionDialog;
