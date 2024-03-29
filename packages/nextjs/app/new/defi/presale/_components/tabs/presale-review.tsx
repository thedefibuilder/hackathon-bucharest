import React from 'react';

import { TabsContent } from '@radix-ui/react-tabs';
import ButtonSpinner from '~~/components/button-spinner';
import Wallet from '~~/components/nav/wallet';
import { preSaleTabs } from '~~/lib/tabs';
import { separateCamelCase } from '~~/lib/utils';
import { TOfferingSchema } from '~~/schemas/offering';
import { TRequirementsSchema } from '~~/schemas/requirements';
import { TVestingSchema } from '~~/schemas/vesting';
import { useAccount } from 'wagmi';

type TPresaleReviewTab = {
  offeringValues: TOfferingSchema;
  requirementsValues: TRequirementsSchema;
  vestingValues: TVestingSchema;
  isDeployingPresale: boolean;
  onPresaleDeploy(): Promise<void>;
};

export default function PresaleReviewTab({
  offeringValues,
  requirementsValues,
  vestingValues,
  isDeployingPresale,
  onPresaleDeploy
}: TPresaleReviewTab) {
  const { isConnected } = useAccount();

  return (
    <TabsContent
      value={preSaleTabs.review}
      className='border-border h-full overflow-hidden rounded-md border'
    >
      <div className='flex h-full w-full flex-col items-end gap-y-5 overflow-y-auto p-5'>
        <div className='flex w-full flex-col gap-y-3'>
          <PresaleReviewSection title='Offering' keyValuePair={offeringValues} />
          <PresaleReviewSection title='Requirements' keyValuePair={requirementsValues} />
          <PresaleReviewSection title='Vesting' keyValuePair={vestingValues} />
        </div>

        {isConnected ? (
          <ButtonSpinner
            isLoading={isDeployingPresale}
            defaultContent='Deploy'
            loadingContent='Deploying...'
            onClick={onPresaleDeploy}
          />
        ) : (
          <Wallet />
        )}
      </div>
    </TabsContent>
  );
}

type TPresaleReviewSection = {
  title: string;
  keyValuePair: TOfferingSchema | TRequirementsSchema | TVestingSchema;
};

function PresaleReviewSection({ title, keyValuePair }: TPresaleReviewSection) {
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
