'use client';

import { useEffect } from 'react';

import { BarsArrowUpIcon } from '@heroicons/react/20/solid';
import { ContractUI } from '~~/app/debug/_components/contract';
import { ContractName } from '~~/utils/scaffold-eth/contract';
import { getAllContracts } from '~~/utils/scaffold-eth/contractsData';
import { useLocalStorage } from 'usehooks-ts';

const selectedContractStorageKey = 'scaffoldEth2.selectedContract';
const contractsData = getAllContracts();
const contractNames = Object.keys(contractsData) as ContractName[];

export function DebugContracts() {
  const [selectedContract, setSelectedContract] = useLocalStorage<ContractName>(
    selectedContractStorageKey,
    contractNames[0],
    { initializeWithValue: false }
  );

  useEffect(() => {
    if (!contractNames.includes(selectedContract)) {
      setSelectedContract(contractNames[0]);
    }
  }, [selectedContract, setSelectedContract]);

  return (
    <div className='flex flex-col items-center justify-center gap-y-6 py-8 lg:gap-y-8 lg:py-12'>
      {contractNames.length === 0 ? (
        <p className='mt-14 text-3xl'>No contracts found!</p>
      ) : (
        <>
          {contractNames.length > 1 && (
            <div className='flex w-full max-w-7xl flex-row flex-wrap gap-2 px-6 pb-1 lg:px-10'>
              {contractNames.map((contractName) => (
                <button
                  className={`btn btn-secondary btn-sm font-light hover:border-transparent ${
                    contractName === selectedContract
                      ? 'no-animation bg-base-300 hover:bg-base-300'
                      : 'bg-base-100 hover:bg-secondary'
                  }`}
                  key={contractName}
                  onClick={() => setSelectedContract(contractName)}
                >
                  {contractName}
                  {contractsData[contractName].external && (
                    <span
                      className='tooltip tooltip-top tooltip-accent'
                      data-tip='External contract'
                    >
                      <BarsArrowUpIcon className='h-4 w-4 cursor-pointer' />
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
          {contractNames.map((contractName) => (
            <ContractUI
              key={contractName}
              contractName={contractName}
              className={contractName === selectedContract ? '' : 'hidden'}
            />
          ))}
        </>
      )}
    </div>
  );
}
