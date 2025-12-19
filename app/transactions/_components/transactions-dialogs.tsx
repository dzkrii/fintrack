'use client';

import { TransactionActionDialog } from './transaction-action-dialog';
import { TransactionDeleteDialog } from './transaction-delete-dialog';
import { useTransactions } from './transactions-context';

export function TransactionsDialogs() {
  const { open, setOpen, currentTransaction, setCurrentTransaction } = useTransactions();

  return (
    <>
      {/* Add Dialog */}
      <TransactionActionDialog
        key="transaction-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      />

      {/* Edit Dialog */}
      {currentTransaction && (
        <>
          <TransactionActionDialog
            key={`transaction-edit-${currentTransaction.id}`}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => setCurrentTransaction(null), 300);
              }
            }}
            currentTransaction={currentTransaction}
          />

          <TransactionDeleteDialog
            key={`transaction-delete-${currentTransaction.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => setCurrentTransaction(null), 300);
              }
            }}
            currentTransaction={currentTransaction}
          />
        </>
      )}
    </>
  );
}
