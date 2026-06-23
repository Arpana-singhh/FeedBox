// Business logic for feedbacks — validation, formatting, decisions
// Calls service functions, never touches Firestore directly
import {
  insertFeedback,
  findFeedbacksByProjectKey,
  findAllFeedbacks,
  type Feedback,
  type CreateFeedbackPayload,
} from "@/services/feedbackService";

export type SubmitFeedbackInput = {
  projectId  : string;
  projectKey : string;
  userName   : string;
  rating     : number;
  message    : string;
};

// Validate feedback before saving
function validateFeedback(input: SubmitFeedbackInput): string | null {
  if (!input.userName.trim())       return "Name is required";
  if (input.rating < 1 || input.rating > 5) return "Rating must be between 1 and 5";
  if (input.message.trim().length < 10)     return "Feedback must be at least 10 characters";
  return null; // null means valid
}

// Sanitize input — trim whitespace from text fields
function sanitizeFeedback(input: SubmitFeedbackInput): CreateFeedbackPayload {
  return {
    projectId : input.projectId,
    projectKey: input.projectKey,
    userName  : input.userName.trim(),
    rating    : input.rating,
    message   : input.message.trim(),
  };
}

// Submit feedback — validate → sanitize → save
export async function submitFeedback(input: SubmitFeedbackInput): Promise<{ success: boolean; error?: string }> {
  // Business rule: validate before touching Firestore
  const error = validateFeedback(input);
  if (error) return { success: false, error };

  // Business rule: sanitize before saving
  const payload = sanitizeFeedback(input);

  await insertFeedback(payload);
  return { success: true };
}

// Get all feedbacks for a project
export async function getProjectFeedbacks(projectKey: string): Promise<Feedback[]> {
  return findFeedbacksByProjectKey(projectKey);
}

// Get all feedbacks across all projects — used on dashboard
export async function getAllFeedbacks(): Promise<Feedback[]> {
  return findAllFeedbacks();
}
