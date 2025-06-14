import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Copy, ExternalLink, Loader2 } from "lucide-react";
import { useStakingContract } from "@/hooks/use-staking-contract";
import { StakingStats } from "@shared/types";
import { MONAD_TESTNET_CONFIG } from "@/lib/web3-config";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

interface StatsSidebarProps {
  signer: ethers.JsonRpcSigner | null;
  provider: ethers.BrowserProvider | null;
  walletAddress: string;
  isConnected: boolean;
}

export function StatsSidebar({ signer, provider, walletAddress, isConnected }: StatsSidebarProps) {
  const [stats, setStats] = useState<StakingStats>({
    totalValueLocked: "0",
    currentAPY: "15.5",
    totalStakers: 0,
    userTotalStaked: "0",
    availableRewards: "0",
  });
  const { toast } = useToast();
  
  const {
    isTransacting,
    getStakingStats,
    getUserStakeInfo,
    claimRewards,
  } = useStakingContract(signer, provider);

  useEffect(() => {
    loadStats();
  }, [isConnected, walletAddress]);

  const loadStats = async () => {
    const stakingStats = await getStakingStats();
    
    if (isConnected && walletAddress) {
      console.log("Loading stats for connected wallet:", walletAddress);
      const userInfo = await getUserStakeInfo(walletAddress);
      console.log("User stake info from stats sidebar:", userInfo);
      
      stakingStats.userTotalStaked = userInfo.stakedAmount;
      stakingStats.availableRewards = userInfo.rewards;
      
      // If contract call fails, show demo data for testing
      if (userInfo.stakedAmount === "0" && userInfo.rewards === "0") {
        console.log("Contract data not available, using demo data for testing");
        stakingStats.userTotalStaked = "0"; // Keep as 0 until actual staking
        stakingStats.availableRewards = "0"; // Keep as 0 until actual rewards
      }
    }
    
    console.log("Final stats:", stakingStats);
    setStats(stakingStats);
  };

  const handleClaimAllRewards = async () => {
    if (!isConnected || parseFloat(stats.availableRewards) <= 0) return;
    
    const success = await claimRewards();
    if (success) {
      await loadStats();
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} address copied to clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Could not copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="space-y-6">
      {/* Network Status */}
      <div className="flex items-center justify-center">
        <Badge variant="secondary" className="px-3 py-1 bg-secondary/10 text-secondary">
          <div className="w-2 h-2 bg-secondary rounded-full animate-pulse-dot mr-2" />
          Monad Testnet
        </Badge>
      </div>

      {/* Stats Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Staking Stats</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Value Locked</span>
            <span className="font-semibold">${parseFloat(stats.totalValueLocked).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Current APY</span>
            <span className="font-semibold text-secondary">{stats.currentAPY}%</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Total Stakers</span>
            <span className="font-semibold">{stats.totalStakers.toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">My Total Staked</span>
            <span className="font-semibold text-primary">
              {parseFloat(stats.userTotalStaked).toFixed(4)} MON
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Card */}
      <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-lg font-bold">Available Rewards</CardTitle>
            <Gift className="w-5 h-5 text-secondary" />
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-secondary mb-2">
              {parseFloat(stats.availableRewards).toFixed(4)}
            </p>
            <p className="text-muted-foreground mb-4">MAOUSLD</p>
            
            <Button
              onClick={handleClaimAllRewards}
              disabled={!isConnected || isTransacting || parseFloat(stats.availableRewards) <= 0}
              className="w-full bg-secondary hover:bg-secondary/90 py-3 font-semibold"
            >
              {isTransacting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Claiming...
                </>
              ) : (
                "Claim All Rewards"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contract Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Contract Information</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Staking Contract</p>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {formatAddress(MONAD_TESTNET_CONFIG.stakingContract)}
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
                onClick={() => copyToClipboard(MONAD_TESTNET_CONFIG.stakingContract, "Staking contract")}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground mb-1">MAOUSLD Token</p>
            <div className="flex items-center space-x-2">
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                {formatAddress(MONAD_TESTNET_CONFIG.maousldToken)}
              </code>
              <Button
                size="sm"
                variant="ghost"
                className="p-1 h-auto"
                onClick={() => copyToClipboard(MONAD_TESTNET_CONFIG.maousldToken, "MAOUSLD token")}
              >
                <Copy className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <div className="pt-3 border-t">
            <Button
              variant="link"
              className="p-0 h-auto text-primary font-medium"
              onClick={() => window.open(`${MONAD_TESTNET_CONFIG.explorerUrl}/address/${MONAD_TESTNET_CONFIG.stakingContract}`, '_blank')}
            >
              <span>View on Block Explorer</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Help Card */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-6">
          <CardTitle className="text-lg font-bold text-blue-900 mb-3">Need Help?</CardTitle>
          <p className="text-blue-700 text-sm mb-4">
            Having trouble with wallet connection or staking? Check our troubleshooting guide.
          </p>
          <Button
            variant="link"
            className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium"
          >
            <span>View Guide</span>
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
