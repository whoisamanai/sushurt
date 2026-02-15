import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface SidebarItemProps {
  item: SidebarNavItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export default function SidebarItem({ item, active, collapsed, onClick }: SidebarItemProps) {
  return (
    <motion.button
      type="button"
      role="menuitem"
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.99 }}
      className={`sidebar-item ${active ? 'active' : ''} ${collapsed ? 'collapsed' : ''}`}
      onClick={onClick}
      aria-label={item.label}
      title={collapsed ? item.label : undefined}
    >
      <span className="sidebar-item-icon" aria-hidden="true">
        {item.icon}
      </span>
      <span className="sidebar-item-label">{item.label}</span>
      {typeof item.badge === 'number' && <span className="sidebar-item-badge">{item.badge}</span>}
    </motion.button>
  );
}
