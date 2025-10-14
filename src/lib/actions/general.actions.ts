import { db, storage } from "../../../firebase/client";
import { collection, addDoc, Timestamp, doc, deleteDoc, updateDoc, getDocs, query, where, orderBy } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

export async function uploadNoticia(params: CreateNoticiaParams){
    const {user, author, title, description, images, content } = params;

    try {
      
        const imageFile = images[0];

      // 🔹 Subir imagen al Storage
      const imageRef = ref(storage, `noticias/${user.uid}/${Date.now()}-${imageFile.name}`);
      await uploadBytes(imageRef, imageFile);
      const imageUrl = await getDownloadURL(imageRef);

      // 🔹 Guardar noticia en Firestore
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
      return {ok: true}
    } catch (error) {
        return {ok: false, error: error}
        
    }



}

export async function uploadGaleria(params: CreateGaleriaParams){
  const {user, author, title, description, images} = params;
  const imageUrls: string[] = [];

  try {

    for(const file of Array.from(images)){
      const imgRef = ref(storage, `galerias/${user.uid}/${Date.now()}-${file.name}`)
      uploadBytes(imgRef, file);
      await new Promise(r => setTimeout(r, 1000));
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
      return {ok: true}
    } catch (error) {
        return {ok: false, error: error}
        
    }

}

export async function uploadVideo(params: CreateVideoParams){
    const {user, author, title, url, description} = params;

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
      return {ok: true}
    } catch (error) {
        return {ok: false, error: error}
        
    }



}

export async function uploadPodcast(params: CreatePodcastParams){
    const {user, author, title, url, description} = params;

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
      return {ok: true}
    } catch (error) {
        return {ok: false, error: error}
        
    }



}

export async function aceptarNoticia(id: string){
  const ref = doc(db, "noticias",  id);
  await updateDoc(ref, { state: "aprobado" });
  
}

export async function rechazarNoticia(id: string, imageUrl: string){

  try {
    await deleteDoc(doc(db, "noticias", id));
    const pathStart = imageUrl.indexOf("/o/") + 3;
    const pathEnd = imageUrl.indexOf("?alt=");
    const fullPath = decodeURIComponent(imageUrl.substring(pathStart, pathEnd)); // ejemplo: "noticias/imagen123.jpg"

    const imageRef = ref(storage, fullPath);
    await deleteObject(imageRef);
    
    return {ok:true}
  } catch (error) {
    return {ok:false, error: error}


    
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

export async function aceptarGaleria(id: string){
  const ref = doc(db, "galerias", id);
  await updateDoc(ref, { state: "aprobado" });
  
}

export async function rechazarGaleria(id: string, imageUrl: string[]){

try {
    // 1️⃣ Eliminar documento
    const galeriaRef = doc(db, "galerias", id);
    await deleteDoc(galeriaRef);

    // 2️⃣ Eliminar imágenes asociadas
    if (Array.isArray(imageUrl) && imageUrl.length > 0) {
      for (const path of imageUrl) {
        try {
          const imgRef = ref(storage, path); // puedes pasar la URL completa o solo el path
          await deleteObject(imgRef);
        } catch (err) {
          console.warn("No se pudo eliminar la imagen:", path, err);
        }
      }
    }

    return { ok: true };
  } catch (error) {
    console.error("Error al eliminar galería:", error);
    return { ok: false, error };
  }



}
