/* eslint-disable unicorn/no-nested-ternary */

'use client';

import React, { useEffect, useRef } from 'react';

import type { UseChatHelpers } from 'ai/react';
import type { ComponentProps } from 'react';

import ButtonIcon from '~~/components/button-icon';
import { Separator } from '~~/components/ui/separator';
import { useAtBottom } from '~~/hooks/use-at-bottom';
import { cn } from '~~/lib/utils';
import { ArrowDown, RefreshCcw, X } from 'lucide-react';

import Message from './message';

type TMessagesList = ComponentProps<'ul'> &
  Pick<UseChatHelpers, 'messages' | 'isLoading' | 'reload' | 'stop'>;

function MessagesList({
  messages,
  isLoading,
  className,
  reload,
  stop,
  ...otherProperties
}: TMessagesList) {
  const messagesListReference = useRef<HTMLUListElement | null>(null);
  const { isAtBottom, scrollToBottom } = useAtBottom(messagesListReference, 0);

  useEffect(() => {
    if (!isAtBottom) {
      scrollToBottom();
    }
  }, [isAtBottom, scrollToBottom]);

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading, messages, scrollToBottom]);

  return (
    <div className='relative flex h-full w-full justify-center overflow-hidden'>
      <ul
        ref={messagesListReference}
        className={cn('relative h-full w-full overflow-y-auto px-5 pt-5', className)}
        {...otherProperties}
      >
        {messages.map((message, index) => (
          <li key={message.id}>
            <Message message={message} isLoading={isLoading} />

            {index < messages.length - 1 ? (
              <Separator className='my-5 bg-muted-foreground/25' />
            ) : null}
          </li>
        ))}
      </ul>

      <div className='absolute bottom-1.5 flex justify-center gap-x-2.5'>
        {!isAtBottom && !isLoading ? (
          <ButtonIcon
            icon={ArrowDown}
            iconSize={20}
            title='Scroll to bottom'
            variant='secondary'
            className='h-10 w-10 rounded-full text-secondary-foreground'
            onClick={scrollToBottom}
          />
        ) : null}

        {isLoading ? (
          <ButtonIcon
            icon={X}
            title='Stop generating'
            text='Stop generating'
            variant='secondary'
            className='text-secondary-foreground'
            onClick={stop}
          />
        ) : isAtBottom && messages.length >= 2 ? (
          <ButtonIcon
            icon={RefreshCcw}
            title='Regenerate response'
            text='Regenerate response'
            variant='secondary'
            className='text-secondary-foreground'
            onClick={() => reload()}
          />
        ) : null}
      </div>
    </div>
  );
}

const MemorizedMessagesList = React.memo(MessagesList);

export default MemorizedMessagesList;
