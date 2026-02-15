import { moduleRegistry } from './ModuleRegistry';
import SidebarButton from '../../components/SidebarButton';
import { useModuleContext } from '../../context/ModuleContext';

export default function Sidebar() {
  const {
    activeModule,
    setActiveModule,
    historyCount,
    sidebarCollapsed,
  } = useModuleContext();

  return (
    <nav className="dashboard-sidebar-nav">
      
      {moduleRegistry.map((moduleItem) => (
        <SidebarButton
          key={moduleItem.id}
          label={sidebarCollapsed ? moduleItem.label.slice(0, 1) : moduleItem.label}
          active={activeModule === moduleItem.id}
          onClick={() => setActiveModule(moduleItem.id)}
          badgeCount={moduleItem.id === 'history' ? historyCount : undefined}
        />
      ))}
    </nav>
  );
}
