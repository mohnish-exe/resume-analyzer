// Local Storage utilities for Resume Analyzer

// Keys for localStorage
const STORAGE_KEYS = {
  RESUME_DRAFT: 'resume_analyzer_draft',
  JOB_DESCRIPTION: 'resume_analyzer_job',
  ANALYSIS_HISTORY: 'resume_analyzer_history',
} as const;

// Types
export interface ResumeDraft {
  content: string;
  lastSaved: string;
}

export interface JobDescription {
  title: string;
  company: string;
  description: string;
  requirements: string[];
  lastSaved: string;
}

export interface AnalysisResult {
  id: string;
  resumeSnippet: string;
  jobTitle: string;
  company: string;
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
  analyzedAt: string;
}

// Resume Draft functions
export function saveResumeDraft(content: string): void {
  const draft: ResumeDraft = {
    content,
    lastSaved: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.RESUME_DRAFT, JSON.stringify(draft));
}

export function getResumeDraft(): ResumeDraft | null {
  const data = localStorage.getItem(STORAGE_KEYS.RESUME_DRAFT);
  if (!data) return null;
  try {
    return JSON.parse(data) as ResumeDraft;
  } catch {
    return null;
  }
}

export function clearResumeDraft(): void {
  localStorage.removeItem(STORAGE_KEYS.RESUME_DRAFT);
}

// Job Description functions
export function saveJobDescription(job: Omit<JobDescription, 'lastSaved'>): void {
  const data: JobDescription = {
    ...job,
    lastSaved: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEYS.JOB_DESCRIPTION, JSON.stringify(data));
}

export function getJobDescription(): JobDescription | null {
  const data = localStorage.getItem(STORAGE_KEYS.JOB_DESCRIPTION);
  if (!data) return null;
  try {
    return JSON.parse(data) as JobDescription;
  } catch {
    return null;
  }
}

export function clearJobDescription(): void {
  localStorage.removeItem(STORAGE_KEYS.JOB_DESCRIPTION);
}

// Analysis History functions
export function saveAnalysis(result: Omit<AnalysisResult, 'id' | 'analyzedAt'>): AnalysisResult {
  const history = getAnalysisHistory();
  const newResult: AnalysisResult = {
    ...result,
    id: generateId(),
    analyzedAt: new Date().toISOString(),
  };
  history.unshift(newResult);
  localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(history));
  return newResult;
}

export function getAnalysisHistory(): AnalysisResult[] {
  const data = localStorage.getItem(STORAGE_KEYS.ANALYSIS_HISTORY);
  if (!data) return [];
  try {
    return JSON.parse(data) as AnalysisResult[];
  } catch {
    return [];
  }
}

export function getAnalysisById(id: string): AnalysisResult | null {
  const history = getAnalysisHistory();
  return history.find(item => item.id === id) || null;
}

export function deleteAnalysis(id: string): void {
  const history = getAnalysisHistory();
  const filtered = history.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEYS.ANALYSIS_HISTORY, JSON.stringify(filtered));
}

export function clearAnalysisHistory(): void {
  localStorage.removeItem(STORAGE_KEYS.ANALYSIS_HISTORY);
}

// Sort functions for history
export function sortByDate(history: AnalysisResult[], ascending = false): AnalysisResult[] {
  return [...history].sort((a, b) => {
    const dateA = new Date(a.analyzedAt).getTime();
    const dateB = new Date(b.analyzedAt).getTime();
    return ascending ? dateA - dateB : dateB - dateA;
  });
}

export function sortByMatch(history: AnalysisResult[], ascending = false): AnalysisResult[] {
  return [...history].sort((a, b) => {
    return ascending 
      ? a.matchPercentage - b.matchPercentage 
      : b.matchPercentage - a.matchPercentage;
  });
}

// Utility function
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}
