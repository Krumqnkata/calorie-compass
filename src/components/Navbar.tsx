import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom";
import { Flame, Calculator, Percent, Droplets, UtensilsCrossed, Menu, X, Dumbbell } from "lucide-react";
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
    { to: "/one-rep-max", label: "1RM", icon: Dumbbell },
    { to: "/daily-tools", label: t("nav.dailyTools"), icon: Droplets },
    { to: "/meal-plan", label: t("nav.mealPlan"), icon: UtensilsCrossed },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 h-16">
        <Link to="/" className="font-bold text-foreground tracking-tight text-lg flex items-center gap-2">
          <div className="bg-primary/10 p-1.5 rounded-lg">
            <Flame className="h-5 w-5 text-primary" />
          </div>
          <span className="hidden sm:inline">{t("nav.brand")}</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-primary/10 text-primary hover:bg-primary/20" : "text-muted-foreground"
                )
              }
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button & Settings */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <DarkModeToggle />
          
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {open && (
        <div className="md:hidden border-t bg-card animate-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-4 space-y-1">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-primary/10 text-primary" 
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  )
                }
              >
                <div className={cn("p-1 rounded-md", link.to === location.pathname ? "bg-background shadow-sm" : "bg-muted/50")}>
                  <link.icon className="h-4 w-4" />
                </div>
                {link.label}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
