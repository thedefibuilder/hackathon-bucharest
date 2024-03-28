'use client';

import { useState } from 'react';

import {
  ContractInput,
  displayTxResult,
  getFunctionInputKey,
  getInitialFormState,
  getParsedContractFunctionArgs,
  transformAbiFunction
} from '~~/app/debug/_components/contract';
import { getParsedError, notification } from '~~/utils/scaffold-eth';
import { Abi, AbiFunction } from 'abitype';
import { Address } from 'viem';
import { useContractRead } from 'wagmi';

import { InheritanceTooltip } from './InheritanceTooltip';

type ReadOnlyFunctionFormProps = {
  contractAddress: Address;
  abiFunction: AbiFunction;
  inheritedFrom?: string;
  abi: Abi;
};

export const ReadOnlyFunctionForm = ({
  contractAddress,
  abiFunction,
  inheritedFrom,
  abi
}: ReadOnlyFunctionFormProps) => {
  const [form, setForm] = useState<Record<string, any>>(() => getInitialFormState(abiFunction));
  const [result, setResult] = useState<unknown>();

  const { isFetching, refetch } = useContractRead({
    address: contractAddress,
    functionName: abiFunction.name,
    abi: abi,
    args: getParsedContractFunctionArgs(form),
    enabled: false,
    onError: (error: any) => {
      const parsedErrror = getParsedError(error);
      notification.error(parsedErrror);
    }
  });

  const transformedFunction = transformAbiFunction(abiFunction);
  const inputElements = transformedFunction.inputs.map((input, inputIndex) => {
    const key = getFunctionInputKey(abiFunction.name, input, inputIndex);
    return (
      <ContractInput
        key={key}
        setForm={(updatedFormValue) => {
          setResult(undefined);
          setForm(updatedFormValue);
        }}
        form={form}
        stateObjectKey={key}
        paramType={input}
      />
    );
  });

  return (
    <div className='flex flex-col gap-3 py-5 first:pt-0 last:pb-1'>
      <p className='my-0 break-words font-medium'>
        {abiFunction.name}
        <InheritanceTooltip inheritedFrom={inheritedFrom} />
      </p>
      {inputElements}
      <div className='flex flex-wrap justify-between gap-2'>
        <div className='w-4/5 flex-grow'>
          {result !== null && result !== undefined && (
            <div className='break-words rounded-3xl bg-secondary px-4 py-1.5 text-sm'>
              <p className='m-0 mb-1 font-bold'>Result:</p>
              <pre className='whitespace-pre-wrap break-words'>{displayTxResult(result)}</pre>
            </div>
          )}
        </div>
        <button
          className='btn btn-secondary btn-sm'
          onClick={async () => {
            const { data } = await refetch();
            setResult(data);
          }}
          disabled={isFetching}
        >
          {isFetching && <span className='loading loading-spinner loading-xs'></span>}
          Read 📡
        </button>
      </div>
    </div>
  );
};
