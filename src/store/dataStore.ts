import { create } from "zustand"
import { Project, API } from "@/types/app";

interface DataState {
  projects: Project[]
  activeProject: string | null
  activeApi: string | null
  addProject: (name: string) => void
  addApiToProject: (projectId: string, api: API) => void
  setProjects: (projects: Project[]) => void
  setApis: (projectId: string, apis: API[]) => void
  setActiveProject: (id: string | null) => void
  setActiveApi: (id: string | null) => void
}

export const useDataStore = create<DataState>((set) => ({
  projects: [],
  activeProject: null,
  activeApi: null,

  addProject: (name) =>
    set((state) => ({
      projects: [...state.projects, { id: crypto.randomUUID(), name, apis: [] }]
    })),

  addApiToProject: (projectId, newApi) =>
    set((state) => ({
      projects: state.projects.map((p) => p.id === projectId ? { ...p, apis: [...(p.apis || []), newApi] } : p),
    })),

  setProjects: (projects) => set({ projects }),

  setApis: (projectId, apis) =>
    set((state) => ({
      projects: state.projects.map((p) => p.id === projectId ? { ...p, apis } : p),
    })),

  setActiveProject: (id) => set({ activeProject: id }),
  setActiveApi: (id) => set({ activeApi: id }),
}))
