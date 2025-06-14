import { useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { WalletState } from "@shared/types";
import { MONAD_TESTNET_CONFIG, MONAD_TESTNET_PARAMS } from "@/lib/web3-config";
import { useToast } from "@/hooks/use-toast";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export function useWeb3() {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    address: "",
    balance: "0",
  });
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const { toast } = useToast();

  const checkWalletConnection = useCallback(async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner();
          const address = await signer.getAddress();
          const balance = await provider.getBalance(address);
          
          setWalletState({
            isConnected: true,
            address,
            balance: ethers.formatEther(balance),
          });
          setProvider(provider);
          setSigner(signer);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  }, []);

  const switchToMonadTestnet = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: MONAD_TESTNET_CONFIG.chainId }],
      });
    } catch (switchError: any) {
      // Chain not added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [MONAD_TESTNET_PARAMS],
          });
        } catch (addError) {
          throw new Error("Failed to add Monad testnet to wallet");
        }
      } else {
        throw switchError;
      }
    }
  };

  const connectWallet = useCallback(async () => {
    if (typeof window.ethereum === "undefined") {
      toast({
        title: "MetaMask tidak ditemukan",
        description: "Silakan install MetaMask untuk menghubungkan wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      // Request account access
      await provider.send("eth_requestAccounts", []);
      
      // Switch to Monad testnet
      await switchToMonadTestnet();
      
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      
      // Request signature for authentication
      const message = `Selamat datang di MON Staking Platform!\n\nTandatangani pesan ini untuk mengautentikasi wallet Anda.\n\nWallet: ${address}\nTimestamp: ${Date.now()}`;
      
      await signer.signMessage(message);
      
      const balance = await provider.getBalance(address);
      
      setWalletState({
        isConnected: true,
        address,
        balance: ethers.formatEther(balance),
      });
      setProvider(provider);
      setSigner(signer);
      
      toast({
        title: "Wallet terhubung",
        description: "Berhasil menghubungkan wallet Anda!",
      });
    } catch (error: any) {
      console.error("Error connecting wallet:", error);
      let errorMessage = "Gagal menghubungkan wallet. Silakan coba lagi.";
      
      if (error.code === 4001) {
        errorMessage = "Koneksi dibatalkan oleh pengguna.";
      } else if (error.code === -32002) {
        errorMessage = "Request sudah tertunda. Silakan cek MetaMask Anda.";
      }
      
      toast({
        title: "Koneksi gagal",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [toast]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      isConnected: false,
      address: "",
      balance: "0",
    });
    setProvider(null);
    setSigner(null);
    
    toast({
      title: "Wallet disconnected",
      description: "Your wallet has been disconnected.",
    });
  }, [toast]);

  useEffect(() => {
    checkWalletConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else {
          checkWalletConnection();
        }
      };

      const handleChainChanged = () => {
        checkWalletConnection();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [checkWalletConnection, disconnectWallet]);

  return {
    walletState,
    provider,
    signer,
    connectWallet,
    disconnectWallet,
    switchToMonadTestnet,
  };
}
