import { describe, expect, it } from 'bun:test';
import { normalizeURLPath } from './common';

describe('normalizeURLPath', () => {
  const data = [
    { path: '/', expected: '/' },
    { path: '/items', expected: '/items' },
    { path: '/items/', expected: '/items' },
    { path: 'items/', expected: '/items' },
    { path: '//items/', expected: '/items' },
    { path: '/items//', expected: '/items' },
  ];

  data.forEach((entry) => {
    it(`normalize "${entry.path}" to "${entry.expected}"`, () => {
      const result = normalizeURLPath(entry.path);
      expect(result).toBe(entry.expected);
    });
  });
});
