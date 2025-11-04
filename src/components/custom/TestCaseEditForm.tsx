import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import TestCaseFormField from "@/components/custom/TestCaseFormField";

interface EditState {
  name: string;
  expectedStatus: number | null;
  expectedBody: string;
  requestBody: string;
  headers: string;
}

interface TestCaseEditFormProps {
  initialData: {
    name: string;
    expectedStatus: number | null;
    expectedBody: any;
    requestBody: any;
    headers: any;
  };
  onSave: (data: EditState) => Promise<void>;
  onCancel: () => void;
}

const validateFields = (data: EditState): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.name?.trim()) {
    errors.name = "Name is required";
  }

  if (!data.expectedStatus) {
    errors.expectedStatus = "Expected status is required";
  }

  if (!data.expectedBody?.trim()) {
    errors.expectedBody = "Expected body is required";
  } else {
    try {
      JSON.parse(data.expectedBody);
    } catch {
      errors.expectedBody = "Must be valid JSON";
    }
  }

  if (!data.requestBody?.trim()) {
    errors.requestBody = "Request body is required";
  } else {
    try {
      JSON.parse(data.requestBody);
    } catch {
      errors.requestBody = "Must be valid JSON";
    }
  }

  if (!data.headers?.trim()) {
    errors.headers = "Headers are required";
  } else {
    try {
      JSON.parse(data.headers);
    } catch {
      errors.headers = "Must be valid JSON";
    }
  }

  return errors;
};

export default function TestCaseEditForm({ initialData, onSave, onCancel }: TestCaseEditFormProps) {
  const [editData, setEditData] = useState<EditState>({
    name: initialData.name || "",
    expectedStatus: initialData.expectedStatus || null,
    expectedBody: initialData.expectedBody ? JSON.stringify(initialData.expectedBody, null, 2) : "",
    requestBody: initialData.requestBody ? JSON.stringify(initialData.requestBody, null, 2) : "",
    headers: initialData.headers ? JSON.stringify(initialData.headers, null, 2) : "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSave = async () => {
    const validationErrors = validateFields(editData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      try {
        await onSave(editData);
      } catch (error) {
        setErrors({ submit: "Failed to save changes" });
      }
    }
  };

  return (
    <Card className="w-full border border-slate-200 shadow-sm rounded-[8px] p-4">
      <div className="space-y-4">
        <div className="flex-center justify-end w-full">
          <ButtonGroup>
            <Button variant="outline" onClick={handleSave}><Save className="h-4 w-4" /></Button>
            <Button variant="outline" onClick={onCancel}><X className="h-4 w-4" /></Button>
          </ButtonGroup>
        </div>
        <div className="flex-center flex-col gap-4">
          <div className="flex-center w-full gap-3">
            <TestCaseFormField
              label="Name"
              required
              value={editData.name}
              onChange={(value) => setEditData({ ...editData, name: value })}
              placeholder="Test case name"
              error={errors.name}
            />

            <TestCaseFormField
              label="Expected Status"
              required
              type="number"
              value={editData.expectedStatus || ""}
              onChange={(value) => setEditData({ ...editData, expectedStatus: parseInt(value) || null })}
              placeholder="200"
              error={errors.expectedStatus}
            />
          </div>

          <div className="flex w-full gap-3 items-stretch">
            <TestCaseFormField
              label="Expected Body (JSON)"
              required
              type="textarea"
              value={editData.expectedBody}
              onChange={(value) => setEditData({ ...editData, expectedBody: value })}
              placeholder='{"key": "value"}'
              error={errors.expectedBody}
              className="flex flex-col"
            />

            <TestCaseFormField
              label="Request Body (JSON)"
              required
              type="textarea"
              value={editData.requestBody}
              onChange={(value) => setEditData({ ...editData, requestBody: value })}
              placeholder='{"key": "value"}'
              error={errors.requestBody}
              className="flex flex-col"
            />
          </div>

          <TestCaseFormField
            label="Headers (JSON)"
            required
            type="textarea"
            value={editData.headers}
            onChange={(value) => setEditData({ ...editData, headers: value })}
            placeholder='{"Content-Type": "application/json"}'
            error={errors.headers}
          />

          {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
        </div>


      </div>
    </Card>
  );
}

export type { EditState };