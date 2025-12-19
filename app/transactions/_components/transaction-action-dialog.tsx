'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useTransactions, type Transaction } from './transactions-context';

const formSchema = z.object({
  type: z.enum(['INCOME', 'EXPENSE', 'TRANSFER']),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  description: z.string().optional(),
  date: z.date(),
  walletId: z.string().min(1, 'Wallet is required'),
  toWalletId: z.string().optional(),
  categoryId: z.string().optional(),
}).refine((data) => {
  if (data.type === 'TRANSFER' && !data.toWalletId) {
    return false;
  }
  return true;
}, {
  message: 'Destination wallet is required for transfers',
  path: ['toWalletId'],
}).refine((data) => {
  if (data.type === 'TRANSFER' && data.walletId === data.toWalletId) {
    return false;
  }
  return true;
}, {
  message: 'Source and destination must be different',
  path: ['toWalletId'],
});

type TransactionFormInput = z.input<typeof formSchema>;
type TransactionFormOutput = z.output<typeof formSchema>;

interface TransactionActionDialogProps {
  currentTransaction?: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionActionDialog({
  currentTransaction,
  open,
  onOpenChange,
}: TransactionActionDialogProps) {
  const { refreshTransactions, wallets, categories } = useTransactions();
  const isEdit = !!currentTransaction;
  const [transactionType, setTransactionType] = useState<'INCOME' | 'EXPENSE' | 'TRANSFER'>('EXPENSE');

  const form = useForm<TransactionFormInput, unknown, TransactionFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: 'EXPENSE',
      amount: 0,
      description: '',
      date: new Date(),
      walletId: '',
      toWalletId: '',
      categoryId: '',
    },
  });

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    (cat) => cat.type === transactionType
  );

  // Reset form when dialog opens/closes or transaction changes
  useEffect(() => {
    if (open) {
      if (currentTransaction) {
        const type = currentTransaction.type;
        setTransactionType(type);
        form.reset({
          type,
          amount: currentTransaction.amount,
          description: currentTransaction.description || '',
          date: new Date(currentTransaction.date),
          walletId: currentTransaction.walletId,
          toWalletId: currentTransaction.toWalletId || '',
          categoryId: currentTransaction.categoryId || '',
        });
      } else {
        setTransactionType('EXPENSE');
        form.reset({
          type: 'EXPENSE',
          amount: 0,
          description: '',
          date: new Date(),
          walletId: wallets[0]?.id || '',
          toWalletId: '',
          categoryId: '',
        });
      }
    }
  }, [open, currentTransaction, form, wallets]);

  // Sync transactionType state with form
  useEffect(() => {
    form.setValue('type', transactionType);
    // Clear category for transfers, clear toWalletId for non-transfers
    if (transactionType === 'TRANSFER') {
      form.setValue('categoryId', '');
    } else {
      form.setValue('toWalletId', '');
    }
  }, [transactionType, form]);

  const onSubmit = async (values: TransactionFormOutput) => {
    try {
      const url = isEdit
        ? `/api/transactions/${currentTransaction.id}`
        : '/api/transactions';
      const method = isEdit ? 'PUT' : 'POST';

      const payload = {
        ...values,
        date: values.date.toISOString(),
        categoryId: values.type !== 'TRANSFER' ? values.categoryId : null,
        toWalletId: values.type === 'TRANSFER' ? values.toWalletId : null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save transaction');
      }

      await refreshTransactions();
      form.reset();
      onOpenChange(false);
      toast.success(
        isEdit ? 'Transaction updated successfully!' : 'Transaction created successfully!'
      );
    } catch (error) {
      console.error('Error saving transaction:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save transaction'
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) {
          form.reset();
        }
        onOpenChange(state);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Transaction' : 'Add New Transaction'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your transaction details.'
              : 'Record a new income, expense, or transfer.'}
          </DialogDescription>
        </DialogHeader>

        {/* Transaction Type Tabs */}
        <Tabs
          value={transactionType}
          onValueChange={(value) => setTransactionType(value as 'INCOME' | 'EXPENSE' | 'TRANSFER')}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger
              value="INCOME"
              className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700 dark:data-[state=active]:bg-emerald-900 dark:data-[state=active]:text-emerald-300"
            >
              Income
            </TabsTrigger>
            <TabsTrigger
              value="EXPENSE"
              className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-700 dark:data-[state=active]:bg-rose-900 dark:data-[state=active]:text-rose-300"
            >
              Expense
            </TabsTrigger>
            <TabsTrigger
              value="TRANSFER"
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900 dark:data-[state=active]:text-blue-300"
            >
              Transfer
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Form {...form}>
          <form
            id="transaction-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            {/* Amount */}
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount (IDR)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      value={String(field.value ?? 0)}
                      onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Groceries at Supermarket" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date */}
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Wallet */}
            <FormField
              control={form.control}
              name="walletId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {transactionType === 'TRANSFER' ? 'From Wallet' : 'Wallet'}
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select wallet" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wallets.map((wallet) => (
                        <SelectItem key={wallet.id} value={wallet.id}>
                          <span className="flex items-center gap-2">
                            <span>{wallet.icon || '💳'}</span>
                            <span>{wallet.name}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* To Wallet (for transfers) */}
            {transactionType === 'TRANSFER' && (
              <FormField
                control={form.control}
                name="toWalletId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Wallet</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select destination wallet" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {wallets
                          .filter((w) => w.id !== form.watch('walletId'))
                          .map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              <span className="flex items-center gap-2">
                                <span>{wallet.icon || '💳'}</span>
                                <span>{wallet.name}</span>
                              </span>
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Category (for income/expense) */}
            {transactionType !== 'TRANSFER' && (
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredCategories.length === 0 ? (
                          <SelectItem value="" disabled>
                            No {transactionType.toLowerCase()} categories found
                          </SelectItem>
                        ) : (
                          filteredCategories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              <span className="flex items-center gap-2">
                                <span>{category.icon || '📁'}</span>
                                <span>{category.name}</span>
                              </span>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </form>
        </Form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="transaction-form"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting
              ? 'Saving...'
              : isEdit
              ? 'Save Changes'
              : 'Add Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
