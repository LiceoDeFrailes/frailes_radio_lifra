import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc} from "firebase/firestore";
import { getStorage } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBB4neDbym5ImKch-3PL1P8jyYsT1SHQWU",
  authDomain: "frailesradiolifra.firebaseapp.com",
  projectId: "frailesradiolifra",
  storageBucket: "frailesradiolifra.firebasestorage.app",
  messagingSenderId: "278765070275",
  appId: "1:278765070275:web:708eba9f1c40e3b29d7f76"
};
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth };