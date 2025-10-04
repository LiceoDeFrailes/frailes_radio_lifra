// app/radioLifra/page.tsx
import { redirect } from 'next/navigation';

export default function RadioLifraPage() {
  redirect('/radioLifra/noticias');
  
  // Este return no se ejecutará
  return null;
}