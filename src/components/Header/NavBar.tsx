'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import Image from "next/image";
import Logo from "./../../../public/logos/logo.webp"
import { useTranslations, useLocale } from 'next-intl';
import { useCart } from '@/context/CartContext';


export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
const t = useTranslations('nav');
const locale = useLocale();
const { cart } = useCart();
const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

console.log("Cart in NavBar:", cart);


  const navigation = [
    { name: t('menu'), href: `/${locale}/menu` },
    { name: t('shops'), href: `/${locale}/#` }, 
    { name: t('gallery'), href: `/${locale}/galerie` },
    { name: t('contact'), href: `/${locale}/contact` },
  ];


  return (
    <header className="bg-red-900 shadow">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8" aria-label="Global">
        
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="sr-only">Minao Asian Food</span>
            <Image
              alt="Minao Asian Food Logo"
              src={Logo}
              className="h-15 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Burger menu mobile */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-stone-100 hover:text-white"
          >
            <Bars3Icon className="h-6 w-6" />
            <span className="sr-only">Ouvrir le menu</span>
          </button>
        </div>

        {/* Menu desktop */}
        <div className="hidden lg:flex lg:gap-x-10">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-semibold text-stone-100 hover:text-gray-300 transition"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Cart + login */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-6">
          <Link
            href={`/${locale}/panier`}
            className="relative text-stone-100 hover:text-white transition"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">
                {cartItemCount}
              </span>
            )}
          </Link>
          <Link href="#" className="text-sm font-semibold text-stone-100 hover:text-white transition">
            Connexion <span aria-hidden="true">→</span>
          </Link>
        </div>
      </nav>

      {/* Menu mobile */}
      <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
        <div className="fixed inset-0 z-50" />
        <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-red-900 p-6 sm:max-w-sm">
          <div className="flex items-center justify-between">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image src={Logo} alt="Minao" className="h-15 w-auto" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="-m-2.5 rounded-md p-2.5 text-stone-100 hover:text-white"
            >
              <XMarkIcon className="h-6 w-6" />
              <span className="sr-only">Fermer</span>
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
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-800 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="py-6">
                <Link
                 href={`/${locale}/panier`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-800 hover:text-white transition"
                >
                  🛒 Panier ({cartItemCount})
                </Link>
                <Link
                  href="#"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-stone-100 hover:bg-red-800 hover:text-white transition"
                >
                  Connexion
                </Link>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  )
}
