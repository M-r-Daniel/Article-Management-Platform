import { describe, expect, it } from 'bun:test';
import { generateSlug } from '../utils/slug';

describe('generateSlug', () => {
  it('converts English title to lowercase and replaces spaces with hyphens', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });

  it('removes special characters and punctuation', () => {
    expect(generateSlug('Hello, World!!! @2026')).toBe('hello-world-2026');
  });

  it('handles Arabic/Unicode characters correctly', () => {
    expect(generateSlug('أحداث اليوم: مقالة جديدة')).toBe('أحداث-اليوم-مقالة-جديدة');
  });

  it('deduplicates hyphens', () => {
    expect(generateSlug('hello---world')).toBe('hello-world');
    expect(generateSlug('hello - - world')).toBe('hello-world');
  });

  it('trims leading and trailing hyphens and whitespace', () => {
    expect(generateSlug(' -hello world- ')).toBe('hello-world');
  });

  it('returns an empty string if only invalid characters are supplied', () => {
    expect(generateSlug('!!! @#$')).toBe('');
  });
});
