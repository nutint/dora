import { describe, expect, it } from "vitest"
import { JIRAAPICaller } from "../jira-api-caller"
import { JIRAAuthenticator } from "../jira-authenticator"

describe("JIRAAuthenticator", () => {
  const jiraAuthenticator = JIRAAPICaller()
  describe("authenticate", () => {
    const { authenticate } = JIRAAuthenticator()
    it("should return JIRAApiCaller", async () => {
      const actual = await authenticate()

      expect(actual).toBeTruthy()
    })
  })
})
