export const ConventionalCommitTypes = {
  feat: "feat",
  fix: "fix",
  refactor: "refactor",
  perf: "perf",
  style: "style",
  test: "test",
  docs: "docs",
  build: "build",
  ops: "ops",
  chore: "chore",
} as const

export type ConventionalCommitType =
  (typeof ConventionalCommitTypes)[keyof typeof ConventionalCommitTypes]

export type NonConventionalCommit = {
  isConventionalCommit: false
  subject: string
}

export type ConventionalCommit = {
  isConventionalCommit: true
  type: ConventionalCommitType
  subject: string
  scope?: string
  body?: string
  breakingChanges?: string
}

export type Commit = NonConventionalCommit | ConventionalCommit
