"use client";

import SideBar from "@/components/custom/SideBar";
import AddProjectModel from "@/components/custom/AddProjectModel";
import AddApiModal from "@/components/custom/AddApiModel";
import DataSidebar from "@/components/custom/DataSidebar";
import { DeleteModal } from "@/components/custom/DeleteModal";
import Main from "@/components/custom/Main";
import AddTestCaseModal from "@/components/custom/AddTestCaseModal";
import { Toaster } from 'sonner'

export default function Home() {

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-slate-200 text-slate-800">
      <SideBar />
      <Main />
      <AddProjectModel />
      <AddApiModal />
      <DataSidebar />
      <DeleteModal />
      <AddTestCaseModal />
      <Toaster
        theme="light"
        closeButton
        toastOptions={{
          classNames: {
            toast: "bg-slate-100/80 backdrop-blur-sm border border-slate-300 text-slate-800 shadow-md",
            title: "text-slate-900 font-medium",
            description: "text-slate-600",
            actionButton: "bg-slate-800 text-slate-100 hover:bg-slate-700 focus:ring-2 focus:ring-slate-500",
            cancelButton: "bg-transparent border border-slate-400 text-slate-600 hover:bg-slate-200",
          },
        }}
      />
    </div>
  );
}
