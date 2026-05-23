// app/(dashboard)/dashboard/page.tsx - Version avec couleurs correctes

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  Calendar,
  AlertCircle,
  Briefcase,
  Activity,
} from "lucide-react";
import {
  format,
  formatDistanceToNow,
  subDays,
  eachDayOfInterval,
} from "date-fns";
import { fr } from "date-fns/locale";

const supabase = createClient();

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserName(user.email?.split("@")[0] || "");

      const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("owner_id", user.id)
        .single();

      if (!company) {
        setLoading(false);
        return;
      }

      const { data: employees } = await supabase
        .from("employees")
        .select("*")
        .eq("company_id", company.id);

      const { data: tasks } = await supabase
        .from("tasks")
        .select("*, employee:assigned_to(first_name, last_name)")
        .eq("company_id", company.id);

      const today = new Date().toISOString().split("T")[0];
      const { count: presentToday } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("date", today);

      const totalEmployees = employees?.length || 0;
      const totalTasks = tasks?.length || 0;
      const completedTasks =
        tasks?.filter((t) => t.status === "completed").length || 0;
      const completionRate =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setData({
        companyName: company.name,
        stats: {
          totalEmployees,
          totalTasks,
          completedTasks,
          completionRate: Math.round(completionRate),
          presentToday: presentToday || 0,
        },
        recentTasks: (tasks || []).slice(0, 5),
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C4A6E] border-t-transparent" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card>
          <div className="text-center py-12">
            <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Bienvenue sur Silva ! 👋
            </h3>
            <p className="text-gray-500 mb-6">
              Commencez par créer votre entreprise
            </p>
            <Link href="/company-setup">
              <Button className="bg-[#2C4A6E] hover:bg-[#1E3A5F] text-white">
                Créer mon entreprise
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header - sans dégradé */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Bonjour, {userName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Bienvenue sur {data.companyName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</span>
        </div>
      </div>

      {/* Stats Cards - Version avec couleurs Silva */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Carte Employés */}
        <Link href="/employees">
          <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Employés</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {data.stats.totalEmployees}
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <Users className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Carte Tâches */}
        <Link href="/tasks">
          <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Tâches complétées</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {data.stats.completionRate}%
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {data.stats.completedTasks}/{data.stats.totalTasks} tâches
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <CheckSquare className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Carte Présences */}
        <Link href="/attendance">
          <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Présents aujourd'hui</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {data.stats.presentToday}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  sur {data.stats.totalEmployees} employés
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <Clock className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>

        {/* Carte Performance */}
        <Link href="/statistics">
          <div className="rounded-xl border border-gray-100 bg-white p-5 transition-all hover:border-gray-200 hover:shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500">Performance</p>
                <p className="mt-2 text-2xl font-semibold text-gray-900">
                  {data.stats.completionRate}%
                </p>
                <p className="mt-1 text-xs text-gray-400">taux de complétion</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-2">
                <TrendingUp className="h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>
        </Link>
      </div>

      {/* Activité récente - Graphique simplifié */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900">
            Activité récente
          </h3>
          <Activity className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {data.recentTasks.length === 0 ? (
            <p className="text-center text-gray-400 py-4 text-sm">
              Aucune activité récente
            </p>
          ) : (
            data.recentTasks.map((task: any) => (
              <div
                key={task.id}
                className="flex items-center justify-between rounded-lg border border-gray-50 p-3"
              >
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {task.title}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {task.status === "completed" ? "Terminée" : "En cours"}
                  </p>
                </div>
                <div
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    task.status === "completed"
                      ? "bg-green-50 text-green-700"
                      : "bg-gray-50 text-gray-500"
                  }`}
                >
                  {task.status === "completed" ? "✓ Terminé" : "⏳ En cours"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Actions rapides */}
      <div className="rounded-xl border border-gray-100 bg-white p-5">
        <h3 className="mb-4 text-base font-semibold text-gray-900">
          Actions rapides
        </h3>
        <div className="flex flex-col gap-2">
          <Link href="/employees">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm font-normal border-gray-200 hover:border-[#2C4A6E] hover:text-[#2C4A6E]"
            >
              <Users className="h-4 w-4" />
              Ajouter un employé
            </Button>
          </Link>
          <Link href="/tasks">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm font-normal border-gray-200 hover:border-[#2C4A6E] hover:text-[#2C4A6E]"
            >
              <CheckSquare className="h-4 w-4" />
              Créer une tâche
            </Button>
          </Link>
          <Link href="/attendance">
            <Button
              variant="outline"
              className="w-full justify-start gap-2 text-sm font-normal border-gray-200 hover:border-[#2C4A6E] hover:text-[#2C4A6E]"
            >
              <Clock className="h-4 w-4" />
              Enregistrer une présence
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
