"use client"

import { useUIStore } from "@/store/uiStore"
import { useDataStore } from "@/store/dataStore"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import clsx from "clsx"

export default function DataSidebar() {
  const { sidebarView } = useUIStore();
  const { projects, activeProject } = useDataStore()

  const project = projects.find((p) => p.id === activeProject)
  const isOpen = sidebarView === "api"

  return (
    <aside
      className={clsx(
        "fixed top-0 right-0 h-full w-[380px] sm:w-[420px] bg-slate-50 border-l border-slate-200 shadow-xl transform transition-transform duration-300 ease-in-out z-30 flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}
    >
      {project && (
        <>
          <div className="p-4 border-b bg-white">
            <h2 className="text-lg font-semibold text-slate-800">{project.name}</h2>
            <p className="text-sm text-slate-500">Project Details</p>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">

              <section>
                <div className="flex gap-3">
                  <h3 className="text-sm font-medium text-slate-600 mb-1">Project ID</h3>
                  <p className="text-slate-800 text-sm break-all">{project.id}</p>
                </div>

              </section>

              <Separator />

              <section>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-slate-600">Total APIs: {project.apis.length}</h3>
                </div>
              </section>
            </div>
          </ScrollArea>
        </>
      )}
    </aside>
  )
}
