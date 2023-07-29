import { describe, it } from "vitest"
import { JIRAAPICaller } from "../jira-api-caller"

describe("JIRAHelper", () => {
  const jiraHelper = JIRAAPICaller()
  describe("addFixVersion", () => {
    const { addFixVersion } = jiraHelper
    it("should pass", async () => {
      await addFixVersion("ABC-123", "1.0.0")
    })
  })
})
