interface Props {
  color?: string;
}

export default function LoadingSpinner({ color = 'amber' }: Props) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className={`animate-spin rounded-full h-12 w-12 border-b-2 border-${color}-500`} />
    </div>
  );
}
