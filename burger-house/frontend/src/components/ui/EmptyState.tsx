interface Props {
  icon?: string;
  title: string;
  subtitle?: string;
}

export default function EmptyState({ icon = '📁', title, subtitle }: Props) {
  return (
    <div className="bg-white p-12 rounded-2xl shadow-md text-center">
      <div className="text-6xl mb-4">{icon}</div>
      <p className="text-gray-500 text-lg">{title}</p>
      {subtitle && <p className="text-gray-400 text-sm mt-2">{subtitle}</p>}
    </div>
  );
}
