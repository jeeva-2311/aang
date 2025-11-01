import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDataStore } from "@/store/dataStore"
import { useUIStore } from "@/store/uiStore"

export function DeleteModal() {
  const { modal, closeModal, setSidebarView } = useUIStore()
  const { projects, activeProject, deleteProject } = useDataStore()

  const open = modal.deleteApi || modal.deleteProject
  const isProject = modal.deleteProject
  const project = projects.find((p) => p.id === activeProject)

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (isProject && project) {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "DELETE",
        })

        if (!res.ok) throw new Error("Failed to delete project")

        deleteProject(project.id)
        setSidebarView("projects")
        closeModal("deleteProject")
      } else {
        // Delete API logic (placeholder for now)
        closeModal("deleteApi")
      }
    } catch (error) {
      console.error("Delete operation failed:", error)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() =>
        closeModal(isProject ? "deleteProject" : "deleteApi")
      }
    >
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleDelete}>
          <DialogHeader>
            <DialogTitle>
              Delete {isProject ? "Project" : "API"}
            </DialogTitle>
            <DialogDescription className="mt-4">
              {isProject ? (
                <>
                  Are you sure you want to delete{" "}
                  <span className="font-semibold">{project?.name}</span>?{" "}
                  This will also delete all the {project?.apis.length} APIs associated with this project.{" "}
                  <span className="text-red-500 font-medium">
                    This action cannot be undone.
                  </span>
                </>
              ) : (
                <>
                  Are you sure you want to delete this API?{" "}
                  <span className="text-red-500 font-medium">
                    This action cannot be undone.
                  </span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" variant="destructive">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
