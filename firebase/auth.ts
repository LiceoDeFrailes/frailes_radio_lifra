import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { app } from "./config";

export const auth = getAuth(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth };
