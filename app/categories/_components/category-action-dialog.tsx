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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCategories, type Category } from './categories-context';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required.'),
  type: z.enum(['INCOME', 'EXPENSE'], {
    required_error: 'Please select a category type.',
  }),
  icon: z.string().optional(),
});

type CategoryFormInput = z.input<typeof formSchema>;
type CategoryFormOutput = z.output<typeof formSchema>;

interface CategoryActionDialogProps {
  currentCategory?: Category | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoryActionDialog({
  currentCategory,
  open,
  onOpenChange,
}: CategoryActionDialogProps) {
  const { refreshCategories } = useCategories();
  const isEdit = !!currentCategory;

  const form = useForm<CategoryFormInput, unknown, CategoryFormOutput>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: 'EXPENSE',
      icon: '',
    },
  });

  // Reset form when dialog opens/closes or category changes
  useEffect(() => {
    if (open) {
      if (currentCategory) {
        form.reset({
          name: currentCategory.name,
          type: currentCategory.type,
          icon: currentCategory.icon || '',
        });
      } else {
        form.reset({
          name: '',
          type: 'EXPENSE',
          icon: '',
        });
      }
    }
  }, [open, currentCategory, form]);

  const onSubmit = async (values: CategoryFormOutput) => {
    try {
      const url = isEdit ? `/api/categories/${currentCategory.id}` : '/api/categories';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save category');
      }

      await refreshCategories();
      form.reset();
      onOpenChange(false);
      toast.success(
        isEdit ? 'Category updated successfully!' : 'Category created successfully!'
      );
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to save category'
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
          <DialogTitle>{isEdit ? 'Edit Category' : 'Add New Category'}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? 'Update your category details.'
              : 'Create a new category for your transactions.'}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="category-form"
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
                    <Input placeholder="e.g., Groceries, Salary" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="INCOME">
                        <span className="flex items-center gap-2">
                          <span className="text-emerald-500">●</span> Income
                        </span>
                      </SelectItem>
                      <SelectItem value="EXPENSE">
                        <span className="flex items-center gap-2">
                          <span className="text-rose-500">●</span> Expense
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    <Input placeholder="e.g., 🍔, 💰, 🏠" {...field} />
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
          <Button type="submit" form="category-form" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Category'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
