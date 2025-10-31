"use client"

import { useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Field, FieldLabel } from "@/components/ui/field"
import { useUIStore } from "@/store/uiStore"
import { useDataStore } from "@/store/dataStore"

export default function AddApiModal() {
  const [formData, setFormData] = useState({
    name: "",
    url: "",
    method: "",
  })
  const [loading, setLoading] = useState(false)

  const { modal, closeModal } = useUIStore()
  const { addApiToProject, activeProject } = useDataStore()

  const open = modal.newApi

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddApi = async () => {
    const { name, url, method } = formData
    if (!name.trim() || !url.trim() || !method) return

    setLoading(true)
    try {
      const { data, status } = await axios.post("/api/apis", {
        name: name.trim(),
        url: url.trim(),
        method,
        projectId: parseInt(activeProject as string)
      })
      if (status === 201) {
        addApiToProject(activeProject as string, data)
        setFormData({ name: "", url: "", method: "" })
        closeModal("newApi")
      }
    } catch (error) {
      console.error("Failed to create API:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => closeModal("newApi")}>
      <DialogContent className="bg-slate-100 border border-slate-300 text-slate-800 shadow-xl max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Add New API
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Field>
            <FieldLabel htmlFor="apiName">Name</FieldLabel>
            <Input
              id="apiName"
              placeholder="Enter API name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="apiUrl">URL</FieldLabel>
            <Input
              id="apiUrl"
              placeholder="Enter API endpoint URL"
              value={formData.url}
              onChange={(e) => handleChange("url", e.target.value)}
              className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
            />
          </Field>

          <Field>
            <FieldLabel htmlFor="method">Method</FieldLabel>
            <Select
              value={formData.method}
              onValueChange={(val) => handleChange("method", val)}
            >
              <SelectTrigger id="method">
                <SelectValue placeholder="Select HTTP method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <DialogFooter className="mt-6">
          <Button
            variant="outline"
            onClick={() => closeModal("newApi")}
            className="border-slate-300 text-slate-700 hover:bg-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddApi}
            disabled={loading}
            className="bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-70"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
