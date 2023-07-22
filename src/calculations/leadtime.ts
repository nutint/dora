import dayjs, {Dayjs} from "dayjs";

type LeadTimeUnit = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export const averageLeadTime = (currentTime: Dayjs, commitTimes: Dayjs[]): LeadTimeUnit | undefined => {
  if(commitTimes.length === 0)
    return undefined

  const currentTimeInMilliseconds = currentTime.valueOf()
  const averageCommitTimeStamps = commitTimes
    .map(commitTime => currentTimeInMilliseconds - commitTime.valueOf())
    .reduce((summarized, current) => summarized + current, 0) / commitTimes.length

  const firstDay = dayjs(0)
  const averageDuration = dayjs(averageCommitTimeStamps)

  return {
    days: averageDuration.diff(firstDay, "day"),
    hours: averageDuration.diff(firstDay, "hours") % 24,
    minutes: averageDuration.diff(firstDay, "minutes") % 60,
    seconds: averageDuration.diff(firstDay, "seconds") % 60,
  }
};