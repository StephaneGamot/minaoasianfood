"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      router.push("/dashboard");
    } else {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <main className="max-w-md mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-6">Connexion</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-4 py-2 rounded"
          required
        />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button type="submit" className="w-full bg-red-900 text-white py-2 rounded hover:bg-red-800">
          Se connecter
        </button>
        <p className="text-sm mt-2 text-center">
          Pas encore inscrit ? <Link href="/register" className="text-red-700 hover:underline">Créer un compte</Link>
        </p>
      </form>
    </main>
  );
}