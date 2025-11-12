"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface TestCase {
  name: string
  url: string
  expectedStatus: number
  method?: string
  requestBody?: Record<string, any>
  expectedBody?: Record<string, any>
}

interface GeneratedTestCaseListProps {
  generated: TestCase[]
  selected: number[]
  onToggleSelect: (index: number) => void
  onSubmit: () => void
  submitting: boolean
  onUpdateCase: (index: number, updated: Partial<TestCase>) => void
}

export default function GeneratedTestCaseList({
  generated,
  selected,
  onToggleSelect,
  onSubmit,
  submitting,
  onUpdateCase,
}: GeneratedTestCaseListProps) {
  if (!generated.length) return null

  return (
    <div className="mt-6 space-y-3">
      <h4 className="font-semibold text-slate-800">Generated Test Cases</h4>

      {generated.map((tc, i) => (
        <div key={i} className={`p-4 border rounded-lg transition ${selected.includes(i) ? "border-slate-800 bg-slate-50" : "border-slate-300 bg-white"}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <input
              type="checkbox"
              checked={selected.includes(i)}
              onChange={() => onToggleSelect(i)}
              className="w-4 h-4 cursor-pointer accent-slate-800"
            />
            <div className="flex-center gap-3">
              <label className="text-xs text-slate-600">Method</label>
              <select
                value={tc.method ?? "GET"}
                onChange={(e) => onUpdateCase(i, { method: e.target.value })}
                className="mt-1 w-full border border-slate-300 rounded px-2 py-2 bg-slate-100 text-slate-800 text-sm"
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="PATCH">PATCH</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex-center gap-3">
              <label className="text-xs text-slate-600">Name</label>
              <Input
                value={tc.name}
                onChange={(e) => onUpdateCase(i, { name: e.target.value })}
                className="mt-1 border-slate-300 bg-slate-100 text-slate-800"
              />
            </div>

            <div className="flex-center gap-3">
              <label className="text-xs text-slate-600">URL</label>
              <Input
                value={tc.url}
                onChange={(e) => onUpdateCase(i, { url: e.target.value })}
                className="mt-1 border-slate-300 bg-slate-100 text-slate-800"
              />
            </div>

            <div className="flex-center gap-3 justify-start">
              <label className="text-xs text-slate-600">Expected Status</label>
              <Input
                type="number"
                value={tc.expectedStatus}
                onChange={(e) =>
                  onUpdateCase(i, { expectedStatus: parseInt(e.target.value) })
                }
                className="mt-1 border-slate-300 bg-slate-100 text-slate-800 w-24"
              />
            </div>

            <div>
              <label className="text-xs text-slate-600">Expected Body (JSON)</label>
              <Textarea
                value={JSON.stringify(tc.expectedBody ?? {}, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value)
                    onUpdateCase(i, { expectedBody: parsed })
                  } catch {
                  }
                }}
                className="mt-1 font-mono text-xs border-slate-300 bg-slate-100 text-slate-800"
                rows={4}
              />
            </div>
          </div>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-end mt-4">
        <Button
          onClick={onSubmit}
          disabled={submitting || !selected.length}
          className="bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-70"
        >
          {submitting ? "Saving..." : `Create (${selected.length})`}
        </Button>
      </div>
    </div>
  )
}
