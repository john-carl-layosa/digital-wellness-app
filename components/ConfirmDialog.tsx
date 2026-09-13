"use client";

import React from "react";
import { Modal } from "./Modal";
import { PrimaryButton } from "./PrimaryButton";

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal open={open} onClose={onCancel} title={title} widthClassName="max-w-sm">
      <p className="text-sm text-inkSoft">{description}</p>
      <div className="mt-6 flex justify-end gap-2">
        <PrimaryButton variant="outline" onClick={onCancel}>
          {cancelLabel}
        </PrimaryButton>
        <PrimaryButton
          onClick={onConfirm}
          className="!bg-danger hover:!bg-danger/90"
        >
          {confirmLabel}
        </PrimaryButton>
      </div>
    </Modal>
  );
}