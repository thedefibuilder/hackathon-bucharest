'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Tabs, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import SuccessToastContent from '~~/components/success-toast-content';
import { useToast } from '~~/components/ui/toast/use-toast';
import externalContracts from '~~/contracts/externalContracts';
import useWriteContract from '~~/hooks/use-write-contract';
import { airstreamTabs, TAirstreamTab } from '~~/lib/tabs';
import { tokenSchema, TTokenSchema } from '~~/schemas/token';
import { TSablierStreamOutput } from '~~/types/api';
import { useForm } from 'react-hook-form';
import { useAccount } from 'wagmi';

import StreamReviewTab from './_components/tabs/stream-review';
import TokenTab from './_components/tabs/token';

export default function AirstreamPage() {
  const [activeTab, setActiveTab] = useState<TAirstreamTab>(airstreamTabs.token);
  const [streamResponse, setStreamResponse] = useState<TSablierStreamOutput | null>(null);
  const { toast } = useToast();
  const account = useAccount();

  const tokenForm = useForm<TTokenSchema>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      token: '',
      recipients: '',
      root: '',
      total: '',
      CID: '',
      cliffDuration: 0,
      vestingDuration: 0
    }
  });

  function onContinueClick(tab: TAirstreamTab) {
    setActiveTab(tab);
  }

  function onCSVUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log(reader.result);

        fetch('/api/stream', {
          method: 'POST',
          body: JSON.stringify({
            csv: reader.result
          })
        }).then((response) => {
          if (response.ok) {
            response.json().then((data: TSablierStreamOutput) => {
              setStreamResponse(data);
              tokenForm.setValue('recipients', data.recipients);
              tokenForm.setValue('root', data.root);
              tokenForm.setValue('total', data.total);
              tokenForm.setValue('CID', data.cid);
            });
          } else {
            toast({
              variant: 'destructive',
              title: 'Failed to upload CSV'
            });
          }
        });
      };
      reader.readAsText(file);
    }
  }

  const {
    publicClient,
    writeContract: createMerkleStream,
    isLoading: isStreamLoading,
    error: streamError,
    response: mekrleStreamResponse
  } = useWriteContract();

  useEffect(() => {
    if (streamError) {
      toast({
        variant: 'destructive',
        title: streamError.title,
        description: streamError.message
      });
    }
  }, [streamError, toast]);

  async function onStreamDeploy() {
    const { token, recipients, root, total, CID, vestingDuration, cliffDuration } =
      tokenForm.getValues();

    const chainName =
      publicClient?.chain?.name === 'Arbitrum Sepolia' ? 'Arbitrum Sepolia' : 'Base Sepolia';

    await createMerkleStream(
      externalContracts[chainName].sablierMerkle.abi,
      externalContracts[chainName].sablierMerkle.address,
      'createMerkleStreamerLL',
      [
        account.address,
        externalContracts[chainName].sablierLockupLinear.address,
        token,
        root,
        10995116277, // no expiration
        { cliff: cliffDuration, total: vestingDuration },
        false,
        false,
        CID,
        total,
        recipients
      ]
    );
  }

  useEffect(() => {
    if (mekrleStreamResponse && !streamError) {
      setActiveTab(airstreamTabs.token);
      tokenForm.reset();

      toast({
        description: (
          <SuccessToastContent>
            <div>
              <p>Stream deployed successfully.</p>
            </div>
          </SuccessToastContent>
        )
      });
    }
  }, [mekrleStreamResponse, streamError, toast]);

  return (
    <div className='flex h-[calc(100%-2.5rem)] w-full flex-col'>
      <Tabs defaultValue={activeTab} value={activeTab} className='h-full w-full'>
        <TabsList className='mb-2.5 w-full'>
          {Object.values(airstreamTabs).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className='w-1/5'
              disabled={false} // todo
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabsTrigger>
          ))}
          <TokenTab form={tokenForm} onContinueClick={onContinueClick} onCSVUpload={onCSVUpload} />

          <StreamReviewTab
            tokenValues={tokenForm.watch()}
            onStreamDeploy={onStreamDeploy}
            isDeployingStream={isStreamLoading}
          />
        </TabsList>
      </Tabs>
    </div>
  );
}
