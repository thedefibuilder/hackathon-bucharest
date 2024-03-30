import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import ButtonSpinner from '~~/components/button-spinner';
import Wallet from '~~/components/nav/wallet';
import { erc20Tabs } from '~~/lib/tabs';
import { cn, separateCamelCase } from '~~/lib/utils';
import { TIdentitySchema } from '~~/schemas/identity';
import { TSocialsSchema } from '~~/schemas/socials';
import { TTokenomicsSchema } from '~~/schemas/tokenomics';
import Image from 'next/image';
import { useAccount } from 'wagmi';

type TReviewTab = {
  identityValues: TIdentitySchema;
  tokenomicsValues: TTokenomicsSchema;
  socialsValues: TSocialsSchema;
  isDeployingErc20: boolean;
  onErc20ContractDeploy(): Promise<void>;
};

export default function ReviewTab({
  identityValues,
  tokenomicsValues,
  socialsValues,
  isDeployingErc20,
  onErc20ContractDeploy
}: TReviewTab) {
  const { isConnected } = useAccount();

  return (
    <TabsContent
      value={erc20Tabs.review}
      className='h-full overflow-hidden rounded-md border border-border'
    >
      <div className='flex h-full w-full flex-col items-end gap-y-5 overflow-y-auto p-5'>
        <div className='flex w-full flex-col gap-y-3'>
          <ReviewSection title='Identity' keyValuePair={identityValues} />
          <ReviewSection title='Tokenomics' keyValuePair={tokenomicsValues} />
          <ReviewSection title='Socials' keyValuePair={socialsValues} />
        </div>

        {isConnected ? (
          <ButtonSpinner
            isLoading={isDeployingErc20}
            defaultContent='Deploy'
            loadingContent='Deploying...'
            onClick={onErc20ContractDeploy}
          />
        ) : (
          <Wallet />
        )}
      </div>
    </TabsContent>
  );
}

type TReviewSection = {
  title: string;
  keyValuePair: TIdentitySchema | TTokenomicsSchema | TSocialsSchema;
};

function ReviewSection({ title, keyValuePair }: TReviewSection) {
  return (
    <div className='flex flex-col gap-y-1.5'>
      <h2 className='text-xl font-semibold'>{title}</h2>

      <ul className='ml-2'>
        {Object.entries(keyValuePair).map((entry) => {
          console.log('ENTRY', entry);
          const key = entry[0];
          const value = entry[1];
          const isImage =
            typeof value === 'string' ? value?.includes('data:image/jpeg;base64') : false;

          return (
            <li key={key} className={cn({ 'flex flex-col gap-y-1.5': isImage })}>
              <span className='font-semibold capitalize text-muted-foreground'>
                {separateCamelCase(key ?? '')}:{' '}
              </span>
              {isImage ? (
                <Image
                  src={value ?? ''}
                  alt='Token Logo'
                  width={200}
                  height={113}
                  className='aspect-auto w-1/2 rounded-md'
                />
              ) : (
                <span>{!value || value === '' ? 'N / A' : value}</span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
