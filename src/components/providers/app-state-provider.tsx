"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { demoWallets } from "@/data/demo-platform";
import { DEMO_WALLET_ADDRESS } from "@/data/demo-transactions";
import type { DemoWallet } from "@/types/transactions";

interface AppStateContextValue {
  demoMode: boolean;
  isConnecting: boolean;
  isWalletConnected: boolean;
  walletAddress: string | null;
  walletError: string | null;
  displayWalletAddress: string;
  selectedWallet: DemoWallet;
  selectedWalletId: string;
  setSelectedWalletId: (value: string) => void;
  setDemoMode: (value: boolean) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  clearLocalData: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const demoModeStorageKey = "arcspend-demo-mode";
const walletStorageKey = "arcspend-wallet-address";
const selectedWalletStorageKey = "arcspend-selected-wallet";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedWalletId, setSelectedWalletId] = useState(demoWallets[0]?.id ?? "wallet-core");
  const [hasLoaded, setHasLoaded] = useState(false);
  const selectedWallet =
    demoWallets.find((wallet) => wallet.id === selectedWalletId) ?? demoWallets[0];

  useEffect(() => {
    // Hydrate client-only local preferences after mount to avoid server/client storage mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    const storedDemoMode = window.localStorage.getItem(demoModeStorageKey);
    const storedWalletAddress = window.localStorage.getItem(walletStorageKey);
    const storedSelectedWallet = window.localStorage.getItem(selectedWalletStorageKey);

    if (storedDemoMode !== null) {
      setDemoMode(storedDemoMode === "true");
    }

    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
    }

    if (storedSelectedWallet && demoWallets.some((wallet) => wallet.id === storedSelectedWallet)) {
      setSelectedWalletId(storedSelectedWallet);
    }

    setHasLoaded(true);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, []);

  useEffect(() => {
    if (!hasLoaded) {
      return;
    }

    window.localStorage.setItem(demoModeStorageKey, String(demoMode));

    if (walletAddress) {
      window.localStorage.setItem(walletStorageKey, walletAddress);
    } else {
      window.localStorage.removeItem(walletStorageKey);
    }

    window.localStorage.setItem(selectedWalletStorageKey, selectedWalletId);
  }, [demoMode, hasLoaded, selectedWalletId, walletAddress]);

  async function connectWallet() {
    if (typeof window === "undefined") {
      return;
    }

    if (!window.ethereum?.request) {
      setWalletError("No browser wallet was detected. Demo Data is still active.");
      return;
    }

    setIsConnecting(true);
    setWalletError(null);

    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts[0]) {
        setWalletAddress(accounts[0]);
      }
    } catch {
      setWalletError("Wallet connection was cancelled. You can keep exploring with Demo Data.");
    } finally {
      setIsConnecting(false);
    }
  }

  function disconnectWallet() {
    setWalletAddress(null);
  }

  function clearLocalData() {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(demoModeStorageKey);
      window.localStorage.removeItem(walletStorageKey);
      window.localStorage.removeItem(selectedWalletStorageKey);
    }

    setDemoMode(true);
    setWalletAddress(null);
    setWalletError(null);
    setSelectedWalletId(demoWallets[0]?.id ?? "wallet-core");
  }

  return (
    <AppStateContext.Provider
      value={{
        demoMode,
        isConnecting,
        isWalletConnected: Boolean(walletAddress),
        walletAddress,
        walletError,
        displayWalletAddress:
          walletAddress ?? selectedWallet?.address ?? DEMO_WALLET_ADDRESS,
        selectedWallet,
        selectedWalletId,
        setSelectedWalletId,
        setDemoMode,
        connectWallet,
        disconnectWallet,
        clearLocalData,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);

  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }

  return context;
}
