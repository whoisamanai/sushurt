import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface SidebarButtonProps {
  label: string;
  active: boolean;
  badgeCount?: number;
  onClick: () => void;
  icon?: ReactNode;
}

export default function SidebarButton({ label, active, badgeCount, onClick, icon }: SidebarButtonProps) {
  return (
    <motion.button
      type="button"
      className={`sidebar-button ${active ? 'active' : ''}`}
      whileHover={{ x: 3 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
    >
      <span className="sidebar-button-label">
        {icon}
        {label}
      </span>
      {typeof badgeCount === 'number' && (
        <motion.span
          key={badgeCount}
          className="history-badge"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          {badgeCount}
        </motion.span>
      )}
    </motion.button>
  );
}
