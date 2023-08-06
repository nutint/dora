import { describe, it, expect } from "vitest"
import { readCommitMessage } from "../conventional-commit-reader"

describe("ConventionalCommitReader", () => {
  describe("readCommitMessage", () => {
    it("should return isConventionalCommit false when commit is not conventional format", () => {
      const commitMessage = "abcDef"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: false,
        subject: commitMessage,
      })
    })

    it("should return isConventionalCommit false when commit type is not correct", () => {
      const commitMessage = "abc: abcDef"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: false,
        subject: commitMessage,
      })
    })

    it("should return isConventionalCommit when commit type is correct, and contains subject", () => {
      const commitMessage = "feat: abcDef"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
      })
    })

    it("should return scope when contains scope", () => {
      const commitMessage = "feat(scope): abcDef"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        scope: "scope",
        subject: "abcDef",
      })
    })

    it("should return isConventionalCommit false when commit body is not separated by blank line", () => {
      const commitMessage = "feat: abcDef\n" + "body message"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: false,
        subject: commitMessage,
      })
    })

    it("should include body is message contains body separated by blank line", () => {
      const commitMessage = "feat: abcDef\n" + "\n" + "body message"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
        body: "body message",
      })
    })

    it("should return isConventionalCommit false when commit footer is not separated by blank line", () => {
      const commitMessage = [
        "feat: abcDef",
        "",
        "body message",
        "BREAKING CHANGES: some breaking changes",
      ].join("\n")
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: false,
        subject: commitMessage,
      })
    })

    it("should include breaking changes message when footer contains breaking changes", () => {
      const commitMessage = [
        "feat: abcDef",
        "",
        "body message",
        "",
        "BREAKING CHANGES: some breaking changes",
      ].join("\n")
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
        body: "body message",
        breakingChanges: "some breaking changes",
      })
    })
  })
})
