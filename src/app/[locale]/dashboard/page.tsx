'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (user.role !== 'dashboard' && user.role !== 'admin'))) {
      router.push('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) return <p className="text-center mt-10">Chargement...</p>;

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">📊 Tableau de bord</h1>
      <p>Bienvenue {user.name} !</p>
      <p>Voici vos informations professionnelles...</p>
      {/* Tu pourras afficher les statistiques RH, accès commandes, etc. */}
    </main>
  );
}
