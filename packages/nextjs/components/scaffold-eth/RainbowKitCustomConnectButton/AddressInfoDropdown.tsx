import { useRef, useState } from 'react';

import {
  ArrowLeftOnRectangleIcon,
  ArrowsRightLeftIcon,
  ArrowTopRightOnSquareIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  DocumentDuplicateIcon,
  QrCodeIcon
} from '@heroicons/react/24/outline';
import { BlockieAvatar, isENS } from '~~/components/scaffold-eth';
import { useOutsideClick } from '~~/hooks/scaffold-eth';
import { getTargetNetworks } from '~~/utils/scaffold-eth';
import CopyToClipboard from 'react-copy-to-clipboard';
import { getAddress } from 'viem';
import { Address, useDisconnect } from 'wagmi';

import { NetworkOptions } from './NetworkOptions';

const allowedNetworks = getTargetNetworks();

type AddressInfoDropdownProps = {
  address: Address;
  blockExplorerAddressLink: string | undefined;
  displayName: string;
  ensAvatar?: string;
};

export const AddressInfoDropdown = ({
  address,
  ensAvatar,
  displayName,
  blockExplorerAddressLink
}: AddressInfoDropdownProps) => {
  const { disconnect } = useDisconnect();
  const checkSumAddress = getAddress(address);

  const [addressCopied, setAddressCopied] = useState(false);

  const [selectingNetwork, setSelectingNetwork] = useState(false);
  const dropdownRef = useRef<HTMLDetailsElement>(null);
  const closeDropdown = () => {
    setSelectingNetwork(false);
    dropdownRef.current?.removeAttribute('open');
  };
  useOutsideClick(dropdownRef, closeDropdown);

  return (
    <>
      <details ref={dropdownRef} className='dropdown dropdown-end leading-3'>
        <summary
          tabIndex={0}
          className='dropdown-toggle btn btn-secondary btn-sm !h-auto gap-0 pl-0 pr-2 shadow-md'
        >
          <BlockieAvatar address={checkSumAddress} size={30} ensImage={ensAvatar} />
          <span className='ml-2 mr-1'>
            {isENS(displayName)
              ? displayName
              : checkSumAddress?.slice(0, 6) + '...' + checkSumAddress?.slice(-4)}
          </span>
          <ChevronDownIcon className='ml-2 h-6 w-4 sm:ml-0' />
        </summary>
        <ul
          tabIndex={0}
          className='menu dropdown-content z-[2] mt-2 gap-1 rounded-box bg-base-200 p-2 shadow-center shadow-accent'
        >
          <NetworkOptions hidden={!selectingNetwork} />
          <li className={selectingNetwork ? 'hidden' : ''}>
            {addressCopied ? (
              <div className='btn-sm flex gap-3 !rounded-xl py-3'>
                <CheckCircleIcon
                  className='ml-2 h-6 w-4 cursor-pointer text-xl font-normal sm:ml-0'
                  aria-hidden='true'
                />
                <span className=' whitespace-nowrap'>Copy address</span>
              </div>
            ) : (
              <CopyToClipboard
                text={checkSumAddress}
                onCopy={() => {
                  setAddressCopied(true);
                  setTimeout(() => {
                    setAddressCopied(false);
                  }, 800);
                }}
              >
                <div className='btn-sm flex gap-3 !rounded-xl py-3'>
                  <DocumentDuplicateIcon
                    className='ml-2 h-6 w-4 cursor-pointer text-xl font-normal sm:ml-0'
                    aria-hidden='true'
                  />
                  <span className=' whitespace-nowrap'>Copy address</span>
                </div>
              </CopyToClipboard>
            )}
          </li>
          <li className={selectingNetwork ? 'hidden' : ''}>
            <label htmlFor='qrcode-modal' className='btn-sm flex gap-3 !rounded-xl py-3'>
              <QrCodeIcon className='ml-2 h-6 w-4 sm:ml-0' />
              <span className='whitespace-nowrap'>View QR Code</span>
            </label>
          </li>
          <li className={selectingNetwork ? 'hidden' : ''}>
            <button className='menu-item btn-sm flex gap-3 !rounded-xl py-3' type='button'>
              <ArrowTopRightOnSquareIcon className='ml-2 h-6 w-4 sm:ml-0' />
              <a
                target='_blank'
                href={blockExplorerAddressLink}
                rel='noopener noreferrer'
                className='whitespace-nowrap'
              >
                View on Block Explorer
              </a>
            </button>
          </li>
          {allowedNetworks.length > 1 ? (
            <li className={selectingNetwork ? 'hidden' : ''}>
              <button
                className='btn-sm flex gap-3 !rounded-xl py-3'
                type='button'
                onClick={() => {
                  setSelectingNetwork(true);
                }}
              >
                <ArrowsRightLeftIcon className='ml-2 h-6 w-4 sm:ml-0' /> <span>Switch Network</span>
              </button>
            </li>
          ) : null}
          <li className={selectingNetwork ? 'hidden' : ''}>
            <button
              className='menu-item btn-sm flex gap-3 !rounded-xl py-3 text-error'
              type='button'
              onClick={() => disconnect()}
            >
              <ArrowLeftOnRectangleIcon className='ml-2 h-6 w-4 sm:ml-0' /> <span>Disconnect</span>
            </button>
          </li>
        </ul>
      </details>
    </>
  );
};
