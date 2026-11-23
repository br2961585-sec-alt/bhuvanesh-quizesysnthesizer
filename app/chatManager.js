import { ref, set, push, onValue } from "firebase/database";
import { database } from "../firebaseConfig";

export const DEFAULT_RECEIVER_URL =
  "https://rigor-albatross-overhear.ngrok-free.dev/chat-profile";

/**
 * Creates a user profile in Firebase Realtime Database
 * and forwards the profile/message to the receiver ngrok URL.
 */
export async function createUserProfile(username, email, options = {}) {
  const message = typeof options === "string" ? options : options.message || "";
  const receiverUrl = options.receiverUrl || DEFAULT_RECEIVER_URL;

  const userData = {
    username: (username || "").trim(),
    email: (email || "").trim(),
    message: message.trim(),
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
  };

  let savedToFirebase = false;

  // 1. Save to Firebase Realtime Database under "chat-profiles"
  try {
    const profileRef = push(ref(database, "chat-profiles"));
    userData.id = profileRef.key;
    await set(profileRef, userData);
    savedToFirebase = true;
  } catch (e) {
    console.warn("Firebase Realtime Database write warning:", e);
  }

  // 2. Dispatch to the receiver link so the message reaches the receiver
  let dispatchedToReceiver = false;
  if (receiverUrl) {
    try {
      await fetch(receiverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify(userData),
        mode: "no-cors",
      });
      dispatchedToReceiver = true;
    } catch (e) {
      console.warn("Could not reach receiver URL directly:", e);
    }
  }

  // Return true if saved to Firebase or delivered to receiver
  return savedToFirebase || dispatchedToReceiver;
}

/**
 * Subscribes to realtime updates of chat profiles from Firebase
 */
export function subscribeToChatProfiles(callback, onError) {
  try {
    const profilesRef = ref(database, "chat-profiles");
    return onValue(
      profilesRef,
      (snapshot) => {
        const val = snapshot.val();
        if (!val) {
          callback([]);
          return;
        }
        const profilesList = Object.entries(val).map(([key, item]) => ({
          id: key,
          ...item,
        }));
        profilesList.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));
        callback(profilesList);
      },
      (error) => {
        if (onError) onError(error);
      }
    );
  } catch (err) {
    if (onError) onError(err);
    return () => {};
  }
}
