export interface Report {
  id: string
  type: string
  period: string
  data: Record<string, any>
  generatedAt: string
}
