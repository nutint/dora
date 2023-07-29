import { IJIRAHelper, JIRAAPICaller } from "./jira-api-caller"

export type IJIRAAuthenticator = {
  authenticate: () => Promise<IJIRAHelper>
}

export const JIRAAuthenticator = () => ({
  authenticate: async (): Promise<IJIRAHelper> => JIRAAPICaller(),
})
