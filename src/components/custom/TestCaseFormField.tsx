import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TestCaseFormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  type?: "input" | "textarea" | "number";
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}

const Required = () => <span className="text-red-500">*</span>;

export default function TestCaseFormField({
  label,
  required = false,
  error,
  type = "input",
  value,
  onChange,
  placeholder,
  rows = 3,
  className = "",
}: TestCaseFormFieldProps) {
  const hasError = !!error;
  const errorClass = hasError ? "border-red-500" : "";

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <Required />}
      </label>
      
      {type === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`font-mono text-sm ${errorClass}`}
        />
      ) : (
        <Input
          type={type === "number" ? "number" : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={errorClass}
        />
      )}
      
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}