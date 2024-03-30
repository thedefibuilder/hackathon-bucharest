'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import tokenArtifact from '~~/assets/artifacts/token.json';
import SuccessToastContent from '~~/components/success-toast-content';
import { Tabs, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { useToast } from '~~/components/ui/toast/use-toast';
import useDeployContract from '~~/hooks/use-deploy-contract';
import fetchImageFromIpfs from '~~/lib/fetch-image';
import { erc20Tabs, TTab } from '~~/lib/tabs';
import { identitySchema, TIdentitySchema } from '~~/schemas/identity';
import { socialsSchema, TSocialsSchema } from '~~/schemas/socials';
import { tokenomicsSchema, TTokenomicsSchema } from '~~/schemas/tokenomics';
import { ESteps } from '~~/types/api';
import { useChat } from 'ai/react';
import { useForm } from 'react-hook-form';
import { Abi, Hex, parseEther } from 'viem';
import { useAccount, useChainId } from 'wagmi';

import AiTab from './_components/tabs/ai';
import IdentityTab from './_components/tabs/identity';
import ReviewTab from './_components/tabs/review';
import SocialsForm from './_components/tabs/socials';
import TokenomicsTab from './_components/tabs/tokenomics';

export default function Erc20Page() {
  const activeChainId = useChainId();
  const { address } = useAccount();
  
  const [chatStep, setChatStep] = useState(0);
  const [activeTab, setActiveTab] = useState<TTab>(erc20Tabs.ai);

  const [isSavingIntoDb, setIsSavingIntoDb] = useState(false);

  const { toast } = useToast();

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

  function onContinueClick(tab: TERC20Tab) {
    setActiveTab(tab);
  }

  //#region AI
  // prettier-ignore
  const {
    input,
    messages,
    isLoading,
    setInput,
    setMessages,
    handleSubmit,
    reload,
    stop
  } = useChat({
    api: '/api/token/chat',
    body: {
      step: chatStep
    }
  });

  const onNewChat = useCallback(() => {
    setMessages([]);
  }, [setMessages]);

  useEffect(() => {
    if (!isLoading && messages.length >= 2 && messages.length % 2 === 0) {
      setChatStep((previousState) => previousState + 1);
    }
  }, [isLoading, messages]);

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    console.log('chatStep', chatStep);

    if (!isLoading) {
      switch (chatStep) {
        case ESteps.DESCRIPTION: {
          if (messages.length >= 2) {
            identityForm.setValue('description', messages[1].content);
          }

          break;
        }
        case ESteps.ROADMAP: {
          if (messages.length >= 4) {
            identityForm.setValue('roadmap', messages[3].content);
          }

          break;
        }
        case ESteps.LOGO: {
          if (messages.length >= 6) {
            fetchImageFromIpfs(messages[5].content)
              .then((imageBase64) => {
                identityForm.setValue('logoBase64', imageBase64 ?? '');

                return null;
              })
              .catch((error) => console.error('ERROR FETCHING IMAGE', error));
          }

          break;
        }
        case ESteps.COVER: {
          if (messages.length >= 8) {
            fetchImageFromIpfs(messages[7].content)
              .then((imageBase64) => {
                identityForm.setValue('coverImageBase64', imageBase64 ?? '');

                return null;
              })
              .catch((error) => console.error('ERROR FETCHING IMAGE', error));
          }

          break;
        }
        case ESteps.TOKEN_INPUTS: {
          if (messages.length >= 10) {
            const tokenInputs = JSON.parse(messages[9].content);
            console.log('tokenInputs', tokenInputs);

            tokenomicsForm.setValue('tokenName', tokenInputs.name);
            tokenomicsForm.setValue('tokenSymbol', tokenInputs.symbol);
            tokenomicsForm.setValue('maxSupply', tokenInputs.maxSupply);
            tokenomicsForm.setValue('premintAmount', tokenInputs.premintAmount);
          }

          break;
        }
      }
    }
  }, [isLoading, messages, chatStep, identityForm, tokenomicsForm]);
  //#endregion

  //#region DEPLOY ERC20
  const {
    isLoading: isDeployingErc20,
    error: deployErc20Error,
    response: deployErc20Response,
    deployContract: deployErc20Contract
  } = useDeployContract();

  async function onErc20ContractDeploy() {
    const { tokenName, tokenSymbol, maxSupply, premintAmount } = tokenomicsForm.getValues();
    const parsedMaxSupply = parseEther(maxSupply);
    const premintAmountParsed = parseEther(premintAmount);

    await deployErc20Contract(tokenArtifact.abi as Abi, tokenArtifact.bytecode as Hex, [
      tokenName,
      tokenSymbol,
      parsedMaxSupply,
      premintAmountParsed,
      true
    ]);
  }

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
      setIsSavingIntoDb(true);

      const { receipt } = deployErc20Response;
      const { contractAddress } = receipt;

      const { logoBase64, coverImageBase64, description, roadmap } = identityForm.getValues();
      const { tokenName, tokenSymbol, maxSupply, premintAmount } = tokenomicsForm.getValues();
      const { website, twitter, telegram, discord } = socialsForm.getValues();

      fetch('/api/tokens', {
        method: 'POST',
        body: JSON.stringify({
          walletAddress: address,
          deployment: {
            chainId: activeChainId,
            contractAddress,
            template: 'TOKEN'
          },
          token: {
            name: tokenName,
            symbol: tokenSymbol,
            maxSupply,
            premintAmount,
            burnable: true,
            logo: logoBase64,
            cover: coverImageBase64,
            description,
            roadmap,
            socialLinks: {
              website,
              twitter,
              telegram,
              discord
            }
          }
        })
      })
        .then((response) => {
          console.log('SAVE TOKEN TO DB RESPONSE', response);

          if (!response.ok) {
            toast({
              variant: 'destructive',
              title: 'Error saving Token details',
              description: 'Something went wrong saving Token details, please try again.'
            });
            setIsSavingIntoDb(false);

            return;
          }

          setChatStep(0);
          setMessages([]);
          setActiveTab(erc20Tabs.ai);
          identityForm.reset();
          tokenomicsForm.reset();
          socialsForm.reset();

          toast({
            description: (
              <SuccessToastContent>
                <div>
                  <p>ERC20 Token Contract deployed successfully.</p>
                </div>
              </SuccessToastContent>
            )
          });

          setIsSavingIntoDb(false);

          return null;
        })
        .catch((error: unknown) => console.error('ERROR SAVING TOKEN TO DB', error));
    }
  }, [
    activeChainId,
    address,
    identityForm,
    tokenomicsForm,
    socialsForm,
    deployErc20Error,
    deployErc20Response,
    toast,
    setMessages
  ]);
  //#endregion

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

        <AiTab
          input={input}
          messages={messages}
          isLoading={isLoading}
          setInput={setInput}
          handleSubmit={handleSubmit}
          onNewChat={onNewChat}
          reload={reload}
          stop={stop}
          onContinueClick={onContinueClick}
        />
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
          isDeployingErc20={isDeployingErc20 || isSavingIntoDb}
          onErc20ContractDeploy={onErc20ContractDeploy}
        />
      </Tabs>
    </div>
  );
}
