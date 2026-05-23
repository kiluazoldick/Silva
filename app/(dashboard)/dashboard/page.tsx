"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { StatsCard } from "@/components/ui/StatsCard";
import { ActivityChart } from "@/components/ui/ActivityChart";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
  ArrowRight,
  Calendar,
  AlertCircle,
  Award,
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

interface DashboardData {
  companyName: string;
  stats: {
    totalEmployees: number;
    activeEmployees: number;
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    presentToday: number;
    totalHoursThisMonth: number;
  };
  recentTasks: any[];
  upcomingDeadlines: any[];
  recentActivity: any[];
  weeklyActivity: { date: string; count: number }[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
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
        .eq("company_id", company.id)
        .order("created_at", { ascending: false });

      const today = new Date().toISOString().split("T")[0];
      const { count: presentToday } = await supabase
        .from("attendance")
        .select("*", { count: "exact", head: true })
        .eq("date", today);

      const firstDayOfMonth = new Date();
      firstDayOfMonth.setDate(1);
      const { data: monthlyAttendance } = await supabase
        .from("attendance")
        .select("hours_worked")
        .gte("date", firstDayOfMonth.toISOString().split("T")[0]);

      const totalHoursThisMonth =
        monthlyAttendance?.reduce((sum, a) => sum + (a.hours_worked || 0), 0) ||
        0;

      const upcoming = tasks
        ?.filter(
          (t) =>
            t.due_date &&
            t.status !== "completed" &&
            new Date(t.due_date) > new Date(),
        )
        .slice(0, 5);

      const recentTasksCompleted =
        tasks?.filter((t) => t.status === "completed").slice(0, 3) || [];
      const recentEmployees = employees?.slice(0, 2) || [];

      const recentActivity = [
        ...recentTasksCompleted.map((t) => ({
          type: "task",
          title: `Tâche terminée : ${t.title}`,
          date: t.updated_at,
        })),
        ...recentEmployees.map((e) => ({
          type: "employee",
          title: `${e.first_name} ${e.last_name} a rejoint l'équipe`,
          date: e.created_at,
        })),
      ]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      const last7Days = eachDayOfInterval({
        start: subDays(new Date(), 6),
        end: new Date(),
      });
      const weeklyActivity = last7Days.map((day) => {
        const dayStr = format(day, "yyyy-MM-dd");
        const dayTasks =
          tasks?.filter((t) => t.created_at?.startsWith(dayStr)) || [];
        return {
          date: format(day, "EEE", { locale: fr }),
          count: dayTasks.length,
        };
      });

      const totalEmployees = employees?.length || 0;
      const activeEmployees =
        employees?.filter((e) => e.status === "active").length || 0;
      const totalTasks = tasks?.length || 0;
      const completedTasks =
        tasks?.filter((t) => t.status === "completed").length || 0;
      const completionRate =
        totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

      setData({
        companyName: company.name,
        stats: {
          totalEmployees,
          activeEmployees,
          totalTasks,
          completedTasks,
          completionRate: Math.round(completionRate),
          presentToday: presentToday || 0,
          totalHoursThisMonth: Math.round(totalHoursThisMonth),
        },
        recentTasks: (tasks || []).slice(0, 5),
        upcomingDeadlines: upcoming || [],
        recentActivity,
        weeklyActivity,
      });
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#2C4A6E] border-t-transparent mx-auto mb-4" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
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
              <Button className="bg-[#2C4A6E] hover:bg-[#1E3A5F]">
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Bonjour, {userName} 👋
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Voici ce qui se passe dans {data.companyName}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Employés"
          value={data.stats.totalEmployees}
          subValue={`${data.stats.activeEmployees} actifs`}
          icon={Users}
          trend={{ value: 12, isPositive: true }}
          link="/employees"
        />
        <StatsCard
          title="Tâches complétées"
          value={`${data.stats.completionRate}%`}
          subValue={`${data.stats.completedTasks}/${data.stats.totalTasks}`}
          icon={CheckSquare}
          trend={{
            value: data.stats.completionRate > 50 ? 8 : -5,
            isPositive: data.stats.completionRate > 50,
          }}
          link="/tasks"
        />
        <StatsCard
          title="Présents aujourd'hui"
          value={data.stats.presentToday}
          subValue={`sur ${data.stats.totalEmployees} employés`}
          icon={Clock}
          link="/attendance"
        />
        <StatsCard
          title="Heures travaillées"
          value={`${data.stats.totalHoursThisMonth}h`}
          subValue="ce mois-ci"
          icon={TrendingUp}
          trend={{ value: 5, isPositive: true }}
          link="/statistics"
        />
      </div>

      {/* Graphique activité */}
      <ActivityChart data={data.weeklyActivity} />

      {/* Deux colonnes */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Tâches récentes */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Tâches récentes
            </h3>
            <Link
              href="/tasks"
              className="text-xs text-[#2C4A6E] hover:underline"
            >
              Voir tout
            </Link>
          </div>
          <div className="space-y-3">
            {data.recentTasks.length === 0 ? (
              <div className="py-8 text-center">
                <CheckSquare className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucune tâche</p>
              </div>
            ) : (
              data.recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 transition hover:border-gray-200"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Assignée à {task.employee?.first_name}{" "}
                      {task.employee?.last_name}
                    </p>
                  </div>
                  <div
                    className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                      task.status === "completed"
                        ? "bg-green-50 text-green-700"
                        : task.status === "in_progress"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-gray-50 text-gray-500"
                    }`}
                  >
                    {task.status === "completed"
                      ? "Terminé"
                      : task.status === "in_progress"
                        ? "En cours"
                        : "À faire"}
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Activité récente */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Activité récente
            </h3>
            <Award className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {data.recentActivity.length === 0 ? (
              <div className="py-8 text-center">
                <Activity className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucune activité récente</p>
              </div>
            ) : (
              data.recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 p-3"
                >
                  <div className="rounded-full bg-gray-50 p-1.5">
                    {activity.type === "task" ? (
                      <CheckSquare className="h-3 w-3 text-gray-500" />
                    ) : (
                      <Users className="h-3 w-3 text-gray-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700">{activity.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDistanceToNow(new Date(activity.date), {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Échéances et actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Échéances */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-gray-900">
              Échéances à venir
            </h3>
            <Calendar className="h-4 w-4 text-gray-400" />
          </div>
          <div className="space-y-3">
            {data.upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center">
                <Calendar className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Aucune échéance</p>
              </div>
            ) : (
              data.upcomingDeadlines.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {task.title}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Due{" "}
                      {formatDistanceToNow(new Date(task.due_date), {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {new Date(task.due_date) < new Date() ? (
                    <AlertCircle className="h-4 w-4 text-red-400" />
                  ) : (
                    <Calendar className="h-4 w-4 text-gray-300" />
                  )}
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Actions rapides */}
        <Card>
          <h3 className="mb-4 text-base font-semibold text-gray-900">
            Actions rapides
          </h3>
          <div className="flex flex-col gap-2">
            <Link href="/employees">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-sm font-normal"
              >
                <Users className="h-4 w-4" />
                Ajouter un employé
              </Button>
            </Link>
            <Link href="/tasks">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-sm font-normal"
              >
                <CheckSquare className="h-4 w-4" />
                Créer une tâche
              </Button>
            </Link>
            <Link href="/attendance">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-sm font-normal"
              >
                <Clock className="h-4 w-4" />
                Enregistrer une présence
              </Button>
            </Link>
            <Link href="/statistics">
              <Button
                variant="outline"
                className="w-full justify-start gap-2 text-sm font-normal"
              >
                <TrendingUp className="h-4 w-4" />
                Voir les statistiques
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
