export const readCommitMessage = (commitMessage: string) => {
  const colonSeparatedMesssage = commitMessage.split(":")
  const [typeAndScope] = colonSeparatedMesssage

  const type = typeAndScope.split("(")[0]
  if (!["feat"].includes(type)) {
    return {
      isConventionalCommit: false,
      subject: commitMessage,
    }
  }

  const subjectAndBodyAndFooter = colonSeparatedMesssage.slice(1).join(":")
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
    type,
    scope,
    subject: subject.trim(),
    body,
    breakingChanges,
  }
}
