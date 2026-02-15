import { motion } from 'framer-motion';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <motion.div
      className="loader-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="status"
      aria-live="polite"
    >
      <div className="loader-content">
        <span className="loader-spinner" />
        <span>{message}</span>
      </div>
    </motion.div>
  );
}
