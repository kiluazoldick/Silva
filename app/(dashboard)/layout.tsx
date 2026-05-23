"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  BarChart3,
  Building2,
  LogOut,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employés", href: "/employees", icon: Users },
  { name: "Tâches", href: "/tasks", icon: CheckSquare },
  { name: "Présences", href: "/attendance", icon: Clock },
  { name: "Statistiques", href: "/statistics", icon: BarChart3 },
  { name: "Entreprise", href: "/company", icon: Building2 },
];

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [company, setCompany] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  useEffect(() => {
    const checkAuthAndCompany = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push("/login");
          return;
        }

        setUser(session.user);

        const { data: company } = await supabase
          .from("companies")
          .select("*")
          .eq("owner_id", session.user.id)
          .maybeSingle();

        if (!company && pathname !== "/company-setup" && pathname !== "/") {
          router.push("/company-setup");
          return;
        }

        if (company) {
          setCompany(company);
          if (pathname === "/company-setup") {
            router.push("/dashboard");
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuthAndCompany();
  }, [router, supabase, pathname]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          <p className="text-sm text-warm-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;
  if (!company && pathname !== "/company-setup") return null;

  const isCompanySetupPage = pathname === "/company-setup";

  return (
    <div className="flex h-screen bg-cream">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      {!isCompanySetupPage && (
        <aside
          className={cn(
            "fixed left-0 top-0 z-50 flex h-screen flex-col bg-white transition-all duration-300 lg:relative",
            "border-r border-warm-gray-100",
            collapsed ? "w-20" : "w-64",
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full lg:translate-x-0",
          )}
        >
          {/* Logo */}
          <div
            className={cn(
              "flex h-16 items-center border-b border-warm-gray-100 transition-all",
              collapsed ? "justify-center px-2" : "px-5",
            )}
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-sm font-bold text-white">S</span>
              </div>
              {!collapsed && (
                <span className="text-lg font-semibold text-warm-gray-900">
                  Silva
                </span>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-6">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-accent/10 text-accent"
                      : "text-warm-gray-500 hover:bg-warm-gray-50 hover:text-warm-gray-900",
                    collapsed && "justify-center",
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <Icon size={18} />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div
            className={cn(
              "border-t border-warm-gray-100 py-4",
              collapsed ? "px-2" : "px-4",
            )}
          >
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg",
                collapsed ? "justify-center" : "px-2",
              )}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                <span className="text-sm font-medium text-accent">
                  {user?.email?.[0].toUpperCase()}
                </span>
              </div>
              {!collapsed && (
                <div className="flex-1 overflow-hidden">
                  <p className="truncate text-sm font-medium text-warm-gray-900">
                    {user?.email?.split("@")[0]}
                  </p>
                  <p className="truncate text-xs text-warm-gray-400">
                    {company?.name}
                  </p>
                </div>
              )}
              <button
                onClick={handleSignOut}
                className={cn(
                  "rounded-lg p-1.5 text-warm-gray-400 transition-colors hover:bg-warm-gray-100 hover:text-warm-gray-600",
                  collapsed && "mt-2",
                )}
                title="Déconnexion"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Collapse button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "absolute -right-3 top-20 hidden h-6 w-6 items-center justify-center rounded-full border border-warm-gray-200 bg-white text-warm-gray-400 transition-all duration-200 hover:border-warm-gray-300 hover:text-warm-gray-600 lg:flex",
              collapsed && "rotate-180",
            )}
          >
            <ChevronLeft size={14} />
          </button>
        </aside>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        {!isCompanySetupPage && (
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-warm-gray-100 bg-cream/80 px-4 backdrop-blur-sm sm:px-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="rounded-lg p-2 text-warm-gray-500 transition-colors hover:bg-warm-gray-100 lg:hidden"
              >
                <Menu size={20} />
              </button>
              <h1 className="text-sm font-medium text-warm-gray-500">
                {navigation.find((n) => n.href === pathname)?.name ||
                  "Dashboard"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <button className="rounded-lg p-2 text-warm-gray-400 transition-colors hover:bg-warm-gray-100 hover:text-warm-gray-600">
                <Bell size={18} />
              </button>

              {/* Date */}
              <span className="hidden text-sm text-warm-gray-400 sm:block">
                {new Date().toLocaleDateString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>

              {/* User menu mobile */}
              <button className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 lg:hidden">
                <User size={16} className="text-accent" />
              </button>
            </div>
          </header>
        )}

        {/* Page content */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
