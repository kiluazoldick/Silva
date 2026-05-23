"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Clock,
  BarChart3,
  Building2,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useState } from "react";

interface SidebarProps {
  onSignOut: () => void;
}

const navigation = [
  { name: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
  { name: "Employés", href: "/employees", icon: Users },
  { name: "Tâches", href: "/tasks", icon: CheckSquare },
  { name: "Présences", href: "/attendance", icon: Clock },
  { name: "Statistiques", href: "/statistics", icon: BarChart3 },
  { name: "Entreprise", href: "/company", icon: Building2 },
];

export function Sidebar({ onSignOut }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col bg-white transition-all duration-300",
        "border-r border-warm-gray-100",
        collapsed ? "w-20" : "w-64",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex h-16 items-center border-b border-warm-gray-100 transition-all",
          collapsed ? "justify-center px-2" : "px-6",
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
              <Icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className={cn(
          "border-t border-warm-gray-100 py-4",
          collapsed ? "px-2" : "px-4",
        )}
      >
        <button
          onClick={onSignOut}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-warm-gray-500 transition-all duration-200",
            "hover:bg-warm-gray-50 hover:text-warm-gray-900",
            collapsed && "justify-center",
          )}
          title={collapsed ? "Déconnexion" : undefined}
        >
          <LogOut size={20} />
          {!collapsed && <span>Déconnexion</span>}
        </button>
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={cn(
          "absolute -right-3 top-20 flex h-6 w-6 items-center justify-center rounded-full border border-warm-gray-200 bg-white text-warm-gray-400",
          "transition-all duration-200 hover:border-warm-gray-300 hover:text-warm-gray-600",
        )}
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
