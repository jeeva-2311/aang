"use client";

import SideBar from "@/components/custom/SideBar";
import AddProjectModel from "@/components/custom/AddProjectModel";
import AddApiModal from "@/components/custom/AddApiModel";
import DataSidebar from "@/components/custom/DataSidebar";

export default function Home() {

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-slate-200 text-slate-800">
      <SideBar />
      <main className="flex-1 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold text-slate-700 mb-2">Welcome to AANG</h1>
        <p className="text-slate-500">Select an existing project or create a new one.</p>
      </main>
      <AddProjectModel />
      <AddApiModal />
      <DataSidebar />
    </div>
  );
}
