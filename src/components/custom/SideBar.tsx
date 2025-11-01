"use client";

import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { ChevronLeft } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { useUIStore } from "@/store/uiStore";
import { useDataStore } from "@/store/dataStore";
import { ProjectCardProps, ApiCardProps, DataListProps, EmptyStateProps } from "@/types/components";

const LoadingSkeleton = () =>
  <div className="space-y-2">{Array.from({ length: 3 }).map((_, idx) => (<Skeleton key={idx} className="h-8 w-full rounded-lg" />))}</div>

const ErrorMessage = () => <div className="text-center text-red-500 text-xs py-8">Failed to load data</div>

const EmptyState = ({ isProjectView }: EmptyStateProps) =>
  <div className="text-center text-slate-500 text-xs py-8">No {isProjectView ? "Projects" : "APIs"} found</div>

function ProjectCard({ project, onSelect }: ProjectCardProps) {
  return (
    <Card
      onClick={() => onSelect(project.id)}
      className="p-2 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-lg border border-slate-300 text-slate-700 hover:shadow-sm text-xs font-medium transition-all duration-200"
    >
      {project.name}
    </Card>
  );
}

function ApiCard({ api, onSelect }: ApiCardProps) {
  const methodStyles = {
    GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-amber-100 text-amber-700 border-amber-200",
    DELETE: "bg-rose-100 text-rose-700 border-rose-200",
    DEFAULT: "bg-slate-100 text-slate-600 border-slate-200",
  };

  const methodClass = methodStyles[api.method as keyof typeof methodStyles] || methodStyles.DEFAULT;

  return (
    <Card
      onClick={() => onSelect(api.id)}
      className="p-3 bg-slate-100 hover:bg-slate-200 cursor-pointer rounded-lg border border-slate-300 text-slate-700 hover:shadow-sm text-sm transition-all duration-200 gap-y-1"
    >
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-semibold truncate">{api.name}</h3>
        <span
          className={`px-2 py-px rounded text-[10px] font-semibold uppercase border ${methodClass}`}
        >
          {api.method}
        </span>
      </div>
      <p className="text-[11px] text-slate-500 truncate">{api.url}</p>
    </Card>
  );
}

function DataList({ data, isProjectView, onSelect }: DataListProps) {
  return (
    <>
      {data.map((item) =>
        isProjectView ? <ProjectCard key={item.id} project={item} onSelect={onSelect} /> : <ApiCard key={item.id} api={item} onSelect={onSelect} />
      )}
    </>
  );
}

function useSidebarData(isProjectView: boolean, activeProject: string | null) {
  const fetchSidebarData = async () => {
    if (isProjectView) {
      const { data } = await axios.get("/api/projects");
      return data.projects ?? [];
    }
    if (activeProject) {
      const { data } = await axios.get(`/api/projects/${activeProject}`);
      return data.apis ?? [];
    }
    return [];
  };
  return useQuery({
    queryKey: ["sidebarData", isProjectView ? "projects" : "api", activeProject],
    queryFn: fetchSidebarData,
    enabled: isProjectView || !!activeProject,
  });
}

export default function SideBar() {
  const { sidebarView, openModal, setSidebarView } = useUIStore();
  const { setProjects, setApis, activeProject, setActiveProject, setActiveApi } = useDataStore();

  const isProjectView = sidebarView === "projects";

  const { data = [], isLoading, error, refetch } = useSidebarData(isProjectView, activeProject);

  useEffect(() => {
    if (isProjectView) setProjects(data);
    else if (activeProject) setApis(activeProject, data);
  }, [data, isProjectView, activeProject]);

  const handleSelect = (id: string) => {
    if (isProjectView) {
      setActiveProject(id);
      setSidebarView("api");
      refetch();
    } else {
      setActiveApi(id);
    }
  }

  const handleBackToProjects = () => setSidebarView("projects");
  const handleAddNew = () => openModal(isProjectView ? "newProject" : "newApi");

  const renderContent = () => {
    if (isLoading) return <LoadingSkeleton />;
    if (error) return <ErrorMessage />;
    if (data.length === 0) return <EmptyState isProjectView={isProjectView} />;
    return <DataList data={data} isProjectView={isProjectView} onSelect={handleSelect} />
  };

  return (
    <aside className="w-64 bg-slate-100/80 backdrop-blur-sm border-r border-slate-300 shadow-sm flex flex-col">

      <div className="p-4 text-lg font-semibold border-b border-slate-300 text-slate-700 flex items-center justify-start gap-2">
        {!isProjectView && <Button onClick={handleBackToProjects} variant="outline" size="icon-sm"><ChevronLeft /></Button>}
        <span>{isProjectView ? "Projects" : "APIs"}</span>
      </div>

      <ScrollArea className="flex-1 p-3"><div className="flex flex-col space-y-2">{renderContent()}</div></ScrollArea>

      <div className="p-4 border-t border-slate-300">
        <Button onClick={handleAddNew} className="w-full bg-slate-700 text-slate-100 rounded-md shadow-sm hover:shadow-md transition-all duration-300">
          + Add {isProjectView ? "Project" : "API"}
        </Button>
      </div>
    </aside>
  );
}