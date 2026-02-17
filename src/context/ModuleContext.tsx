import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useMemo, useState } from 'react';
import { auth } from '../services/firebase';
import { useAuth } from './AuthContext';
import type { ModuleId } from '../types/index.d.ts';
import type { ModuleId } from '../types/index.d.ts';

interface ModuleContextValue {
  activeModule: ModuleId;
  setActiveModule: (moduleId: ModuleId) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  userId: string | null;
  historyCount: number;
  setHistoryCount: (count: number) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: Dispatch<SetStateAction<boolean>>;
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
  overlay: ReactNode | null;
  openOverlay: (node: ReactNode) => void;
  closeOverlay: () => void;
}

const ModuleContext = createContext<ModuleContextValue | undefined>(undefined);

export function ModuleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleId>('overview');
  const [loading, setLoading] = useState(false);
  const [historyCount, setHistoryCount] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [overlay, setOverlay] = useState<ReactNode | null>(null);

  const userId = auth.currentUser?.uid ?? user?.uid ?? null;

  const value = useMemo(
    () => ({
      activeModule,
      setActiveModule,
      loading,
      setLoading,
      userId,
      historyCount,
      setHistoryCount,
      sidebarCollapsed,
      setSidebarCollapsed,
      sidebarOpen,
      setSidebarOpen,
      overlay,
      openOverlay: (node: ReactNode) => setOverlay(node),
      closeOverlay: () => setOverlay(null)
    }),
    [activeModule, loading, userId, historyCount, sidebarCollapsed, sidebarOpen, overlay]
  );

  return <ModuleContext.Provider value={value}>{children}</ModuleContext.Provider>;
}

export function useModuleContext() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModuleContext must be used inside ModuleProvider');
  }
  return context;
}

export function useSidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, sidebarOpen, setSidebarOpen } = useModuleContext();

  return {
    sidebarCollapsed,
    setSidebarCollapsed,
    sidebarOpen,
    setSidebarOpen
  };
}

