import { useState, useCallback } from 'react';

/**
 * useToast — lightweight toast notification hook.
 *
 * Usage:
 *   const { toast, showToast, showError, showSuccess } = useToast();
 */
export function useToast(durationMs = 5000) {
  const [toast, setToast] = useState({ message: '', type: 'error', visible: false });
  let timer = null;

  const showToast = useCallback((message, type = 'error') => {
    setToast({ message, type, visible: true });
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => setToast(t => ({ ...t, visible: false })), durationMs);
  }, [durationMs]);

  const showError = useCallback((msg) => showToast(msg, 'error'), [showToast]);
  const showSuccess = useCallback((msg) => showToast(msg, 'success'), [showToast]);
  const dismiss = useCallback(() => setToast(t => ({ ...t, visible: false })), []);

  return { toast, showToast, showError, showSuccess, dismiss };
}

