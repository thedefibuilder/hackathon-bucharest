export enum ERoutesName {
  home = 'Home',
  dashboard = 'Contracts',
  deployContract = 'New'
}

export enum ERoutesPath {
  home = '/',
  dashboard = '/contracts',
  deployContract = '/new/token/erc20'
}

export const routes = [
  {
    name: ERoutesName.home,
    path: ERoutesPath.home
  },
  {
    name: ERoutesName.dashboard,
    path: ERoutesPath.dashboard
  },
  {
    name: ERoutesName.deployContract,
    path: ERoutesPath.deployContract
  }
];
