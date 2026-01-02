"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-UI-DELETE-CONFIRM-CTX
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T13:28:00+05:30

const __FP_SIG = "FP-20260101-UI-DELETE-CONFIRM-CTX|HASH-PLACEHOLDER";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

interface ConfirmOptions {
  title: string;
  description: string;
  onConfirm: () => Promise<void> | void;
  verificationText?: string;
}

interface DeleteConfirmationContextType {
  confirmDelete: (options: ConfirmOptions) => void;
}

const DeleteConfirmationContext = createContext<
  DeleteConfirmationContextType | undefined
>(undefined);

export function useDeleteConfirmation() {
  const context = useContext(DeleteConfirmationContext);
  if (!context) {
    throw new Error(
      "useDeleteConfirmation must be used within a DeleteConfirmationProvider"
    );
  }
  return context;
}

/**
 * DeleteConfirmationProvider
 *
 * Purpose:
 * - Manages the state of the global delete confirmation modal.
 * - Provides the confirmDelete function to children.
 *
 * Responsibilities:
 * - Rendering the modal at the root level.
 * - Handling opening/closing and executing the confirm callback.
 */
export function DeleteConfirmationProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirmDelete = (opts: ConfirmOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setOptions(null);
      setIsLoading(false);
    }, 300); // Clear options after animation
  };

  const handleConfirm = async () => {
    if (options?.onConfirm) {
      try {
        setIsLoading(true);
        await options.onConfirm();
      } finally {
        setIsLoading(false);
        handleClose();
      }
    }
  };

  return (
    <DeleteConfirmationContext.Provider value={{ confirmDelete }}>
      {children}
      {options && (
        <DeleteConfirmationModal
          isOpen={isOpen}
          onClose={handleClose}
          onConfirm={handleConfirm}
          title={options.title}
          description={options.description}
          verificationText={options.verificationText}
          isLoading={isLoading}
        />
      )}
    </DeleteConfirmationContext.Provider>
  );
}
