import { describe, it, expect } from "vitest"
import { readCommitMessage } from "../conventional-commit-reader"
import { ConventionalCommitTypes } from "../types"

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
        subject: "abcDef",
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

    it("should support multi line body when body have multiple line without blank line", () => {
      const commitMessage =
        "feat: abcDef\n" + "\n" + "body message\nsecond line body message"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
        body: "body message\nsecond line body message",
      })
    })

    it("should return breaking changes as part of body when commit footer is not separated by blank line", () => {
      const commitMessage = [
        "feat: abcDef",
        "",
        "body message",
        "BREAKING CHANGES: some breaking changes",
      ].join("\n")
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
        body: "body message\nBREAKING CHANGES: some breaking changes",
      })
    })

    it("should not add new line when body part end with just new line", () => {
      const commitMessage =
        "feat: abcDef\n" + "\n" + "body message\nsecond line body message\n"
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
        body: "body message\nsecond line body message",
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

    it("should support multiple line breaking changes", () => {
      const commitMessage = [
        "feat: abcDef",
        "",
        "body message",
        "",
        "BREAKING CHANGES: some breaking changes\nremaining",
      ].join("\n")
      const commitInfo = readCommitMessage(commitMessage)

      expect(commitInfo).toEqual({
        isConventionalCommit: true,
        type: "feat",
        subject: "abcDef",
        body: "body message",
        breakingChanges: "some breaking changes\nremaining",
      })
    })

    it.each([
      { fromMessage: "feat", expected: ConventionalCommitTypes.feat },
      { fromMessage: "fix", expected: ConventionalCommitTypes.fix },
      { fromMessage: "refactor", expected: ConventionalCommitTypes.refactor },
      { fromMessage: "perf", expected: ConventionalCommitTypes.perf },
      { fromMessage: "style", expected: ConventionalCommitTypes.style },
      { fromMessage: "test", expected: ConventionalCommitTypes.test },
      { fromMessage: "docs", expected: ConventionalCommitTypes.docs },
      { fromMessage: "build", expected: ConventionalCommitTypes.build },
      { fromMessage: "ops", expected: ConventionalCommitTypes.ops },
      { fromMessage: "chore", expected: ConventionalCommitTypes.chore },
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
