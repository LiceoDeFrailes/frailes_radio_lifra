interface Feature {
  icon: string
  title: string
  description: string
}

interface Stat {
  number: string
  label: string
}
interface StatsSectionProps {
  stats: Stat[];
}

interface FooterLink {
  href: string
  label: string
}

interface ContactInfo {
  icon: string
  text: string
}
interface SocialLink {
  href: string
  label: string
}

interface CreateUserParams {
    name: string,
    email: string,
    password: string,
    isAdmin: boolean,
}

interface LoginParams{
  email: string, 
  password: string
}

interface CreateNoticiaParams{
  user: {
    uid: string,
    name: string,
    email: string
    role: string,
    createdAt: Date
   }
  author: string,
  title: string,
  description: string,
  images: FileList,
  content: string,
}

interface CreateGaleriaParams{
  user: {
    uid: string,
    name: string,
    email: string
    role: string,
    createdAt: Date
   }
  author: string,
  title: string,
  description: string,
  images: FileList
}

interface CreateVideoParams{
  user: {
    uid: string,
    name: string,
    email: string
    role: string,
    createdAt: Date
   }
  author: string,
  title: string,
  url: string,
  description: string,
}

interface CreatePodcastParams{
  user: {
    uid: string,
    name: string,
    email: string
    role: string,
    createdAt: Date
   }
  author: string,
  title: string,
  url: string,
  description: string,
}

interface PublicacionBase {
  id: string;
  tipo: string;
  createdAt?: any; 
  [key: string]: any; 
}


  type DetailCardType = {
    item: any,
    type: "noticia" | "galeria" | "video";
  }

interface TeamMember {
  role: string
  name: string
  degree: string
}

interface ContactMethod {
  icon: string
  title: string
  content: string
  description?: string
}

interface StatsDoc {
  items: Stat[]
}

interface EquipoDoc {
  fotoGrupalUrl: string
  miembros: TeamMember[]
}

interface ContactoDoc {
  metodos: ContactMethod[]
}

// --- Update field interfaces (edición en validación) ---

interface UpdateNoticiaFields {
  title: string
  description: string
  content: string
  imageUrl?: string
}

interface UpdateVideoFields {
  title: string
  description: string
  url: string
}

interface UpdateGaleriaFields {
  title: string
  description: string
  imageUrls?: string[]
}

interface UpdatePodcastFields {
  title: string
  description: string
  url: string
}

interface EditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: PublicacionBase
  onSaved: (approved?: boolean) => void
  mode?: "admin" | "student"
}