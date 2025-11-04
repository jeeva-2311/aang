export function getMethodStyle(method: string) {
  const methodStyles = {
    GET: "bg-emerald-100 text-emerald-700 border-emerald-200",
    POST: "bg-blue-100 text-blue-700 border-blue-200",
    PUT: "bg-amber-100 text-amber-700 border-amber-200",
    DELETE: "bg-rose-100 text-rose-700 border-rose-200",
    DEFAULT: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return methodStyles[method as keyof typeof methodStyles] || methodStyles.DEFAULT;
}