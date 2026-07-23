import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

interface AssetLoadingContextType {
  registerAsset: (id: string) => void;
  markAssetComplete: (id: string) => void;
  removeAsset: (id: string) => void;
}

const AssetLoadingContext = createContext<AssetLoadingContextType | null>(null);

export const useAssetLoading = () => {
  const context = useContext(AssetLoadingContext);
  return context;
};

export function AssetLoadingProvider({ 
  children, 
  onReadyChange 
}: { 
  children: React.ReactNode, 
  onReadyChange?: (ready: boolean, expected: number, completed: number) => void 
}) {
  const expectedAssetsRef = useRef<Set<string>>(new Set());
  const completedAssetsRef = useRef<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  const checkReadyState = useCallback(() => {
    const expected = expectedAssetsRef.current.size;
    const completed = completedAssetsRef.current.size;
    
    // We consider it ready if expected is 0 (no assets) or all expected are completed
    const isReady = expected === 0 || completed === expected;
    
    setReady(isReady);
    if (onReadyChange) {
      onReadyChange(isReady, expected, completed);
    }
  }, [onReadyChange]);

  const registerAsset = useCallback((id: string) => {
    expectedAssetsRef.current.add(id);
    checkReadyState();
  }, [checkReadyState]);

  const markAssetComplete = useCallback((id: string) => {
    completedAssetsRef.current.add(id);
    checkReadyState();
  }, [checkReadyState]);

  const removeAsset = useCallback((id: string) => {
    expectedAssetsRef.current.delete(id);
    completedAssetsRef.current.delete(id);
    checkReadyState();
  }, [checkReadyState]);

  return (
    <AssetLoadingContext.Provider value={{ registerAsset, markAssetComplete, removeAsset }}>
      {children}
    </AssetLoadingContext.Provider>
  );
}
