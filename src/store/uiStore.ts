import { create } from "zustand"

interface UIState {
  sidebarView: "projects" | "api"
  selectedProjectId: number | null
  modal: {
    newProject: boolean
    newApi: boolean
    newTestCase: boolean
    deleteProject: boolean
    deleteApi: boolean
    deleteTestCase: boolean
  }
  setSidebarView: (view: "projects" | "api") => void
  setSelectedProject: (id: number | null) => void
  openModal: (name: keyof UIState["modal"]) => void
  closeModal: (name: keyof UIState["modal"]) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarView: "projects",
  selectedProjectId: null,
  modal: { newProject: false, newApi: false, newTestCase: false, deleteProject: false, deleteApi: false, deleteTestCase: false },

  setSidebarView: (view) => set({ sidebarView: view }),
  setSelectedProject: (id) => set({ selectedProjectId: id }),

  openModal: (name) =>
    set((state) => ({ modal: { ...state.modal, [name]: true } })),

  closeModal: (name) =>
    set((state) => ({ modal: { ...state.modal, [name]: false } })),
}))
