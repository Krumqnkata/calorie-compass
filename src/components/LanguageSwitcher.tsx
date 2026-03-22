import { useTranslation } from "react-i18next";
import { Globe } from "lucide-react";

const langs = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "bg", label: "BG", flag: "🇧🇬" },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const change = (code: string) => {
    i18n.changeLanguage(code);
    localStorage.setItem("app-language", code);
  };

  return (
    <div className="flex items-center gap-1">
      <Globe className="h-4 w-4 text-muted-foreground" />
      {langs.map((l) => (
        <button
          key={l.code}
          onClick={() => change(l.code)}
          className={`rounded-md px-2 py-1 text-xs font-medium transition-colors
            ${i18n.language === l.code
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:text-foreground"
            }`}
        >
          {l.flag} {l.label}
        </button>
      ))}
    </div>
  );
}
