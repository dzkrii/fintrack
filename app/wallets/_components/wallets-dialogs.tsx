'use client';

import { WalletActionDialog } from './wallet-action-dialog';
import { WalletDeleteDialog } from './wallet-delete-dialog';
import { useWallets } from './wallets-context';

export function WalletsDialogs() {
  const { open, setOpen, currentWallet, setCurrentWallet } = useWallets();

  return (
    <>
      {/* Add Dialog */}
      <WalletActionDialog
        key="wallet-add"
        open={open === 'add'}
        onOpenChange={(isOpen) => {
          if (!isOpen) setOpen(null);
        }}
      />

      {/* Edit Dialog */}
      {currentWallet && (
        <>
          <WalletActionDialog
            key={`wallet-edit-${currentWallet.id}`}
            open={open === 'edit'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => setCurrentWallet(null), 300);
              }
            }}
            currentWallet={currentWallet}
          />

          <WalletDeleteDialog
            key={`wallet-delete-${currentWallet.id}`}
            open={open === 'delete'}
            onOpenChange={(isOpen) => {
              if (!isOpen) {
                setOpen(null);
                setTimeout(() => setCurrentWallet(null), 300);
              }
            }}
            currentWallet={currentWallet}
          />
        </>
      )}
    </>
  );
}
