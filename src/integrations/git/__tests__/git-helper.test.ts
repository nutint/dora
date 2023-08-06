import { describe, it, expect, vi, beforeEach } from "vitest"
import { GitHelper } from "../git-helper"
import { execSync } from "child_process"
import gitCommitInfo from "git-commit-info"
// @ts-ignore
import dayjs from "dayjs"

vi.mock("child_process", () => ({
  execSync: vi.fn(),
}))

vi.mock("git-commit-info")

describe("GitHelper", () => {
  const origin = "origin"
  const gitHelper = GitHelper({ origin })
  describe("clearAllTags", () => {
    const { clearAllTags } = gitHelper
    it("should pass", () => {
      clearAllTags()
    })
  })

  describe("getAllTags", () => {
    const { getAllTags } = gitHelper
    beforeEach(() => {
      ;(execSync as any)
        .mockClear()
        .mockReturnValue("0.1.0\n0.1.1\n0.1.2\n0.2.0\n1.2.0\n")
    })
    it("should pass", () => {
      getAllTags()

      expect(execSync).toHaveBeenCalledWith("git tag")
    })

    it("should return tags correctly", () => {
      const actual = getAllTags()

      expect(actual).toEqual(["0.1.0", "0.1.1", "0.1.2", "0.2.0", "1.2.0"])
    })
  })

  describe("addTag", () => {
    const { addTag } = gitHelper

    beforeEach(() => {
      ;(execSync as any).mockClear()
    })

    it("should add tag correctly", () => {
      addTag("1.2345")

      expect(execSync).toHaveBeenCalledWith("git tag 1.2345")
    })
  })

  describe("pushTag", () => {
    const { pushTag } = gitHelper

    beforeEach(() => {
      ;(execSync as any).mockClear()
    })

    it("should add tag correctly", () => {
      pushTag("1.2345")

      expect(execSync).toHaveBeenCalledWith("git push origin 1.2345")
    })
  })

  describe("deleteTag", () => {
    const { deleteTag } = gitHelper

    beforeEach(() => {
      ;(execSync as any).mockClear()
    })

    it("should add tag correctly", () => {
      deleteTag("1.2345")

      expect(execSync).toHaveBeenCalledWith("git tag -d 1.2345")
    })
  })

  describe("deleteRemoteTag", () => {
    const { deleteRemoteTag } = gitHelper

    beforeEach(() => {
      ;(execSync as any).mockClear()
    })

    it("should add tag correctly", () => {
      deleteRemoteTag("1.2345")

      expect(execSync).toHaveBeenCalledWith("git push --delete origin 1.2345")
    })
  })

  describe("getCommits", () => {
    const { getCommits } = gitHelper

    beforeEach(() => {
      ;(execSync as any).mockClear().mockReturnValue(["abc\ndef"])
    })

    it("should add tag correctly", () => {
      getCommits("begin", "end")

      expect(execSync).toHaveBeenCalledWith(
        'git log --pretty=format:" % h" ^begin end',
      )
    })

    it("should return correctly", () => {
      const actual = getCommits("begin", "end")

      expect(actual).toEqual(["abc", "def"])
    })

    it("should support transformer", () => {
      const actual = getCommits(
        "begin",
        "end",
        (commitHash: string): string => `hello ${commitHash}`,
      )

      expect(actual).toEqual(["hello abc", "hello def"])
    })
  })

  describe("getCommitInfo", () => {
    const { getCommitInfo } = gitHelper

    const commitHash = "commitHash"
    const responseCommitInfo = {
      message: "message",
      date: "2012-09-09",
    }

    beforeEach(() => {
      ;(gitCommitInfo as any).mockClear().mockReturnValue(responseCommitInfo)
    })

    it("should call gitCommitInfo correctly", () => {
      getCommitInfo(commitHash)

      expect(gitCommitInfo).toHaveBeenCalledWith({ commit: commitHash })
    })

    it("should return correctly", () => {
      const actual = getCommitInfo(commitHash)

      expect(actual).toEqual({
        message: responseCommitInfo.message,
        date: dayjs(responseCommitInfo.date),
      })
    })

    it("should throw error when message is undefined", () => {
      ;(gitCommitInfo as any).mockClear().mockReturnValue({
        ...responseCommitInfo,
        message: undefined,
      })

      expect(() => getCommitInfo(commitHash)).toThrow(
        new Error("Invalid commit as required message, and commit date"),
      )
    })

    it("should throw error when date is not defined", () => {
      ;(gitCommitInfo as any).mockClear().mockReturnValue({
        ...responseCommitInfo,
        date: undefined,
      })

      expect(() => getCommitInfo(commitHash)).toThrow(
        new Error("Invalid commit as required message, and commit date"),
      )
    })
  })
})
