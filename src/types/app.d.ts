export interface TestCaseResult {
  status: string;
  expectedStatus: number;
  expectedBody: object;
  actualStatus: number;
  actualBody: object;
  request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: object;
  };
  testCase: any;
}

export interface TestCase {
  id: number;
  apiId: number;
  name: string;
  requestBody?: Record<string, any>;
  headers?: Record<string, any> | null;
  expectedStatus?: number | null;
  expectedBody?: Record<string, any>;
  lastRunAt?: Date | null;
  result?: TestCaseResult;
  url?: string
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