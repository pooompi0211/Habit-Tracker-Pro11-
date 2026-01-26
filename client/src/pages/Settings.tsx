import { PageHeader } from "@/components/PageHeader";
import { User, Bell, Moon, Shield, HelpCircle, LogOut, ChevronRight } from "lucide-react";

export default function Settings() {
  const sections = [
    {
      title: "Account",
      items: [
        { icon: User, label: "Profile", subtitle: "Manage your account info" },
        { icon: Bell, label: "Notifications", subtitle: "Reminders & updates" },
      ]
    },
    {
      title: "App Settings",
      items: [
        { icon: Moon, label: "Appearance", subtitle: "Light mode active" },
        { icon: Shield, label: "Privacy & Security", subtitle: "Data protection" },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: HelpCircle, label: "Help & Feedback", subtitle: "FAQ and support" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background pb-24 px-6 pt-safe">
      <PageHeader title="Settings" subtitle="Customize your experience" />

      <div className="space-y-8">
        {sections.map((section, idx) => (
          <div key={idx}>
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4 px-2">
              {section.title}
            </h3>
            <div className="bg-white rounded-3xl overflow-hidden border border-border/50 shadow-sm">
              {section.items.map((item, itemIdx) => (
                <div 
                  key={itemIdx}
                  className={`
                    flex items-center p-4 hover:bg-secondary/50 cursor-pointer transition-colors
                    ${itemIdx !== section.items.length - 1 ? 'border-b border-border/50' : ''}
                  `}
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground mr-4">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-foreground">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground/50" />
                </div>
              ))}
            </div>
          </div>
        ))}

        <button className="w-full p-4 flex items-center justify-center gap-2 text-destructive font-bold bg-destructive/10 rounded-2xl hover:bg-destructive/20 transition-colors">
          <LogOut className="w-5 h-5" />
          Log Out
        </button>

        <p className="text-center text-xs text-muted-foreground font-medium pt-4">
          Version 1.0.0 • Habit Tracker Pro
        </p>
      </div>
    </div>
  );
}
