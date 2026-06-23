export const REFERENCES_DELIMITER = '<<<REFERENCES>>>';

/**
 * Normalizes a single reference line, stripping common list prefixes and backticks.
 * Handles:
 *   - "- `uuid`"     → "uuid"
 *   - "* uuid"       → "uuid"
 *   - "1. uuid"      → "uuid"
 *   - "`uuid`"       → "uuid"
 *   - bare "uuid"    → "uuid"
 */
function normalizeReferenceLine(line: string): string {
    return (
        line
            .trim()
            // Remove backticks
            .replace(/`/g, '')
            // Remove leading "- " or "* " bullet markers
            .replace(/^[-*]\s+/, '')
            // Remove leading numbered list markers like "1. " or "12. "
            .replace(/^\d+\.\s+/, '')
            .trim()
    );
}

export function parseChatResponse(raw: string): {
    answer: string;
    references: string[];
} {
    if (!raw) {
        return { answer: '', references: [] };
    }

    // Split using a regex that handles optional surrounding whitespace around <<<REFERENCES>>>
    const parts = raw.split(/\s*<<<REFERENCES>>>\s*/);
    const answerPart = parts[0] || '';
    const referencesPart = parts[1] || '';

    return {
        answer: answerPart.trim(),
        references: referencesPart
            ? referencesPart
                  .split(/\r?\n/)
                  .map(normalizeReferenceLine)
                  .filter(Boolean)
            : [],
    };
}
