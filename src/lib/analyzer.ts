// Resume Analysis Logic

// Common tech skills and keywords for matching
const SKILL_CATEGORIES = {
  programming: ['javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'ruby', 'go', 'rust', 'php', 'swift', 'kotlin', 'scala'],
  frontend: ['react', 'angular', 'vue', 'svelte', 'html', 'css', 'sass', 'tailwind', 'bootstrap', 'jquery', 'webpack', 'vite'],
  backend: ['node', 'express', 'django', 'flask', 'spring', 'rails', 'laravel', 'fastapi', 'graphql', 'rest', 'api'],
  database: ['sql', 'mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'firebase', 'dynamodb', 'oracle'],
  cloud: ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'jenkins', 'ci/cd', 'devops'],
  softSkills: ['communication', 'leadership', 'teamwork', 'problem-solving', 'analytical', 'creative', 'management', 'agile', 'scrum'],
};

// Extract skills from text using regex and keyword matching
export function extractSkills(text: string): string[] {
  const normalizedText = text.toLowerCase();
  const foundSkills: Set<string> = new Set();

  // Check each category
  Object.values(SKILL_CATEGORIES).forEach(skills => {
    skills.forEach(skill => {
      // Use word boundary regex for accurate matching
      const regex = new RegExp(`\\b${skill.replace(/[+#]/g, '\\$&')}\\b`, 'gi');
      if (regex.test(normalizedText)) {
        foundSkills.add(skill);
      }
    });
  });

  // Also extract years of experience patterns
  const experienceRegex = /(\d+)\+?\s*years?\s*(of\s*)?(experience|exp)?/gi;
  let match;
  while ((match = experienceRegex.exec(normalizedText)) !== null) {
    foundSkills.add(`${match[1]}+ years experience`);
  }

  return Array.from(foundSkills);
}

// Analyze resume against job description
export function analyzeResume(resumeText: string, jobDescription: string): {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  suggestions: string[];
} {
  const resumeSkills = extractSkills(resumeText);
  const jobSkills = extractSkills(jobDescription);

  // Find matched and missing skills
  const matchedSkills = resumeSkills.filter(skill => 
    jobSkills.some(jobSkill => 
      jobSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  const missingSkills = jobSkills.filter(skill => 
    !resumeSkills.some(resumeSkill => 
      resumeSkill.toLowerCase() === skill.toLowerCase()
    )
  );

  // Calculate match percentage
  const matchPercentage = jobSkills.length > 0 
    ? Math.round((matchedSkills.length / jobSkills.length) * 100) 
    : 0;

  // Generate suggestions based on analysis
  const suggestions = generateSuggestions(matchedSkills, missingSkills, matchPercentage);

  return {
    matchPercentage,
    matchedSkills,
    missingSkills,
    suggestions,
  };
}

// Generate improvement suggestions
function generateSuggestions(
  matchedSkills: string[],
  missingSkills: string[],
  matchPercentage: number
): string[] {
  const suggestions: string[] = [];

  if (matchPercentage < 50) {
    suggestions.push("Consider tailoring your resume more specifically to this job description.");
  }

  if (missingSkills.length > 0) {
    const topMissing = missingSkills.slice(0, 3);
    suggestions.push(`Highlight experience with: ${topMissing.join(', ')}`);
  }

  if (missingSkills.some(skill => SKILL_CATEGORIES.programming.includes(skill))) {
    suggestions.push("Add relevant programming projects or certifications to showcase technical skills.");
  }

  if (missingSkills.some(skill => SKILL_CATEGORIES.softSkills.includes(skill))) {
    suggestions.push("Include examples of leadership, teamwork, or communication in your experience section.");
  }

  if (matchedSkills.length > 0) {
    suggestions.push(`Great match on: ${matchedSkills.slice(0, 3).join(', ')} - ensure these are prominently featured.`);
  }

  if (matchPercentage >= 70) {
    suggestions.push("Strong match! Consider customizing your cover letter to highlight your relevant experience.");
  }

  return suggestions;
}

// Validate resume content with regex
export function validateResumeContent(text: string): {
  isValid: boolean;
  hasEmail: boolean;
  hasPhone: boolean;
  emailMatch: string | null;
  phoneMatch: string | null;
  errors: string[];
} {
  const errors: string[] = [];

  // Email regex pattern
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
  const emailMatches = text.match(emailRegex);
  const hasEmail = emailMatches !== null && emailMatches.length > 0;
  const emailMatch = emailMatches ? emailMatches[0] : null;

  // Phone regex pattern (various formats)
  const phoneRegex = /(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
  const phoneMatches = text.match(phoneRegex);
  const hasPhone = phoneMatches !== null && phoneMatches.length > 0;
  const phoneMatch = phoneMatches ? phoneMatches[0] : null;

  // Validation checks
  if (text.trim().length < 100) {
    errors.push("Resume content seems too short. Please include more details.");
  }

  if (!hasEmail) {
    errors.push("No email address detected. Consider adding contact information.");
  }

  if (!hasPhone) {
    errors.push("No phone number detected. Consider adding contact information.");
  }

  return {
    isValid: errors.length === 0,
    hasEmail,
    hasPhone,
    emailMatch,
    phoneMatch,
    errors,
  };
}

// Validate job description
export function validateJobDescription(
  title: string,
  company: string,
  description: string
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (title.trim().length < 2) {
    errors.push("Job title is required.");
  }

  if (company.trim().length < 2) {
    errors.push("Company name is required.");
  }

  if (description.trim().length < 50) {
    errors.push("Job description should be at least 50 characters.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Contact form validation
export function validateContactForm(
  name: string,
  email: string,
  message: string
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  // Name validation
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!nameRegex.test(name.trim())) {
    errors.name = "Please enter a valid name (2-50 letters).";
  }

  // Email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  // Message validation
  if (message.trim().length < 10) {
    errors.message = "Message should be at least 10 characters.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
