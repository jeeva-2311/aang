"use client"

import { useDataStore } from "@/store/dataStore";
import { useUIStore } from "@/store/uiStore";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getMethodStyle } from "@/utils/general";
import TestCaseView from "./TestCaseView";
import { ScrollArea } from "../ui/scroll-area";

function InfoView({ message }: { message: string }) {
    return (
        <>
            <h1 className="text-3xl font-semibold text-slate-700 mb-2">Welcome to AANG</h1>
            <p className="text-slate-500">{message}</p>
        </>
    );
}

function ApiView() {
    const { activeApi, activeProject, projects, setActiveApi } = useDataStore();
    const { openModal } = useUIStore();

    const project = projects.find(p => p.id === activeProject);
    const apis = project?.apis || [];
    const currentIndex = apis.findIndex(a => a.id === activeApi);
    const api = apis[currentIndex];

    if (!api || !project) {
        return (
            <div className="text-center">
                <h1 className="text-3xl font-semibold text-slate-700 mb-2">Nothing to Display</h1>
                <p className="text-slate-500">Please select a project or API to continue.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full bg-liner-to-br from-slate-50 to-slate-100">
            {/* Header Navigation */}
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
                        onClick={() => openModal("newTestCase")}
                        className="hover:bg-slate-50"
                    >
                        Add Test Case
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

            {/* API Details Section */}
            <div className="px-6 py-5 bg-white mx-6 mt-6 rounded-lg shadow-sm border border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-slate-700">
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">API Name</p>
                        <h2 className="text-xl font-semibold text-slate-900">{api.name || "Unnamed API"}</h2>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">Method</p>
                        <span className={`inline-block mt-1 px-3 py-1 text-sm font-semibold rounded-lg ${getMethodStyle(api.method)}`}>
                            {api.method}
                        </span>
                    </div>
                    <div className="col-span-2 flex-center justify-start gap-3">
                        <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Endpoint</p>
                        <code className="flex w-full bg-slate-50 text-slate-800 rounded-lg px-3 py-2 text-sm overflow-x-auto border border-slate-200 font-mono">
                            {api.url || "No URL specified"}
                        </code>
                    </div>
                </div>
            </div>

            {/* Test Cases Section */}
            <div className="flex-1 flex flex-col px-6 py-5 min-h-0">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-800">Test Cases</h3>
                    {api.testCases?.length > 0 && (
                        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                            {api.testCases.length} {api.testCases.length === 1 ? "test" : "tests"}
                        </span>
                    )}
                </div>

                {/* Scrollable Test Case List */}
                <ScrollArea className="flex-1 rounded-lg border border-slate-200 bg-white p-4 overflow-y-auto gray-thin-scrollbar">
                    {api.testCases?.length ? (
                        <div className="space-y-3">
                            {api.testCases.map((test) => (
                                <TestCaseView key={test.id} data={test} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 border-2 border-dashed border-slate-300 rounded-lg py-12 px-6">
                            <div className="max-w-sm mx-auto">
                                <p className="text-base font-medium text-slate-700 mb-2">No test cases yet</p>
                                <p className="text-sm text-slate-500">Get started by adding your first test case to validate this API endpoint.</p>
                            </div>
                        </div>
                    )}
                </ScrollArea>
            </div>
        </div>
    );
}

export default function Main() {
    const { sidebarView } = useUIStore();
    const { activeApi } = useDataStore();

    const isProject = sidebarView === "projects";

    let content;
    if (isProject) content = <InfoView message="Select an existing project or create a new one." />;
    else if (!activeApi) content = <InfoView message="Select an existing API or create a new one to view test cases." />;
    else content = <ApiView />;

    const shouldCenter = isProject || !activeApi;

    return (
        <main className={`flex-1 flex flex-col max-h-screen ${shouldCenter ? 'items-center justify-center text-center' : ''}`}>
            {content}
        </main>
    );
}