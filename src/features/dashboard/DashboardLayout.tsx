import { Suspense, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Loader from '../../components/Loader';
import { ModuleProvider, useModuleContext } from '../../context/ModuleContext';
import { moduleRegistry } from './ModuleRegistry';
import Sidebar from './Sidebar';
import ProfileMenu from './ProfileMenu';

function DashboardShellContent() {
  const { activeModule, loading, sidebarCollapsed,overlay } = useModuleContext();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const moduleItem = moduleRegistry.find((item) => item.id === activeModule) ?? moduleRegistry[0];
  const ActiveComponent = moduleItem.component;

  return (
    <div className={`saas-layout ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <aside className={`saas-sidebar ${mobileSidebarOpen ? 'mobile-open' : ''}`}>
        <div>
          <h1 className="saas-logo">Sushrut</h1>
          {!sidebarCollapsed && <p className="saas-subtitle">AI Automation Platform</p>}
        </div>
        <Sidebar />
        <ProfileMenu />
      </aside>

      <main className="saas-workspace">
        <header className="mobile-workspace-header">
          <button type="button" className="sidebar-collapse-toggle" onClick={() => setMobileSidebarOpen((v) => !v)}>
            <span aria-hidden="true">☰</span>
            <span>Menu</span>
          </button>
          
        </header>

        <AnimatePresence mode="wait">
          <motion.section
            key={moduleItem.id}
            className="workspace-panel"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<Loader message="Loading module..." />}>
              <ActiveComponent />
            </Suspense>
          </motion.section>
        </AnimatePresence>
      </main>

      <AnimatePresence>{loading && <Loader message="Processing..." />}</AnimatePresence>

      <AnimatePresence>{overlay}</AnimatePresence>

      {mobileSidebarOpen && <button className="mobile-sidebar-backdrop" onClick={() => setMobileSidebarOpen(false)} aria-label="Close sidebar" />}
    </div>
  );
}

export default function DashboardLayout() {
  return (
    <ModuleProvider>
      <DashboardShellContent />
    </ModuleProvider>
  );
}
