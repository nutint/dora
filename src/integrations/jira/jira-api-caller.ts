export type IJIRAHelper = {
  addFixVersion: (ticketNumber: string, fixVersion: string) => Promise<void>
}

export const JIRAAPICaller = (): IJIRAHelper => ({
  addFixVersion: async (ticketNumber: string, fixVersion: string) => {},
})
