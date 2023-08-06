import { execSync } from "child_process"
import gitCommitInfo from "git-commit-info"
import dayjs, { Dayjs } from "dayjs"

type GitHelperConfig = {
  origin: string
}

export const GitHelper = (config: GitHelperConfig) => ({
  clearAllTags: () => {},
  getAllTags: () => {
    const result = execSync("git tag").toString()
    return result.split("\n").filter((tag) => tag !== "")
  },
  addTag: (tag: string) => {
    execSync(`git tag ${tag}`)
  },
  pushTag: (tag: string) => {
    execSync(`git push ${config.origin} ${tag}`)
  },
  deleteTag: (tag: string) => {
    execSync(`git tag -d ${tag}`)
  },
  deleteRemoteTag: (tag: string) => {
    execSync(`git push --delete ${config.origin} ${tag}`)
  },
  getCommits: <T>(
    begin: string,
    end: string,
    transformer?: (commitHash?: string) => T,
  ): string[] | T[] => {
    const result = execSync(`git log --pretty=format:" % h" ^${begin} ${end}`)
    const rawResult = result.toString().split("\n")
    return transformer ? rawResult.map(transformer) : rawResult
  },
  getCommitInfo: (commitHash: string): { message: string; date: Dayjs } => {
    const { message, date } = gitCommitInfo({ commit: commitHash })
    if (date === undefined || message === undefined) {
      throw new Error("Invalid commit as required message, and commit date")
    }
    return {
      message,
      date: dayjs(date),
    }
  },
})
