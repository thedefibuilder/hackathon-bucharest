import React, { ComponentProps } from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TTab } from '~~/lib/tabs';
import { UseChatHelpers } from 'ai/react';

import MessagesList from '../chat-messages/list';
import ChatPrompt from '../chat/prompt';

type TAiTab = Pick<
  UseChatHelpers,
  'input' | 'messages' | 'isLoading' | 'setInput' | 'handleSubmit' | 'reload' | 'stop'
> & {
  onNewChat: () => void;
  onContinueClick: (tab: TTab) => void;
};

export default function AiTab({
  input,
  messages,
  isLoading,
  setInput,
  handleSubmit,
  reload,
  stop,
  onNewChat,
  onContinueClick
}: TAiTab) {
  return (
    <TabsContent
      value={erc20Tabs.ai}
      className='h-full overflow-hidden rounded-md border border-border'
    >
      <div className='flex h-full w-full flex-col items-center overflow-y-auto'>
        <MessagesList messages={messages} isLoading={isLoading} reload={reload} stop={stop} />

        <ChatPrompt
          input={input}
          isLoading={isLoading}
          messages={messages}
          setInput={setInput}
          handleSubmit={handleSubmit}
          onNewChat={onNewChat}
          onContinueClick={onContinueClick}
        />
      </div>
    </TabsContent>
  );
}
