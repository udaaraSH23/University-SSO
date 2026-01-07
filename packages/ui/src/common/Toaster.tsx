"use client";

import { Toaster as SonnerToaster } from "sonner";

/**
 * Shared Toaster configuration for all portals.
 * Uses 'sonner' library.
 */
export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      // If we need theme support we can add it here via `theme={theme}` from useTheme hook
    />
  );
}
