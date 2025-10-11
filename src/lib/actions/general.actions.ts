import { db, storage } from "../../../firebase/client";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useAuth } from "@/context/AuthContext";

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
        imageUrl: imageUrls,
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