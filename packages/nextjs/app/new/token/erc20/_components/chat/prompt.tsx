/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable jsx-a11y/no-autofocus */

import React from 'react';

import type { UseChatHelpers } from 'ai/react';
import type { ComponentProps } from 'react';

import AutoSizingTextarea from '~~/components/autosizing-textarea';
import StyledLink from '~~/components/styled-link';
import { Button } from '~~/components/ui/button';
import { useEnterSubmit } from '~~/hooks/use-enter-submit';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';
import { cn } from '~~/lib/utils';
import { CornerDownLeft, Plus } from 'lucide-react';

type TChatPrompt = ComponentProps<'div'> &
  Pick<UseChatHelpers, 'input' | 'isLoading' | 'messages' | 'setInput' | 'handleSubmit'> & {
    onContinueClick: (tab: TERC20Tab) => void;
    onNewChat: () => void;
  };

function ChatPrompt({
  input,
  isLoading,
  messages,
  className,
  setInput,
  handleSubmit,
  onNewChat,
  onContinueClick,
  ...otherProperties
}: TChatPrompt) {
  const { formReference, onKeyDown } = useEnterSubmit();

  return (
    <div
      className={cn('mt-2.5 flex w-full items-center gap-x-5 border-t p-5', className)}
      {...otherProperties}
    >
      <Button
        size='icon'
        variant='outline'
        title='New chat'
        className='rounded-full'
        disabled={isLoading}
        onClick={onNewChat}
      >
        <Plus size={20} />
      </Button>

      <form
        ref={formReference}
        className='flex w-full items-center gap-x-5'
        onSubmit={handleSubmit}
      >
        <AutoSizingTextarea
          placeholder='Ask chatbot anything you want...'
          className='resize-none'
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => onKeyDown(event, !isLoading)}
          autoFocus
        />

        {messages.length === 0 && !isLoading ? (
          <Button onClick={() => onContinueClick(erc20Tabs.identity)}>Skip AI</Button>
        ) : messages.length === 10 ? (
          <Button onClick={() => onContinueClick(erc20Tabs.socials)}>Continue</Button>
        ) : (
          <Button size='icon' title='Send message' disabled={input === '' || isLoading}>
            <CornerDownLeft size={20} />
          </Button>
        )}
      </form>
    </div>
  );
}

const MemorizedChatPrompt = React.memo(ChatPrompt);

export default MemorizedChatPrompt;
