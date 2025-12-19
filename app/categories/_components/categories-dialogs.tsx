'use client';

import { CategoryActionDialog } from './category-action-dialog';
import { CategoryDeleteDialog } from './category-delete-dialog';
import { useCategories } from './categories-context';

export function CategoriesDialogs() {
  const { open, setOpen, currentCategory, setCurrentCategory } = useCategories();

  return (
    <>
      {/* Add Dialog */}
      <CategoryActionDialog
        key="category-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      />

      {/* Edit Dialog */}
      {currentCategory && (
        <>
          <CategoryActionDialog
            key={`category-edit-${currentCategory.id}`}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => setCurrentCategory(null), 300);
              }
            }}
            currentCategory={currentCategory}
          />

          <CategoryDeleteDialog
            key={`category-delete-${currentCategory.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => setCurrentCategory(null), 300);
              }
            }}
            currentCategory={currentCategory}
          />
        </>
      )}
    </>
  );
}
