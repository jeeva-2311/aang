"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { useUIStore } from "@/store/uiStore"
import { useDataStore } from "@/store/dataStore"

export default function AddProjectModal() {
  const [newProject, setNewProject] = useState("")
  const [loading, setLoading] = useState(false)

  const { modal, closeModal } = useUIStore()
  const { addProject } = useDataStore()

  const open = modal.newProject

  const handleAddProject = async () => {
    if (!newProject.trim()) return

    setLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newProject.trim() }),
      })

      if (res.ok) {
        const created = await res.json()
        addProject(created.name)
        setNewProject("")
        closeModal("newProject")
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => closeModal("newProject")}>
      <DialogContent className="bg-slate-100 border border-slate-300 text-slate-700 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-slate-800">Add New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <Input
            placeholder="Enter project name"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            className="bg-slate-200 border-slate-300 text-slate-800 placeholder:text-slate-500"
          />
        </div>

        <DialogFooter className="mt-4">
          <Button
            variant="outline"
            onClick={() => closeModal("newProject")}
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
