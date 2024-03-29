import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TTab } from '~~/lib/tabs';

type TAiTab = {
  onContinueClick: (tab: TTab) => void;
};

export default function AiTab({ onContinueClick }: TAiTab) {
  return (
    <TabsContent
      value={erc20Tabs.ai}
      className='h-full overflow-hidden rounded-md border border-border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>{erc20Tabs.ai}</div>
    </TabsContent>
  );
}
