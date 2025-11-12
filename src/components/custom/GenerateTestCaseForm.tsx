"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import TestCaseInputForm from "@/components/custom/TestCaseInputForm"
import GeneratedTestCaseList from "@/components/custom/GeneratedTestCaseList"
import generateTestCases from "@/utils/generate"
import { TestCase } from "@/types/app"

export default function GenerateTestCaseForm({ onClose }: { onClose: () => void }) {
  const [formData, setFormData] = useState({ url: "", method: "GET" })
  const [generated, setGenerated] = useState<any[]>([])
  const [selected, setSelected] = useState<number[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  const handleGenerate = () => {
    setLoading(true)
    const { url, method } = formData
    if (!url) {
      alert("Please provide a URL")
      setLoading(false)
      return
    }
    const testCases = generateTestCases(url, method)
    setGenerated(testCases)
    setLoading(false)
  }

  const toggleSelect = (index: number) =>
    setSelected((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )

  const handleSubmit = async () => {
    setSubmitting(true)
    const chosen = generated.filter((_, i) => selected.includes(i))
    console.log("Submitting test cases:", chosen)
    setSubmitting(false)
    onClose()
  }

  const handleCancel = () => {
    setFormData({ url: "", method: "GET" })
    setGenerated([])
    onClose()
  }

  const handleUpdateCase = (index: number, updated: Partial<TestCase>) => {
    setGenerated((prev) =>
      prev.map((tc, i) => (i === index ? { ...tc, ...updated } : tc))
    )
  }

  return (
    <div className="space-y-6">
      <TestCaseInputForm
        url={formData.url}
        method={formData.method}
        onChange={handleChange}
      />

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button onClick={handleGenerate} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>

      <GeneratedTestCaseList
        generated={generated}
        selected={selected}
        onToggleSelect={toggleSelect}
        onSubmit={handleSubmit}
        submitting={submitting}
        onUpdateCase={handleUpdateCase}
      />
    </div>
  )
}
