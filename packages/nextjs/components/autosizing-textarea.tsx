'use client';

import React, { useEffect, useRef, useState } from 'react';

import type { ComponentProps } from 'react';

import { cn } from '~~/lib/utils';

type TAutoSizingTextarea = ComponentProps<'textarea'> & {
  minRows?: number;
  maxRows?: number;
};
export default function AutoSizingTextarea({
  minRows = 1,
  maxRows = 10,
  className,
  ...otherProperties
}: TAutoSizingTextarea) {
  const [rows, setRows] = useState(minRows);
  const textareaReference = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const _textareaReference = textareaReference.current;

    if (!_textareaReference) {
      return;
    }

    function handleResize() {
      if (!_textareaReference) {
        return;
      }

      const scrollHeight = _textareaReference.scrollHeight;
      const currentHeight = _textareaReference.offsetHeight;

      if (scrollHeight > currentHeight) {
        const rowHeight = Number.parseInt(
          window.getComputedStyle(_textareaReference).getPropertyValue('line-height'),
          10
        );
        const newRows = Math.floor(scrollHeight / rowHeight);

        if (newRows < minRows) {
          setRows(minRows);
        } else if (newRows > maxRows) {
          setRows(maxRows);
        } else {
          setRows(newRows);
        }
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Enter' || event.key === 'Delete' || event.key === 'Backspace') {
        if (!_textareaReference) {
          return;
        }

        const scrollHeight = _textareaReference.scrollHeight;
        const newRows = Math.ceil(scrollHeight / _textareaReference.scrollHeight);

        if (newRows < rows) {
          setRows(Math.max(minRows, newRows));
        }
      }
    }

    _textareaReference.addEventListener('input', handleResize);
    _textareaReference.addEventListener('keydown', handleKeyDown);

    return () => {
      if (_textareaReference) {
        _textareaReference.removeEventListener('input', handleResize);
        _textareaReference.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [rows, minRows, maxRows]);

  return (
    <textarea
      ref={textareaReference}
      rows={rows}
      className={cn(
        'flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...otherProperties}
    />
  );
}
