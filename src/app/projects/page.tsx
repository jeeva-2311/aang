"use client";

import SideBar from "@/components/custom/SideBar";
import AddProjectModel from "@/components/custom/AddProjectModel";
import AddApiModal from "@/components/custom/AddApiModel";
import DataSidebar from "@/components/custom/DataSidebar";
import { DeleteModal } from "@/components/custom/DeleteModal";
import Main from "@/components/custom/Main";

export default function Home() {

  return (
    <div className="flex min-h-screen bg-linear-to-br from-slate-200 via-slate-300 to-slate-200 text-slate-800">
      <SideBar />
      <Main />
      <AddProjectModel />
      <AddApiModal />
      <DataSidebar />
      <DeleteModal />
    </div>
  );
}
