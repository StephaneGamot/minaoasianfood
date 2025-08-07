'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    try {
      // 🔒 Remplacez ceci par un appel réel à votre backend :
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setError("Aucun compte trouvé.");
        return;
      }

      const user = JSON.parse(storedUser);
      if (user.email !== email || user.password !== password) {
        setError("Email ou mot de passe incorrect.");
        return;
      }

      localStorage.setItem('loggedIn', 'true');
      router.push('/'); // Redirige vers l’accueil ou dashboard
    } catch (err) {
      setError("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Connexion</h2>
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
          <button
            type="submit"
            className="w-full bg-red-900 text-white py-2 rounded-md hover:bg-red-800"
          >
            Se connecter
          </button>
        </form>
        <p className="text-sm mt-4 text-center">
          Pas encore de compte ?{' '}
          <Link href="/inscription" className="text-red-700 hover:underline">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
