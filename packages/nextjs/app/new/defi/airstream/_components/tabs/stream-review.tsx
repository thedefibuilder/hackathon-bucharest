import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import ButtonSpinner from '~~/components/button-spinner';
import Wallet from '~~/components/nav/wallet';
import { airstreamTabs } from '~~/lib/tabs';
import { separateCamelCase } from '~~/lib/utils';
import { TTokenSchema } from '~~/schemas/token';
import { useAccount } from 'wagmi';

type TStreamReviewTab = {
  tokenValues: TTokenSchema;
  isDeployingStream: boolean;
  onStreamDeploy(): Promise<void>;
};

export default function StreamReviewTab({
  tokenValues,
  onStreamDeploy,
  isDeployingStream
}: TStreamReviewTab) {
  const { isConnected } = useAccount();

  return (
    <TabsContent
      value={airstreamTabs.review}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex h-full w-full flex-col items-end gap-y-5 overflow-y-auto p-5'>
        <div className='flex w-full flex-col gap-y-3'>
          <StreamReviewSection title='Token' keyValuePair={tokenValues} />
        </div>

        {isConnected ? (
          <ButtonSpinner
            isLoading={isDeployingStream}
            defaultContent='Deploy'
            loadingContent='Deploying...'
            onClick={onStreamDeploy}
          />
        ) : (
          <Wallet />
        )}
      </div>
    </TabsContent>
  );
}

type TStreamReviewSection = {
  title: string;
  keyValuePair: TTokenSchema;
};

function StreamReviewSection({ title, keyValuePair }: TStreamReviewSection) {
  return (
    <div className='flex flex-col gap-y-1.5'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      <ul className='ml-2'>
        {Object.entries(keyValuePair).map((entry) => {
          const key = entry[0];
          const value = entry[1];

          return (
            <li key={key} className='flex flex-col gap-y-1.5'>
              <span className='text-muted-foreground font-semibold capitalize'>
                {separateCamelCase(key ?? '')}:{' '}
              </span>

              <span>{value.toString() ?? ''}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
