'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { GlassmorphismForm } from '@/components/ui/GlassmorphismForm'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Mail, Lock, CheckCircle } from 'lucide-react'

const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
})

type RegisterForm = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')
  const passwordStrength = password.length >= 8 ? 'strong' : password.length >= 6 ? 'medium' : 'weak'

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true)
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Compte créé! Veuillez vérifier votre email.')
      router.push('/login')
    }
    setLoading(false)
  }

  const handleGoogleRegister = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    })

    if (error) {
      toast.error(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <GlassmorphismForm
      title="Créer un compte"
      description="Rejoignez Silva et gérez votre entreprise"
    >
      {/* Logo */}
      <div className="mb-6 text-center lg:hidden">
        <Link href="/">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Silva</h1>
        </Link>
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleRegister}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-muted transition-colors font-medium text-foreground disabled:opacity-50"
      >
        {googleLoading ? (
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        ) : (
          <svg className="h-4 w-4" viewBox="0 0 24 24">
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
        <span className="text-sm">{googleLoading ? 'Inscription...' : 'Continuer avec Google'}</span>
      </button>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-background text-muted-foreground">ou</span>
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Mail className="w-4 h-4 text-primary" />
          Email
        </label>
        <Input
          type="email"
          placeholder="vous@exemple.com"
          {...register('email')}
          error={errors.email?.message}
          className="rounded-lg"
        />
      </div>

      {/* Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <Lock className="w-4 h-4 text-primary" />
          Mot de passe
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register('password')}
          error={errors.password?.message}
          className="rounded-lg"
        />
        {password && (
          <div className="flex gap-1">
            <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-success' : passwordStrength === 'medium' ? 'bg-warning' : 'bg-error'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-success' : passwordStrength === 'medium' ? 'bg-warning' : 'bg-muted'}`}></div>
            <div className={`h-1 flex-1 rounded-full ${passwordStrength === 'strong' ? 'bg-success' : 'bg-muted'}`}></div>
          </div>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Confirmer mot de passe
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
          className="rounded-lg"
        />
      </div>

      {/* Terms */}
      <label className="flex items-start gap-2 cursor-pointer">
        <input type="checkbox" className="mt-1" required />
        <span className="text-sm text-muted-foreground">
          J&apos;accepte les <Link href="#" className="text-primary hover:underline">conditions d&apos;utilisation</Link>
        </span>
      </label>

      {/* Submit */}
      <Button type="submit" onClick={handleSubmit(onSubmit)} className="w-full" loading={loading}>
        S'inscrire
      </Button>

      {/* Login link */}
      <p className="text-center text-sm text-muted-foreground">
        Déjà un compte?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Se connecter
        </Link>
      </p>
    </GlassmorphismForm>
  )
}
