'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import tokenArtifact from '~~/assets/artifacts/token.json';
import SuccessToastContent from '~~/components/success-toast-content';
import { Tabs, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { useToast } from '~~/components/ui/toast/use-toast';
import useDeployContract from '~~/hooks/use-deploy-contract';
import { erc20Tabs, TTab } from '~~/lib/tabs';
import { identitySchema, TIdentitySchema } from '~~/schemas/identity';
import { socialsSchema, TSocialsSchema } from '~~/schemas/socials';
import { tokenomicsSchema, TTokenomicsSchema } from '~~/schemas/tokenomics';
import { useForm } from 'react-hook-form';

import AiTab from './_components/tabs/ai';
import IdentityTab from './_components/tabs/identity';
import ReviewTab from './_components/tabs/review';
import SocialsForm from './_components/tabs/socials';
import TokenomicsTab from './_components/tabs/tokenomics';

export default function Erc20Page() {
  const [activeTab, setActiveTab] = useState<TTab>(erc20Tabs.ai);

  //#region IDENTITY
  const identityForm = useForm<TIdentitySchema>({
    resolver: zodResolver(identitySchema),
    defaultValues: {
      description: '',
      roadmap: ''
    }
  });

  function onLogoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        identityForm.setValue('logoBase64', base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  function onCoverImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files && event.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        identityForm.setValue('coverImageBase64', base64String);
      };
      reader.readAsDataURL(file);
    }
  }
  //#endregion

  const tokenomicsForm = useForm<TTokenomicsSchema>({
    resolver: zodResolver(tokenomicsSchema),
    defaultValues: {
      tokenName: '',
      tokenSymbol: '',
      maxSupply: '',
      premintAmount: ''
    }
  });

  const socialsForm = useForm<TSocialsSchema>({
    resolver: zodResolver(socialsSchema),
    defaultValues: {
      website: '',
      twitter: '',
      telegram: '',
      discord: ''
    }
  });

  function onContinueClick(tab: TTab) {
    setActiveTab(tab);
  }

  const {
    isLoading: isDeployingErc20,
    error: deployErc20Error,
    response: deployErc20Response,
    deployContract: deployErc20Contract
  } = useDeployContract();

  async function onErc20ContractDeploy() {
    const { tokenName, tokenSymbol, maxSupply, premintAmount } = tokenomicsForm.getValues();

    await deployErc20Contract(tokenArtifact.abi, tokenArtifact.bytecode, [
      tokenName,
      tokenSymbol,
      maxSupply,
      premintAmount,
      true
    ]);

    identityForm.reset();
    tokenomicsForm.reset();
    socialsForm.reset();
  }

  const { toast } = useToast();

  useEffect(() => {
    if (deployErc20Error) {
      toast({
        variant: 'destructive',
        title: deployErc20Error.title,
        description: deployErc20Error.message
      });
    }
  }, [deployErc20Error, toast]);

  useEffect(() => {
    if (!deployErc20Error && deployErc20Response) {
      toast({
        description: (
          <SuccessToastContent>
            <div>
              <p>ERC20 Token Contract deployed successfully.</p>
            </div>
          </SuccessToastContent>
        )
      });
    }
  }, [deployErc20Error, deployErc20Response, toast]);

  return (
    <div className='flex h-[calc(100%-2.5rem)] w-full flex-col'>
      <Tabs defaultValue={activeTab} value={activeTab} className='h-full w-full'>
        <TabsList className='mb-2.5 w-full'>
          {Object.values(erc20Tabs).map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className='w-1/5'
              disabled={isDeployingErc20}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <AiTab onContinueClick={onContinueClick} />
        <IdentityTab
          form={identityForm}
          onContinueClick={onContinueClick}
          onLogoUpload={onLogoUpload}
          onCoverImageUpload={onCoverImageUpload}
        />
        <TokenomicsTab form={tokenomicsForm} onContinueClick={onContinueClick} />
        <SocialsForm form={socialsForm} onContinueClick={onContinueClick} />
        <ReviewTab
          identityValues={identityForm.watch()}
          tokenomicsValues={tokenomicsForm.watch()}
          socialsValues={socialsForm.watch()}
          isDeployingErc20={isDeployingErc20}
          onErc20ContractDeploy={onErc20ContractDeploy}
        />
      </Tabs>
    </div>
  );
}
