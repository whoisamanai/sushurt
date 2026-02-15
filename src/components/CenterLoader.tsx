import Spinner from './Spinner';

interface CenterLoaderProps {
  label?: string;
}

export default function CenterLoader({ label = 'Please wait...' }: CenterLoaderProps) {
  return (
    <div className="center-loader" role="status" aria-live="polite">
      <Spinner label={label} />
    </div>
  );
}
