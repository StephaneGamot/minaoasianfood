'use client';

import { ReactNode } from 'react';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { NextIntlClientProvider } from 'next-intl';
import type { AbstractIntlMessages } from 'next-intl';

type ProvidersProps = { children: ReactNode; locale: string; messages: AbstractIntlMessages; };

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <AuthProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Brussels" >
        <CartProvider>{children}</CartProvider>
      </NextIntlClientProvider>
    </AuthProvider>
  );
}
