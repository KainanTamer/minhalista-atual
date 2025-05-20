
import { z } from 'zod';
import { format } from 'date-fns';

export const transactionFormSchema = z.object({
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

export type TransactionFormValues = z.infer<typeof transactionFormSchema>;

export const formatForSubmission = (values: TransactionFormValues) => {
  return {
    ...values,
    transaction_date: format(values.transaction_date, 'yyyy-MM-dd'),
  };
};
