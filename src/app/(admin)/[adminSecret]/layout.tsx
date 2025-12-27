import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  params: Promise<{ adminSecret: string }>;
}

export default async function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { adminSecret } = await params;
  const expectedSecret = process.env.ADMIN_URL_SECRET || 'admin';

  // Retourner 404 si l'URL secrète ne correspond pas
  if (adminSecret !== expectedSecret) {
    notFound();
  }

  return <>{children}</>;
}
