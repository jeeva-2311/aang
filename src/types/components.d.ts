import { Project,API } from "./app";

export interface ProjectCardProps {
  project: Project;
  onSelect: (id: number) => void;
}

export interface ApiCardProps {
  api: API;
  onSelect: (id: number) => void;
}

export interface DataListProps {
  data: any[];
  isProjectView: boolean;
  onSelect: (id: number) => void;
}

export interface EmptyStateProps {
  isProjectView: boolean;
}
