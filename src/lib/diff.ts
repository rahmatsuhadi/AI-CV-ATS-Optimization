export interface DiffChunk {
  type: "added" | "removed" | "unchanged";
  value: string;
}

export function computeWordDiff(oldStr: string, newStr: string): DiffChunk[] {
  // If either string is empty, handle as pure addition or removal
  if (!oldStr) {
    return [{ type: "added", value: newStr }];
  }
  if (!newStr) {
    return [{ type: "removed", value: oldStr }];
  }

  const oldWords = oldStr.split(/(\s+)/);
  const newWords = newStr.split(/(\s+)/);

  const dp: number[][] = Array.from({ length: oldWords.length + 1 }, () =>
    Array(newWords.length + 1).fill(0),
  );

  for (let i = 1; i <= oldWords.length; i++) {
    for (let j = 1; j <= newWords.length; j++) {
      if (oldWords[i - 1] === newWords[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }

  const result: DiffChunk[] = [];
  let i = oldWords.length;
  let j = newWords.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && oldWords[i - 1] === newWords[j - 1]) {
      result.unshift({ type: "unchanged", value: oldWords[i - 1] });
      i--;
      j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      result.unshift({ type: "added", value: newWords[j - 1] });
      j--;
    } else {
      result.unshift({ type: "removed", value: oldWords[i - 1] });
      i--;
    }
  }

  // Merge contiguous chunks of same type for cleaner rendering
  const merged: DiffChunk[] = [];
  for (const chunk of result) {
    if (merged.length > 0 && merged[merged.length - 1].type === chunk.type) {
      merged[merged.length - 1].value += chunk.value;
    } else {
      merged.push(chunk);
    }
  }

  return merged;
}
