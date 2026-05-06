type FormFieldProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  value?: string;
  onChange?: (value: string) => void;
};

export function FormField({
  label,
  name,
  type = "text",
  placeholder,
  required,
  min,
  max,
  step,
  value,
  onChange
}: FormFieldProps) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-graphite">
        {label}
      </span>
      <input
        className="w-full rounded border border-graphite/15 bg-white px-3 py-3 outline-none transition focus:border-forest focus:ring-4 focus:ring-forest/10"
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={onChange ? (event) => onChange(event.target.value) : undefined}
      />
    </label>
  );
}
