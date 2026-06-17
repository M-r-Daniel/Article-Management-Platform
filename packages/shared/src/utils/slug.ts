/**
 * Generates a URL-safe slug from a given string.
 * Supports Latin, Arabic, and other Unicode characters, deduplicates hyphens,
 * and strips leading/trailing hyphens.
 *
 * @param title The title to slugify
 * @returns A clean, URL-safe slug
 */
export function generateSlug(title: string): string {
  return (
    title
      .trim()
      .toLowerCase()
      // Replace whitespace and common separators with a hyphen
      .replace(/[\s\-_]+/g, '-')
      // Remove characters that are not Unicode letters, numbers, or hyphens
      .replace(/[^\p{L}\p{N}\-]/gu, '')
      // Deduplicate hyphens
      .replace(/-+/g, '-')
      // Remove leading and trailing hyphens
      .replace(/^-+|-+$/g, '')
  );
}
