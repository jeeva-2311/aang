"use client";

import { TestCase } from "@/types/app";
import { useState } from "react";
import { useDataStore } from "@/store/dataStore";
import axios from "axios";
import TestCaseDisplay from "./TestCaseDisplay";
import TestCaseEditForm, { EditState } from "./TestCaseEditForm";
import TestCaseResultDisplay from "./TestCaseResultDisplay";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function TestCaseView({ data }: { data: TestCase }) {
  const [edit, setEdit] = useState(false);

  const { deleteTestCaseFromAPI, activeApi, activeProject, updateTestCaseInAPI } = useDataStore();

  const handleSave = async (editData: EditState) => {
    const payload = {
      id: data.id,
      name: editData.name,
      expectedStatus: editData.expectedStatus,
      expectedBody: JSON.parse(editData.expectedBody),
      requestBody: JSON.parse(editData.requestBody),
      headers: JSON.parse(editData.headers),
    };

    const response = await axios.patch("/api/test-cases", payload);

    if (response.status === 200) {
      updateTestCaseInAPI(activeProject as number, activeApi as number, { ...response.data });
      setEdit(false);
    }
  };

  const handleDelete = async () => {
    try {
      const { status } = await axios.delete("/api/test-cases", {
        data: { id: data.id },
      });
      if (status === 200) {
        deleteTestCaseFromAPI(activeProject as number, activeApi as number, data.id);
      }
    } catch (error) {
      console.error("Failed to delete test case", error);
    }
  };

  const handleRun = async () => {
    try {
      const result = await axios.post("/api/runner", { id: data.id });
      console.log(result);
      if (result.status === 200) {
        const { testCase, ...rest } = result.data;
        const transformed = {
          ...testCase,
          result: rest
        };
        updateTestCaseInAPI(activeProject as number, activeApi as number, { ...transformed });
      }
    } catch (error) {
      console.error("Failed to run test", error);
    }
  };

  if (!data) {
    return <p className="text-sm text-slate-500">No test case data available.</p>;
  }

  return (
    <>
      {edit ? (
        <TestCaseEditForm
          initialData={{
            name: data.name,
            expectedStatus: data.expectedStatus as number,
            expectedBody: data.expectedBody,
            requestBody: data.requestBody,
            headers: data.headers,
            url: data.url as string
          }}
          onSave={handleSave}
          onCancel={() => setEdit(false)}
        />
      ) : (
        <Card className="w-full border border-slate-200 shadow-sm rounded-[8px] p-4 gap-4">
          <TestCaseDisplay
            data={data}
            onEdit={() => setEdit(true)}
            onDelete={handleDelete}
            onRun={handleRun}
          />
          {(data?.result && typeof data?.result !== "string") && (
            <>
              <Separator />
              <Accordion type="single" collapsible defaultValue="result">
                <AccordionItem value="result" className="border-none">
                  <AccordionTrigger className="text-slate-700 font-medium hover:no-underline hover:bg-slate-100 px-3">
                    <div className="flex justify-between items-center text-sm w-full">
                      <h2 className="font-semibold text-slate-800">Test Run Result</h2>
                      <Badge variant={data?.result?.status === "passed" ? "default" : "destructive"} >
                        {data?.result?.status?.toUpperCase()}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <TestCaseResultDisplay result={data?.result} />
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </>
          )}
        </Card>
      )}
    </>
  );
}