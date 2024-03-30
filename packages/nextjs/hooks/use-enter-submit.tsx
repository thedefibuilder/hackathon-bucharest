import { useCallback, useRef } from 'react';

export function useEnterSubmit() {
  const formReference = useRef<HTMLFormElement | null>(null);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>, canSubmit: boolean) => {
      if (typeof window === 'undefined') {
        return;
      }

      if (!canSubmit) {
        return;
      }

      if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
        formReference.current?.requestSubmit();
        event.preventDefault();
      }
    },
    []
  );

  return { formReference, onKeyDown: handleKeyDown };
}
