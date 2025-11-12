import { create } from "zustand"
import { Project, API, TestCase } from "@/types/app";

interface DataState {
  projects: Project[]
  activeProject: number | null
  activeApi: number | null
  addProject: (project: Project) => void
  addApiToProject: (projectId: number, api: API) => void
  addTestCaseToAPI: (projectId: number, apiId: number, testCase: TestCase) => void
  updateTestCaseInAPI: (projectId: number, apiId: number, testCase: TestCase) => void
  updateTestCasesInAPI: (projectId: number, apiId: number, updatedTestCases: TestCase[]) => void
  setProjects: (projects: Project[]) => void
  setApis: (projectId: number, apis: API[]) => void
  setActiveProject: (id: number | null) => void
  setActiveApi: (id: number | null) => void
  updateProject: (projectId: number, updates: Partial<Project>) => void
  deleteProject: (projectId: number) => void
  deleteTestCaseFromAPI: (projectId: number, apiId: number, testCase: number) => void
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

  addTestCaseToAPI: (projectId, apiId, testCase) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, apis: p.apis.map((a) => a.id === apiId ? { ...a, testCases: [...a.testCases, testCase] } : a) }
          : p
      ),
    })),

  updateTestCaseInAPI: (projectId, apiId, testCase) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            apis: p.apis.map((a) =>
              a.id === apiId
                ? {
                  ...a,
                  testCases: a.testCases.map((t) =>
                    t.id === testCase.id ? testCase : t
                  ),
                }
                : a
            ),
          }
          : p
      ),
    })),

  deleteTestCaseFromAPI: (projectId, apiId, testCaseId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? {
            ...p,
            apis: p.apis.map((a) =>
              a.id === apiId
                ? {
                  ...a,
                  testCases: a.testCases.filter(
                    (t) => t.id !== testCaseId
                  ),
                }
                : a
            ),
          }
          : p
      ),
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

    updateTestCasesInAPI: (projectId, apiId, updatedTestCases) =>
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                apis: p.apis.map((a) =>
                  a.id === apiId
                    ? {
                        ...a,
                        testCases: a.testCases.map((t) => {
                          const updated = updatedTestCases.find(
                            (ut) => ut.id === t.id
                          );
                          return updated ? updated : t;
                        }),
                      }
                    : a
                ),
              }
            : p
        ),
      })),
    
}))
