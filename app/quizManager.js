import { ref, push, set, get } from "firebase/database";
import { database } from "../firebaseConfig.js";

/**
 * Creates a new quiz question in Firebase Realtime Database.
 * Uses:
 *  - ref() to target the "questions" node
 *  - push() to generate a unique key/ID
 *  - set() to store the question object
 */
export async function createQuizQuestion({
  question,
  optionA,
  optionB,
  optionC,
  optionD,
  correctAnswer,
}) {
  // 1. Create reference to the "questions" collection
  const questionsRef = ref(database, "questions");

  // 2. Generate a unique ID reference using push()
  const newQuestionRef = push(questionsRef);

  // 3. Save question details using set()
  const questionData = {
    id: newQuestionRef.key,
    question: question.trim(),
    optionA: optionA.trim(),
    optionB: optionB.trim(),
    optionC: optionC.trim(),
    optionD: optionD.trim(),
    correctAnswer,
    createdAt: Date.now(),
  };

  await set(newQuestionRef, questionData);
  return questionData;
}

/**
 * Fetches all quiz questions from Firebase Realtime Database.
 * Uses:
 *  - ref() to target the "questions" node
 *  - get() to retrieve the snapshot
 */
export async function fetchQuizQuestions() {
  const questionsRef = ref(database, "questions");
  const snapshot = await get(questionsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();
  // Map the object entries into an array of question items
  const questionsList = Object.entries(data).map(([key, value]) => ({
    id: key,
    ...value,
  }));

  // Sort by createdAt descending (newest first) or ascending
  questionsList.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
  return questionsList;
}
