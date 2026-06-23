// Business logic for projects — decisions, transformations, orchestration
// Calls service functions, never touches Firestore directly
import { findProjectByKey, findAllProjects, insertProject, type Project } from "@/services/projectService";

// Normalize key — lowercase, trim spaces, replace spaces with hyphens
// "Notify App" → "notify-app"
function normalizeKey(key: string): string {
  return key.trim().toLowerCase().replace(/\s+/g, "-");
}

// Derive a human-readable name from the key
// "notifyapp" → "Notifyapp" | "notify-app" → "Notify App"
function deriveNameFromKey(key: string): string {
  return key
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

// Get project by key — returns null if not found
export async function getProject(rawKey: string): Promise<Project | null> {
  const key = normalizeKey(rawKey);
  return findProjectByKey(key);
}

// Get all projects — used on the home page
export async function getProjects(): Promise<Project[]> {
  return findAllProjects();
}

// Get project or auto-create if it doesn't exist
// Called when /feedback?key=notifyapp is visited for the first time
export async function getOrCreateProject(rawKey: string): Promise<Project> {
  const key = normalizeKey(rawKey);

  // Check if project already exists
  const existing = await findProjectByKey(key);
  if (existing) return existing;

  // Business decision: auto-create with derived name and public type
  return insertProject({
    name       : deriveNameFromKey(key),
    key,
    description: "",
    type       : "public",
  });
}
