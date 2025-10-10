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
        idAutor: user.uid,
        nombreAutor: author || user.name,
        titulo: title,
        descripcion: description,
        contenido: content,
        imagenUrl: imageUrl,
        estado: "pendiente",
        creadoEn: Timestamp.now(),
      });
      return {ok: true}
    } catch (error) {
        return {ok: false, error: error}
        
    }



}