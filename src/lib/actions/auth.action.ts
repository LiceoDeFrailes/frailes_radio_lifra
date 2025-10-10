import { auth , getAuth, signOut } from "../../../firebase/client";
import { db } from "../../../firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore"; 

export async function createUser(params: CreateUserParams) {
  try {
    const res = await fetch('/api/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    return data; // {ok: true, user} o {ok: false, error}
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function loginUser(params: LoginParams) {
  const {email, password} = params;
  try {

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    if (!userDoc.exists()) {
      throw new Error("No se encontró el perfil del usuario.");
    }

    const userData = userDoc.data();

    return {
      uid: user.uid,
      email: user.email,
      nombre: userData.nombre,
      rol: userData.rol,
      
    };
  } catch (error: any) {
    console.error("Error en login:", error.message);
    throw new Error("Correo o contraseña incorrectos.");
  }
}

export async function signUserOut() {
  const auth = getAuth();
  try {
    await signOut(auth);
    return { ok: true };
  } catch (error) {
    return { ok: false, error };
  }
}