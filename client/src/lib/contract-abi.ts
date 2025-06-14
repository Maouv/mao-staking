// Basic ERC20 ABI for token interactions
export const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
] as const;

// Staking contract ABI untuk contract yang sudah di-deploy
export const STAKING_ABI = [
  "function stake(uint256 amount) external payable",
  "function withdraw(uint256 amount) external",
  "function claimRewards() external",
  "function getUserStakeInfo(address user) view returns (uint256 stakedAmount, uint256 rewards)",
  "function getStakingStats() view returns (uint256 totalStaked, uint256 apy, uint256 totalStakers)",
  "function userStakes(address) view returns (uint256)",
  "function pendingRewards(address) view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function totalSupply() view returns (uint256)",
  "function stakingBalance(address) view returns (uint256)",
  "function rewardBalance(address) view returns (uint256)",
  "event Staked(address indexed user, uint256 amount)",
  "event Withdrawn(address indexed user, uint256 amount)",
  "event RewardsClaimed(address indexed user, uint256 amount)",
] as const;
