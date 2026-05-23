"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { Mail, Lock, ArrowRight, UserPlus } from "lucide-react";

const registerSchema = z
  .object({
    email: z.string().email("Email invalide"),
    password: z
      .string()
      .min(6, "Mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Compte créé! Veuillez vérifier votre email.");
      router.push("/login");
    }
    setLoading(false);
  };

  const handleGoogleRegister = async () => {
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      toast.error(error.message);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:bg-[#2C4A6E] lg:px-12">
        <div className="mx-auto max-w-md">
          <Link href="/" className="inline-block">
            <span className="text-3xl font-bold text-white">Silva</span>
          </Link>

          <div className="mt-12">
            <h1 className="text-4xl font-bold tracking-tight text-white">
              Créez votre espace,
              <br />
              <span className="text-white/80">commencez gratuitement.</span>
            </h1>
            <p className="mt-4 text-lg text-white/70">
              Plus besoin d'Excel ou de logiciels complexes. Silva centralise
              tout.
            </p>
          </div>

          <div className="mt-12 space-y-3">
            <div className="flex items-center gap-3 text-white/80">
              <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Gratuit pendant 30 jours</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Sans carte bancaire</span>
            </div>
            <div className="flex items-center gap-3 text-white/80">
              <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
                <svg
                  className="h-3 w-3 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <span>Installation en 2 minutes</span>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="flex items-center gap-2 text-sm text-white/60">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white text-xs">
                ✓
              </span>
              <span>Aucun engagement</span>
              <span className="mx-2">•</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white text-xs">
                ✓
              </span>
              <span>Support inclus</span>
              <span className="mx-2">•</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white text-xs">
                ✓
              </span>
              <span>Mises à jour gratuites</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex w-full items-center justify-center px-6 py-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center lg:text-left">
            <h2 className="text-2xl font-semibold text-gray-900">
              Inscription
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Créez votre compte en quelques secondes
            </p>
          </div>

          {/* Google button */}
          <button
            onClick={handleGoogleRegister}
            disabled={googleLoading}
            className="mb-6 flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            {googleLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-[#2C4A6E]" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
            )}
            <span>Continuer avec Google</span>
          </button>

          {/* Separator */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-2 text-gray-400">
                ou avec votre email
              </span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Adresse email"
              type="email"
              placeholder="vous@exemple.com"
              icon={<Mail className="h-4 w-4 text-gray-400" />}
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Mot de passe"
              type="password"
              placeholder="Choisissez un mot de passe"
              icon={<Lock className="h-4 w-4 text-gray-400" />}
              {...register("password")}
              error={errors.password?.message}
            />
            <Input
              label="Confirmer le mot de passe"
              type="password"
              placeholder="Répétez le mot de passe"
              icon={<Lock className="h-4 w-4 text-gray-400" />}
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />
            <Button
              type="submit"
              className="w-full bg-[#2C4A6E] hover:bg-[#1E3A5F] text-white"
              loading={loading}
            >
              Créer mon compte
              <UserPlus className="ml-2 h-4 w-4" />
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-500">
            Déjà un compte?{" "}
            <Link
              href="/login"
              className="font-medium text-[#2C4A6E] hover:underline"
            >
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
