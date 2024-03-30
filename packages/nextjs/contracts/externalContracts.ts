/* eslint-disable unicorn/numeric-separators-style */
import { GenericContractsDeclaration } from '~~/utils/scaffold-eth/contract';

/**
 * @example
 * const externalContracts = {
 *   1: {
 *     DAI: {
 *       address: "0x...",
 *       abi: [...],
 *     },
 *   },
 * } as const;
 */
const externalContracts = {
  'Arbitrum Sepolia': {
    sablierLockupLinear: {
      address: '0x483bdd560dE53DC20f72dC66ACdB622C5075de34',
      abi: []
    },
    sablierBatch: {
      address: '0x72D921E579aB7FC5D19CD398B6be24d626Ccb6e7',
      abi: []
    }
  },
  'Base Sepolia': {
    sablierLockupLinear: {
      address: '0xbd7AAA2984c0a887E93c66baae222749883763d3',
      abi: []
    },
    sablierBatch: {
      address: '0xbD636B8EF09760aC91f6Df3c6AC5531250420200',
      abi: []
    }
  }
} as const;
export default externalContracts satisfies GenericContractsDeclaration;
