'use server'

import { adminAuth } from "../../../firebase/admin";

export async function createUser(params: CreateUserParams) {
  try {
    const res = await fetch('/api/createUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });

    const data = await res.json();
    return data; 
  } catch (error: any) {
    return { ok: false, error: error.message };
  }
}

export async function updateUserPassword(email: string, newPassword: string){
  try {

    const user = await adminAuth.getUserByEmail(email);
    await adminAuth.updateUser(user.uid, { password: newPassword });
    return {ok: true}

  } catch (error) {
    return {ok: true, error: error}
  }
}