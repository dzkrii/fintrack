'use client';

import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
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
import { useWallets, type Wallet } from './wallets-context';

const formSchema = z.object({
  name: z.string().min(1, 'Wallet name is required.'),
  icon: z.string().optional(),
  balance: z.coerce.number().min(0, 'Balance cannot be negative.'),
});

type WalletFormInput = z.input<typeof formSchema>;
type WalletFormOutput = z.output<typeof formSchema>;

interface WalletActionDialogProps {
  currentWallet?: Wallet | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WalletActionDialog({
  currentWallet,
  open,
  onOpenChange,
}: WalletActionDialogProps) {
  const { refreshWallets } = useWallets();
  const isEdit = !!currentWallet;

  const form = useForm<WalletFormInput, unknown, WalletFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      icon: '',
      balance: 0,
    },
  });

  // Reset form when dialog opens/closes or wallet changes
  useEffect(() => {
    if (open) {
      if (currentWallet) {
        form.reset({
          name: currentWallet.name,
          icon: currentWallet.icon || '',
          balance:
            typeof currentWallet.balance === 'string'
              ? parseFloat(currentWallet.balance)
              : currentWallet.balance,
        });
      } else {
        form.reset({
          name: '',
          icon: '',
          balance: 0,
        });
      }
    }
  }, [open, currentWallet, form]);

  const onSubmit = async (values: WalletFormOutput) => {
    try {
      const url = isEdit ? `/api/wallets/${currentWallet.id}` : '/api/wallets';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save wallet');
      }

      await refreshWallets();
      form.reset();
      onOpenChange(false);
      toast.success(
        isEdit ? 'Wallet updated successfully!' : 'Wallet created successfully!'
      );
    } catch (error) {
      console.error('Error saving wallet:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save wallet'
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Wallet' : 'Add New Wallet'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your wallet details.'
              : 'Create a new wallet to track your finances.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="wallet-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., BCA, Cash, GoPay" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon (Emoji)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 💳, 🏦, 📲" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="balance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance (IDR)</FormLabel>
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
          <Button type="submit" form="wallet-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Wallet'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
