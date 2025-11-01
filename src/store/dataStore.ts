import { create } from "zustand"
import { Project, API } from "@/types/app";

interface DataState {
  projects: Project[]
  activeProject: string | null
  activeApi: string | null
  addProject: (project: Project) => void
  addApiToProject: (projectId: string, api: API) => void
  setProjects: (projects: Project[]) => void
  setApis: (projectId: string, apis: API[]) => void
  setActiveProject: (id: string | null) => void
  setActiveApi: (id: string | null) => void
  updateProject: (projectId: string, updates: Partial<Project>) => void
  deleteProject: (projectId: string) => void
}

export const useDataStore = create<DataState>((set) => ({
  projects: [],
  activeProject: null,
  activeApi: null,

  addProject: (project: Project) =>
    set((state) => ({
      projects: [...state.projects, project]
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

  updateProject: (projectId, updates) =>
    set((state) => ({
      projects: state.projects.map((p) => p.id === projectId ? { ...p, ...updates } : p),
    })),

  deleteProject: (projectId) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== projectId),
      activeProject: state.activeProject === projectId ? null : state.activeProject,
    })),
}))
