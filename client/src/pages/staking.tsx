import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, User, AlertTriangle } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";
import { WalletModal } from "@/components/wallet-modal";
import { StakingInterface } from "@/components/staking-interface";
import { StatsSidebar } from "@/components/stats-sidebar";

export default function StakingPage() {
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showAlert, setShowAlert] = useState(true);
  
  const { walletState, provider, signer, connectWallet, disconnectWallet } = useWeb3();

  const handleWalletConnection = () => {
    if (walletState.isConnected) {
      disconnectWallet();
    } else {
      setShowWalletModal(true);
    }
  };

  const handleConnectWallet = async () => {
    setShowWalletModal(false);
    await connectWallet();
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">MON Staking</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={handleWalletConnection}
                className="flex items-center space-x-2"
              >
                {walletState.isConnected ? (
                  <>
                    <User className="w-4 h-4" />
                    <span>{formatAddress(walletState.address)}</span>
                  </>
                ) : (
                  <>
                    <Wallet className="w-4 h-4" />
                    <span>Connect Wallet</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Connection Status Alert */}
        {showAlert && !walletState.isConnected && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <AlertDescription className="text-yellow-800">
              Please connect your wallet and sign the transaction to continue.
              <Button
                variant="link"
                className="p-0 ml-2 h-auto text-yellow-800 underline"
                onClick={() => setShowAlert(false)}
              >
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Staking Interface */}
          <div className="lg:col-span-2">
            <StakingInterface
              signer={signer}
              provider={provider}
              walletAddress={walletState.address}
              isConnected={walletState.isConnected}
            />
          </div>

          {/* Stats Sidebar */}
          <div>
            <StatsSidebar
              signer={signer}
              provider={provider}
              walletAddress={walletState.address}
              isConnected={walletState.isConnected}
            />
          </div>
        </div>
      </main>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleConnectWallet}
      />
    </>
  );
}
