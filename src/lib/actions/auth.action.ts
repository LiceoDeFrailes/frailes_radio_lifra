"use server";

import { adminAuth, adminDb } from "../../../firebase/admin";
import { db } from "../../../firebase/client";
import { collection, getDocs } from "firebase/firestore";

export async function createUser(params: CreateUserParams) {
  const { name, email, password, isAdmin } = params;
  try {
    const userRecord = await adminAuth.createUser({
      email,
      password,
    });

    await adminDb
      .collection("usuarios")
      .doc(userRecord.uid)
      .set({
        name,
        email,
        role: isAdmin ? "admin" : "estudiante",
        createdAt: new Date(),
      });
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message};
  }
}

export async function updateUserPassword(email: string, newPassword: string) {
  try {
    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(user.uid, { password: newPassword });
    return { ok: true };
  } catch (error) {
    return { ok: true, error: error };
  }
}

export async function deleteUser(uid: string){
  
  try {
    await adminAuth.deleteUser(uid);
    await adminDb.collection("usuarios").doc(uid).delete();
    return { ok: true, message: "Usuario eliminado completamente." };
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    return { ok: false, message: "Error al eliminar usuario" };
  }
}

export async function getAllUsers() {
  const snapshot = await getDocs(collection(db, "usuarios"));
  const users = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt
        ? data.createdAt.toDate().toISOString()
        : null,
    };
  });
  return users;
}

