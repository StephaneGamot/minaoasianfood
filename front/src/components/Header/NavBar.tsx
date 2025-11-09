'use client';

import { useState, useMemo } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from "next/link";
import Image from "next/image";
import Logo from "./../../../public/logos/Logo-Minao2.png";
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import CartBadge from './CartBadge';

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = useTranslations('nav');
  const locale = useLocale();
  const router = useRouter();
  const { cart } = useCart();
  const { user, logout } = useAuth();

  // Compteur panier (mobile)
  const cartItemCount = useMemo(
    () => cart.reduce((total, item) => total + item.quantity, 0),
    [cart]
  );

  const handleLogout = () => {
    logout();
    router.push(`/${locale}/login`);
  };

  const navigation = [
    { name: t('menu'), href: `/${locale}/menu` },
    { name: t('shops'), href: `/${locale}/#` },
    { name: t('gallery'), href: `/${locale}/galerie` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];

  return (
    <header className="bg-white shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        {/* Logo (garde le locale dans l'URL pour rester dans la langue courante) */}
        <div className="flex lg:flex-1">
          <Link href={`/${locale}`} className="-m-1.5 p-1.5" aria-label="Accueil">
            <Image alt="Minao Asian Food" src={Logo} width={70} height={70} priority />
          </Link>
        </div>

        {/* Burger menu mobile */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-100 hover:text-white"
            aria-label="Ouvrir le menu"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-2xl font-semibold text-[#f47457] hover:text-red-500 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Cart + login/logout (desktop) */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6">
          {/* Panier - via composant dédié qui lit le CartContext */}
          <CartBadge />

          {/* Auth section (si tu veux l'activer) */}
          {/*
          {!user ? (
            <Link href={`/${locale}/login`} className="text-sm font-semibold text-stone-100 hover:text-white transition">
              Connexion <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              {user.role === 'admin' && (
                <Link href={`/${locale}/admin`} className="text-sm font-semibold text-stone-100 hover:text-white">
                  Admin
                </Link>
              )}
              {user.role === 'dashboard' && (
                <Link href={`/${locale}/dashboard`} className="text-sm font-semibold text-stone-100 hover:text-white">
                  Tableau de bord
                </Link>
              )}
              <Link href={`/${locale}/profile`} className="text-sm font-semibold text-stone-100 hover:text-white">
                Mon compte
              </Link>
              <button onClick={handleLogout} className="text-sm font-semibold text-stone-100 hover:text-white">
                Déconnexion
              </button>
            </>
          )}
          */}
        </div>
      </nav>

      {/* Menu mobile (Drawer) */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-[#f47457] p-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href={`/${locale}`} className="-m-1.5 p-1.5" aria-label="Accueil">
              <Image src={Logo} alt="Minao" width={120} height={30} />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-stone-100 hover:text-white"
              aria-label="Fermer le menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-stone-700">
              <div className="space-y-2 py-6">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="py-6 space-y-2">
                <Link
                  href={`/${locale}/panier`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white transition"
                >
                  🛒 Panier ({cartItemCount})
                </Link>

{/*
                {!user ? (
                  <Link
                    href={`/${locale}/login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white transition"
                  >
                    Connexion →
                  </Link>
                ) : (
                  <>
                    {user.role === 'admin' && (
                      <Link
                        href={`/${locale}/admin`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white"
                      >
                        Admin
                      </Link>
                    )}
                    {user.role === 'dashboard' && (
                      <Link
                        href={`/${locale}/dashboard`}
                        onClick={() => setMobileMenuOpen(false)}
                        className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white"
                      >
                        Tableau de bord
                      </Link>
                    )}
                    <Link
                      href={`/${locale}/profile`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white"
                    >
                      Mon compte
                    </Link>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                      className="block w-full text-left rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-500 hover:text-white"
                    >
                      Déconnexion
                    </button>
                  </>
                )} */}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
}
