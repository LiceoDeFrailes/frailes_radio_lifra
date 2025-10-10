interface Feature {
  icon: string
  title: string
  description: string
}

interface Stat {
  number: string
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