export const erc20Tabs = {
  ai: '1 | AI',
  identity: '2 | Identity',
  tokenomics: '3 | Tokenomics',
  socials: '4 | Socials',
  review: '5 | Review'
} as const;

export type TTab = (typeof erc20Tabs)[keyof typeof erc20Tabs];
