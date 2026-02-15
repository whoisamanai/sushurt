import { motion } from 'framer-motion';
import type { Patient } from '../../types';

interface PrintPreviewProps {
  entryData: Patient;
  onClose: () => void;
  onPrintComplete?: () => void;
}

function getDisplayDate(entryData: Patient) {
  return 'toDate' in entryData.createdAt
    ? entryData.createdAt.toDate().toLocaleString()
    : new Date().toLocaleString();
}

export default function PrintPreview({ entryData, onClose, onPrintComplete }: PrintPreviewProps) {
  const handlePrint = () => {
    window.print();
    onPrintComplete?.();
  };

  return (
    <motion.div className="workspace-overlay" role="dialog" aria-modal="true" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className="workspace-overlay-card" initial={{ y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 18, opacity: 0 }}>
        <div className="row-space-between no-print">
          <h3>Print Preview</h3>
          <button type="button" onClick={onClose}>Close</button>
        </div>

        <div className="printable-slip print-area-only">
          <h2>Sushrut Automation Slip</h2>
          <p><strong>Name:</strong> {entryData.name}</p>
          <p><strong>Father Name:</strong> {entryData.fatherName}</p>
          <p><strong>Address:</strong> {entryData.address}</p>
          <p><strong>Mobile:</strong> {entryData.mobile}</p>
          <p><strong>Complaint:</strong> {entryData.complaint}</p>
          <p><strong>Date:</strong> {getDisplayDate(entryData)}</p>
        </div>

        <div className="row-actions no-print">
          <button type="button" onClick={handlePrint}>Print</button>
          <button type="button" className="ghost-button" onClick={onClose}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}
