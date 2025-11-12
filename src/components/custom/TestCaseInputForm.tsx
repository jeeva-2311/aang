"use client"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface TestCaseInputFormProps {
  url: string
  method: string
  onChange: (field: string, value: string) => void
}

export default function TestCaseInputForm({ url, method, onChange }: TestCaseInputFormProps) {
  return (
    <>
      <Field>
        <FieldLabel htmlFor="url">API Endpoint URL</FieldLabel>
        <Input
          id="url"
          placeholder="https://api.example.com/users"
          value={url}
          onChange={(e) => onChange("url", e.target.value)}
          className="bg-slate-100 border-slate-300 text-slate-800"
        />
      </Field>

      <Field>
        <FieldLabel htmlFor="method">HTTP Method</FieldLabel>
        <select
          id="method"
          value={method}
          onChange={(e) => onChange("method", e.target.value)}
          className="border border-slate-300 rounded px-3 py-2 bg-slate-100 text-slate-800"
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
      </Field>
    </>
  )
}
