export interface WalletState {
  isConnected: boolean;
  address: string;
  balance: string;
  chainId?: string;
}

export interface StakeInfo {
  id: string;
  amount: string;
  timestamp: number;
  rewards: string;
  isActive: boolean;
}

export interface StakingStats {
  totalValueLocked: string;
  currentAPY: string;
  totalStakers: number;
  userTotalStaked: string;
  availableRewards: string;
}

export interface ContractConfig {
  stakingContract: string;
  maousldToken: string;
  monToken?: string;
  chainId: string;
  rpcUrl: string;
  explorerUrl: string;
}
