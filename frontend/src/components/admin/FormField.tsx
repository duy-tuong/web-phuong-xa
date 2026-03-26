"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BaseFieldProps {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: "text" | "email" | "password" | "number";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps extends BaseFieldProps {
  type: "select";
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  placeholder?: string;
}

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, name, required, error } = props;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={name} className="text-sm font-medium text-stone-700">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>

      {props.type === "textarea" ? (
        <Textarea
          id={name}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          rows={props.rows || 3}
          className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
        />
      ) : props.type === "select" ? (
        <Select value={props.value} onValueChange={props.onChange}>
          <SelectTrigger className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400">
            <SelectValue placeholder={props.placeholder || "Chọn..."} />
          </SelectTrigger>
          <SelectContent>
            {props.options.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={name}
          type={props.type}
          value={props.value}
          onChange={(e) => props.onChange(e.target.value)}
          placeholder={props.placeholder}
          className="border-stone-200 focus:border-emerald-400 focus:ring-emerald-400"
        />
      )}

      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
}
