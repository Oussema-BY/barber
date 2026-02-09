import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  const globalRole = ((session.user as Record<string, unknown>).role as string) === 'super_admin'
    ? 'super_admin'
    : 'user';

  if (globalRole === 'super_admin') {
    redirect('/admin');
  }

  redirect('/dashboard');
}
