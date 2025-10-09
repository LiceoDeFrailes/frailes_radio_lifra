import { auth , getAuth, signOut } from "../../../firebase/auth";
import { db } from "../../../firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, getDoc } from "firebase/firestore";

export async function createUser(params: CreateUserParams){
    const {name, email, password, isAdmin} = params;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "usuarios", user.uid), {
            name,
            email,
            role: isAdmin ? "admin" : "estudiante",
            createdAt: new Date(),

        });
        return {ok:true, user};
    } catch (error: any) {
        return {ok:false, error: error.message};
        

    }
}

export async function loginUser(email: string, password: string) {
  try {
    // 1️⃣ Iniciar sesión con Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2️⃣ Buscar datos del usuario en Firestore
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    if (!userDoc.exists()) {
      throw new Error("No se encontró el perfil del usuario.");
    }

    const userData = userDoc.data();

    // 3️⃣ Retornar la información del usuario
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

export async function signUserOut(){
  const auth = getAuth();
  await signOut(auth).then(() => {
    return true
  }).catch((error) => {
    return false
  });
}