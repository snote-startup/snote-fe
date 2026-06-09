export const REFERENCES_DELIMITER = '<<<REFERENCES>>>';

export function parseChatResponse(raw: string): {
    answer: string;
    references: string[];
} {
    if (!raw) {
        return { answer: '', references: [] };
    }
    const [answerPart, referencesPart] = raw.split(REFERENCES_DELIMITER);

    return {
        answer: answerPart.trim(),
        references: referencesPart
            ? referencesPart
                  .split(/\r?\n/)
                  .map((line) => line.trim())
                  .filter(Boolean)
            : [],
    };
}
