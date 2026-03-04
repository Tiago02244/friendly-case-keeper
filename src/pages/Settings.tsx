import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { Plus, Trash2, Edit2, Scale, Briefcase, ListTodo, LayoutGrid, ArrowUp, ArrowDown } from 'lucide-react';

export function Settings() {
  const {
    areasOfLaw, services, standardTasks, kanbanStages,
    addAreaOfLaw, deleteAreaOfLaw,
    addService, deleteService,
    addStandardTask, deleteStandardTask,
    addKanbanStage, updateKanbanStage, deleteKanbanStage, reorderKanbanStages
  } = useStore();

  const [activeTab, setActiveTab] = useState<'areas' | 'services' | 'tasks' | 'kanban'>('areas');

  const [newAreaName, setNewAreaName] = useState('');
  const [newAreaDesc, setNewAreaDesc] = useState('');
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDesc, setNewServiceDesc] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [selectedAreaForService, setSelectedAreaForService] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newStageName, setNewStageName] = useState('');
  const [newStageColor, setNewStageColor] = useState('#D4AF37');
  const [editingStageId, setEditingStageId] = useState<string | null>(null);

  const handleAddArea = () => { if (newAreaName.trim()) { addAreaOfLaw(newAreaName, newAreaDesc); setNewAreaName(''); setNewAreaDesc(''); } };
  const handleAddService = () => { if (newServiceName.trim() && selectedAreaForService) { addService(selectedAreaForService, newServiceName, newServiceDesc, newServicePrice ? Number(newServicePrice) : undefined); setNewServiceName(''); setNewServiceDesc(''); setNewServicePrice(''); } };
  const handleAddTask = () => { if (newTaskTitle.trim()) { addStandardTask(newTaskTitle, newTaskDesc); setNewTaskTitle(''); setNewTaskDesc(''); } };
  const handleAddStage = () => { if (newStageName.trim()) { addKanbanStage(newStageName, newStageColor); setNewStageName(''); setNewStageColor('#D4AF37'); } };

  const moveStage = (id: string, direction: 'up' | 'down') => {
    const sorted = [...kanbanStages].sort((a, b) => a.order - b.order);
    const index = sorted.findIndex(s => s.id === id);
    if (direction === 'up' && index > 0) [sorted[index - 1], sorted[index]] = [sorted[index], sorted[index - 1]];
    else if (direction === 'down' && index < sorted.length - 1) [sorted[index], sorted[index + 1]] = [sorted[index + 1], sorted[index]];
    reorderKanbanStages(sorted.map((s, i) => ({ ...s, order: i })));
  };

  const tabs = [
    { key: 'areas', icon: Scale, label: 'Áreas de Atuação' },
    { key: 'services', icon: Briefcase, label: 'Serviços' },
    { key: 'tasks', icon: ListTodo, label: 'Tarefas Padrão' },
    { key: 'kanban', icon: LayoutGrid, label: 'Fluxo Kanban' },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-serif font-bold text-primary mb-2">Configurações do Sistema</h1>
        <p className="text-muted-foreground">Gerencie áreas de atuação, serviços, tarefas e o fluxo do Kanban.</p>
      </div>

      <div className="flex gap-4 mb-8 border-b border-border pb-4 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold tracking-wider uppercase text-sm transition-all whitespace-nowrap ${
              activeTab === tab.key ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-gold-400 hover:bg-accent'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'areas' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-serif text-gold-400 mb-4">Nova Área de Atuação</h2>
            <div className="flex gap-4">
              <input type="text" placeholder="Nome da Área (ex: Trabalhista)" value={newAreaName} onChange={(e) => setNewAreaName(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Descrição (opcional)" value={newAreaDesc} onChange={(e) => setNewAreaDesc(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <button onClick={handleAddArea} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            {areasOfLaw.map(area => (
              <div key={area.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gold-100 text-lg">{area.name}</h3>
                  {area.description && <p className="text-muted-foreground text-sm">{area.description}</p>}
                </div>
                <button onClick={() => deleteAreaOfLaw(area.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {areasOfLaw.length === 0 && <p className="text-muted-foreground text-center py-8">Nenhuma área de atuação cadastrada.</p>}
          </div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-serif text-gold-400 mb-4">Novo Serviço</h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <select value={selectedAreaForService} onChange={(e) => setSelectedAreaForService(e.target.value)} className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary">
                <option value="">Selecione a Área de Atuação</option>
                {areasOfLaw.map(area => (<option key={area.id} value={area.id}>{area.name}</option>))}
              </select>
              <input type="text" placeholder="Nome do Serviço" value={newServiceName} onChange={(e) => setNewServiceName(e.target.value)} className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Descrição (opcional)" value={newServiceDesc} onChange={(e) => setNewServiceDesc(e.target.value)} className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <input type="number" placeholder="Valor Estimado (opcional)" value={newServicePrice} onChange={(e) => setNewServicePrice(e.target.value)} className="bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
            </div>
            <div className="flex justify-end">
              <button onClick={handleAddService} disabled={!selectedAreaForService || !newServiceName} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                <Plus className="w-4 h-4" /> Adicionar Serviço
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            {services.map(service => {
              const area = areasOfLaw.find(a => a.id === service.areaOfLawId);
              return (
                <div key={service.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary bg-accent px-2 py-1 rounded">{area?.name || 'Área Desconhecida'}</span>
                      {service.price && <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>}
                    </div>
                    <h3 className="font-bold text-gold-100 text-lg">{service.name}</h3>
                    {service.description && <p className="text-muted-foreground text-sm">{service.description}</p>}
                  </div>
                  <button onClick={() => deleteService(service.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
            {services.length === 0 && <p className="text-muted-foreground text-center py-8">Nenhum serviço cadastrado.</p>}
          </div>
        </div>
      )}

      {activeTab === 'tasks' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-serif text-gold-400 mb-4">Nova Tarefa Padrão</h2>
            <div className="flex gap-4">
              <input type="text" placeholder="Título da Tarefa" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <input type="text" placeholder="Descrição (opcional)" value={newTaskDesc} onChange={(e) => setNewTaskDesc(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <button onClick={handleAddTask} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            {standardTasks.map(task => (
              <div key={task.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-gold-100 text-lg">{task.title}</h3>
                  {task.description && <p className="text-muted-foreground text-sm">{task.description}</p>}
                </div>
                <button onClick={() => deleteStandardTask(task.id)} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
            {standardTasks.length === 0 && <p className="text-muted-foreground text-center py-8">Nenhuma tarefa padrão cadastrada.</p>}
          </div>
        </div>
      )}

      {activeTab === 'kanban' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-xl border border-border">
            <h2 className="text-xl font-serif text-gold-400 mb-4">Nova Etapa do Kanban</h2>
            <div className="flex gap-4">
              <input type="text" placeholder="Nome da Etapa" value={newStageName} onChange={(e) => setNewStageName(e.target.value)} className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary" />
              <input type="color" value={newStageColor} onChange={(e) => setNewStageColor(e.target.value)} className="w-12 h-10 bg-background border border-border rounded-lg p-1 cursor-pointer" />
              <button onClick={handleAddStage} className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-bold hover:bg-gold-400 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" /> Adicionar
              </button>
            </div>
          </div>
          <div className="grid gap-4">
            {[...kanbanStages].sort((a, b) => a.order - b.order).map((stage, index, arr) => (
              <div key={stage.id} className="bg-card p-4 rounded-xl border border-border flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1">
                    <button disabled={index === 0} onClick={() => moveStage(stage.id, 'up')} className="p-1 text-muted-foreground hover:text-primary disabled:opacity-0 transition-all">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button disabled={index === arr.length - 1} onClick={() => moveStage(stage.id, 'down')} className="p-1 text-muted-foreground hover:text-primary disabled:opacity-0 transition-all">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="w-3 h-10 rounded-full" style={{ backgroundColor: stage.color }}></div>
                  {editingStageId === stage.id ? (
                    <div className="flex items-center gap-2">
                      <input type="text" defaultValue={stage.name} onBlur={(e) => { updateKanbanStage(stage.id, { name: e.target.value }); setEditingStageId(null); }} autoFocus className="bg-background border border-primary rounded px-2 py-1 text-foreground" />
                      <input type="color" defaultValue={stage.color} onChange={(e) => updateKanbanStage(stage.id, { color: e.target.value })} className="w-8 h-8 bg-background border border-border rounded cursor-pointer" />
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-gold-100 text-lg flex items-center gap-2">
                        {stage.name}
                        <button onClick={() => setEditingStageId(stage.id)} className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-primary transition-all">
                          <Edit2 className="w-3 h-3" />
                        </button>
                      </h3>
                    </div>
                  )}
                </div>
                <button onClick={() => { if (confirm('Tem certeza que deseja excluir esta etapa?')) deleteKanbanStage(stage.id); }} className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
