export const erc20Tabs = {
  ai: '1 | AI',
  identity: '2 | Identity',
  tokenomics: '3 | Tokenomics',
  socials: '4 | Socials',
  review: '5 | Review'
} as const;

export const preSaleTabs = {
  offering: '1 | Offering',
  requirements: '2 | Requirements',
  vesting: '3 | Vesting',
  review: '4 | Review'
} as const;

export type TERC20Tab = (typeof erc20Tabs)[keyof typeof erc20Tabs];
export type TPreSaleTab = (typeof preSaleTabs)[keyof typeof preSaleTabs];
