// Issue: https://github.com/radix-ui/primitives/issues/1836#issuecomment-1556688048
// Demo: https://codesandbox.io/embed/r9sq1q

import React from 'react';

import { Dialog, DialogContent, DialogPortal, DialogTrigger } from '~~/components/ui/dialog';
import { DropdownMenuItem } from '~~/components/ui/dropdown-menu';

type TDialog = {
  isDialogOpen?: boolean;
  triggerChildren: React.ReactNode;
  children: React.ReactNode;
  onDropdownSelect: () => void;
  onDialogOpenChange: (open: boolean) => void;
};

function _Dialog(
  {
    isDialogOpen,
    triggerChildren,
    children: contentChildren,
    onDropdownSelect,
    onDialogOpenChange
  }: TDialog,
  forwardedReference: React.Ref<HTMLDivElement>
) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onDialogOpenChange}>
      <DialogTrigger asChild>
        <DropdownMenuItem
          ref={forwardedReference}
          onSelect={(event) => {
            event.preventDefault();
            onDropdownSelect();
          }}
        >
          {triggerChildren}
        </DropdownMenuItem>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent>{contentChildren}</DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

const ForwardedDialog = React.forwardRef<HTMLDivElement, TDialog>(_Dialog);

export default ForwardedDialog;
