import { auth } from "../../../firebase/auth";
import { db } from "../../../firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

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