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
    },
    sablierMerkle: {
      address: '0xcc87b1A4de285832f226BD585bd54a2184D32105',
      abi: [
        {
          type: 'function',
          name: 'createMerkleStreamerLL',
          inputs: [
            { name: 'initialAdmin', type: 'address', internalType: 'address' },
            {
              name: 'lockupLinear',
              type: 'address',
              internalType: 'contract ISablierV2LockupLinear'
            },
            { name: 'asset', type: 'address', internalType: 'contract IERC20' },
            { name: 'merkleRoot', type: 'bytes32', internalType: 'bytes32' },
            { name: 'expiration', type: 'uint40', internalType: 'uint40' },
            {
              name: 'streamDurations',
              type: 'tuple',
              internalType: 'struct LockupLinear.Durations',
              components: [
                { name: 'cliff', type: 'uint40', internalType: 'uint40' },
                { name: 'total', type: 'uint40', internalType: 'uint40' }
              ]
            },
            { name: 'cancelable', type: 'bool', internalType: 'bool' },
            { name: 'transferable', type: 'bool', internalType: 'bool' },
            { name: 'ipfsCID', type: 'string', internalType: 'string' },
            { name: 'aggregateAmount', type: 'uint256', internalType: 'uint256' },
            { name: 'recipientsCount', type: 'uint256', internalType: 'uint256' }
          ],
          outputs: [
            {
              name: 'merkleStreamerLL',
              type: 'address',
              internalType: 'contract ISablierV2MerkleStreamerLL'
            }
          ],
          stateMutability: 'nonpayable'
        },
        {
          type: 'event',
          name: 'CreateMerkleStreamerLL',
          inputs: [
            {
              name: 'merkleStreamer',
              type: 'address',
              indexed: false,
              internalType: 'contract ISablierV2MerkleStreamerLL'
            },
            { name: 'admin', type: 'address', indexed: true, internalType: 'address' },
            {
              name: 'lockupLinear',
              type: 'address',
              indexed: true,
              internalType: 'contract ISablierV2LockupLinear'
            },
            { name: 'asset', type: 'address', indexed: true, internalType: 'contract IERC20' },
            { name: 'merkleRoot', type: 'bytes32', indexed: false, internalType: 'bytes32' },
            { name: 'expiration', type: 'uint40', indexed: false, internalType: 'uint40' },
            {
              name: 'streamDurations',
              type: 'tuple',
              indexed: false,
              internalType: 'struct LockupLinear.Durations',
              components: [
                { name: 'cliff', type: 'uint40', internalType: 'uint40' },
                { name: 'total', type: 'uint40', internalType: 'uint40' }
              ]
            },
            { name: 'cancelable', type: 'bool', indexed: false, internalType: 'bool' },
            { name: 'transferable', type: 'bool', indexed: false, internalType: 'bool' },
            { name: 'ipfsCID', type: 'string', indexed: false, internalType: 'string' },
            { name: 'aggregateAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'recipientsCount', type: 'uint256', indexed: false, internalType: 'uint256' }
          ],
          anonymous: false
        }
      ]
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
    },
    sablierMerkle: {
      address: '0xf632521bbAb0dBC2bEf169865e6c8e285AFe0a42',
      abi: [
        {
          type: 'function',
          name: 'createMerkleStreamerLL',
          inputs: [
            { name: 'initialAdmin', type: 'address', internalType: 'address' },
            {
              name: 'lockupLinear',
              type: 'address',
              internalType: 'contract ISablierV2LockupLinear'
            },
            { name: 'asset', type: 'address', internalType: 'contract IERC20' },
            { name: 'merkleRoot', type: 'bytes32', internalType: 'bytes32' },
            { name: 'expiration', type: 'uint40', internalType: 'uint40' },
            {
              name: 'streamDurations',
              type: 'tuple',
              internalType: 'struct LockupLinear.Durations',
              components: [
                { name: 'cliff', type: 'uint40', internalType: 'uint40' },
                { name: 'total', type: 'uint40', internalType: 'uint40' }
              ]
            },
            { name: 'cancelable', type: 'bool', internalType: 'bool' },
            { name: 'transferable', type: 'bool', internalType: 'bool' },
            { name: 'ipfsCID', type: 'string', internalType: 'string' },
            { name: 'aggregateAmount', type: 'uint256', internalType: 'uint256' },
            { name: 'recipientsCount', type: 'uint256', internalType: 'uint256' }
          ],
          outputs: [
            {
              name: 'merkleStreamerLL',
              type: 'address',
              internalType: 'contract ISablierV2MerkleStreamerLL'
            }
          ],
          stateMutability: 'nonpayable'
        },
        {
          type: 'event',
          name: 'CreateMerkleStreamerLL',
          inputs: [
            {
              name: 'merkleStreamer',
              type: 'address',
              indexed: false,
              internalType: 'contract ISablierV2MerkleStreamerLL'
            },
            { name: 'admin', type: 'address', indexed: true, internalType: 'address' },
            {
              name: 'lockupLinear',
              type: 'address',
              indexed: true,
              internalType: 'contract ISablierV2LockupLinear'
            },
            { name: 'asset', type: 'address', indexed: true, internalType: 'contract IERC20' },
            { name: 'merkleRoot', type: 'bytes32', indexed: false, internalType: 'bytes32' },
            { name: 'expiration', type: 'uint40', indexed: false, internalType: 'uint40' },
            {
              name: 'streamDurations',
              type: 'tuple',
              indexed: false,
              internalType: 'struct LockupLinear.Durations',
              components: [
                { name: 'cliff', type: 'uint40', internalType: 'uint40' },
                { name: 'total', type: 'uint40', internalType: 'uint40' }
              ]
            },
            { name: 'cancelable', type: 'bool', indexed: false, internalType: 'bool' },
            { name: 'transferable', type: 'bool', indexed: false, internalType: 'bool' },
            { name: 'ipfsCID', type: 'string', indexed: false, internalType: 'string' },
            { name: 'aggregateAmount', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'recipientsCount', type: 'uint256', indexed: false, internalType: 'uint256' }
          ],
          anonymous: false
        }
      ]
    }
  }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
