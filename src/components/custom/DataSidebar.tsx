"use client"

import { useState } from "react"
import { useUIStore } from "@/store/uiStore"
import { useDataStore } from "@/store/dataStore"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ButtonGroup } from "@/components/ui/button-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Edit2, Save, X, Trash2 } from "lucide-react"
import clsx from "clsx"
import axios from "axios"

export default function DataSidebar() {
  const { sidebarView, openModal } = useUIStore()
  const { projects, activeProject, updateProject } = useDataStore()
  const project = projects.find(p => p.id === activeProject)
  const isOpen = sidebarView === "api" && project

  const [edit, setEdit] = useState(false)
  const [form, setForm] = useState({ name: "", baseUrl: "" })

  const startEdit = () => {
    if (!project) return
    setForm({ name: project.name, baseUrl: project.baseUrl || "" })
    setEdit(true)
  }

  const saveEdit = async () => {
    if (!project || !form.name.trim()) return
    try {
      await axios.patch(`/api/projects/${project.id}`, form)
      updateProject(project.id, form)
      setEdit(false)
    } catch (err) {
      console.error("Failed to update:", err)
    }
  }

  const cancelEdit = () => {
    setEdit(false)
    setForm({ name: "", baseUrl: "" })
  }

  return (
    <aside
      className={clsx(
        "h-screen bg-slate-50 border-l border-slate-200 transition-all duration-300 flex flex-col overflow-hidden",
        isOpen ? "w-80 p-4" : "w-0"
      )}
    >
      {project && isOpen && (
        <>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-slate-500">Project Details</p>
            <ButtonGroup>
              {edit ? (
                <>
                  <Button variant="outline" onClick={saveEdit}><Save className="h-4 w-4" /></Button>
                  <Button variant="outline" onClick={cancelEdit}><X className="h-4 w-4" /></Button>
                </>
              ) : (
                <>
                  <Button variant="outline" onClick={startEdit}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="outline" onClick={() => openModal("deleteProject")}><Trash2 className="h-4 w-4" /></Button>
                </>
              )}
            </ButtonGroup>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-6">
              {edit ? (
                <div className="space-y-2 mb-4">
                  <Label>Project Name</Label>
                  <Input
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Enter project name"
                    className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                  />
                </div>
              ) : (
                <div className="space-y-2 mb-4">
                  <Label className="text-sm text-slate-600">Project Name</Label>
                  <p className="text-sm text-slate-800 bg-slate-100 px-2 py-1 rounded break-all">{project.name}</p>
                </div>
              )}
              {edit ? (
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input
                    value={form.baseUrl}
                    onChange={e => setForm({ ...form, baseUrl: e.target.value })}
                    placeholder="https://api.example.com"
                    className="focus:outline-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none"
                  />
                </div>
              ) :
                <div className="space-y-2 mb-4">
                  <Label className="text-sm text-slate-600">Base URL</Label>
                  <p className="text-sm text-slate-800 bg-slate-100 px-2 py-1 rounded break-all">{project.baseUrl}</p>
                </div>
              }
              <Separator />
              <div className="flex items-center justify-between">
                <Label className="text-sm text-slate-600">Total APIs</Label>
                <Badge variant="secondary">{project.apis?.length || 0}</Badge>
              </div>
            </div>
          </ScrollArea>
        </>
      )}
    </aside>
  )
}
