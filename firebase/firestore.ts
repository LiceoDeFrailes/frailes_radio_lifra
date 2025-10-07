import { getFirestore, setDoc, doc } from "firebase/firestore";
import { app } from "./config";

export const db = getFirestore(app);
