import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import {
  ChevronLeft, Phone, MessageCircle, Mail, Calendar,
  Clock, Plus, Send, CheckCircle2,
  History, User, DollarSign, Briefcase,
  FileText, Paperclip, AlertCircle, ListTodo, Video
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function LeadDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    leads, campaigns, adGroups, ads, areasOfLaw, services, standardTasks, kanbanStages,
    updateLead, addNoteToLead, addDocumentToLead, addFollowUpToLead, updateFollowUpStatus,
    addTaskToLead, updateTaskStatus
  } = useStore();
  const lead = leads.find(l => l.id === id);

  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState<'message' | 'call' | 'meeting' | 'other'>('message');
  const [newDocName, setNewDocName] = useState('');
  const [newDocUrl, setNewDocUrl] = useState('');
  const [newDocFileData, setNewDocFileData] = useState<string | null>(null);
  const [newDocType, setNewDocType] = useState<'pdf' | 'image' | 'doc' | 'other'>('other');
  const [inputMode, setInputMode] = useState<'note' | 'document'>('note');

  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isAdSelectorOpen, setIsAdSelectorOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'history' | 'documents' | 'tasks'>('history');

  const campaign = campaigns.find(c => c.id === lead?.campaignId);
  const ad = ads.find(a => a.id === lead?.adId);

  const availableServices = services.filter(s => s.areaOfLawId === lead?.areaOfLawId);
  const availableAds = ads.filter(a => adGroups.find(ag => ag.id === a.adGroupId)?.campaignId === lead?.campaignId);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDocFileData(reader.result as string);
        if (!newDocName) setNewDocName(file.name);
        if (file.type.includes('pdf')) setNewDocType('pdf');
        else if (file.type.includes('image')) setNewDocType('image');
        else if (file.type.includes('word') || file.type.includes('document')) setNewDocType('doc');
        else setNewDocType('other');
      };
      reader.readAsDataURL(file);
    }
  };

  if (!lead) {
    return (
      <div className="p-20 text-center">
        <h2 className="text-3xl font-serif font-bold text-primary">Lead não encontrado</h2>
        <Link to="/leads" className="text-muted-foreground hover:text-gold-400 mt-4 inline-block underline">Voltar para a lista</Link>
      </div>
    );
  }

  return (
    <div className="p-10 max-w-7xl mx-auto space-y-10">
      <header className="flex items-center justify-between">
        <button
          onClick={() => navigate('/leads')}
          className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-black uppercase tracking-widest">Voltar ao Pipeline</span>
        </button>
        <div className="flex gap-4">
          <select
            value={lead.status}
            onChange={(e) => updateLead(lead.id, { status: e.target.value })}
            className="px-6 py-2.5 bg-card border border-border text-primary text-[10px] font-black rounded-lg uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            {kanbanStages.sort((a, b) => a.order - b.order).map(stage => (
              <option key={stage.id} value={stage.id}>{stage.name}</option>
            ))}
          </select>
        </div>
      </header>

      {/* Lead Profile Section */}
      <section className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
        <div className="p-8 gold-gradient">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-2xl bg-background/20 backdrop-blur-md flex items-center justify-center border border-foreground/10">
              <User className="w-12 h-12 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <h1 className="text-4xl font-serif font-bold tracking-tight">{lead.name}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="px-3 py-1 bg-background/10 rounded-full text-[10px] font-black uppercase tracking-widest border border-background/10">
                  {lead.status.replace('_', ' ')}
                </span>
                <span className="text-xs font-bold opacity-70">Registrado em {format(new Date(lead.createdAt), 'dd/MM/yyyy HH:mm')}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest">Contato Direto</p>
            <div className="flex items-center gap-3 text-foreground">
              <Phone className="w-4 h-4 text-primary" />
              <span className="font-bold">{lead.phone}</span>
            </div>
            {lead.email && (
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <Mail className="w-4 h-4 text-gold-500/50" />
                <span>{lead.email}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest">Documento (CPF)</p>
            <div className="flex items-center gap-3 text-foreground">
              <User className="w-4 h-4 text-primary" />
              <input
                type="text"
                value={lead.cpf || ''}
                onChange={(e) => updateLead(lead.id, { cpf: e.target.value })}
                placeholder="000.000.000-00"
                className="bg-transparent border-b border-border focus:border-primary focus:outline-none text-sm font-bold w-full"
              />
            </div>
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest">Área & Serviço</p>
            <div className="flex flex-col gap-2 mt-1">
              <select
                value={lead.areaOfLawId || ''}
                onChange={(e) => updateLead(lead.id, { areaOfLawId: e.target.value, serviceId: undefined })}
                className="bg-background/40 border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Selecione a Área</option>
                {areasOfLaw.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
              </select>
              {lead.areaOfLawId && (
                <select
                  value={lead.serviceId || ''}
                  onChange={(e) => {
                    const selectedService = services.find(s => s.id === e.target.value);
                    updateLead(lead.id, {
                      serviceId: e.target.value,
                      estimatedValue: selectedService?.price || lead.estimatedValue
                    });
                  }}
                  className="bg-background/40 border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
                >
                  <option value="">Selecione o Serviço</option>
                  {availableServices.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
            </div>
            {lead.estimatedValue && (
              <div className="flex items-center gap-3 text-emerald-500 font-bold mt-2">
                <DollarSign className="w-4 h-4" />
                <span>R$ {lead.estimatedValue.toLocaleString()}</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-[10px] font-black text-gold-500/60 uppercase tracking-widest">Origem do Lead</p>
            <div className="flex flex-col gap-2 mt-1">
              <select
                value={lead.campaignId || ''}
                onChange={(e) => {
                  const selectedCampaign = campaigns.find(c => c.id === e.target.value);
                  updateLead(lead.id, {
                    campaignId: e.target.value,
                    adGroupId: undefined,
                    adId: undefined,
                    areaOfLawId: selectedCampaign?.areaOfLawId || lead.areaOfLawId,
                    serviceId: selectedCampaign?.serviceId || lead.serviceId
                  });
                }}
                className="bg-background/40 border border-border rounded-lg px-2 py-1 text-xs text-foreground focus:outline-none focus:border-primary"
              >
                <option value="">Selecione a Campanha</option>
                {campaigns.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <div className="relative">
                <button
                  onClick={() => setIsAdSelectorOpen(!isAdSelectorOpen)}
                  disabled={!lead.campaignId}
                  className="w-full bg-background/40 border border-border rounded-lg px-2 py-1 text-xs text-foreground text-left flex items-center justify-between hover:border-gold-500/50 disabled:opacity-50"
                >
                  <span>{ad ? ad.name : 'Selecionar Criativo'}</span>
                  <ChevronLeft className={cn("w-4 h-4 transition-transform", isAdSelectorOpen ? "rotate-90" : "-rotate-90")} />
                </button>

                {isAdSelectorOpen && (
                  <div className="absolute z-50 mt-2 w-64 bg-card border border-border rounded-xl shadow-2xl p-2 grid grid-cols-2 gap-2 max-h-64 overflow-y-auto custom-scrollbar">
                    {availableAds.map(a => (
                      <button
                        key={a.id}
                        onClick={() => {
                          updateLead(lead.id, { adId: a.id, adGroupId: a.adGroupId });
                          setIsAdSelectorOpen(false);
                        }}
                        className={cn(
                          "flex flex-col gap-1 p-1 rounded-lg border transition-all hover:border-gold-500/50",
                          lead.adId === a.id ? "border-primary bg-accent" : "border-border bg-background/40"
                        )}
                      >
                        <div className="aspect-video rounded overflow-hidden bg-background">
                          {a.mediaType === 'video' ? (
                            <div className="w-full h-full flex items-center justify-center">
                              <Video className="w-4 h-4 text-primary" />
                            </div>
                          ) : (
                            <img src={a.mediaUrl} alt={a.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <span className="text-[8px] font-bold text-muted-foreground truncate w-full text-center">{a.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {ad && ad.mediaUrl && (
                <div className="mt-2 rounded-xl overflow-hidden border border-border bg-background aspect-video relative">
                  {ad.mediaType === 'video' ? (
                    <video src={ad.mediaUrl} className="w-full h-full object-cover" controls />
                  ) : (
                    <img src={ad.mediaUrl} alt={ad.name} className="w-full h-full object-cover" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-background/60 p-1 backdrop-blur-sm">
                    <p className="text-[8px] text-foreground font-bold truncate text-center">{ad.name}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Follow-ups & Actions */}
        <div className="space-y-10">
          <section className="bg-card rounded-3xl border border-border shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-border bg-accent flex items-center justify-between">
              <h2 className="text-lg font-serif font-bold text-foreground flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                Agenda
              </h2>
              <button
                onClick={() => setIsFollowUpModalOpen(true)}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-gold-400 transition-all"
                title="Novo Agendamento"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {(lead.followUps || []).filter(f => f.status === 'pendente').length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-border rounded-2xl">
                  <p className="text-muted-foreground italic text-sm">Nenhum follow-up agendado.</p>
                  <button
                    onClick={() => setIsFollowUpModalOpen(true)}
                    className="text-primary text-[10px] font-black uppercase tracking-widest mt-2 hover:underline"
                  >
                    Agendar Agora
                  </button>
                </div>
              ) : (
                (lead.followUps || []).filter(f => f.status === 'pendente').map((fu) => (
                  <div key={fu.id} className="p-4 bg-accent border border-border rounded-2xl group hover:border-gold-500/50 transition-all">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {fu.type === 'whatsapp' ? <MessageCircle className="w-4 h-4 text-emerald-500" /> : <Phone className="w-4 h-4 text-blue-500" />}
                        <span className="text-[10px] font-black text-primary uppercase tracking-widest">{fu.type}</span>
                      </div>
                      <button
                        onClick={() => updateFollowUpStatus(lead.id, fu.id, 'concluido')}
                        className="w-6 h-6 rounded-full border border-border flex items-center justify-center hover:bg-emerald-500 hover:border-emerald-500 transition-all group/check"
                        title="Marcar como concluído"
                      >
                        <CheckCircle2 className="w-4 h-4 text-transparent group-hover/check:text-primary-foreground" />
                      </button>
                    </div>
                    <p className="text-foreground text-sm font-bold">{format(new Date(fu.date), "dd/MM 'às' HH:mm")}</p>
                    {fu.notes && <p className="text-xs text-muted-foreground mt-2 italic">"{fu.notes}"</p>}
                  </div>
                ))
              )}
            </div>
          </section>

          {/* Input Section (Notes & Docs) */}
          <section className="bg-card rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
            <div className="flex border-b border-border">
              <button
                onClick={() => setInputMode('note')}
                className={cn(
                  "flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                  inputMode === 'note' ? "bg-accent text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Nova Observação
              </button>
              <button
                onClick={() => setInputMode('document')}
                className={cn(
                  "flex-1 py-4 text-[10px] font-black uppercase tracking-widest transition-all",
                  inputMode === 'document' ? "bg-accent text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Anexar Documento
              </button>
            </div>
            <div className="p-6">
              {inputMode === 'note' ? (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {(['message', 'call', 'meeting', 'other'] as const).map(type => (
                      <button
                        key={type}
                        onClick={() => setNewNoteType(type)}
                        className={cn(
                          "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                          newNoteType === type
                            ? type === 'message' ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/50"
                            : type === 'call' ? "bg-blue-500/20 text-blue-500 border border-blue-500/50"
                            : type === 'meeting' ? "bg-purple-500/20 text-purple-500 border border-purple-500/50"
                            : "bg-gold-500/20 text-primary border border-gold-500/50"
                            : "bg-background/40 text-muted-foreground border border-border hover:border-gold-500/30"
                        )}
                      >
                        {type === 'message' ? 'Mensagem' : type === 'call' ? 'Ligação' : type === 'meeting' ? 'Reunião' : 'Outro'}
                      </button>
                    ))}
                  </div>
                  <div className="relative">
                    <textarea
                      value={newNote}
                      onChange={(e) => setNewNote(e.target.value)}
                      placeholder="Digite os detalhes da conversa, objeções, etc..."
                      className="w-full p-4 bg-background/60 border border-border rounded-2xl text-foreground text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all resize-none h-32"
                    />
                    <button
                      onClick={() => {
                        if (newNote.trim()) {
                          addNoteToLead(lead.id, newNoteType, newNote);
                          setNewNote('');
                        }
                      }}
                      className="absolute bottom-4 right-4 p-2 bg-primary text-primary-foreground rounded-lg hover:bg-gold-400 transition-all"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="Nome do Documento (ex: Procuração)"
                    className="w-full px-4 py-3 bg-background/60 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                  />
                  <input
                    type="text"
                    value={newDocUrl}
                    onChange={(e) => setNewDocUrl(e.target.value)}
                    placeholder="Link do Documento (opcional)"
                    className="w-full px-4 py-3 bg-background/60 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="w-full px-4 py-3 bg-background/60 border border-border rounded-xl text-foreground text-sm focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:tracking-widest file:bg-gold-500/10 file:text-primary hover:file:bg-gold-500/20 cursor-pointer"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (newDocName.trim()) {
                        addDocumentToLead(lead.id, {
                          name: newDocName,
                          url: newDocUrl,
                          fileData: newDocFileData || undefined,
                          type: newDocType
                        });
                        setNewDocName('');
                        setNewDocUrl('');
                        setNewDocFileData(null);
                        setActiveTab('documents');
                      }
                    }}
                    className="w-full py-3 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold-400 transition-all"
                  >
                    Salvar Documento
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column: Central de Controle (Tabs) */}
        <div className="lg:col-span-2 bg-card rounded-3xl border border-border shadow-2xl flex flex-col overflow-hidden">
          <div className="flex border-b border-border bg-accent">
            {[
              { key: 'history', icon: History, label: 'Histórico & Observações' },
              { key: 'documents', icon: FileText, label: 'Documentos' },
              { key: 'tasks', icon: ListTodo, label: 'Tarefas' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  "flex-1 py-5 text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                  activeTab === tab.key ? "text-primary border-b-2 border-primary bg-accent" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          <div className="p-8 flex-1 overflow-y-auto custom-scrollbar min-h-[500px]">
            {activeTab === 'history' && (
              <div className="space-y-8">
                {(lead.notes || []).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Observações do Vendedor</h3>
                    {(lead.notes || []).map((note) => (
                      <div key={note.id} className="p-5 bg-background/40 border border-border rounded-2xl">
                        <p className="text-foreground text-sm leading-relaxed">{note.content}</p>
                        <p className="text-[9px] text-muted-foreground mt-3 font-bold uppercase tracking-widest">
                          {format(new Date(note.createdAt), 'dd/MM/yyyy HH:mm')}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest mb-4">Log do Sistema</h3>
                  <div className="space-y-6">
                    {(lead.logs || []).slice().reverse().map((log) => (
                      <div key={log.id} className="relative pl-6 border-l border-border">
                        <div className="absolute left-[-5px] top-1 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(212,175,55,0.5)]"></div>
                        <p className="text-[10px] text-gold-500/60 font-bold uppercase tracking-widest">{log.timestamp}</p>
                        <p className="text-sm text-foreground mt-1">{log.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                {(lead.documents || []).length === 0 ? (
                  <div className="text-center py-20">
                    <Paperclip className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground italic">Nenhum documento anexado a este lead.</p>
                    <p className="text-muted-foreground text-sm mt-2">Use o painel lateral para adicionar documentos ou links.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(lead.documents || []).map((doc) => (
                      <div key={doc.id} className="p-4 bg-background/40 border border-border rounded-2xl flex items-center justify-between group hover:border-gold-500/30 transition-all">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-accent rounded-lg text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-foreground font-bold text-sm">{doc.name}</p>
                            <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mt-1">
                              {format(new Date(doc.createdAt), 'dd/MM/yyyy')}
                            </p>
                          </div>
                        </div>
                        {doc.url ? (
                          <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                            Abrir Link
                          </a>
                        ) : doc.fileData ? (
                          <a href={doc.fileData} download={doc.name} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">
                            Baixar Arquivo
                          </a>
                        ) : null}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Tarefas do Lead</h3>
                  <button
                    onClick={() => setIsTaskModalOpen(true)}
                    className="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest hover:underline"
                  >
                    <Plus className="w-3 h-3" />
                    Nova Tarefa
                  </button>
                </div>

                <div className="space-y-4">
                  {(lead.tasks || []).length === 0 ? (
                    <div className="text-center py-20">
                      <ListTodo className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground italic">Nenhuma tarefa cadastrada para este lead.</p>
                    </div>
                  ) : (
                    (lead.tasks || []).map((task) => (
                      <div key={task.id} className={cn("p-4 bg-background/40 border rounded-2xl flex items-start justify-between group transition-all", task.status === 'concluida' ? "border-emerald-500/20 opacity-60" : "border-border hover:border-gold-500/30")}>
                        <div className="flex items-start gap-4">
                          <button
                            onClick={() => updateTaskStatus(lead.id, task.id, task.status === 'concluida' ? 'pendente' : 'concluida')}
                            className={cn("mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all", task.status === 'concluida' ? "bg-emerald-500 border-emerald-500" : "border-border hover:border-primary")}
                          >
                            {task.status === 'concluida' && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                          </button>
                          <div>
                            <p className={cn("text-foreground font-bold text-sm", task.status === 'concluida' && "line-through text-muted-foreground")}>{task.title}</p>
                            {task.description && <p className="text-muted-foreground text-xs mt-1">{task.description}</p>}
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {format(new Date(task.date), 'dd/MM/yyyy')}
                              </span>
                              {task.isStandard && (
                                <span className="text-[9px] bg-accent text-primary px-2 py-0.5 rounded uppercase tracking-widest">
                                  Padrão
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Follow-up Modal */}
      {isFollowUpModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-3xl p-8 w-full max-w-md shadow-2xl border border-border">
            <h2 className="text-2xl font-serif font-bold gold-text-gradient mb-6">Agendar Missão (Follow-up)</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const date = formData.get('date') as string;
              const time = formData.get('time') as string;
              addFollowUpToLead(lead.id, {
                type: formData.get('type') as any,
                date: `${date}T${time}`,
                notes: formData.get('notes') as string,
              });
              setIsFollowUpModalOpen(false);
            }} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Canal de Contato</label>
                <select name="type" className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all">
                  <option value="whatsapp">WhatsApp</option>
                  <option value="ligacao">Ligação Direta</option>
                  <option value="email">E-mail</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Data</label>
                  <input required name="date" type="date" className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Hora</label>
                  <input required name="time" type="time" className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Objetivo da Missão</label>
                <textarea name="notes" placeholder="Ex: Cobrar resposta sobre a proposta..." className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all h-24 resize-none" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsFollowUpModalOpen(false)} className="px-6 py-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold-400 transition-all shadow-xl">Agendar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-3xl p-8 w-full max-w-md shadow-2xl border border-border">
            <h2 className="text-2xl font-serif font-bold gold-text-gradient mb-6">Nova Tarefa</h2>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              const standardTaskId = formData.get('standardTask') as string;

              let title = formData.get('title') as string;
              let description = formData.get('description') as string;
              let isStandard = false;

              if (standardTaskId) {
                const stdTask = standardTasks.find(t => t.id === standardTaskId);
                if (stdTask) {
                  title = stdTask.title;
                  description = stdTask.description || '';
                  isStandard = true;
                }
              }

              addTaskToLead(lead.id, {
                title,
                description,
                date: formData.get('date') as string,
                isStandard
              });
              setIsTaskModalOpen(false);
            }} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Tarefa Padrão (Opcional)</label>
                <select
                  name="standardTask"
                  className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all"
                  onChange={(e) => {
                    const form = e.target.closest('form');
                    const titleInput = form?.querySelector('input[name="title"]') as HTMLInputElement;
                    const descInput = form?.querySelector('textarea[name="description"]') as HTMLTextAreaElement;
                    if (e.target.value) {
                      const stdTask = standardTasks.find(t => t.id === e.target.value);
                      if (stdTask) {
                        if (titleInput) titleInput.value = stdTask.title;
                        if (descInput) descInput.value = stdTask.description || '';
                        if (titleInput) titleInput.disabled = true;
                        if (descInput) descInput.disabled = true;
                      }
                    } else {
                      if (titleInput) { titleInput.value = ''; titleInput.disabled = false; }
                      if (descInput) { descInput.value = ''; descInput.disabled = false; }
                    }
                  }}
                >
                  <option value="">Criar Tarefa Personalizada</option>
                  {standardTasks.map(t => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Título da Tarefa</label>
                <input required name="title" type="text" placeholder="Ex: Enviar minuta de contrato" className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all disabled:opacity-50" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Data Limite</label>
                <input required name="date" type="date" className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-gold-500/60 uppercase tracking-widest mb-2">Descrição (Opcional)</label>
                <textarea name="description" placeholder="Detalhes da tarefa..." className="w-full px-4 py-3 bg-background/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/50 focus:outline-none transition-all h-24 resize-none disabled:opacity-50" />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button type="button" onClick={() => setIsTaskModalOpen(false)} className="px-6 py-2 text-muted-foreground font-black text-[10px] uppercase tracking-widest">Cancelar</button>
                <button type="submit" className="px-8 py-3 bg-primary text-primary-foreground font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-gold-400 transition-all shadow-xl">Adicionar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
