import { useStore } from '@/store/useStore';
import { Users, CheckCircle2, AlertCircle, PhoneCall, MessageCircle, History, ArrowRight, ListTodo } from 'lucide-react';
import { format, isToday } from 'date-fns';
import { Link } from 'react-router-dom';

export function Dashboard() {
  const { leads } = useStore();

  const totalLeads = leads.length;
  const closedLeads = leads.filter(l => l.status === 'fechado').length;
  const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;

  const todayFollowUps = leads.flatMap(lead =>
    (lead.followUps || [])
      .filter(fu => isToday(new Date(fu.date)) && fu.status === 'pendente')
      .map(fu => ({ ...fu, lead }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const todayTasks = leads.flatMap(lead =>
    (lead.tasks || [])
      .filter(task => isToday(new Date(task.date)) && task.status === 'pendente')
      .map(task => ({ ...task, lead }))
  ).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const recentActivities = leads.flatMap(lead =>
    (lead.logs || []).map(log => ({ ...log, leadName: lead.name, leadId: lead.id }))
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  .slice(0, 10);

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-5xl font-serif font-bold gold-text-gradient tracking-tight">
            Central de Comando
          </h1>
          <p className="text-muted-foreground mt-2 font-medium tracking-[0.1em] uppercase text-xs">
            Performance & Gestão de Elite • Escritório de Advocacia
          </p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-card border border-border rounded-xl shadow-lg">
            <p className="text-[10px] text-gold-500/60 uppercase tracking-widest font-bold">Status do Sistema</p>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
              <span className="text-foreground text-sm font-semibold">Operacional</span>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Users, label: 'Total de Leads', value: totalLeads },
          { icon: CheckCircle2, label: 'Contratos', value: closedLeads },
          { icon: AlertCircle, label: 'Conversão', value: `${conversionRate}%` },
        ].map((stat, i) => (
          <div key={i} className="group bg-card p-8 rounded-2xl border border-border shadow-2xl hover:border-gold-500/50 transition-all duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-900/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-gold-500/10 transition-colors"></div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="p-4 bg-accent text-primary rounded-2xl border border-border group-hover:scale-110 transition-transform">
                <stat.icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-xs font-bold text-gold-500/60 uppercase tracking-[0.2em]">{stat.label}</p>
                <h3 className="text-4xl font-serif font-bold text-foreground mt-1">{stat.value}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Follow-ups Column */}
        <div className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
          <div className="p-8 border-b border-border flex items-center justify-between bg-accent">
            <h2 className="text-xl font-serif font-bold text-gold-100 flex items-center gap-3">
              <PhoneCall className="w-6 h-6 text-primary" />
              Follow-ups para Hoje
            </h2>
            <span className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
              {todayFollowUps.length} Pendentes
            </span>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {todayFollowUps.length === 0 ? (
              <div className="p-16 text-center">
                <p className="text-muted-foreground font-serif italic text-lg">Nenhuma missão estratégica para hoje.</p>
              </div>
            ) : (
              <ul className="divide-y divide-border">
                {todayFollowUps.map((fu) => (
                  <li key={fu.id} className="p-6 hover:bg-accent transition-all duration-300 group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-accent border border-border flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all">
                          {fu.type === 'whatsapp' ? <MessageCircle className="w-6 h-6" /> : <PhoneCall className="w-6 h-6" />}
                        </div>
                        <div>
                          <Link to={`/leads/${fu.lead.id}`} className="text-lg font-serif font-bold text-foreground hover:text-primary transition-colors block">
                            {fu.lead.name}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-1 font-semibold tracking-widest uppercase">
                            {format(new Date(fu.date), "HH:mm")} • {fu.type === 'whatsapp' ? 'WhatsApp' : 'Ligação Direta'}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/leads/${fu.lead.id}`}
                        className="px-6 py-2.5 bg-transparent border border-gold-500/30 text-primary text-[10px] font-black rounded-lg hover:bg-primary hover:text-primary-foreground transition-all uppercase tracking-widest"
                      >
                        Assumir Lead
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden flex flex-col">
          <div className="p-8 border-b border-border bg-accent">
            <h2 className="text-xl font-serif font-bold text-gold-100 flex items-center gap-3">
              <ListTodo className="w-6 h-6 text-primary" />
              Ações Rápidas
            </h2>
          </div>
          <div className="p-8 flex-1 flex flex-col items-center justify-center text-center space-y-6">
            <p className="text-muted-foreground text-sm">
              Gerencie seus leads, campanhas e agenda a partir do menu lateral.
            </p>
            <Link to="/leads" className="px-8 py-3 bg-primary text-primary-foreground text-xs font-black rounded-xl hover:bg-gold-400 transition-all uppercase tracking-[0.2em] shadow-lg">
              Ver Todos os Leads
            </Link>
          </div>
        </div>
      </div>

      {/* Today's Tasks Feed */}
      <section className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border bg-accent flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-gold-100 flex items-center gap-3">
            <ListTodo className="w-6 h-6 text-primary" />
            Tarefas de Hoje
          </h2>
          <span className="bg-primary text-primary-foreground text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
            {todayTasks.length} Pendentes
          </span>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {todayTasks.length === 0 ? (
              <p className="text-muted-foreground italic md:col-span-2 text-center py-10">Nenhuma tarefa pendente para hoje.</p>
            ) : (
              todayTasks.map((task, idx) => (
                <div key={idx} className="flex gap-4 group bg-background/40 p-4 rounded-2xl border border-border hover:border-gold-500/30 transition-all">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 rounded-xl bg-accent border border-border flex items-center justify-center text-primary">
                      <ListTodo className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <Link to={`/leads/${task.lead.id}`} className="text-[10px] text-muted-foreground font-bold hover:text-primary transition-colors uppercase tracking-widest">
                        {task.lead.name}
                      </Link>
                      {task.isStandard && (
                        <span className="text-[8px] bg-accent text-primary px-2 py-0.5 rounded uppercase tracking-widest">
                          Padrão
                        </span>
                      )}
                    </div>
                    <p className="text-foreground text-sm font-bold group-hover:text-gold-100 transition-colors">{task.title}</p>
                    {task.description && <p className="text-muted-foreground text-xs mt-1 line-clamp-2">{task.description}</p>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Recent Activity Feed */}
      <section className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
        <div className="p-8 border-b border-border bg-accent flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-gold-100 flex items-center gap-3">
            <History className="w-6 h-6 text-primary" />
            Atividade Recente do Pipeline
          </h2>
          <Link to="/leads" className="text-primary text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
            Ver Todos <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {recentActivities.length === 0 ? (
              <p className="text-muted-foreground italic md:col-span-2 text-center py-10">Nenhuma atividade registrada ainda.</p>
            ) : (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
                    <div className="w-px flex-1 bg-border mt-2"></div>
                  </div>
                  <div className="pb-4">
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] text-gold-500/60 font-black uppercase tracking-widest">{activity.timestamp}</p>
                      <span className="text-muted-foreground">•</span>
                      <Link to={`/leads/${activity.leadId}`} className="text-[10px] text-muted-foreground font-bold hover:text-primary transition-colors uppercase tracking-widest">
                        {activity.leadName}
                      </Link>
                    </div>
                    <p className="text-foreground text-sm mt-1 group-hover:text-gold-100 transition-colors">{activity.content}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
