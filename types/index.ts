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