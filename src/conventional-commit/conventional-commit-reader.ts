import { Commit, ConventionalCommitType } from "./types"

export const readCommitMessage = (commitMessage: string): Commit => {
  const lineSeparatedCommitMessage = commitMessage.split("\n")
  const requiredInfo = readFirstLine(lineSeparatedCommitMessage[0])
  if (!requiredInfo?.isConventionalCommit) {
    return requiredInfo
  }
  if (lineSeparatedCommitMessage.length == 1) {
    return requiredInfo
  }
  if (lineSeparatedCommitMessage[1] !== "") {
    return {
      isConventionalCommit: false,
      subject: requiredInfo.subject,
    }
  }
  const bodyPart = lineSeparatedCommitMessage.slice(2)
  const { body, footerPart } = readBodyPart(bodyPart)
  if (footerPart.length === 0) {
  }
  return {
    ...requiredInfo,
    body: body?.trim(),
    breakingChanges:
      footerPart.length !== 0 ? readFooterPart(footerPart) : undefined,
  }
}

const readFirstLine = (commitMessageFirstLine: string): Commit => {
  const [typeAndScope, subject] = commitMessageFirstLine.split(":")

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
      subject: commitMessageFirstLine,
    }
  }

  const scopeRegex = /\(([^)]+)\)/
  const matches = scopeRegex.exec(typeAndScope)
  const scope = matches !== null ? matches[1] : undefined
  return {
    isConventionalCommit: true,
    type: type as ConventionalCommitType,
    scope,
    subject: subject.trim(),
  }
}

const readBodyPart = (
  bodyPart: string[],
): { body: string | undefined; footerPart: string[] } => {
  if (bodyPart.length == 0) {
    return { body: undefined, footerPart: [] }
  } else if (bodyPart.length == 1) {
    return { body: bodyPart[0], footerPart: [] }
  } else {
    if (bodyPart[0] === "") {
      return { body: undefined, footerPart: bodyPart.slice(1) }
    }
    const { body, footerPart } = readBodyPart(bodyPart.slice(1))
    return {
      body: `${bodyPart[0]}\n${body || ""}`,
      footerPart,
    }
  }
}

const readFooterPart = (footerPart: string[]): string => {
  const breakingChangesSearchString = "BREAKING CHANGES: "
  return footerPart.join("\n").replace(breakingChangesSearchString, "").trim()
}
