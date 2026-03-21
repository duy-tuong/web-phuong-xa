"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  titleClassName?: string;
  descriptionClassName?: string;
}

const sizeMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  titleClassName,
  descriptionClassName,
}: ModalProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className={`${sizeMap[size]} w-[calc(100vw-1rem)] sm:w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-[hsl(120,10%,86%)] bg-white p-4 sm:p-6 shadow-[0_18px_44px_-20px_rgba(0,0,0,0.25)]`}
      >
        <DialogHeader className="text-left space-y-1.5 pb-1">
          <DialogTitle
            className={cn(
              "text-stone-900 text-lg sm:text-xl font-semibold tracking-tight text-left leading-tight",
              titleClassName
            )}
          >
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription
              className={cn(
                "text-stone-500 text-sm text-left",
                descriptionClassName
              )}
            >
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        <div className="py-1">{children}</div>
        {footer && <DialogFooter className="gap-2 sm:justify-end">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

// Confirm delete modal
interface ConfirmDeleteProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  itemName,
}: ConfirmDeleteProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Xác nhận xóa"
      description={`Bạn có chắc chắn muốn xóa${itemName ? ` "${itemName}"` : ""}? Hành động này không thể hoàn tác.`}
      footer={
        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Xóa
          </Button>
        </div>
      }
    >
      <div />
    </Modal>
  );
}
