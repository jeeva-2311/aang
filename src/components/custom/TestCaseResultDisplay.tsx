export interface TestCaseRunResultProps {
  result: {
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
  };
}

export default function TestCaseResultDisplay({ result }: TestCaseRunResultProps) {
  const { status, expectedStatus, expectedBody, actualStatus, actualBody, request } = result;

  return (
    <>
      {/* 🧾 Request Section */}
      <div className="mt-3 text-xs">
        <h3 className="font-medium text-slate-800 mb-1">Request Details</h3>
        <div className="space-y-1">
          <p><span className="font-medium">URL:</span> {request.url}</p>
          <p><span className="font-medium">Method:</span> {request.method}</p>
          <p><span className="font-medium">Headers:</span> {JSON.stringify(request.headers, null, 2)}</p>
          <p><span className="font-medium">Body:</span> {JSON.stringify(request.body, null, 2)}</p>
        </div>
      </div>

      {/* 🎯 Expected vs Actual */}
      <div className="grid grid-cols-2 gap-4 mt-4 text-xs items-stretch">
        <div className="space-y-1 flex flex-col">
          <h3 className="font-medium text-slate-800">Expected</h3>
          <p><span className="font-medium">Status:</span> {expectedStatus}</p>
          <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto flex-1">
            {JSON.stringify(expectedBody, null, 2)}
          </pre>
        </div>

        <div className="space-y-1 flex flex-col">
          <h3 className="font-medium text-slate-800">Actual</h3>
          <p><span className="font-medium">Status:</span> {actualStatus}</p>
          <pre className="bg-slate-50 p-2 rounded text-xs overflow-auto flex-1">
            {JSON.stringify(actualBody, null, 2)}
          </pre>
        </div>
      </div>

    </>
  );
}
