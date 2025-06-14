import { ContractConfig } from "@shared/types";

export const MONAD_TESTNET_CONFIG: ContractConfig = {
  stakingContract: "0xbf20cc14264f15ce43d077c533992b5226feb807",
  maousldToken: "0x46148378a6Eb3D879F051398Cb2d4e428e991C3C",
  chainId: "0x6EE", // Monad Testnet Chain ID (1774)
  rpcUrl: "https://testnet1.monad.xyz", // Monad Testnet RPC
  explorerUrl: "https://testnet1.monadhq.com", // Monad Testnet Explorer
};

export const MONAD_TESTNET_PARAMS = {
  chainId: MONAD_TESTNET_CONFIG.chainId,
  chainName: "Monad Testnet",
  rpcUrls: [MONAD_TESTNET_CONFIG.rpcUrl],
  nativeCurrency: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
  blockExplorerUrls: [MONAD_TESTNET_CONFIG.explorerUrl],
};
