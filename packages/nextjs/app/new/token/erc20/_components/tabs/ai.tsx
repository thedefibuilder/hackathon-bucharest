import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import { erc20Tabs, TERC20Tab } from '~~/lib/tabs';

type TAiTab = {
  onContinueClick: (tab: TERC20Tab) => void;
};

export default function AiTab({ onContinueClick }: TAiTab) {
  return (
    <TabsContent
      value={erc20Tabs.ai}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex w-full justify-center overflow-y-auto p-5'>{erc20Tabs.ai}</div>
    </TabsContent>
  );
}
