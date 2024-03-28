import { Address } from '~~/components/scaffold-eth';
import { useTargetNetwork } from '~~/hooks/scaffold-eth/useTargetNetwork';
import { TransactionWithFunction } from '~~/utils/scaffold-eth';
import { TransactionsTableProps } from '~~/utils/scaffold-eth/';
import { formatEther } from 'viem';

import { TransactionHash } from './TransactionHash';

export const TransactionsTable = ({ blocks, transactionReceipts }: TransactionsTableProps) => {
  const { targetNetwork } = useTargetNetwork();

  return (
    <div className='flex justify-center px-4 md:px-0'>
      <div className='w-full overflow-x-auto rounded-xl shadow-2xl'>
        <table className='table table-zebra table-sm w-full bg-base-100 text-xl md:table-md'>
          <thead>
            <tr className='rounded-xl text-sm text-base-content'>
              <th className='bg-primary'>Transaction Hash</th>
              <th className='bg-primary'>Function Called</th>
              <th className='bg-primary'>Block Number</th>
              <th className='bg-primary'>Time Mined</th>
              <th className='bg-primary'>From</th>
              <th className='bg-primary'>To</th>
              <th className='bg-primary text-end'>Value ({targetNetwork.nativeCurrency.symbol})</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((block) =>
              (block.transactions as TransactionWithFunction[]).map((tx) => {
                const receipt = transactionReceipts[tx.hash];
                const timeMined = new Date(Number(block.timestamp) * 1000).toLocaleString();
                const functionCalled = tx.input.substring(0, 10);

                return (
                  <tr key={tx.hash} className='hover text-sm'>
                    <td className='w-1/12 md:py-4'>
                      <TransactionHash hash={tx.hash} />
                    </td>
                    <td className='w-2/12 md:py-4'>
                      {tx.functionName === '0x' ? (
                        ''
                      ) : (
                        <span className='mr-1'>{tx.functionName}</span>
                      )}
                      {functionCalled !== '0x' && (
                        <span className='badge badge-primary text-xs font-bold'>
                          {functionCalled}
                        </span>
                      )}
                    </td>
                    <td className='w-1/12 md:py-4'>{block.number?.toString()}</td>
                    <td className='w-2/1 md:py-4'>{timeMined}</td>
                    <td className='w-2/12 md:py-4'>
                      <Address address={tx.from} size='sm' />
                    </td>
                    <td className='w-2/12 md:py-4'>
                      {!receipt?.contractAddress ? (
                        tx.to && <Address address={tx.to} size='sm' />
                      ) : (
                        <div className='relative'>
                          <Address address={receipt.contractAddress} size='sm' />
                          <small className='absolute left-4 top-4'>(Contract Creation)</small>
                        </div>
                      )}
                    </td>
                    <td className='text-right md:py-4'>
                      {formatEther(tx.value)} {targetNetwork.nativeCurrency.symbol}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
