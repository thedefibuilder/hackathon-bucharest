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
          type: 'constructor',
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
              name: 'streamDurations_',
              type: 'tuple',
              internalType: 'struct LockupLinear.Durations',
              components: [
                { name: 'cliff', type: 'uint40', internalType: 'uint40' },
                { name: 'total', type: 'uint40', internalType: 'uint40' }
              ]
            },
            { name: 'cancelable', type: 'bool', internalType: 'bool' },
            { name: 'transferable', type: 'bool', internalType: 'bool' }
          ],
          stateMutability: 'nonpayable'
        },
        {
          type: 'function',
          name: 'ASSET',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'CANCELABLE',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'EXPIRATION',
          inputs: [],
          outputs: [{ name: '', type: 'uint40', internalType: 'uint40' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'LOCKUP',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract ISablierV2Lockup' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'LOCKUP_LINEAR',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract ISablierV2LockupLinear' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'MERKLE_ROOT',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'TRANSFERABLE',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'admin',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'claim',
          inputs: [
            { name: 'index', type: 'uint256', internalType: 'uint256' },
            { name: 'recipient', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint128', internalType: 'uint128' },
            { name: 'merkleProof', type: 'bytes32[]', internalType: 'bytes32[]' }
          ],
          outputs: [{ name: 'streamId', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'nonpayable'
        },
        {
          type: 'function',
          name: 'clawback',
          inputs: [
            { name: 'to', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint128', internalType: 'uint128' }
          ],
          outputs: [],
          stateMutability: 'nonpayable'
        },
        {
          type: 'function',
          name: 'hasClaimed',
          inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'hasExpired',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'streamDurations',
          inputs: [],
          outputs: [
            { name: 'cliff', type: 'uint40', internalType: 'uint40' },
            { name: 'total', type: 'uint40', internalType: 'uint40' }
          ],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'transferAdmin',
          inputs: [{ name: 'newAdmin', type: 'address', internalType: 'address' }],
          outputs: [],
          stateMutability: 'nonpayable'
        },
        {
          type: 'event',
          name: 'Claim',
          inputs: [
            { name: 'index', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'recipient', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint128', indexed: false, internalType: 'uint128' },
            { name: 'streamId', type: 'uint256', indexed: true, internalType: 'uint256' }
          ],
          anonymous: false
        },
        {
          type: 'event',
          name: 'Clawback',
          inputs: [
            { name: 'admin', type: 'address', indexed: true, internalType: 'address' },
            { name: 'to', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint128', indexed: false, internalType: 'uint128' }
          ],
          anonymous: false
        },
        {
          type: 'event',
          name: 'TransferAdmin',
          inputs: [
            { name: 'oldAdmin', type: 'address', indexed: true, internalType: 'address' },
            { name: 'newAdmin', type: 'address', indexed: true, internalType: 'address' }
          ],
          anonymous: false
        },
        {
          type: 'error',
          name: 'CallerNotAdmin',
          inputs: [
            { name: 'admin', type: 'address', internalType: 'address' },
            { name: 'caller', type: 'address', internalType: 'address' }
          ]
        },
        {
          type: 'error',
          name: 'SablierV2MerkleStreamer_CampaignExpired',
          inputs: [
            { name: 'currentTime', type: 'uint256', internalType: 'uint256' },
            { name: 'expiration', type: 'uint40', internalType: 'uint40' }
          ]
        },
        {
          type: 'error',
          name: 'SablierV2MerkleStreamer_CampaignNotExpired',
          inputs: [
            { name: 'currentTime', type: 'uint256', internalType: 'uint256' },
            { name: 'expiration', type: 'uint40', internalType: 'uint40' }
          ]
        },
        { type: 'error', name: 'SablierV2MerkleStreamer_InvalidProof', inputs: [] },
        { type: 'error', name: 'SablierV2MerkleStreamer_ProtocolFeeNotZero', inputs: [] },
        {
          type: 'error',
          name: 'SablierV2MerkleStreamer_StreamClaimed',
          inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }]
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
          type: 'constructor',
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
              name: 'streamDurations_',
              type: 'tuple',
              internalType: 'struct LockupLinear.Durations',
              components: [
                { name: 'cliff', type: 'uint40', internalType: 'uint40' },
                { name: 'total', type: 'uint40', internalType: 'uint40' }
              ]
            },
            { name: 'cancelable', type: 'bool', internalType: 'bool' },
            { name: 'transferable', type: 'bool', internalType: 'bool' }
          ],
          stateMutability: 'nonpayable'
        },
        {
          type: 'function',
          name: 'ASSET',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract IERC20' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'CANCELABLE',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'EXPIRATION',
          inputs: [],
          outputs: [{ name: '', type: 'uint40', internalType: 'uint40' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'LOCKUP',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract ISablierV2Lockup' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'LOCKUP_LINEAR',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'contract ISablierV2LockupLinear' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'MERKLE_ROOT',
          inputs: [],
          outputs: [{ name: '', type: 'bytes32', internalType: 'bytes32' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'TRANSFERABLE',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'admin',
          inputs: [],
          outputs: [{ name: '', type: 'address', internalType: 'address' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'claim',
          inputs: [
            { name: 'index', type: 'uint256', internalType: 'uint256' },
            { name: 'recipient', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint128', internalType: 'uint128' },
            { name: 'merkleProof', type: 'bytes32[]', internalType: 'bytes32[]' }
          ],
          outputs: [{ name: 'streamId', type: 'uint256', internalType: 'uint256' }],
          stateMutability: 'nonpayable'
        },
        {
          type: 'function',
          name: 'clawback',
          inputs: [
            { name: 'to', type: 'address', internalType: 'address' },
            { name: 'amount', type: 'uint128', internalType: 'uint128' }
          ],
          outputs: [],
          stateMutability: 'nonpayable'
        },
        {
          type: 'function',
          name: 'hasClaimed',
          inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'hasExpired',
          inputs: [],
          outputs: [{ name: '', type: 'bool', internalType: 'bool' }],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'streamDurations',
          inputs: [],
          outputs: [
            { name: 'cliff', type: 'uint40', internalType: 'uint40' },
            { name: 'total', type: 'uint40', internalType: 'uint40' }
          ],
          stateMutability: 'view'
        },
        {
          type: 'function',
          name: 'transferAdmin',
          inputs: [{ name: 'newAdmin', type: 'address', internalType: 'address' }],
          outputs: [],
          stateMutability: 'nonpayable'
        },
        {
          type: 'event',
          name: 'Claim',
          inputs: [
            { name: 'index', type: 'uint256', indexed: false, internalType: 'uint256' },
            { name: 'recipient', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint128', indexed: false, internalType: 'uint128' },
            { name: 'streamId', type: 'uint256', indexed: true, internalType: 'uint256' }
          ],
          anonymous: false
        },
        {
          type: 'event',
          name: 'Clawback',
          inputs: [
            { name: 'admin', type: 'address', indexed: true, internalType: 'address' },
            { name: 'to', type: 'address', indexed: true, internalType: 'address' },
            { name: 'amount', type: 'uint128', indexed: false, internalType: 'uint128' }
          ],
          anonymous: false
        },
        {
          type: 'event',
          name: 'TransferAdmin',
          inputs: [
            { name: 'oldAdmin', type: 'address', indexed: true, internalType: 'address' },
            { name: 'newAdmin', type: 'address', indexed: true, internalType: 'address' }
          ],
          anonymous: false
        },
        {
          type: 'error',
          name: 'CallerNotAdmin',
          inputs: [
            { name: 'admin', type: 'address', internalType: 'address' },
            { name: 'caller', type: 'address', internalType: 'address' }
          ]
        },
        {
          type: 'error',
          name: 'SablierV2MerkleStreamer_CampaignExpired',
          inputs: [
            { name: 'currentTime', type: 'uint256', internalType: 'uint256' },
            { name: 'expiration', type: 'uint40', internalType: 'uint40' }
          ]
        },
        {
          type: 'error',
          name: 'SablierV2MerkleStreamer_CampaignNotExpired',
          inputs: [
            { name: 'currentTime', type: 'uint256', internalType: 'uint256' },
            { name: 'expiration', type: 'uint40', internalType: 'uint40' }
          ]
        },
        { type: 'error', name: 'SablierV2MerkleStreamer_InvalidProof', inputs: [] },
        { type: 'error', name: 'SablierV2MerkleStreamer_ProtocolFeeNotZero', inputs: [] },
        {
          type: 'error',
          name: 'SablierV2MerkleStreamer_StreamClaimed',
          inputs: [{ name: 'index', type: 'uint256', internalType: 'uint256' }]
        }
      ]
    }
  }
} as const;

export default externalContracts satisfies GenericContractsDeclaration;
