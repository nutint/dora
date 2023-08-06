import { execSync } from "child_process"

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
})
