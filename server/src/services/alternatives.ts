export interface AlternativeItem {
  id: string;
  title: string;
  description: string;
  score?: number;
  assessment?: 'High signal' | 'Moderate signal' | 'Needs review';
  dataSignal?: string;
}

export function parseAlternatives(alternatives: string[]): AlternativeItem[] {
  return alternatives
    .map((text, index) => ({
      id: `alt-${index + 1}`,
      title: text.trim(),
      description: 'Sample candidate item evaluated by the starter heuristics.',
    }))
    .filter((item) => item.title.length > 0);
}
