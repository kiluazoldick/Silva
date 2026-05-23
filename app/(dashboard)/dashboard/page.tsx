"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  CheckSquare,
  Clock,
  TrendingUp,
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

// Styles constants
const styles = {
  page: {
    padding: "24px",
    maxWidth: "1280px",
    margin: "0 auto",
    width: "100%",
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #e5e5e5",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 1px 2px rgba(0,0,0,0.03)",
  },
  cardHover: {
    transition: "all 0.2s ease",
    cursor: "pointer",
  },
  statValue: {
    fontSize: "28px",
    fontWeight: 600,
    color: "#1a1a1a",
    lineHeight: 1.2,
  },
  statLabel: {
    fontSize: "13px",
    color: "#8c8c8c",
    fontWeight: 500,
  },
  statSubValue: {
    fontSize: "11px",
    color: "#b3b3b3",
    marginTop: "4px",
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#1a1a1a",
    marginBottom: "16px",
  },
  trendUp: {
    fontSize: "11px",
    color: "#22c55e",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "8px",
  },
  trendDown: {
    fontSize: "11px",
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    marginTop: "8px",
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "16px",
    marginBottom: "24px",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "24px",
  },
  buttonOutline: {
    padding: "10px 16px",
    backgroundColor: "white",
    border: "1px solid #e5e5e5",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: 500,
    color: "#4a4a4a",
    cursor: "pointer",
    transition: "all 0.2s",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    width: "100%",
    textDecoration: "none",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "11px",
    fontWeight: 500,
  },
};

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
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f4",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              border: "2px solid #2C4A6E",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 16px",
            }}
          />
          <p style={{ fontSize: "13px", color: "#8c8c8c" }}>Chargement...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f5f5f4",
        }}
      >
        <div
          style={{
            ...styles.card,
            maxWidth: "400px",
            textAlign: "center",
            padding: "48px 32px",
          }}
        >
          <Briefcase
            size={48}
            style={{ color: "#d4d4d4", margin: "0 auto 16px" }}
          />
          <h3
            style={{
              fontSize: "18px",
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: "8px",
            }}
          >
            Bienvenue sur Silva ! 👋
          </h3>
          <p
            style={{ fontSize: "13px", color: "#8c8c8c", marginBottom: "24px" }}
          >
            Commencez par créer votre entreprise
          </p>
          <Link
            href="/company-setup"
            style={{
              ...styles.buttonOutline,
              justifyContent: "center",
              backgroundColor: "#2C4A6E",
              color: "white",
              border: "none",
            }}
          >
            Créer mon entreprise
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: 600,
              color: "#1a1a1a",
              marginBottom: "4px",
            }}
          >
            Bonjour, {userName} 👋
          </h1>
          <p style={{ fontSize: "13px", color: "#8c8c8c" }}>
            Voici ce qui se passe dans {data.companyName}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "13px",
            color: "#b3b3b3",
          }}
        >
          <Calendar size={14} />
          <span>{format(new Date(), "EEEE d MMMM yyyy", { locale: fr })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.grid4}>
        {/* Card 1 - Employés */}
        <div style={{ ...styles.card, ...styles.cardHover }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p style={styles.statLabel}>Employés</p>
              <p style={styles.statValue}>{data.stats.totalEmployees}</p>
              <p style={styles.statSubValue}>
                {data.stats.activeEmployees} actifs
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#f5f5f4",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Users size={18} color="#8c8c8c" />
            </div>
          </div>
          <div style={styles.trendUp}>
            <TrendingUp size={11} />
            <span>12% vs mois dernier</span>
          </div>
        </div>

        {/* Card 2 - Tâches complétées */}
        <div style={{ ...styles.card, ...styles.cardHover }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p style={styles.statLabel}>Tâches complétées</p>
              <p style={styles.statValue}>{data.stats.completionRate}%</p>
              <p style={styles.statSubValue}>
                {data.stats.completedTasks}/{data.stats.totalTasks}
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#f5f5f4",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <CheckSquare size={18} color="#8c8c8c" />
            </div>
          </div>
          <div
            style={
              data.stats.completionRate > 50 ? styles.trendUp : styles.trendDown
            }
          >
            <TrendingUp size={11} />
            <span>
              {data.stats.completionRate > 50 ? "8%" : "5%"} vs mois dernier
            </span>
          </div>
        </div>

        {/* Card 3 - Présents aujourd'hui */}
        <div style={{ ...styles.card, ...styles.cardHover }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p style={styles.statLabel}>Présents aujourd'hui</p>
              <p style={styles.statValue}>{data.stats.presentToday}</p>
              <p style={styles.statSubValue}>
                sur {data.stats.totalEmployees} employés
              </p>
            </div>
            <div
              style={{
                backgroundColor: "#f5f5f4",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <Clock size={18} color="#8c8c8c" />
            </div>
          </div>
        </div>

        {/* Card 4 - Heures travaillées */}
        <div style={{ ...styles.card, ...styles.cardHover }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div>
              <p style={styles.statLabel}>Heures travaillées</p>
              <p style={styles.statValue}>{data.stats.totalHoursThisMonth}h</p>
              <p style={styles.statSubValue}>ce mois-ci</p>
            </div>
            <div
              style={{
                backgroundColor: "#f5f5f4",
                padding: "8px",
                borderRadius: "8px",
              }}
            >
              <TrendingUp size={18} color="#8c8c8c" />
            </div>
          </div>
          <div style={styles.trendUp}>
            <TrendingUp size={11} />
            <span>5% vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div style={{ ...styles.card, marginBottom: "24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3 style={styles.sectionTitle}>Activité hebdomadaire</h3>
            <p style={{ fontSize: "11px", color: "#b3b3b3" }}>
              Tâches créées cette semaine
            </p>
          </div>
          <Activity size={18} color="#b3b3b3" />
        </div>
        <div
          style={{
            display: "flex",
            gap: "8px",
            justifyContent: "space-between",
          }}
        >
          {data.weeklyActivity.map((day: any, i: number) => (
            <div
              key={i}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <div
                style={{
                  width: "100%",
                  backgroundColor: day.count > 0 ? "#2C4A6E" : "#f0f0f0",
                  height: `${Math.max(day.count * 10, 4)}px`,
                  maxHeight: "60px",
                  minHeight: "4px",
                  borderRadius: "4px",
                  transition: "all 0.2s",
                }}
              />
              <span style={{ fontSize: "11px", color: "#b3b3b3" }}>
                {day.date}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Two columns */}
      <div style={styles.grid2}>
        {/* Recent Tasks */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={styles.sectionTitle}>Tâches récentes</h3>
            <Link
              href="/tasks"
              style={{
                fontSize: "11px",
                color: "#2C4A6E",
                textDecoration: "none",
              }}
            >
              Voir tout
            </Link>
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.recentTasks.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <CheckSquare
                  size={32}
                  color="#d4d4d4"
                  style={{ margin: "0 auto 8px" }}
                />
                <p style={{ fontSize: "13px", color: "#b3b3b3" }}>
                  Aucune tâche
                </p>
              </div>
            ) : (
              data.recentTasks.map((task: any) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1a1a1a",
                        marginBottom: "4px",
                      }}
                    >
                      {task.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "#b3b3b3" }}>
                      Assignée à {task.employee?.first_name}{" "}
                      {task.employee?.last_name}
                    </p>
                  </div>
                  <div
                    style={{
                      ...styles.badge,
                      backgroundColor:
                        task.status === "completed"
                          ? "#e8f5e9"
                          : task.status === "in_progress"
                            ? "#e3f2fd"
                            : "#f5f5f4",
                      color:
                        task.status === "completed"
                          ? "#2e7d32"
                          : task.status === "in_progress"
                            ? "#1565c0"
                            : "#8c8c8c",
                    }}
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
        </div>

        {/* Recent Activity */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={styles.sectionTitle}>Activité récente</h3>
            <Award size={14} color="#b3b3b3" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.recentActivity.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <Activity
                  size={32}
                  color="#d4d4d4"
                  style={{ margin: "0 auto 8px" }}
                />
                <p style={{ fontSize: "13px", color: "#b3b3b3" }}>
                  Aucune activité récente
                </p>
              </div>
            ) : (
              data.recentActivity.map((activity: any, i: number) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#f5f5f4",
                      padding: "6px",
                      borderRadius: "8px",
                    }}
                  >
                    {activity.type === "task" ? (
                      <CheckSquare size={12} color="#8c8c8c" />
                    ) : (
                      <Users size={12} color="#8c8c8c" />
                    )}
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#4a4a4a",
                        marginBottom: "4px",
                      }}
                    >
                      {activity.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "#b3b3b3" }}>
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
        </div>
      </div>

      {/* Deadlines and Quick Actions */}
      <div style={styles.grid2}>
        {/* Upcoming Deadlines */}
        <div style={styles.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h3 style={styles.sectionTitle}>Échéances à venir</h3>
            <Calendar size={14} color="#b3b3b3" />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            {data.upcomingDeadlines.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <Calendar
                  size={32}
                  color="#d4d4d4"
                  style={{ margin: "0 auto 8px" }}
                />
                <p style={{ fontSize: "13px", color: "#b3b3b3" }}>
                  Aucune échéance
                </p>
              </div>
            ) : (
              data.upcomingDeadlines.map((task: any) => (
                <div
                  key={task.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    border: "1px solid #f0f0f0",
                    borderRadius: "8px",
                  }}
                >
                  <div>
                    <p
                      style={{
                        fontSize: "14px",
                        fontWeight: 500,
                        color: "#1a1a1a",
                        marginBottom: "4px",
                      }}
                    >
                      {task.title}
                    </p>
                    <p style={{ fontSize: "11px", color: "#b3b3b3" }}>
                      Due{" "}
                      {formatDistanceToNow(new Date(task.due_date), {
                        locale: fr,
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                  {new Date(task.due_date) < new Date() ? (
                    <AlertCircle size={14} color="#ef4444" />
                  ) : (
                    <Calendar size={14} color="#d4d4d4" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>Actions rapides</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/employees" style={styles.buttonOutline}>
              <Users size={14} />
              Ajouter un employé
            </Link>
            <Link href="/tasks" style={styles.buttonOutline}>
              <CheckSquare size={14} />
              Créer une tâche
            </Link>
            <Link href="/attendance" style={styles.buttonOutline}>
              <Clock size={14} />
              Enregistrer une présence
            </Link>
            <Link href="/statistics" style={styles.buttonOutline}>
              <TrendingUp size={14} />
              Voir les statistiques
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
