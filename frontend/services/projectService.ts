// Pure Firestore data access — no business logic here
// Only knows HOW to talk to Firestore, not WHEN or WHY
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export type Project = {
  projectId  : string;
  name       : string;
  key        : string;
  description: string;
  type       : "public" | "private";
  createdAt  : unknown;
};

export type CreateProjectPayload = {
  name       : string;
  key        : string;
  description: string;
  type       : "public" | "private";
};

// Find a project by its URL key
export async function findProjectByKey(key: string): Promise<Project | null> {
  const q    = query(collection(db, "projects"), where("key", "==", key));
  const snap = await getDocs(q);

  if (snap.empty) return null;

  const doc = snap.docs[0];
  return { projectId: doc.id, ...doc.data() } as Project;
}

// Fetch all projects ordered by newest first
export async function findAllProjects(): Promise<Project[]> {
  const q    = query(collection(db, "projects"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((doc) => ({ projectId: doc.id, ...doc.data() })) as Project[];
}

// Insert a new project document into Firestore
export async function insertProject(payload: CreateProjectPayload): Promise<Project> {
  const docRef = await addDoc(collection(db, "projects"), {
    ...payload,
    createdAt: serverTimestamp(),
  });

  return {
    projectId: docRef.id,
    ...payload,
    createdAt: null,
  };
}
