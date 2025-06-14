import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Wallet, ExternalLink } from "lucide-react";

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: () => void;
}

export function WalletModal({ isOpen, onClose, onConnect }: WalletModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Connect Wallet</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 mt-4">
          <Button
            onClick={onConnect}
            className="w-full flex items-center justify-between p-4 h-auto border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 text-gray-900"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Fox.svg" 
                alt="MetaMask" 
                className="w-8 h-8"
              />
              <span className="font-medium">MetaMask</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </Button>
          
          <Button
            onClick={onConnect}
            className="w-full flex items-center justify-between p-4 h-auto border border-gray-200 bg-white hover:border-primary hover:bg-primary/5 text-gray-900"
            variant="outline"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium">WalletConnect</span>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </Button>
        </div>
        
        <p className="text-gray-500 text-xs mt-4 text-center">
          By connecting a wallet, you agree to our Terms of Service and Privacy Policy.
        </p>
      </DialogContent>
    </Dialog>
  );
}
