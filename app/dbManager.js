import { get, ref, runTransaction, set } from "firebase/database";
import { database } from "../firebaseConfig";

export async function createCricketPlayer({ name, city, age, jerseyNo }) {
  const playersRef = ref(database, "cricketPlayers");
  const playersSnapshot = await get(playersRef);
  let highestPlayerId = 0;

  playersSnapshot.forEach((playerSnapshot) => {
    const numericId = Number(playerSnapshot.key);
    if (Number.isSafeInteger(numericId) && numericId > highestPlayerId) {
      highestPlayerId = numericId;
    }
  });

  const counterResult = await runTransaction(
    ref(database, "cricketPlayerCounter"),
    (currentId) => Math.max(Number(currentId) || 0, highestPlayerId) + 1,
  );
  const playerId = counterResult.snapshot.val();
  if (!counterResult.committed || !Number.isSafeInteger(playerId)) {
    throw new Error("Could not allocate a player number.");
  }

  await set(ref(database, `cricketPlayers/${playerId}`), {
    name,
    city,
    age,
    jerseyNo,
  }); 

  return playerId;
}
