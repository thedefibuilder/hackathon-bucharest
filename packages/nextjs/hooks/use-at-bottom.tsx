import { useCallback, useEffect, useState } from 'react';

import type { RefObject } from 'react';

export function useAtBottom<T extends HTMLElement>(elementReference: RefObject<T>, offset = 100) {
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const _elementReference = elementReference.current;

    function handleScroll() {
      if (!_elementReference) {
        return;
      }

      const { scrollTop, clientHeight, scrollHeight } = _elementReference;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - offset);
    }

    if (_elementReference) {
      _elementReference.addEventListener('scroll', handleScroll);
      handleScroll();
    }

    return () => {
      if (_elementReference) {
        _elementReference.removeEventListener('scroll', handleScroll);
      }
    };
  }, [elementReference, offset]);

  const scrollToBottom = useCallback(() => {
    if (elementReference.current) {
      elementReference.current.scrollTo({
        top: elementReference.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [elementReference]);

  return { isAtBottom, scrollToBottom };
}
