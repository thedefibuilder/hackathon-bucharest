/* eslint-disable unicorn/no-nested-ternary */
/* eslint-disable sonarjs/no-duplicate-string */

'use client';

import React, { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import presaleArtifact from '~~/assets/artifacts/presale.json';
import StyledLink from '~~/components/styled-link';
import SuccessToastContent from '~~/components/success-toast-content';
import { Tabs, TabsList, TabsTrigger } from '~~/components/ui/tabs';
import { useToast } from '~~/components/ui/toast/use-toast';
import externalContracts from '~~/contracts/externalContracts';
import useDeployContract from '~~/hooks/use-deploy-contract';
import { preSaleTabs, TPreSaleTab } from '~~/lib/tabs';
import { offeringSchema, TOfferingSchema } from '~~/schemas/offering';
import { requirementsSchema, TRequirementsSchema } from '~~/schemas/requirements';
import { TVestingSchema, vestingSchema } from '~~/schemas/vesting';
import { DateRange } from 'react-day-picker';
import { useForm } from 'react-hook-form';
import { Abi, Hex, parseEther } from 'viem';
import { usePublicClient } from 'wagmi';

import OfferingTab from './_components/tabs/offering';
import PresaleReviewTab from './_components/tabs/presale-review';
import RequirementsTab from './_components/tabs/requirements';
import VestingTab from './_components/tabs/vesting';

const arbitrumUsdcAddress = '0x75faf114eafb1bdbe2f0316df893fd58ce46aa4d';

export default function PresalePage() {
  const [activeTab, setActiveTab] = useState<TPreSaleTab>(preSaleTabs.offering);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const { chain } = usePublicClient();

  function onContinueClick(tab: TPreSaleTab) {
    setActiveTab(tab);
  }

  const offeringForm = useForm<TOfferingSchema>({
    resolver: zodResolver(offeringSchema),
    defaultValues: {
      token: '',
      payment: arbitrumUsdcAddress,
      allocationSupply: '0',
      price: '0'
    }
  });

  const requirementsForm = useForm<TRequirementsSchema>({
    resolver: zodResolver(requirementsSchema),
    defaultValues: {
      minParticipationAmount: '',
      maxParticipationAmount: ''
    }
  });

  const vestingForm = useForm<TVestingSchema>({
    resolver: zodResolver(vestingSchema),
    defaultValues: {
      cliffDuration: 0,
      vestingDuration: 0
    }
  });

  const { toast } = useToast();

  const {
    publicClient,
    isLoading: isDeployingPresale,
    error: deployPresaleError,
    response: deployPresaleResponse,
    deployContract: deployPresaleContract
  } = useDeployContract();

  useEffect(() => {
    if (deployPresaleError) {
      toast({
        variant: 'destructive',
        title: deployPresaleError.title,
        description: deployPresaleError.message
      });
    }
  }, [deployPresaleError, toast]);

  useEffect(() => {
    if (!deployPresaleError && deployPresaleResponse) {
      const { receipt } = deployPresaleResponse;
      const { contractAddress } = receipt;

      // todo: save contract address to db

      setActiveTab(preSaleTabs.offering);
      offeringForm.reset();
      requirementsForm.reset();
      vestingForm.reset();

      toast({
        description: (
          <SuccessToastContent>
            <div>
              <p>ERC20 Token Contract deployed successfully.</p>
              <StyledLink
                variant='link'
                href={`${chain.blockExplorers?.default.url}/address/${deployPresaleResponse.receipt.contractAddress}`}
                target='_blank'
              >
                View on {chain.blockExplorers?.default.name}
              </StyledLink>
            </div>
          </SuccessToastContent>
        )
      });

      toast({
        description: (
          <SuccessToastContent>
            <div>
              <p>Presale Contract deployed successfully.</p>
            </div>
          </SuccessToastContent>
        )
      });
    }
  }, [deployPresaleError, deployPresaleResponse, toast]);

  async function onPresaleContractDeploy() {
    const { token, payment, allocationSupply, price } = offeringForm.getValues();
    const { minParticipationAmount, maxParticipationAmount, startTime, endTime } =
      requirementsForm.getValues();
    const { cliffDuration, vestingDuration } = vestingForm.getValues();

    const offeringConfig = {
      token,
      paymentToken: payment,
      supply: parseEther(allocationSupply),
      price: parseEther(price),
      minParticipationAmount,
      maxParticipationAmount,
      startTime: startTime.getTime() / 1000,
      endTime: endTime.getTime() / 1000
    };

    const chainName =
      publicClient?.chain?.name === 'Arbitrum Sepolia' ? 'Arbitrum Sepolia' : 'Base Sepolia';

    const vestingConfig = {
      sablierLockupLinear: externalContracts[chainName].sablierLockupLinear.address,
      sablierBatch: externalContracts[chainName].sablierBatch.address,
      cliffDuration,
      vestingDuration
    };

    console.log('offeringConfig', offeringConfig);
    console.log('vestingConfig', vestingConfig);

    await deployPresaleContract(
      presaleArtifact.abi as Abi,
      presaleArtifact.bytecode as Hex,
      [offeringConfig, vestingConfig],
      true,
      offeringConfig.token,
      offeringConfig.supply
    );
  }

  return (
    <div className='flex h-[calc(100%-2.5rem)] w-full flex-col'>
      <Tabs defaultValue={activeTab} value={activeTab} className='h-full w-full'>
        <TabsList className='mb-2.5 w-full'>
          {Object.values(preSaleTabs).map((tab) => (
            <TabsTrigger key={tab} value={tab} className='w-1/4' onClick={() => setActiveTab(tab)}>
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>

        <OfferingTab form={offeringForm} onContinueClick={onContinueClick} />

        <RequirementsTab
          form={requirementsForm}
          onContinueClick={onContinueClick}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />

        <VestingTab form={vestingForm} onContinueClick={onContinueClick} />

        <PresaleReviewTab
          offeringValues={offeringForm.watch()}
          requirementsValues={requirementsForm.watch()}
          vestingValues={vestingForm.watch()}
          isDeployingPresale={isDeployingPresale}
          onPresaleDeploy={onPresaleContractDeploy}
        />
      </Tabs>
    </div>
  );
}
