interface LabelValueProps {
  label: string;
  value: string | undefined;
}

export function LabelValue({ label, value }: LabelValueProps) {
  return (
    <div className="flex flex-col">
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <span className="mt-1 text-sm text-gray-900">{value ?? '--'}</span>
    </div>
  )
}