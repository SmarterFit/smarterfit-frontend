'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"
import { subscriptionUserService } from "@/backend/modules/billing/services/subscriptionUserServices"
import { SuccessToast, ErrorToast } from "@/components/toasts/Toasts"
import type { SubscriptionResponseDTO } from "@/backend/modules/billing/types/subscriptionTypes"
import type { CreatedPlanResponseDTO } from "@/backend/modules/billing/types/planTypes"
import { classGroupUserService } from "@/backend/modules/classgroup/service/classGroupUserService"
import { Card } from "@/components/ui/card"

interface SelectPlanDialogProps {
  classGroupId: string
  userId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function SelectPlanDialog({
  classGroupId,
  userId,
  open,
  onOpenChange,
  onSuccess,
}: SelectPlanDialogProps) {
  const [subscriptions, setSubscriptions] = useState<SubscriptionResponseDTO[]>([])
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [fetchingSubscriptions, setFetchingSubscriptions] = useState(false)

  useEffect(() => {
    if (open) {
      fetchSubscriptions()
    }
  }, [open])

  const fetchSubscriptions = async () => {
    setFetchingSubscriptions(true)
    try {
      const data = await subscriptionUserService.getAllSubscriptionsByUserId(userId)
      setSubscriptions(data)
      if (data.length > 0) {
        setSelectedSubscriptionId(data[0].id)
      }
    } catch (error) {
      ErrorToast("Falha ao carregar assinaturas disponíveis")
    } finally {
      setFetchingSubscriptions(false)
    }
  }

  const handleJoinClass = async () => {
    if (!selectedSubscriptionId) {
      ErrorToast("Selecione um plano para continuar")
      return
    }

    setLoading(true)
    try {
      await classGroupUserService.addMemberToClassGroup({
        classGroupId,
        userId,
        subscriptionId: selectedSubscriptionId,
      })
      SuccessToast("Sucesso", "Você entrou na turma com sucesso!")
      onSuccess()
      onOpenChange(false)
    } catch (error) {
      ErrorToast(error.response?.data?.message || "Falha ao entrar na turma")
    } finally {
      setLoading(false)
    }
  }

  const getAvailableSlotsText = (plan: CreatedPlanResponseDTO, available: number) => {
    return `${available} de ${plan.maxUsers} vagas disponíveis`
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Selecione um plano</DialogTitle>
          <DialogDescription>
            Escolha um dos seus planos ativos para entrar nesta turma.
          </DialogDescription>
        </DialogHeader>

        {fetchingSubscriptions ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            Você não possui nenhum plano ativo. Adquira um plano antes de entrar na turma.
          </div>
        ) : (
          <div className="grid gap-4">
            {subscriptions.map((subscription) => (
              <Card
                key={subscription.id}
                onClick={() => setSelectedSubscriptionId(subscription.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  selectedSubscriptionId === subscription.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{subscription.plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {subscription.plan.description}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {getAvailableSlotsText(subscription.plan, subscription.availableMembers)}
                    </p>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL'
                      }).format(subscription.plan.price)}
                    </span>
                    <span className="text-sm text-muted-foreground ml-1">
                      /{subscription.plan.duration} dias
                    </span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={handleJoinClass}
            disabled={loading || subscriptions.length === 0}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Entrando na turma...
              </>
            ) : (
              "Confirmar seleção"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}