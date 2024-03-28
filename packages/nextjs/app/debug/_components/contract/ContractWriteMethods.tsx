import { WriteOnlyFunctionForm } from '~~/app/debug/_components/contract';
import {
  Contract,
  ContractName,
  GenericContract,
  InheritedFunctions
} from '~~/utils/scaffold-eth/contract';
import { Abi, AbiFunction } from 'abitype';

export const ContractWriteMethods = ({
  onChange,
  deployedContractData
}: {
  onChange: () => void;
  deployedContractData: Contract<ContractName>;
}) => {
  if (!deployedContractData) {
    return null;
  }

  const functionsToDisplay = (
    (deployedContractData.abi as Abi).filter((part) => part.type === 'function') as AbiFunction[]
  )
    .filter((fn) => {
      return fn.stateMutability !== 'view' && fn.stateMutability !== 'pure';
    })
    .map((fn) => {
      return {
        fn,
        inheritedFrom: (
          (deployedContractData as GenericContract)?.inheritedFunctions as InheritedFunctions
        )?.[fn.name]
      };
    })
    .sort((a, b) => (b.inheritedFrom ? b.inheritedFrom.localeCompare(a.inheritedFrom) : 1));

  if (!functionsToDisplay.length) {
    return <>No write methods</>;
  }

  return (
    <>
      {functionsToDisplay.map(({ fn, inheritedFrom }, idx) => (
        <WriteOnlyFunctionForm
          abi={deployedContractData.abi as Abi}
          key={`${fn.name}-${idx}}`}
          abiFunction={fn}
          onChange={onChange}
          contractAddress={deployedContractData.address}
          inheritedFrom={inheritedFrom}
        />
      ))}
    </>
  );
};
