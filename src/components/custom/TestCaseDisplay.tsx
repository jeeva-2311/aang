import { TestCase } from "@/types/app";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit2, Play, Trash2, Clock } from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
interface TestCaseDisplayProps {
  data: TestCase;
  onEdit: () => void;
  onDelete: () => void;
  onRun: () => void;
}

const formatDate = (date: string | Date) => {
  const d = new Date(date);
  return d.toISOString().replace("T", " ").slice(0, 19);
};

export default function TestCaseDisplay({
  data,
  onEdit,
  onDelete,
  onRun,
}: TestCaseDisplayProps) {
  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between p-0">

        <div className="flex-center flex-col gap-3 items-start">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold text-slate-800">
              {data.name || "Untitled Test Case"}
            </CardTitle>
            <Badge variant={data.result === "passed" ? "default" : data.result === "failed" ? "destructive" : "secondary"}>{data.result ?? "Not Run"}</Badge>
          </div>

          <div className="flex items-center gap-2 text-slate-600 text-sm">
            <Clock className="h-4 w-4" />
            <span className="font-medium">Last Run:</span>
            <span>{data.lastRunAt ? formatDate(data.lastRunAt) : "—"}</span>
          </div>
        </div>

        <ButtonGroup className="flex items-center">
          <Button variant="outline" size="icon" onClick={onEdit}>
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onDelete}>
            <Trash2 className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={onRun}>
            <Play className="h-4 w-4" />
          </Button>
        </ButtonGroup>
      </CardHeader>

      <Separator />

      <CardContent className="flex-center flex-col w-full gap-4 p-0 text-sm text-slate-700">
        <div className="flex w-full gap-4">
          <div className="w-full ">
            <span className="font-medium text-slate-800">Expected Status:</span>
            <div>{data.expectedStatus ?? "—"}</div>
          </div>

          <div className="w-full gap-3">
            <span className="font-medium text-slate-800">Headers:</span>
            <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto">
              {data.headers ? JSON.stringify(data.headers) : "—"}
            </pre>
          </div>
        </div>

        <div className="w-full flex gap-4">
          <div className="w-full gap-3">
            <span className="font-medium text-slate-800">Expected Body:</span>
            <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto">
              {data.expectedBody ? JSON.stringify(data.expectedBody) : "—"}
            </pre>
          </div>

          <div className="w-full gap-3">
            <span className="font-medium text-slate-800">Request Body:</span>
            <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto">
              {data.requestBody ? JSON.stringify(data.requestBody) : "—"}
            </pre>
          </div>
        </div>
      </CardContent>
    </>
  );
}
