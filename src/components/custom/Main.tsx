import { useDataStore } from "@/store/dataStore";
import { useUIStore } from "@/store/uiStore";

function InfoView({ message }: { message: string }) {
    return (
        <>
            <h1 className="text-3xl font-semibold text-slate-700 mb-2">Welcome to AANG</h1>
            <p className="text-slate-500">{message}</p>
        </>
    );
}

function DummyView() {
    const { activeApi, projects, activeProject } = useDataStore();

    const project = projects.find(project => project.id === activeProject);
    const api = project?.apis?.find(api => api.id === activeApi);
    console.log(project, api);
    
    return (
        <>
            <h1 className="text-3xl font-semibold text-slate-700 mb-2">Nothing to Display</h1>
            <p className="text-slate-500">Please select a project or API to continue.</p>
        </>
    );
}

export default function Main() {
    const { sidebarView } = useUIStore();
    const { activeApi } = useDataStore();

    const isProject = sidebarView === "projects";

    let content;
    if (isProject) content = <InfoView message="Select an existing project or create a new one." />;
    else if (!activeApi) content = <InfoView message="Select an existing API or create a new one to view test cases." />;
    else content = <DummyView />;

    return (
        <main className="flex-1 flex flex-col items-center justify-center text-center">
            {content}
        </main>
    );
}
