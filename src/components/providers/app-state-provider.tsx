"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { DEMO_WALLET_ADDRESS } from "@/data/demo-transactions";

interface AppStateContextValue {
  demoMode: boolean;
  isConnecting: boolean;
  isWalletConnected: boolean;
  walletAddress: string | null;
  walletError: string | null;
  displayWalletAddress: string;
  setDemoMode: (value: boolean) => void;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  clearLocalData: () => void;
}

const AppStateContext = createContext<AppStateContextValue | undefined>(undefined);

const demoModeStorageKey = "arcspend-demo-mode";
const walletStorageKey = "arcspend-wallet-address";

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [demoMode, setDemoMode] = useState(true);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Hydrate client-only local preferences after mount to avoid server/client storage mismatch.
    /* eslint-disable react-hooks/set-state-in-effect */
    const storedDemoMode = window.localStorage.getItem(demoModeStorageKey);
    const storedWalletAddress = window.localStorage.getItem(walletStorageKey);

    if (storedDemoMode !== null) {
      setDemoMode(storedDemoMode === "true");
    }

    if (storedWalletAddress) {
      setWalletAddress(storedWalletAddress);
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
      return;
    }

    window.localStorage.removeItem(walletStorageKey);
  }, [demoMode, hasLoaded, walletAddress]);

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
    }

    setDemoMode(true);
    setWalletAddress(null);
    setWalletError(null);
  }

  return (
    <AppStateContext.Provider
      value={{
        demoMode,
        isConnecting,
        isWalletConnected: Boolean(walletAddress),
        walletAddress,
        walletError,
        displayWalletAddress: walletAddress ?? DEMO_WALLET_ADDRESS,
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
