import { Commit, ConventionalCommitType } from "./types"

export const readCommitMessage = (commitMessage: string): Commit => {
  const colonSeparatedMessage = commitMessage.split(":")
  const [typeAndScope] = colonSeparatedMessage

  const type = typeAndScope.split("(")[0]
  if (
    ![
      ConventionalCommitType.feat,
      ConventionalCommitType.fix,
      ConventionalCommitType.refactor,
      ConventionalCommitType.perf,
      ConventionalCommitType.style,
      ConventionalCommitType.test,
      ConventionalCommitType.docs,
      ConventionalCommitType.build,
      ConventionalCommitType.ops,
      ConventionalCommitType.chore,
    ].includes(type as ConventionalCommitType)
  ) {
    return {
      isConventionalCommit: false,
      subject: commitMessage,
    }
  }

  const subjectAndBodyAndFooter = colonSeparatedMessage.slice(1).join(":")
  const [subject, bodySeparator, body, footerSeparator, footer] =
    subjectAndBodyAndFooter.split("\n")
  if (bodySeparator !== undefined && bodySeparator !== "") {
    return {
      isConventionalCommit: false,
      subject: commitMessage,
    }
  }

  if (footerSeparator !== undefined && footerSeparator !== "") {
    return {
      isConventionalCommit: false,
      subject: commitMessage,
    }
  }

  const breakingChangesSearchString = "BREAKING CHANGES: "
  const breakingChanges =
    footer && footer.includes(breakingChangesSearchString)
      ? footer.replace(breakingChangesSearchString, "")
      : undefined

  const scopeRegex = /\(([^)]+)\)/
  const matches = scopeRegex.exec(typeAndScope)
  const scope = matches !== null ? matches[1] : undefined
  return {
    isConventionalCommit: true,
    type: type as ConventionalCommitType,
    scope,
    subject: subject.trim(),
    body,
    breakingChanges,
  }
}
