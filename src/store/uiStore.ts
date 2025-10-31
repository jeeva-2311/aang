  import { create } from "zustand"

  interface UIState {
    sidebarView: "projects" | "api"
    selectedProjectId: string | null
    activeTab: string
    modal: {
      newProject: boolean
      newApi: boolean
    }
    setSidebarView: (view: "projects" | "api") => void
    setSelectedProject: (id: string | null) => void
    setActiveTab: (tab: string) => void
    openModal: (name: keyof UIState["modal"]) => void
    closeModal: (name: keyof UIState["modal"]) => void
  }

  export const useUIStore = create<UIState>((set) => ({
    sidebarView: "projects",
    selectedProjectId: null,
    activeTab: "projects",
    modal: { newProject: false, newApi: false },

    setSidebarView: (view) => set({ sidebarView: view }),
    setSelectedProject: (id) => set({ selectedProjectId: id }),
    setActiveTab: (tab) => set({ activeTab: tab }),

    openModal: (name) =>
      set((state) => ({ modal: { ...state.modal, [name]: true } })),

    closeModal: (name) =>
      set((state) => ({ modal: { ...state.modal, [name]: false } })),
  }))
