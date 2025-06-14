import { useState, useCallback } from "react";
import { ethers } from "ethers";
import { StakeInfo, StakingStats } from "@shared/types";
import { MONAD_TESTNET_CONFIG } from "@/lib/web3-config";
import { STAKING_ABI, ERC20_ABI } from "@/lib/contract-abi";
import { useToast } from "@/hooks/use-toast";

export function useStakingContract(signer: ethers.JsonRpcSigner | null, provider: ethers.BrowserProvider | null) {
  const [isTransacting, setIsTransacting] = useState(false);
  const { toast } = useToast();

  const getStakingContract = useCallback(() => {
    if (!signer) return null;
    return new ethers.Contract(MONAD_TESTNET_CONFIG.stakingContract, STAKING_ABI, signer);
  }, [signer]);

  const getTokenContract = useCallback((tokenAddress: string, withSigner = true) => {
    if (!provider) return null;
    const signerOrProvider = withSigner && signer ? signer : provider;
    return new ethers.Contract(tokenAddress, ERC20_ABI, signerOrProvider);
  }, [signer, provider]);

  const getMonBalance = useCallback(async (address: string): Promise<string> => {
    try {
      if (!provider) return "0";
      const balance = await provider.getBalance(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting MON balance:", error);
      return "0";
    }
  }, [provider]);

  const getMaousldBalance = useCallback(async (address: string): Promise<string> => {
    try {
      const tokenContract = getTokenContract(MONAD_TESTNET_CONFIG.maousldToken, false);
      if (!tokenContract) return "0";
      
      const balance = await tokenContract.balanceOf(address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error("Error getting MAOUSLD balance:", error);
      return "0";
    }
  }, [getTokenContract]);

  const getStakingStats = useCallback(async (): Promise<StakingStats> => {
    try {
      const contract = getStakingContract();
      if (!contract) {
        return {
          totalValueLocked: "0",
          currentAPY: "15.5",
          totalStakers: 0,
          userTotalStaked: "0",
          availableRewards: "0",
        };
      }

      // Mock implementation - replace with actual contract calls
      return {
        totalValueLocked: "125432",
        currentAPY: "15.5",
        totalStakers: 1247,
        userTotalStaked: "0",
        availableRewards: "0",
      };
    } catch (error) {
      console.error("Error getting staking stats:", error);
      return {
        totalValueLocked: "0",
        currentAPY: "0",
        totalStakers: 0,
        userTotalStaked: "0",
        availableRewards: "0",
      };
    }
  }, [getStakingContract]);

  const getUserStakeInfo = useCallback(async (address: string): Promise<{ stakedAmount: string; rewards: string }> => {
    try {
      const contract = getStakingContract();
      if (!contract) return { stakedAmount: "0", rewards: "0" };

      // Try multiple methods to get user stake info
      try {
        // First try getUserStakeInfo method
        const [stakedAmount, rewards] = await contract.getUserStakeInfo(address);
        return {
          stakedAmount: ethers.formatEther(stakedAmount),
          rewards: ethers.formatEther(rewards),
        };
      } catch (methodError) {
        console.log("getUserStakeInfo method failed:", methodError.message);
        
        // Try alternative methods
        try {
          const stakedAmount = await contract.userStakes(address);
          const rewards = await contract.pendingRewards(address);
          return {
            stakedAmount: ethers.formatEther(stakedAmount),
            rewards: ethers.formatEther(rewards),
          };
        } catch (fallbackError1) {
          console.log("userStakes method failed:", fallbackError1.message);
          
          // Try stakingBalance and rewardBalance methods
          try {
            const stakedAmount = await contract.stakingBalance(address);
            const rewards = await contract.rewardBalance(address);
            return {
              stakedAmount: ethers.formatEther(stakedAmount),
              rewards: ethers.formatEther(rewards),
            };
          } catch (fallbackError2) {
            console.log("stakingBalance method failed:", fallbackError2.message);
            
            // Try balanceOf method (if contract is ERC20-like)
            try {
              const stakedAmount = await contract.balanceOf(address);
              return {
                stakedAmount: ethers.formatEther(stakedAmount),
                rewards: "0",
              };
            } catch (finalError) {
              console.log("All methods failed, contract might not be deployed or accessible");
              return { stakedAmount: "0", rewards: "0" };
            }
          }
        }
      }
    } catch (error) {
      console.error("Error getting user stake info:", error);
      return { stakedAmount: "0", rewards: "0" };
    }
  }, [getStakingContract]);

  const stakeTokens = useCallback(async (amount: string): Promise<boolean> => {
    if (!signer) {
      toast({
        title: "Wallet belum terhubung",
        description: "Silakan hubungkan wallet Anda terlebih dahulu.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsTransacting(true);
      const contract = getStakingContract();
      if (!contract) throw new Error("Contract tidak tersedia");

      const amountWei = ethers.parseEther(amount);
      
      // Check if user has enough balance
      const userBalance = await provider?.getBalance(await signer.getAddress());
      if (userBalance && userBalance < amountWei) {
        throw new Error("Saldo MON tidak mencukupi");
      }
      
      // Call stake function with value (since MON is the native token)
      const tx = await contract.stake(amountWei, { 
        value: amountWei,
        gasLimit: ethers.parseUnits("200000", "wei") // Set gas limit
      });
      
      toast({
        title: "Transaksi dikirim",
        description: `Sedang melakukan staking ${amount} MON tokens...`,
      });

      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        toast({
          title: "Staking berhasil!",
          description: `Berhasil melakukan staking ${amount} MON tokens!`,
        });
        return true;
      } else {
        throw new Error("Transaksi gagal");
      }
    } catch (error: any) {
      console.error("Staking error:", error);
      let errorMessage = "Gagal melakukan staking. Silakan coba lagi.";
      
      if (error.code === 4001) {
        errorMessage = "Transaksi dibatalkan oleh pengguna.";
      } else if (error.message.includes("insufficient funds")) {
        errorMessage = "Saldo tidak mencukupi untuk gas fee.";
      } else if (error.message.includes("Saldo MON tidak mencukupi")) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Staking gagal",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTransacting(false);
    }
  }, [signer, provider, getStakingContract, toast]);

  const withdrawTokens = useCallback(async (amount: string): Promise<boolean> => {
    if (!signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsTransacting(true);
      const contract = getStakingContract();
      if (!contract) throw new Error("Contract not available");

      const amountWei = ethers.parseEther(amount);
      const tx = await contract.withdraw(amountWei);
      
      toast({
        title: "Transaction submitted",
        description: `Withdrawing ${amount} MON tokens...`,
      });

      await tx.wait();
      
      toast({
        title: "Withdrawal successful",
        description: `Successfully withdrew ${amount} MON tokens!`,
      });

      return true;
    } catch (error: any) {
      console.error("Withdrawal error:", error);
      toast({
        title: "Withdrawal failed",
        description: error.message || "Failed to withdraw tokens. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTransacting(false);
    }
  }, [signer, getStakingContract, toast]);

  const claimRewards = useCallback(async (): Promise<boolean> => {
    if (!signer) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet first.",
        variant: "destructive",
      });
      return false;
    }

    try {
      setIsTransacting(true);
      const contract = getStakingContract();
      if (!contract) throw new Error("Contract not available");

      const tx = await contract.claimRewards();
      
      toast({
        title: "Transaction submitted",
        description: "Claiming your MAOUSLD rewards...",
      });

      await tx.wait();
      
      toast({
        title: "Rewards claimed",
        description: "Successfully claimed your MAOUSLD rewards!",
      });

      return true;
    } catch (error: any) {
      console.error("Claim rewards error:", error);
      toast({
        title: "Claim failed",
        description: error.message || "Failed to claim rewards. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsTransacting(false);
    }
  }, [signer, getStakingContract, toast]);

  return {
    isTransacting,
    getMonBalance,
    getMaousldBalance,
    getStakingStats,
    getUserStakeInfo,
    stakeTokens,
    withdrawTokens,
    claimRewards,
  };
}
