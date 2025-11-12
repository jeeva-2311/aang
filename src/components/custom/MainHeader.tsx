
import { useDataStore } from "@/store/dataStore";
import { useUIStore } from "@/store/uiStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import axios from "axios";

export default function MainHeader() {

  const { activeApi, activeProject, projects, setActiveApi } = useDataStore();
  const { openModal } = useUIStore();

  const project = projects.find(p => p.id === activeProject);
  const apis = project?.apis || [];
  const currentIndex = apis.findIndex(a => a.id === activeApi);

  const exportFile = async () => {
    try {
      const api = projects.find(p => p.id === activeProject)?.apis.find(a => a.id === activeApi);

      if (!api) {
        throw new Error("No active API found for export");
      }

      console.log("Exporting API:", api);

      const response = await axios.post(
        "/api/export",
        { data: api },
        { responseType: "blob" }
      );

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `api_export_${api.id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Exporting call failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 shadow-sm h-16 bg-slate-100/80 backdrop-blur-sm">
      <Button
        variant="outline"
        size="icon-sm"
        disabled={currentIndex <= 0}
        onClick={() => setActiveApi(apis[currentIndex - 1].id)}
        className="hover:bg-slate-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>

      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={exportFile}
          className="hover:bg-slate-50"
        >
          <FileDown />
          Export
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => openModal("newTestCase")}
          className="hover:bg-slate-50"
        >
          + Add Test Case
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          disabled={currentIndex >= apis.length - 1}
          onClick={() => setActiveApi(apis[currentIndex + 1].id)}
          className="hover:bg-slate-50"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}