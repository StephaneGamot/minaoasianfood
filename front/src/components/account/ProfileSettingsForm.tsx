// src/components/Profile/ProfileSettingsForm.tsx
"use client";

import { useEffect, useMemo, useState, useId } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTranslations } from "next-intl";

type Props = { locale: string };
type Gender = "MALE" | "FEMALE" | "OTHER" | "";

type Profile = {
  id: number | string;
  firstName?: string | null;
  lastName: string;
  email: string;
  phoneNumber?: string | null;
  gender?: Gender | null;
  address?: string | null;
  address2?: string | null;
  city?: string | null;
  postalCode?: string | null;
  profilePicUrl?: string | null;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
};

const API = process.env.NEXT_PUBLIC_API_BASE || "/api";

export default function ProfileSettingsForm({ locale }: Props) {
  const t = useTranslations("profile");
  const router = useRouter();
  const { user, loading, authedFetch } = useAuth();

  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<null | "ok" | "err">(null);
  const [errMsg, setErrMsg] = useState("");

  const isAuthed = !!user;
  const backHref = useMemo(() => `/${locale}/profile`, [locale]);

  // Guard
  useEffect(() => {
    if (!loading && !isAuthed) {
      const redirect = encodeURIComponent(`/${locale}/profile/settings`);
      router.replace(`/${locale}/login?redirectTo=${redirect}`);
    }
  }, [loading, isAuthed, router, locale]);

  // Load profile
  useEffect(() => {
    if (!isAuthed) return;
    (async () => {
      try {
        const res = await authedFetch(`${API}/auth/me`, { method: "GET", cache: "no-store" });
        if (!res.ok) {
          if (res.status === 401) {
            const redirect = encodeURIComponent(`/${locale}/profile/settings`);
            router.replace(`/${locale}/login?redirectTo=${redirect}`);
          } else {
            setErrMsg(t("loadError", { default: "Erreur de chargement du profil." }) as string);
          }
          return;
        }
        const data = await res.json();
        setForm({
          id: data.id,
          firstName: data.firstName ?? "",
          lastName: data.lastName ?? "",
          email: data.email ?? "",
          phoneNumber: data.phoneNumber ?? "",
          gender: (data.gender as Gender) ?? "",
          address: data.address ?? "",
          address2: data.address2 ?? "",
          city: data.city ?? "",
          postalCode: data.postalCode ?? "",
          profilePicUrl: data.profilePicUrl ?? "",
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          active: data.active,
        });
      } catch {
        setErrMsg(t("loadError", { default: "Erreur de chargement du profil." }) as string);
      }
    })();
  }, [isAuthed, authedFetch, router, locale, t]);

  function onChange<K extends keyof Profile>(key: K, val: Profile[K]) {
    if (!form) return;
    setForm({ ...form, [key]: val });
    setSaved(null);
    setErrMsg("");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;

    if (!form.lastName || !form.lastName.trim()) {
      setErrMsg(t("lastNameRequired", { default: "Le nom de famille est obligatoire." }) as string);
      return;
    }

    setSaving(true);
    setSaved(null);
    setErrMsg("");
    try {
      const payload = {
        firstName: form.firstName?.trim() || null,
        lastName: form.lastName?.trim() || null,
        phoneNumber: form.phoneNumber?.trim() || null,
        gender: form.gender || null,
        address: form.address?.trim() || null,
        address2: form.address2?.trim() || null,
        city: form.city?.trim() || null,
        postalCode: form.postalCode?.trim() || null,
        profilePicUrl: form.profilePicUrl?.trim() || null,
      };

      const res = await authedFetch(`${API}/auth/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const msg = await safeText(res);
        setErrMsg(msg || (t("saveError", { default: "Une erreur est survenue." }) as string));
        setSaved("err");
        return;
      }

      setSaved("ok");
      // Retour vers /profile
      router.replace(`/${locale}/profile`);
    } catch {
      setErrMsg(t("saveError", { default: "Une erreur est survenue." }) as string);
      setSaved("err");
    } finally {
      setSaving(false);
    }
  }

  if (loading || !isAuthed || !form) {
    return (
      <main className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-56 bg-gray-200 rounded" />
          <div className="h-20 bg-gray-200 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Prépare l’erreur du nom (pour ARIA)
  const lastNameError =
    !form.lastName?.trim()
      ? (t("lastNameRequired", { default: "Le nom de famille est obligatoire." }) as string)
      : "";

  return (
    <main className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">
          {t("settingsTitle", { default: "Paramètres du profil" })}
        </h1>
        <p className="text-gray-600">
          {t("settingsSubtitle", { default: "Mettez à jour vos informations" })}
        </p>
      </div>

      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-6">
        {/* État */}
        {saved === "ok" && (
          <div
            role="status"
            className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-800"
          >
            {t("saved", { default: "Modifications enregistrées." })}
          </div>
        )}
        {(saved === "err" || errMsg) && (
          <div
            role="alert"
            className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          >
            {errMsg || t("saveError", { default: "Une erreur est survenue." })}
          </div>
        )}

        {/* Aperçu avatar si URL */}
        {(form.profilePicUrl || "").trim() ? (
          <div className="flex items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.profilePicUrl!}
              alt={t("avatarPreview", { default: "Aperçu de la photo de profil" }) as string}
              className="h-16 w-16 rounded-full object-cover border"
            />
            <span className="text-sm text-gray-600">
              {t("avatarHint", { default: "L’aperçu est basé sur l’URL ci-dessous." })}
            </span>
          </div>
        ) : null}

        {/* Identité */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="profilePicUrl"
            label={t("photoUrl", { default: "URL de la photo" }) as string}
            value={form.profilePicUrl || ""}
            onChange={(v) => onChange("profilePicUrl", v)}
            autoComplete="url"
            placeholder="https://exemple.com/avatar.jpg"
          />

          <Field
            id="firstName"
            label={t("firstName", { default: "Prénom" }) as string}
            value={form.firstName || ""}
            onChange={(v) => onChange("firstName", v)}
            autoComplete="given-name"
            placeholder="Ex: Mei"
          />
          <Field
            id="lastName"
            label={`${t("lastName", { default: "Nom" })} *`}
            value={form.lastName || ""}
            onChange={(v) => onChange("lastName", v)}
            required
            autoComplete="family-name"
            placeholder="Ex: Li"
            errorId="err-lastName"
            errorText={lastNameError}
          />
          <Field
            id="email"
            label={t("email", { default: "E-mail" }) as string}
            value={form.email}
            readOnly
            autoComplete="email"
            placeholder="exemple@domaine.com"
          />
          <Field
            id="phone"
            label={t("phone", { default: "Téléphone" }) as string}
            value={form.phoneNumber || ""}
            onChange={(v) => onChange("phoneNumber", v)}
            autoComplete="tel"
            placeholder="Ex: +32 4 12 34 56 78"
          />

          <LabeledSelect
            id="gender"
            label={t("gender", { default: "Genre" }) as string}
            value={form.gender || ""}
            onChange={(v) => onChange("gender", v as Gender)}
            options={[
              { value: "" as Gender, label: "—" },
              { value: "MALE", label: t("genderMale", { default: "Homme" }) as string },
              { value: "FEMALE", label: t("genderFemale", { default: "Femme" }) as string },
              { value: "OTHER", label: t("genderOther", { default: "Autre" }) as string },
            ]}
          />
        </section>

        {/* Adresse */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field
            id="address1"
            label={t("address1", { default: "Adresse" }) as string}
            value={form.address || ""}
            onChange={(v) => onChange("address", v)}
            autoComplete="address-line1"
            placeholder="Rue, numéro"
          />
          <Field
            id="address2"
            label={t("address2", { default: "Complément d’adresse" }) as string}
            value={form.address2 || ""}
            onChange={(v) => onChange("address2", v)}
            autoComplete="address-line2"
            placeholder="Bâtiment, étage…"
          />
          <Field
            id="city"
            label={t("city", { default: "Ville" }) as string}
            value={form.city || ""}
            onChange={(v) => onChange("city", v)}
            autoComplete="address-level2"
            placeholder="Ex: Bruxelles"
          />
          <Field
            id="postalCode"
            label={t("postalCode", { default: "Code postal" }) as string}
            value={form.postalCode || ""}
            onChange={(v) => onChange("postalCode", v)}
            autoComplete="postal-code"
            placeholder="Ex: 1000"
          />
        </section>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center rounded-md bg-[#f47457] px-4 py-2 text-sm text-white hover:bg-red-500 disabled:opacity-60"
          >
            {saving
              ? (t("saving", { default: "Enregistrement..." }) as string)
              : (t("save", { default: "Enregistrer" }) as string)}
          </button>

          <Link
            href={backHref}
            className="inline-flex items-center justify-center rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
          >
            {t("cancel", { default: "Annuler" })}
          </Link>

          <span className="ml-auto text-xs text-gray-500">
            {t("requiredHint", { default: "Les champs marqués * sont obligatoires." })}
          </span>
        </div>
      </form>
    </main>
  );
}

/* ---------- Champs ---------- */

function Field(props: {
  id?: string;
  label: string;
  value: string;
  onChange?: (v: string) => void;
  required?: boolean;
  readOnly?: boolean;
  autoComplete?:
    | "name" | "honorific-prefix" | "given-name" | "additional-name" | "family-name"
    | "email" | "username" | "new-password" | "current-password"
    | "organization" | "street-address" | "address-line1" | "address-line2"
    | "address-level2" | "address-level1" | "postal-code" | "country-name"
    | "tel" | "url" | "off";
  placeholder?: string;
  errorId?: string;   // id du message d’erreur si présent
  errorText?: string; // texte d’erreur à afficher
}) {
  const reactId = useId();
  const {
    id = reactId,
    label,
    value,
    onChange,
    required,
    readOnly,
    autoComplete = "off",
    placeholder,
    errorId,
    errorText,
  } = props;

  const isInvalid = !!errorText;

  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required ? <span className="text-red-600">*</span> : null}
      </label>

      <input
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        required={required}
        readOnly={readOnly}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 ${
          readOnly ? "bg-gray-50 text-gray-600 cursor-not-allowed" : ""
        }`}
        // ✅ Axe/Edge friendly: attribut seulement si erreur, valeur booléenne
        aria-invalid={isInvalid ? true : undefined}
        aria-describedby={isInvalid && errorId ? errorId : undefined}
      />

      {isInvalid ? (
        <p id={errorId} className="text-xs text-red-700 mt-1">
          {errorText}
        </p>
      ) : null}
    </div>
  );
}

function LabeledSelect<T extends string>(props: {
  id?: string;
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
}) {
  const reactId = useId();
  const { id = reactId, label, value, onChange, options } = props;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="w-full px-4 py-2 border rounded-md outline-none focus:ring-2 focus:ring-red-300 bg-white"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

async function safeText(res: Response): Promise<string | null> {
  try {
    const t = await res.text();
    return t || null;
  } catch {
    return null;
  }
}
