import { Project,API } from "./app";

export interface ProjectCardProps {
  project: Project;
  onSelect: (id: string) => void;
}

export interface ApiCardProps {
  api: API;
  onSelect: (id: string) => void;
}

export interface DataListProps {
  data: any[];
  isProjectView: boolean;
  onSelect: (id: string) => void;
}

export interface EmptyStateProps {
  isProjectView: boolean;
}
