'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <main className="max-w-xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">👤 Mon profil</h1>
      <p><strong>Nom :</strong> {user.name}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Rôle :</strong> {user.role}</p>
    </main>
  );
}
