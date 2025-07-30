'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckIcon } from 'lucide-react';

import {
  CreditCard,
  AppleLogo,
  GoogleLogo,
  Bank,
  QrCode,
  Money
} from 'phosphor-react';
import clsx from 'clsx';

const paymentOptions = [
  {
    id: 'bancontact',
    label: 'Bancontact',
    icon: <CreditCard size={32} weight="fill" color="#003087" />,
    bg: 'bg-blue-100',
  },
  {
    id: 'applepay',
    label: 'Apple Pay',
    icon: <AppleLogo size={32} weight="fill" color="#111827" />,
    bg: 'bg-gray-100',
  },
  {
    id: 'googlepay',
    label: 'Google Pay',
    icon: <GoogleLogo size={32} weight="fill" color="#34a853" />,
    bg: 'bg-green-100',
  },
  {
    id: 'virement',
    label: 'Virement instantané',
    icon: <Bank size={32} weight="fill" color="#7c3aed" />,
    bg: 'bg-purple-100',
  },
  {
    id: 'qr',
    label: 'QR Code',
    icon: <QrCode size={32} weight="fill" color="#0f172a" />,
    bg: 'bg-slate-100',
  },
  {
    id: 'cash',
    label: 'Espèces',
    icon: <Money size={32} weight="fill" color="#16a34a" />,
    bg: 'bg-lime-100',
  },
];

export default function PaiementPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const router = useRouter();

  const handleConfirm = () => {
    if (!selected) return;
    switch (selected) {
      case 'bancontact':
      case 'applepay':
      case 'googlepay':
        router.push('/paiement/stripe'); // page de redirection Stripe
        break;
      case 'virement':
        router.push('/paiement/virement');
        break;
      case 'qr':
        router.push('/paiement/qr');
        break;
      case 'cash':
        router.push('/paiement/cash');
        break;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-900">Choisissez votre mode de paiement</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paymentOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => setSelected(option.id)}
            className={`border rounded-xl p-6 flex flex-col items-center gap-4 text-center transition
              ${selected === option.id
                ? 'border-red-700 bg-red-50 shadow-md'
                : 'border-gray-200 hover:border-red-500'}
            `}
          >
            {option.icon}
            <span className="font-semibold">{option.label}</span>
            {selected === option.id && <CheckIcon className="text-red-700 w-5 h-5" />}
          </button>
        ))}
      </div>

      <div className="mt-10 text-center">
        <button
          disabled={!selected}
          onClick={handleConfirm}
          className="px-6 py-3 rounded-md text-white bg-red-800 hover:bg-red-700 disabled:opacity-50"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
