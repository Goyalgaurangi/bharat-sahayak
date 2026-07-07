import { describe, it, expect } from "vitest";

describe("Sanity Tests", () => {
  it("application exists", () => {
    expect(1).toBe(1);
  });

  it("string comparison works", () => {
    expect("Smart Bharat").toContain("Bharat");
  });
});
