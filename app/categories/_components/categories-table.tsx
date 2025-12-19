'use client';

import { Pencil, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useCategories, type Category } from './categories-context';

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function CategoriesTable() {
  const { categories, setOpen, setCurrentCategory, isLoading } = useCategories();

  const handleEdit = (category: Category) => {
    setCurrentCategory(category);
    setOpen('edit');
  };

  const handleDelete = (category: Category) => {
    setCurrentCategory(category);
    setOpen('delete');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-pulse text-muted-foreground">
          Loading categories...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Tag className="h-16 w-16 mb-4 opacity-50" />
        <h3 className="text-xl font-semibold mb-2">No categories yet</h3>
        <p className="text-sm">
          Click &quot;Add Category&quot; to create your first category.
        </p>
      </div>
    );
  }

  // Group categories by type
  const incomeCategories = categories.filter((c) => c.type === 'INCOME');
  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE');

  return (
    <div className="space-y-8">
      {/* Income Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Badge variant="default" className="bg-emerald-500 hover:bg-emerald-500">
            Income
          </Badge>
          <span className="text-muted-foreground text-sm font-normal">
            ({incomeCategories.length} categories)
          </span>
        </h3>
        {incomeCategories.length > 0 ? (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[60px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[120px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {incomeCategories.map((category) => (
                  <TableRow key={category.id} className="group/row">
                    <TableCell className="text-2xl">{category.icon || '📥'}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">No income categories yet.</p>
        )}
      </div>

      {/* Expense Categories */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Badge variant="default" className="bg-rose-500 hover:bg-rose-500">
            Expense
          </Badge>
          <span className="text-muted-foreground text-sm font-normal">
            ({expenseCategories.length} categories)
          </span>
        </h3>
        {expenseCategories.length > 0 ? (
          <div className="overflow-hidden rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-[60px]">Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[120px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {expenseCategories.map((category) => (
                  <TableRow key={category.id} className="group/row">
                    <TableCell className="text-2xl">{category.icon || '📤'}</TableCell>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(category.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(category)}
                          className="h-8 w-8"
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(category)}
                          className="h-8 w-8 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4">No expense categories yet.</p>
        )}
      </div>
    </div>
  );
}
