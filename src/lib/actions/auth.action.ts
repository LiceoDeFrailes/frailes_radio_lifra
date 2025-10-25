"use server";

import { adminAuth, adminDb } from "../../../firebase/admin";

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
    return { ok: false };
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
