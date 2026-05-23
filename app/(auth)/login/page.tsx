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
import { Mail, Lock } from 'lucide-react'

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe doit contenir au moins 6 caractères'),
})

type LoginForm = z.infer<typeof loginSchema>

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })

    if (error) {
      toast.error(error.message)
    } else {
      toast.success('Connexion réussie!')
      router.push('/dashboard')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      toast.error(error.message)
      setGoogleLoading(false)
    }
  }

  return (
    <GlassmorphismForm
      title="Connexion"
      description="Connectez-vous à votre compte Silva"
    >
      {/* Logo */}
      <div className="mb-6 text-center lg:hidden">
        <Link href="/">
          <h1 className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">Silva</h1>
        </Link>
      </div>

      {/* Google Button */}
      <button
        onClick={handleGoogleLogin}
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
        <span className="text-sm">{googleLoading ? 'Connexion...' : 'Continuer avec Google'}</span>
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
      </div>

      {/* Remember & Forgot */}
      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="rounded" />
          <span className="text-muted-foreground">Se souvenir de moi</span>
        </label>
        <Link href="#" className="text-primary hover:underline font-medium">
          Mot de passe oublié?
        </Link>
      </div>

      {/* Submit */}
      <Button type="submit" onClick={handleSubmit(onSubmit)} className="w-full" loading={loading}>
        Se connecter
      </Button>

      {/* Sign up link */}
      <p className="text-center text-sm text-muted-foreground">
        Pas encore de compte?{' '}
        <Link href="/register" className="font-semibold text-primary hover:underline">
          S'inscrire
        </Link>
      </p>
    </GlassmorphismForm>
  )
}
