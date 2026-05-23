'use client'

import { ReactNode, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ChevronRight, ChevronLeft, X, CheckCircle } from 'lucide-react'

interface OnboardingStep {
  id: string
  title: string
  description: string
  content: ReactNode
  icon?: ReactNode
}

interface OnboardingFlowProps {
  steps: OnboardingStep[]
  onComplete: () => void
  onSkip?: () => void
  allowSkip?: boolean
}

export function OnboardingFlow({
  steps,
  onComplete,
  onSkip,
  allowSkip = true,
}: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set())

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100
  const isLastStep = currentStep === steps.length - 1

  const handleNext = () => {
    const newCompleted = new Set(completedSteps)
    newCompleted.add(step.id)
    setCompletedSteps(newCompleted)

    if (isLastStep) {
      onComplete()
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    if (allowSkip && onSkip) {
      onSkip()
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">{step.title}</h2>
            <p className="text-muted-foreground text-sm mt-1">{step.description}</p>
          </div>
          {allowSkip && (
            <button
              onClick={handleSkip}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Fermer l'onboarding"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="px-6 pt-4">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Étape {currentStep + 1} sur {steps.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-6">
            {step.icon && (
              <div className="inline-flex p-3 rounded-lg bg-primary/10 text-primary mb-4">
                {step.icon}
              </div>
            )}
          </div>
          {step.content}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border p-6 bg-card flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Précédent
          </Button>

          <div className="flex gap-2">
            {steps.map((s) => (
              <div
                key={s.id}
                className={`h-2 rounded-full transition-all ${
                  completedSteps.has(s.id) || currentStep >= steps.indexOf(s)
                    ? 'bg-primary w-2'
                    : 'bg-muted w-2'
                }`}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            className="flex items-center gap-2"
          >
            {isLastStep ? (
              <>
                <CheckCircle className="w-4 h-4" />
                Terminer
              </>
            ) : (
              <>
                Suivant
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
