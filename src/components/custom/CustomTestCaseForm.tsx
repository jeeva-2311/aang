"use client"

import { Field, FieldLabel } from "@/components/ui/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { toast } from "sonner"
import { useDataStore } from "@/store/dataStore"
import axios from "axios"
import { TestCase } from "@/types/app"

const initialForm = {
  name: "",
  requestBody: "",
  headers: "",
  expectedStatus: "",
  expectedBody: "",
  byPassUrl: ""
}

interface CustomTestCaseFormProps {
  onClose: () => void;
}

export default function CustomTestCaseForm({ onClose }: CustomTestCaseFormProps) {
  const { activeProject, activeApi, addTestCaseToAPI } = useDataStore();
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validateJSON = (jsonString: string, fieldName: string): Record<string, any> | null => {
    if (!jsonString.trim()) return null

    try {
      return JSON.parse(jsonString);
    } catch (e) {
      setErrors((prev) => ({ ...prev, [fieldName]: "Invalid JSON format" }));
      return null;
    }
  }

  const handleSubmit = async () => {
    setErrors({});

    const requiredFields: Partial<Record<keyof typeof formData, string>> = {
      name: "Test case name is required",
      requestBody: "Request body is required",
      headers: "Headers are required",
      expectedStatus: "Expected status is required",
      expectedBody: "Expected body is required",
    };

    for (const [key, message] of Object.entries(requiredFields) as [keyof typeof formData, string][]) {
      if (!formData[key].trim()) {
        setErrors((prev) => ({ ...prev, [key]: message }));
        return;
      }
    }

    const requestBody = validateJSON(formData.requestBody, "requestBody");
    if (!requestBody) return;

    const headers = validateJSON(formData.headers, "headers");
    if (!headers) return;

    const expectedBody = validateJSON(formData.expectedBody, "expectedBody");
    if (!expectedBody) return;

    let expectedStatus: number | null = null;
    if (formData.expectedStatus.trim()) {
      expectedStatus = parseInt(formData.expectedStatus)
      if (isNaN(expectedStatus) || expectedStatus < 100 || expectedStatus > 599) {
        setErrors((prev) => ({ ...prev, expectedStatus: "Invalid HTTP status code" }))
        return
      }
    }
    setLoading(true)

    try {
      const response = await axios.post("/api/test-cases", {
        apiId: activeApi,
        name: formData.name,
        requestBody,
        headers,
        expectedStatus,
        expectedBody,
        url: formData.byPassUrl
      })

      if (response.status !== 201) throw new Error("Failed to create test case")
      toast.success("Test case created successfully")
      setFormData(initialForm)
      addTestCaseToAPI(activeProject as number, activeApi as number, response.data as TestCase)
      onClose()
    } catch (error) {
      console.error("Error creating test case:", error)
      toast.error(error instanceof Error ? error.message : "Failed to create test case")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData(initialForm)
    setErrors({})
    onClose()
  }

  return (
    <div className="space-y-4">
      <Field>
        <FieldLabel htmlFor="testCaseName">
          Name <span className="text-red-500">*</span>
        </FieldLabel>
        <Input
          id="testCaseName"
          placeholder="Enter test case name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
        />
        {errors.name && (
          <p className="text-sm text-red-600 mt-1">{errors.name}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="requestBody">
          Request Body (JSON)
        </FieldLabel>
        <Textarea
          id="requestBody"
          placeholder='{"key": "value"}'
          value={formData.requestBody}
          onChange={(e) => handleChange("requestBody", e.target.value)}
          className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500 font-mono text-sm min-h-[100px]"
        />
        {errors.requestBody && (
          <p className="text-sm text-red-600 mt-1">{errors.requestBody}</p>
        )}
      </Field>

      <Field>
        <FieldLabel htmlFor="headers">Headers (JSON)</FieldLabel>
        <Textarea
          id="headers"
          placeholder='{"Authorization": "Bearer token"}'
          value={formData.headers}
          onChange={(e) => handleChange("headers", e.target.value)}
          className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500 font-mono text-sm min-h-20"
        />
        {errors.headers && (<p className="text-sm text-red-600 mt-1">{errors.headers}</p>)}
      </Field>

      <Field>
        <FieldLabel htmlFor="expectedStatus">Expected Status Code</FieldLabel>
        <Input
          id="expectedStatus"
          type="number"
          placeholder="200"
          value={formData.expectedStatus}
          onChange={(e) => handleChange("expectedStatus", e.target.value)}
          className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
        />
        {errors.expectedStatus && (<p className="text-sm text-red-600 mt-1">{errors.expectedStatus}</p>)}
      </Field>

      <Field>
        <FieldLabel htmlFor="expectedBody">Expected Response Body (JSON)</FieldLabel>
        <Textarea
          id="expectedBody"
          placeholder='{"success": true}'
          value={formData.expectedBody}
          onChange={(e) => handleChange("expectedBody", e.target.value)}
          className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500 font-mono text-sm min-h-[100px]"
        />
        {errors.expectedBody && (<p className="text-sm text-red-600 mt-1">{errors.expectedBody}</p>)}
      </Field>

      <Field>
        <FieldLabel htmlFor="byPassUrl">Bypass URL</FieldLabel>
        <Input
          id="byPassUrl"
          placeholder="http://abc.exe/something"
          value={formData.byPassUrl}
          onChange={(e) => handleChange("byPassUrl", e.target.value)}
          className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500 font-mono text-sm"
        />
        {errors.byPassUrl && (<p className="text-sm text-red-600 mt-1">{errors.byPassUrl}</p>)}
      </Field>

      <div className="flex justify-end gap-2 mt-6">
        <Button
          variant="outline"
          onClick={handleCancel}
          disabled={loading}
          className="border-slate-300 text-slate-700 hover:bg-slate-200"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-70"
        >
          {loading ? "Creating..." : "Create Test Case"}
        </Button>
      </div>
    </div>
  )
}