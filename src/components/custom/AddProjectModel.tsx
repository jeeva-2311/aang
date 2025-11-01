"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useUIStore } from "@/store/uiStore"
import { useDataStore } from "@/store/dataStore"
import { Project } from "@/types/app"
import { useQueryClient } from "@tanstack/react-query"

export default function AddProjectModal() {
  const [projectName, setProjectName] = useState("")
  const [baseUrl, setBaseUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({ name: "", baseUrl: "" })

  const { modal, closeModal } = useUIStore()
  const { addProject } = useDataStore()
  const queryClient = useQueryClient()

  const open = modal.newProject

  const validateForm = () => {
    const newErrors = { name: "", baseUrl: "" }
    let isValid = true

    if (!projectName.trim()) {
      newErrors.name = "Project name is required"
      isValid = false
    }

    if (!baseUrl.trim()) {
      newErrors.baseUrl = "Base URL is required"
      isValid = false
    } else {
      try {
        new URL(baseUrl.trim())
      } catch {
        newErrors.baseUrl = "Please enter a valid URL"
        isValid = false
      }
    }

    setErrors(newErrors)
    return isValid
  }

  const handleAddProject = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName.trim(),
          baseUrl: baseUrl.trim()
        }),
      })

      if (res.ok) {
        const created: Project = await res.json();
        addProject(created)
        // Invalidate and refetch projects query
        queryClient.invalidateQueries({ queryKey: ["sidebarData", "projects"] })
        setProjectName("")
        setBaseUrl("")
        setErrors({ name: "", baseUrl: "" })
        closeModal("newProject")
      } else {
        const error = await res.json()
        setErrors({ name: error.message || "Failed to create project", baseUrl: "" })
      }
    } catch (err) {
      console.error(err)
      setErrors({ name: "An error occurred. Please try again.", baseUrl: "" })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setProjectName("")
    setBaseUrl("")
    setErrors({ name: "", baseUrl: "" })
    closeModal("newProject")
  }

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === "Enter" && !loading) {
      handleAddProject()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-100 border border-slate-300 text-slate-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Add New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="project-name" className="text-slate-700 text-sm font-medium">
              Project Name
            </Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => {
                setProjectName(e.target.value)
                if (errors.name) setErrors({ ...errors, name: "" })
              }}
              onKeyDown={handleKeyDown}
              className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-600 text-xs">{errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="base-url" className="text-slate-700 text-sm font-medium">
              Base URL
            </Label>
            <Input
              id="base-url"
              placeholder="https://api.example.com"
              value={baseUrl}
              onChange={(e) => {
                setBaseUrl(e.target.value)
                if (errors.baseUrl) setErrors({ ...errors, baseUrl: "" })
              }}
              onKeyDown={handleKeyDown}
              className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
              disabled={loading}
            />
            {errors.baseUrl && (
              <p className="text-red-600 text-xs">{errors.baseUrl}</p>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
            className="border-slate-300 text-slate-700"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddProject}
            disabled={loading}
            className="bg-slate-700 text-white rounded-md transition-all duration-300 hover:shadow-md"
          >
            {loading ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}