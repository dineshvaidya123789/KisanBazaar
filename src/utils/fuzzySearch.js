/**
 * Calculates the Levenshtein distance between two strings.
 * Used for typo tolerance in search.
 */
export const getLevenshteinDistance = (a, b) => {
    const matrix = [];

    // Increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    // Increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
};

/**
 * Checks if a query is a fuzzy match for a target string.
 * @param {string} query 
 * @param {string} target 
 * @param {number} maxDistance - Maximum allowed edits
 */
export const isFuzzyMatch = (query, target, maxDistance = 2) => {
    const q = query.toLowerCase().trim();
    const t = target.toLowerCase().trim();

    // 1. Direct contains (Standard matching)
    if (t.includes(q)) return true;

    // 2. Short queries shouldn't have high tolerance
    if (q.length < 3) return false;

    // 3. Distance check
    // Optimization: if length difference is too high, it's not a match
    if (Math.abs(q.length - t.length) > maxDistance) return false;

    const distance = getLevenshteinDistance(q, t);
    return distance <= maxDistance;
};
