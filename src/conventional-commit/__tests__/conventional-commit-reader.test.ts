import { describe, it, expect } from "vitest"
import { readCommitMessage } from "../conventional-commit-reader"
import { ConventionalCommitType } from "../types"

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

    it.each([
      { fromMessage: "feat", expected: ConventionalCommitType.feat },
      { fromMessage: "fix", expected: ConventionalCommitType.fix },
      { fromMessage: "refactor", expected: ConventionalCommitType.refactor },
      { fromMessage: "perf", expected: ConventionalCommitType.perf },
      { fromMessage: "style", expected: ConventionalCommitType.style },
      { fromMessage: "test", expected: ConventionalCommitType.test },
      { fromMessage: "docs", expected: ConventionalCommitType.docs },
      { fromMessage: "build", expected: ConventionalCommitType.build },
      { fromMessage: "ops", expected: ConventionalCommitType.ops },
      { fromMessage: "chore", expected: ConventionalCommitType.chore },
    ])(
      "read commit from message $fromMessage should be type $expected",
      ({ fromMessage, expected }) => {
        const commitMessage = `${fromMessage}: abcDef`
        const actual = readCommitMessage(commitMessage)
        expect(actual).toEqual({
          isConventionalCommit: true,
          type: expected,
          subject: "abcDef",
        })
      },
    )
  })
})
