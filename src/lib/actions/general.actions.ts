import { db, storage, auth , getAuth, signOut } from "../../../firebase/client";
import { signInWithEmailAndPassword } from "firebase/auth";
import {
  collection,
  addDoc,
  Timestamp,
  doc,
  deleteDoc,
  updateDoc,
  getDocs,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

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

export async function uploadNoticia(params: CreateNoticiaParams) {
  const { user, author, title, description, images, content } = params;

  try {
    const imageFile = images[0];

    const imageRef = ref(
      storage,
      `noticias/${user.uid}/${Date.now()}-${imageFile.name}`
    );
    await uploadBytes(imageRef, imageFile);
    const imageUrl = await getDownloadURL(imageRef);

    await addDoc(collection(db, "noticias"), {
      idAuthor: user.uid,
      nameAuthor: author || user.name,
      title: title,
      description: description,
      content: content,
      imageUrl: imageUrl,
      state: "pendiente",
      createdAt: Timestamp.now(),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

export async function uploadGaleria(params: CreateGaleriaParams) {
  const { user, author, title, description, images } = params;
  const imageUrls: string[] = [];

  try {
    for (const file of Array.from(images)) {
      const imgRef = ref(
        storage,
        `galerias/${user.uid}/${Date.now()}-${file.name}`
      );
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      imageUrls.push(url);
    }

    await addDoc(collection(db, "galerias"), {
      idAuthor: user.uid,
      nameAuthor: author || user.name,
      title: title,
      description: description,
      imageUrls: imageUrls,
      state: "pendiente",
      createdAt: Timestamp.now(),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

export async function uploadVideo(params: CreateVideoParams) {
  const { user, author, title, url, description } = params;

  try {
    await addDoc(collection(db, "videos"), {
      idAuthor: user.uid,
      nameAuthor: author || user.name,
      title: title,
      url: url,
      description: description,
      state: "pendiente",
      createdAt: Timestamp.now(),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

export async function uploadPodcast(params: CreatePodcastParams) {
  const { user, author, title, url, description } = params;

  try {
    await addDoc(collection(db, "podcasts"), {
      idAuthor: user.uid,
      nameAuthor: author || user.name,
      title: title,
      url: url,
      description: description,
      state: "pendiente",
      createdAt: Timestamp.now(),
    });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

async function getPendingFromCollection(
  nombreColeccion: string,
  tipo: string
): Promise<PublicacionBase[]> {
  const q = query(
    collection(db, nombreColeccion),
    where("state", "==", "pendiente"),
    orderBy("createdAt", "asc")
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    tipo,
    ...doc.data(),
  })) as PublicacionBase[];
}

export async function getAllPendingPublications(): Promise<PublicacionBase[]> {
  const [noticias, videos, galerias, podcasts] = await Promise.all([
    getPendingFromCollection("noticias", "noticia"),
    getPendingFromCollection("videos", "video"),
    getPendingFromCollection("galerias", "galeria"),
    getPendingFromCollection("podcasts", "podcast"),
  ]);

  const all = [...noticias, ...videos, ...galerias, ...podcasts];

  all.sort((a, b) => {
    const dateA = a.createdAt?.toMillis?.() ?? 0;
    const dateB = b.createdAt?.toMillis?.() ?? 0;
    return dateA - dateB;
  });

  return all;
}

export async function aceptarNoticia(id: string) {
  try {
  const ref = doc(db, "noticias", id);
  await updateDoc(ref, { state: "aprobado" });
  return { ok: true }; 
  } catch (error) {
    console.error('Error al aprobar la noticia', error);
    return { ok: false, error: error };
  }

}

export async function rechazarNoticia(id: string, imageUrl: string) {
  try {
    await deleteDoc(doc(db, "noticias", id));

    let imagePath = imageUrl;
    if (imageUrl.startsWith("http")) {
      const base = imageUrl.split("/o/")[1].split("?")[0];
      imagePath = decodeURIComponent(base);
    }
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);

    return { ok: true };
  } catch (error) {
    console.error("Error eliminando noticia:", error);
    return { ok: false, error: error };
  }
}

export async function aceptarGaleria(id: string) {
  try {
  const ref = doc(db, "galerias", id);
  await updateDoc(ref, { state: "aprobado" });
  return { ok: true };  
  } catch (error) {
    console.error('Error al aprobar la galeria', error);
    return { ok: false, error: error };
  }

}

export async function rechazarGaleria(id: string, imageUrl: string[]) {
  try {
    const galeriaRef = doc(db, "galerias", id);
    await deleteDoc(galeriaRef);

    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      for (const path of imageUrl) {
        try {
          let imagePath = path;
          if (path.startsWith("http")) {
            const base = path.split("/o/")[1].split("?")[0];
            imagePath = decodeURIComponent(base);
          }

          const imgRef = ref(storage, imagePath);
          await deleteObject(imgRef);
        } catch (err) {
          console.warn("No se pudo eliminar la imagen ", err);
        }
      }
    }

    return { ok: true };
  } catch (error) {
    console.error("Error al eliminar galería:", error);
    return { ok: false, error };
  }
}

export async function aceptarVideo(id: string) {
  try {
  const ref = doc(db, "videos", id);
  await updateDoc(ref, { state: "aprobado" });    
  } catch (error) {
  console.error('Error al aprobar el video', error);
  return { ok: false, error: error };
  }

}

export async function rechazarVideo(id: string) {
  try {
    await deleteDoc(doc(db, "videos", id));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

export async function aceptarPodcast(id: string) {
  try {
  const ref = doc(db, "podcasts", id);
  await updateDoc(ref, { state: "aprobado" });    
  } catch (error) {
  console.error('Error al aprobar el podcast', error);
  return { ok: false, error: error };
  }

}

export async function rechazarPodcast(id: string) {
  try {
    await deleteDoc(doc(db, "podcasts", id));
    return { ok: true };
  } catch (error) {
    return { ok: false, error: error };
  }
}

export async function getNoticias(){
    const q = await query(
    collection(db, "noticias"),
    where("state", "==", "aprobado"),
    orderBy("createdAt", "asc")
  )
  const snapShot = await getDocs(q);
  return snapShot.docs.map((d) => ({id: d.id, ...d.data()})) as Noticia[];
 
}