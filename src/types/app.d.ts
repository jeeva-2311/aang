export interface TestCase {
  id: number;
  apiId: number;
  name: string;
  requestBody?: Record<string, any> | null;
  headers?: Record<string, any> | null;
  expectedStatus?: number | null;
  expectedBody?: Record<string, any> | null;
  lastRunAt?: Date | null;
  result?: string | null;
}

export interface API {
  id: number;
  projectId: number;
  name: string;
  url: string;
  method: string;
  testCases: TestCase[];
  createdAt: Date;
}

export interface Project {
  id: number;
  name: string;
  baseUrl: string;
  apis: API[];
  createdAt: Date;
}