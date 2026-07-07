import { describe, it, expect } from 'vitest';

const add = (a: number, b: number) => a + b;

describe('Basic Math Operations', () => {
  it('should correctly add two numbers together', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  it('should verify that true is true', () => {
    expect(true).toBe(true);
  });
});
