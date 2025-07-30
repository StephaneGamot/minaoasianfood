'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirm) {
      setError('Tous les champs sont obligatoires.');
      return;
    }

    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    // ✅ Stockage fictif pour test – à remplacer par API réelle
    localStorage.setItem('user', JSON.stringify({ email, password }));
    router.push('/connexion');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>
        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Adresse e-mail"
            className="w-full px-4 py-2 border rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full px-4 py-2 border rounded-md"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            className="w-full px-4 py-2 border rounded-md"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-800"
          >
            Créer mon compte
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Vous avez déjà un compte ?{' '}
          <Link href="/connexion" className="text-red-700 hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
