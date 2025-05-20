
import React from 'react';
import { format } from 'date-fns';
import { FinancialTransaction } from '@/services/api';
import { useFinancialTransactions } from '@/hooks/useFinancialTransactions';
import { TransactionFormValues, formatForSubmission } from '@/schemas/transactionSchema';
import TransactionForm from '@/components/transactions/TransactionForm';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const isEditing = !!transaction;

  const { handleSubmit, handleDelete, isSubmitting } = useFinancialTransactions(
    onTransactionUpdated,
    () => onOpenChange(false)
  );

  const onSubmit = (values: TransactionFormValues) => {
    const formattedValues = formatForSubmission(values);
    handleSubmit(formattedValues, transaction);
  };

  const onDelete = () => {
    if (transaction) {
      handleDelete(transaction);
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

        <TransactionForm
          transaction={transaction}
          onSubmit={onSubmit}
          onDelete={onDelete}
          isSubmitting={isSubmitting}
          isEditing={isEditing}
        />
      </DialogContent>
    </Dialog>
  );
};

export default FinancialTransactionDialog;
