'use client';

import { useEffect, useState } from 'react';

import { BanknotesIcon } from '@heroicons/react/24/outline';
import { Address, AddressInput, Balance, EtherInput } from '~~/components/scaffold-eth';
import { useTransactor } from '~~/hooks/scaffold-eth';
import { notification } from '~~/utils/scaffold-eth';
import { Address as AddressType, createWalletClient, http, parseEther } from 'viem';
import { hardhat } from 'viem/chains';
import { useNetwork } from 'wagmi';

// Account index to use from generated hardhat accounts.
const FAUCET_ACCOUNT_INDEX = 0;

const localWalletClient = createWalletClient({
  chain: hardhat,
  transport: http()
});

/**
 * Faucet modal which lets you send ETH to any address.
 */
export const Faucet = () => {
  const [loading, setLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState<AddressType>();
  const [faucetAddress, setFaucetAddress] = useState<AddressType>();
  const [sendValue, setSendValue] = useState('');

  const { chain: ConnectedChain } = useNetwork();

  const faucetTxn = useTransactor(localWalletClient);

  useEffect(() => {
    const getFaucetAddress = async () => {
      try {
        const accounts = await localWalletClient.getAddresses();
        setFaucetAddress(accounts[FAUCET_ACCOUNT_INDEX]);
      } catch (error) {
        notification.error(
          <>
            <p className='mb-1 mt-0 font-bold'>Cannot connect to local provider</p>
            <p className='m-0'>
              - Did you forget to run{' '}
              <code className='bg-base-300 text-base font-bold italic'>yarn chain</code> ?
            </p>
            <p className='mt-1 break-normal'>
              - Or you can change{' '}
              <code className='bg-base-300 text-base font-bold italic'>targetNetwork</code> in{' '}
              <code className='bg-base-300 text-base font-bold italic'>scaffold.config.ts</code>
            </p>
          </>
        );
        console.error('⚡️ ~ file: Faucet.tsx:getFaucetAddress ~ error', error);
      }
    };
    getFaucetAddress();
  }, []);

  const sendETH = async () => {
    if (!faucetAddress) {
      return;
    }
    try {
      setLoading(true);
      await faucetTxn({
        to: inputAddress,
        value: parseEther(sendValue as `${number}`),
        account: faucetAddress,
        chain: hardhat
      });
      setLoading(false);
      setInputAddress(undefined);
      setSendValue('');
    } catch (error) {
      console.error('⚡️ ~ file: Faucet.tsx:sendETH ~ error', error);
      setLoading(false);
    }
  };

  // Render only on local chain
  if (ConnectedChain?.id !== hardhat.id) {
    return null;
  }

  return (
    <div>
      <label htmlFor='faucet-modal' className='btn btn-primary btn-sm gap-1 font-normal'>
        <BanknotesIcon className='h-4 w-4' />
        <span>Faucet</span>
      </label>
      <input type='checkbox' id='faucet-modal' className='modal-toggle' />
      <label htmlFor='faucet-modal' className='modal cursor-pointer'>
        <label className='modal-box relative'>
          {/* dummy input to capture event onclick on modal box */}
          <input className='absolute left-0 top-0 h-0 w-0' />
          <h3 className='mb-3 text-xl font-bold'>Local Faucet</h3>
          <label
            htmlFor='faucet-modal'
            className='btn btn-circle btn-ghost btn-sm absolute right-3 top-3'
          >
            ✕
          </label>
          <div className='space-y-3'>
            <div className='flex space-x-4'>
              <div>
                <span className='text-sm font-bold'>From:</span>
                <Address address={faucetAddress} />
              </div>
              <div>
                <span className='pl-3 text-sm font-bold'>Available:</span>
                <Balance address={faucetAddress} />
              </div>
            </div>
            <div className='flex flex-col space-y-3'>
              <AddressInput
                placeholder='Destination Address'
                value={inputAddress ?? ''}
                onChange={(value) => setInputAddress(value as AddressType)}
              />
              <EtherInput
                placeholder='Amount to send'
                value={sendValue}
                onChange={(value) => setSendValue(value)}
              />
              <button
                className='btn btn-primary btn-sm h-10 rounded-full px-2'
                onClick={sendETH}
                disabled={loading}
              >
                {!loading ? (
                  <BanknotesIcon className='h-6 w-6' />
                ) : (
                  <span className='loading loading-spinner loading-sm'></span>
                )}
                <span>Send</span>
              </button>
            </div>
          </div>
        </label>
      </label>
    </div>
  );
};
