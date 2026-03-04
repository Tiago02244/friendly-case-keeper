import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Megaphone, Calendar, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Painel de Controle', path: '/' },
  { icon: Users, label: 'Gestão de Leads', path: '/leads' },
  { icon: Megaphone, label: 'Estratégia de Tráfego', path: '/campaigns' },
  { icon: Calendar, label: 'Agenda', path: '/calendar' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Layout() {
  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      <aside className="w-72 bg-card border-r border-border flex flex-col shadow-2xl z-20">
        <div className="p-8 border-b border-border">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 gold-gradient rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.3)]">
              <span className="text-primary-foreground font-serif text-3xl font-bold italic">L</span>
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-serif font-bold tracking-[0.2em] gold-text-gradient uppercase">
                LawCRM
              </h1>
              <p className="text-[10px] text-gold-500/60 tracking-[0.4em] uppercase mt-1">
                Prestige & Excellence
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-4 px-4 py-3.5 rounded-lg text-xs font-semibold tracking-widest uppercase transition-all duration-300 group",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                    : "text-muted-foreground hover:text-gold-400 hover:bg-accent"
                )
              }
            >
              <item.icon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-4 px-4 py-3 rounded-xl bg-accent border border-border">
            <div className="w-10 h-10 rounded-full gold-gradient p-[1px]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <Users className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="font-bold text-xs text-gold-100 truncate tracking-wider uppercase">Vendas Elite</p>
              <p className="text-[10px] text-gold-500/60 truncate tracking-tight">Escritório de Advocacia</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-background relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold-900/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold-900/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
