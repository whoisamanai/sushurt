import { AnimatePresence, motion } from 'framer-motion';

interface SidebarMobileOverlayProps {
  open: boolean;
  onClose: () => void;
}

export default function SidebarMobileOverlay({ open, onClose }: SidebarMobileOverlayProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.button
          type="button"
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
