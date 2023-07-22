import {describe, expect, it} from "vitest"
// @ts-ignore
import dayjs from "dayjs"
import {averageLeadTime} from "../leadtime"

describe("LeadTime", () => {
  describe("averageLeadTime", () => {
    const currentTime = dayjs()
    it("should return undefined if commit time array is empty", () => {
      const actual = averageLeadTime(currentTime, [])

      expect(actual).toBeUndefined()
    })

    it("should return 1 day if commit time is one day away from current time", () => {
      const actual = averageLeadTime(currentTime, [currentTime.add(-1, "day")])

      expect(actual).toEqual({
        days: 1,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    })

    it("should return 2 days if commit time average is 2 days away from current time", () => {
      const actual = averageLeadTime(currentTime,
        [
          currentTime.add(-1, "day"),
          currentTime.add(-3, "day")
        ])

      expect(actual).toEqual({
        days: 2,
        hours: 0,
        minutes: 0,
        seconds: 0,
      })
    })

    it("should calculate all unites correctly", () => {
      const actual = averageLeadTime(currentTime,
        [
          currentTime.add(-1, "day").add(-1, "hours").add(-1, "minutes").add(-1, "seconds"),
          currentTime.add(-3, "day").add(-3, "hours").add(-3, "minutes").add(-3, "seconds")
        ])

      expect(actual).toEqual({
        days: 2,
        hours: 2,
        minutes: 2,
        seconds: 2,
      })
    })
  })
})