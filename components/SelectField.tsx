type SelectFieldProps = {
  label: string;
  name: string;
  options: string[];
  required?: boolean;
};

export function SelectField({
  label,
  name,
  options,
  required
}: SelectFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-graphite">
        {label}
      </span>
      <select
        className="w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
        name={name}
        required={required}
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
