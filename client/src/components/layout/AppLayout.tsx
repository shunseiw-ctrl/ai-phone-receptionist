import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Phone, Settings2, Sparkles, PhoneIncoming } from "lucide-react";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Call Logs", icon: Phone },
    { href: "/settings", label: "AI Settings", icon: Settings2 },
  ];

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Premium Sidebar */}
      <aside className="w-64 flex-shrink-0 glass-panel border-r border-white/5 flex flex-col z-20 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-xl tracking-tight">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/40 to-transparent opacity-50" />
              <PhoneIncoming className="w-4 h-4 relative z-10" />
            </div>
            <span>AutoReception</span>
          </div>
        </div>
        
        <nav className="flex-1 py-6 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`
                  relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-300
                  ${isActive ? "text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"}
                `}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-nav-bg"
                    className="absolute inset-0 bg-primary/10 rounded-xl border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <item.icon className={`w-4 h-4 relative z-10 ${isActive ? "text-primary" : ""}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 relative overflow-hidden group cursor-default">
            <div className="absolute -inset-2 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out" />
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">AI Active</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Your AI receptionist is currently screening incoming calls.
            </p>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 glass-panel border-b border-white/5 flex items-center px-4 md:hidden z-30">
          <div className="flex items-center gap-2 text-primary font-display font-bold text-lg">
            <PhoneIncoming className="w-5 h-5" />
            <span>AutoReception</span>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-4 md:p-8">
            <motion.div
              key={location}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}
