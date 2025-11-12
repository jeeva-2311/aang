"use client"

import { useUIStore } from "@/store/uiStore"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GenerateTestCaseForm from "@/components/custom/GenerateTestCaseForm"
import CustomTestCaseForm from "@/components/custom/CustomTestCaseForm"

export default function AddTestCaseModal() {
  const { modal, closeModal } = useUIStore();
  const open = modal.newTestCase;

  const handleClose = () => {
    closeModal("newTestCase");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="bg-slate-100 border border-slate-300 text-slate-800 shadow-xl max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Add New Test Case
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="custom" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-2 bg-slate-200">
            <TabsTrigger value="custom" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              Custom
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-slate-800 data-[state=active]:text-white">
              Generate
            </TabsTrigger>
          </TabsList>

          <TabsContent value="custom" className="mt-4">
            <CustomTestCaseForm onClose={handleClose} />
          </TabsContent>

          <TabsContent value="generate" className="mt-4">
            <GenerateTestCaseForm onClose={handleClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}