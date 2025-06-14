import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Loader2, Lock, ExternalLink } from "lucide-react";
import { useStakingContract } from "@/hooks/use-staking-contract";
import { ethers } from "ethers";

interface StakingInterfaceProps {
  signer: ethers.JsonRpcSigner | null;
  provider: ethers.BrowserProvider | null;
  walletAddress: string;
  isConnected: boolean;
}

export function StakingInterface({ signer, provider, walletAddress, isConnected }: StakingInterfaceProps) {
  const [stakeAmount, setStakeAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [monBalance, setMonBalance] = useState("0");
  const [userStakeInfo, setUserStakeInfo] = useState({ stakedAmount: "0", rewards: "0" });
  
  const {
    isTransacting,
    getMonBalance,
    getUserStakeInfo,
    stakeTokens,
    withdrawTokens,
    claimRewards,
  } = useStakingContract(signer, provider);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserData();
    }
  }, [isConnected, walletAddress]);

  const loadUserData = async () => {
    if (!walletAddress) return;
    
    console.log("Loading user data for address:", walletAddress);
    const balance = await getMonBalance(walletAddress);
    const stakeInfo = await getUserStakeInfo(walletAddress);
    
    console.log("MON Balance:", balance);
    console.log("Stake Info:", stakeInfo);
    
    setMonBalance(balance);
    setUserStakeInfo(stakeInfo);
  };

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConnected) {
      return;
    }
    
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      return;
    }
    
    const success = await stakeTokens(stakeAmount);
    if (success) {
      setStakeAmount("");
      await loadUserData();
    }
  };

  const handleUseMax = () => {
    setStakeAmount(monBalance);
  };

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      return;
    }
    
    if (parseFloat(withdrawAmount) > parseFloat(userStakeInfo.stakedAmount)) {
      return;
    }
    
    const success = await withdrawTokens(withdrawAmount);
    if (success) {
      setWithdrawAmount("");
      setShowWithdrawForm(false);
      await loadUserData();
    }
  };

  const handleWithdrawAll = async () => {
    if (parseFloat(userStakeInfo.stakedAmount) <= 0) return;
    
    const success = await withdrawTokens(userStakeInfo.stakedAmount);
    if (success) {
      await loadUserData();
    }
  };

  const handleUseMaxWithdraw = () => {
    setWithdrawAmount(userStakeInfo.stakedAmount);
  };

  const handleClaimRewards = async () => {
    if (parseFloat(userStakeInfo.rewards) <= 0) return;
    
    const success = await claimRewards();
    if (success) {
      await loadUserData();
    }
  };

  return (
    <div className="space-y-6">
      {/* Staking Form */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold">Stake MON Tokens</CardTitle>
          <p className="text-muted-foreground">Earn MAOUSLD rewards by staking your MON tokens</p>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleStake} className="space-y-6">
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Amount to Stake
              </Label>
              <div className="relative">
                <Input
                  type="number"
                  placeholder="0.0"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="text-lg pr-16"
                  disabled={!isConnected || isTransacting}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                  <span className="text-muted-foreground font-medium">MON</span>
                </div>
              </div>
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Balance: {parseFloat(monBalance).toFixed(4)} MON</span>
                <Button
                  type="button"
                  variant="link"
                  className="p-0 h-auto text-primary"
                  onClick={handleUseMax}
                  disabled={!isConnected}
                >
                  Use Max
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-lg font-semibold"
              disabled={!isConnected || isTransacting || !stakeAmount || parseFloat(stakeAmount) <= 0}
            >
              {isTransacting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 mr-2" />
                  Stake MON
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* My Stakes */}
      <Card>
        <CardHeader className="border-b">
          <CardTitle className="text-xl font-bold">My Stakes</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          {parseFloat(userStakeInfo.stakedAmount) > 0 ? (
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold text-gray-900">
                    {parseFloat(userStakeInfo.stakedAmount).toFixed(4)} MON Staked
                  </p>
                  <p className="text-sm text-muted-foreground">Active stake</p>
                </div>
                <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                  Active
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Rewards Earned</p>
                  <p className="font-semibold text-secondary">
                    {parseFloat(userStakeInfo.rewards).toFixed(4)} MAOUSLD
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">APY</p>
                  <p className="font-semibold">15.5%</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex space-x-3">
                  <Button
                    onClick={handleClaimRewards}
                    disabled={isTransacting || parseFloat(userStakeInfo.rewards) <= 0}
                    className="flex-1 bg-secondary hover:bg-secondary/90"
                  >
                    {isTransacting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : null}
                    Claim Rewards
                  </Button>
                  <Button
                    onClick={() => setShowWithdrawForm(!showWithdrawForm)}
                    disabled={isTransacting || parseFloat(userStakeInfo.stakedAmount) <= 0}
                    variant="outline"
                    className="flex-1"
                  >
                    Withdraw
                  </Button>
                </div>
                
                {showWithdrawForm && (
                  <form onSubmit={handleWithdraw} className="border rounded-lg p-4 bg-gray-50">
                    <Label className="text-sm font-medium mb-2 block">
                      Amount to Withdraw
                    </Label>
                    <div className="relative mb-3">
                      <Input
                        type="number"
                        placeholder="0.0"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="text-lg pr-16"
                        disabled={isTransacting}
                        max={userStakeInfo.stakedAmount}
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-muted-foreground font-medium">MON</span>
                      </div>
                    </div>
                    <div className="flex justify-between mb-3 text-sm text-muted-foreground">
                      <span>Staked: {parseFloat(userStakeInfo.stakedAmount).toFixed(4)} MON</span>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-primary"
                        onClick={handleUseMaxWithdraw}
                        disabled={isTransacting}
                      >
                        Use Max
                      </Button>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        type="submit"
                        disabled={isTransacting || !withdrawAmount || parseFloat(withdrawAmount) <= 0}
                        className="flex-1"
                      >
                        {isTransacting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Withdraw
                      </Button>
                      <Button
                        type="button"
                        onClick={handleWithdrawAll}
                        disabled={isTransacting || parseFloat(userStakeInfo.stakedAmount) <= 0}
                        variant="destructive"
                        className="flex-1"
                      >
                        {isTransacting ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : null}
                        Withdraw All
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Lock className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No active stakes found</p>
              <p className="text-muted-foreground/75 text-sm mt-1">
                Start staking MON tokens to earn MAOUSLD rewards
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
