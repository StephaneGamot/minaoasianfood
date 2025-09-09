"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";

// ✅ clé pour ne plus réafficher la modale pendant la session
const STORAGE_KEY = "closedModalDismissed";

// ✅ flag activé/désactivé par variable d'env publique (bake au build)
const SITE_CLOSED =
  (process.env.NEXT_PUBLIC_SITE_CLOSED ?? "").toLowerCase() === "true" ||
  (process.env.NEXT_PUBLIC_SITE_CLOSED ?? "") === "1";

/**
 * Modale très simple “site en construction”.
 * - S’affiche seulement si NEXT_PUBLIC_SITE_CLOSED = true/1
 * - Se masque pour la session après clic sur “D’accord”
 */
export default function SiteClosedModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // côté client uniquement
    if (!SITE_CLOSED) return;
    try {
      const dismissed = sessionStorage.getItem(STORAGE_KEY) === "1";
      if (!dismissed) setOpen(true);
    } catch {
      // si sessionStorage indispo, on ouvre quand même
      setOpen(true);
    }
  }, []);

  if (!SITE_CLOSED) return null;

  return (
    <Dialog
      open={open}
      onClose={() => {
        // on empêche la fermeture par clic extérieur/ESC tant que l’utilisateur n’a pas cliqué “D’accord”
        // donc on ne fait rien ici
      }}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="mx-auto w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
          <DialogTitle className="text-xl font-bold text-gray-900">
            Site en construction
          </DialogTitle>

          <p className="mt-3 text-sm text-gray-700">
            Nous finalisons le site. Les commandes en ligne sont temporairement
            désactivées. Vous pouvez nous joindre au{" "}
            <a href="tel:+3227057535" className="font-semibold text-red-900 underline">
              02 705 75 35
            </a>
            .
          </p>

          <div className="mt-4">
     
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
