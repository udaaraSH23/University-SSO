"use client";

// Author: UDARA SHANUKA
// Project: University-Portal
// FP-ID: FP-20260101-UI-DELETE-CONFIRM-MODAL
// FP-HASH: HASH-PLACEHOLDER
// Generated: 2026-01-01T13:24:32+05:30

const __FP_SIG = "FP-20260101-UI-DELETE-CONFIRM-MODAL|HASH-PLACEHOLDER";

import { useState, useEffect } from "react";
import { Modal } from "./Modal";

export interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  verificationText?: string;
  isLoading?: boolean;
}

/**
 * DeleteConfirmationModal
 *
 * Purpose:
 * - A specialized modal for destructive actions.
 * - Requires user to type a verification text to confirm.
 *
 * Responsibilities:
 * - Validating user input against verification text.
 * - Triggering the confirm callback.
 */
export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  verificationText = "DELETE",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");
  const isConfirmed = inputValue === verificationText;

  useEffect(() => {
    if (isOpen) {
      setInputValue("");
    }
  }, [isOpen]);

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  const footer = (
    <>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirm}
        disabled={!isConfirmed || isLoading}
        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Deleting..." : "Delete"}
      </button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      description={description}
      variant="danger"
      footer={footer}
    >
      <div className="space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          To confirm, please type{" "}
          <span className="font-bold select-all text-red-600 dark:text-red-400">
            {verificationText}
          </span>{" "}
          below.
        </p>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Type "${verificationText}" to confirm`}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white dark:bg-gray-900 text-gray-900 dark:text-white sm:text-sm"
          disabled={isLoading}
        />
      </div>
    </Modal>
  );
}
