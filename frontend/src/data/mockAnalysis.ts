// Deterministic mock data standing in for a real face-detection backend.
// Keep this isolated so a real API can be swapped in later without
// touching any component logic.

export interface Subject {
  id: string;
  label: string;
  confidence: number;
}

export const MOCK_SUBJECTS_NORMAL: Subject[] = [
  { id: 's1', label: 'Subject 1', confidence: 0.98 },
  { id: 's2', label: 'Subject 2', confidence: 0.97 },
  { id: 's3', label: 'Subject 3', confidence: 0.95 },
  { id: 's4', label: 'Subject 4', confidence: 0.96 },
  { id: 's5', label: 'Subject 5', confidence: 0.94 },
];

export const MOCK_SUBJECT_ANOMALY: Subject = {
  id: 's6',
  label: 'Subject 6',
  confidence: 0.41,
};

export const LIGHT_VERDICTS = [
  {
    title: 'SUSPICIOUSLY NORMAL',
    body: 'Subject exhibits zero paranormal markers, which is itself statistically abnormal.',
  },
  {
    title: 'HAUNTED SINCE 2014',
    body: 'Cross-referenced against our historical database. This is not the first scan.',
  },
  {
    title: 'DO NOT ASK QUESTIONS',
    body: 'This classification has been sealed for your own comfort.',
  },
  {
    title: 'PROBABLY FINE',
    body: 'Entity signature detected but appears to be on its lunch break.',
  },
  {
    title: 'MILD HAUNTING, GREAT LIGHTING',
    body: 'Paranormal activity confirmed. Photo composition remains excellent.',
  },
];

export const FINAL_REPORT = {
  subjects: 5,
  human: 4,
  unidentified: 1,
  threat: 'MODERATE',
  recommendation: 'LEAVE THE PREMISES.',
};
