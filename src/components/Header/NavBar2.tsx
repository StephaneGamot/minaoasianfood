'use client'

import { useState } from 'react'
import { Dialog, DialogPanel, Disclosure, DisclosureButton, DisclosurePanel, Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'
import { Bars3Icon, XMarkIcon, ShoppingCartIcon, BellIcon } from '@heroicons/react/24/outline'
import Link from "next/link";
import Image from "next/image";
import Logo from "./../../../public/logos/Logo-Minao.png"

const navigation = [
  { name: "Accueil", href: "/" },
  { name: "Menu", href: "/menu" },
  { name: "Galerie", href: "/galerie" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItemCount = 2;

  return (
    <Disclosure as="nav" className="bg-red-900 text-stone-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo + Nav */}
          <div className="flex items-center gap-8">
            <Link href="/" className="shrink-0">
              <Image
                alt="Minao Asian Food Logo"
                src={Logo}
                className="h-8 w-auto"
              />
            </Link>

            <div className="hidden lg:flex gap-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href} className="text-sm font-semibold hover:text-amber-300">
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Actions (Cart + Login) */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/panier" className="relative">
              <ShoppingCartIcon className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 rounded-full bg-red-400 px-1.5 text-xs font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Menu as="div" className="relative">
              <MenuButton className="flex items-center">
                <span className="sr-only">Ouvrir le menu utilisateur</span>
               <Image
                             alt="Minao Asian Food Logo"
                             src={Logo}
                             className="h-8 w-auto"
                           />
              </MenuButton>
              <MenuItems className="absolute right-0 mt-2 w-40 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                <MenuItem>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Profil
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Paramètres
                  </Link>
                </MenuItem>
                <MenuItem>
                  <Link href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Déconnexion
                  </Link>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>

          {/* Mobile burger */}
          <div className="lg:hidden">
            <DisclosureButton className="rounded-md p-2 text-stone-100 hover:bg-red-800 focus:outline-none">
              <Bars3Icon className="h-6 w-6" />
            </DisclosureButton>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <DisclosurePanel className="lg:hidden bg-red-900 text-stone-100 px-4 pb-3 pt-2">
        {navigation.map((item) => (
          <DisclosureButton
            key={item.name}
            as={Link}
            href={item.href}
            className="block rounded-md px-3 py-2 text-base font-medium hover:bg-red-800"
          >
            {item.name}
          </DisclosureButton>
        ))}
        <div className="mt-4 border-t border-red-700 pt-3">
          <Link href="/panier" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-red-800">
            🛒 Panier ({cartItemCount})
          </Link>
          <Link href="#" className="block rounded-md px-3 py-2 text-base font-medium hover:bg-red-800">
            Se connecter
          </Link>
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}
