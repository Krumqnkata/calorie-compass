import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Flame, Calculator, Percent, Droplets, UtensilsCrossed, Menu, X } from "lucide-react";
import { DarkModeToggle } from "./DarkModeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const links = [
    { to: "/", label: t("nav.tdee"), icon: Flame },
    { to: "/portion-calculator", label: t("nav.portion"), icon: Calculator },
    { to: "/body-fat", label: t("nav.bodyFat"), icon: Percent },
    { to: "/daily-tools", label: t("nav.dailyTools"), icon: Droplets },
    { to: "/meal-plan", label: t("nav.mealPlan"), icon: UtensilsCrossed },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 h-14">
        <span className="font-bold text-foreground tracking-tight text-lg flex items-center gap-2">
          <Flame className="h-5 w-5 text-primary" />
          {t("nav.brand")}
        </span>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <DarkModeToggle />
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card px-4 pb-3 pt-1 space-y-1 animate-fade-in">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )
              }
            >
              <l.icon className="h-4 w-4" />
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}
