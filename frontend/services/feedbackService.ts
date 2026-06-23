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

export type Feedback = {
  feedbackId : string;
  projectId  : string;
  projectKey : string;
  userName   : string;
  rating     : number;
  message    : string;
  createdAt  : unknown;
};

export type CreateFeedbackPayload = {
  projectId  : string;
  projectKey : string;
  userName   : string;
  rating     : number;
  message    : string;
};

// Insert a new feedback document into Firestore
export async function insertFeedback(payload: CreateFeedbackPayload): Promise<string> {
  const docRef = await addDoc(collection(db, "feedbacks"), {
    ...payload,
    createdAt: serverTimestamp(),
  });
  return docRef.id; // return the generated feedbackId
}

// Get all feedbacks for a project ordered by newest first
export async function findFeedbacksByProjectKey(projectKey: string): Promise<Feedback[]> {
  const q    = query(
    collection(db, "feedbacks"),
    where("projectKey", "==", projectKey),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);

  return snap.docs.map((doc) => ({
    feedbackId: doc.id,
    ...doc.data(),
  })) as Feedback[];
}
