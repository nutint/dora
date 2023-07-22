import { describe, it, expect } from "vitest"
import {greeter} from "../index";

describe("index", () => {
  describe("greeter", () => {
    it("should greet John", () => {
      const actual = greeter("John")

      expect(actual).toEqual("Hello John")
    })
  })
})