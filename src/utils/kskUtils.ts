/**
 * Automatically formats a KSK number according to factory standards:
 * - If the user enters a KSK containing 4 digits, automatically prepend 400.
 *   Example: 1112 → 4001112
 * - If the user enters a KSK containing 3 digits, automatically prepend 4000.
 *   Example: 950 → 4000950
 * - If already formatted or other length, preserves valid input.
 */
export function formatKskNumber(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (!trimmed) return '';

  // 1. Pure digits check
  if (/^\d+$/.test(trimmed)) {
    if (trimmed.length === 4) {
      return `400${trimmed}`;
    }
    if (trimmed.length === 3) {
      return `4000${trimmed}`;
    }
    return trimmed;
  }

  // 2. If user enters with a prefix like #950 or #1112
  const digitsOnly = trimmed.replace(/\D/g, '');
  if (/^#?\d{3}$/.test(trimmed)) {
    return `4000${digitsOnly}`;
  }
  if (/^#?\d{4}$/.test(trimmed)) {
    return `400${digitsOnly}`;
  }

  return trimmed;
}

/**
 * Parses raw multi-line or separated text into an array of auto-formatted KSK strings.
 */
export function parseAndFormatKskInput(input: string): string[] {
  if (!input) return [];
  const rawTokens = input
    .split(/[\s,\n]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0);

  return rawTokens.map(formatKskNumber);
}
