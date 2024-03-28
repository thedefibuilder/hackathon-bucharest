import { useCallback, useEffect, useState } from 'react';

import { CommonInputProps, InputBase, isENS } from '~~/components/scaffold-eth';
import { blo } from 'blo';
import { useDebounceValue } from 'usehooks-ts';
import { Address, isAddress } from 'viem';
import { useEnsAddress, useEnsAvatar, useEnsName } from 'wagmi';

/**
 * Address input with ENS name resolution
 */
export const AddressInput = ({
  value,
  name,
  placeholder,
  onChange,
  disabled
}: CommonInputProps<Address | string>) => {
  // Debounce the input to keep clean RPC calls when resolving ENS names
  // If the input is an address, we don't need to debounce it
  const [_debouncedValue] = useDebounceValue(value, 500);
  const debouncedValue = isAddress(value) ? value : _debouncedValue;
  const isDebouncedValueLive = debouncedValue === value;

  // If the user changes the input after an ENS name is already resolved, we want to remove the stale result
  const settledValue = isDebouncedValueLive ? debouncedValue : undefined;

  const {
    data: ensAddress,
    isLoading: isEnsAddressLoading,
    isError: isEnsAddressError,
    isSuccess: isEnsAddressSuccess
  } = useEnsAddress({
    name: settledValue,
    enabled: isDebouncedValueLive && isENS(debouncedValue),
    chainId: 1,
    cacheTime: 30_000
  });

  const [enteredEnsName, setEnteredEnsName] = useState<string>();
  const {
    data: ensName,
    isLoading: isEnsNameLoading,
    isError: isEnsNameError,
    isSuccess: isEnsNameSuccess
  } = useEnsName({
    address: settledValue as Address,
    enabled: isAddress(debouncedValue),
    chainId: 1,
    cacheTime: 30_000
  });

  const { data: ensAvatar, isLoading: isEnsAvtarLoading } = useEnsAvatar({
    name: ensName,
    enabled: Boolean(ensName),
    chainId: 1,
    cacheTime: 30_000
  });

  // ens => address
  useEffect(() => {
    if (!ensAddress) return;

    // ENS resolved successfully
    setEnteredEnsName(debouncedValue);
    onChange(ensAddress);
  }, [ensAddress, onChange, debouncedValue]);

  const handleChange = useCallback(
    (newValue: Address) => {
      setEnteredEnsName(undefined);
      onChange(newValue);
    },
    [onChange]
  );

  const reFocus =
    isEnsAddressError ||
    isEnsNameError ||
    isEnsNameSuccess ||
    isEnsAddressSuccess ||
    ensName === null ||
    ensAddress === null;

  return (
    <InputBase<Address>
      name={name}
      placeholder={placeholder}
      error={ensAddress === null}
      value={value as Address}
      onChange={handleChange}
      disabled={isEnsAddressLoading || isEnsNameLoading || disabled}
      reFocus={reFocus}
      prefix={
        ensName ? (
          <div className='flex items-center rounded-l-full bg-base-300'>
            {isEnsAvtarLoading && (
              <div className='skeleton h-[35px] w-[35px] shrink-0 rounded-full bg-base-200'></div>
            )}
            {ensAvatar ? (
              <span className='w-[35px]'>
                {
                  // eslint-disable-next-line
                  <img
                    className='w-full rounded-full'
                    src={ensAvatar}
                    alt={`${ensAddress} avatar`}
                  />
                }
              </span>
            ) : null}
            <span className='px-2 text-accent'>{enteredEnsName ?? ensName}</span>
          </div>
        ) : (
          (isEnsNameLoading || isEnsAddressLoading) && (
            <div className='flex items-center gap-2 rounded-l-full bg-base-300 pr-2'>
              <div className='skeleton h-[35px] w-[35px] shrink-0 rounded-full bg-base-200'></div>
              <div className='skeleton h-3 w-20 bg-base-200'></div>
            </div>
          )
        )
      }
      suffix={
        // Don't want to use nextJS Image here (and adding remote patterns for the URL)
        // eslint-disable-next-line @next/next/no-img-element
        value && (
          <img
            alt=''
            className='!rounded-full'
            src={blo(value as `0x${string}`)}
            width='35'
            height='35'
          />
        )
      }
    />
  );
};
