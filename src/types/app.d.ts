export interface API {
  id: string
  name: string
  method: string
  url: string
  body?: string
  headers?: Record<string, string>
}

export interface Project {
  id: string
  name: string
  apis: API[]
  baseUrl: string
}