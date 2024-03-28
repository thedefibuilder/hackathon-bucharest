import { useCallback } from 'react';

import { CommonInputProps, InputBase } from '~~/components/scaffold-eth';
import { bytesToString, isHex, toBytes, toHex } from 'viem';

export const BytesInput = ({ value, onChange, name, placeholder, disabled }: CommonInputProps) => {
  const convertStringToBytes = useCallback(() => {
    onChange(isHex(value) ? bytesToString(toBytes(value)) : toHex(toBytes(value)));
  }, [onChange, value]);

  return (
    <InputBase
      name={name}
      value={value}
      placeholder={placeholder}
      onChange={onChange}
      disabled={disabled}
      suffix={
        <div
          className='cursor-pointer self-center px-4 text-xl font-semibold text-accent'
          onClick={convertStringToBytes}
        >
          #
        </div>
      }
    />
  );
};
