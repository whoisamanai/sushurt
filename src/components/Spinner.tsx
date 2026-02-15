interface SpinnerProps {
  size?: 'sm' | 'md';
  label?: string;
}

export default function Spinner({ size = 'md', label = 'Loading...' }: SpinnerProps) {
  return (
    <span className="spinner-wrap" role="status" aria-live="polite" aria-label={label}>
      <span className={`spinner spinner-${size}`} />
      <span>{label}</span>
    </span>
  );
}
