// TODO: Implement reports API service
export const reportsApi = {
  generate: async (_filters: any) => {},
  export: async (_reportId: string, _format: 'pdf' | 'excel') => {},
  getByBarber: async (_barberId: string) => {},
  getByBarbershop: async (_shopId: string) => {},
  getByPeriod: async (_startDate: string, _endDate: string) => {},
}
