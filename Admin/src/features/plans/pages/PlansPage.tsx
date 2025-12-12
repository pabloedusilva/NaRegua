import { useState, useEffect } from 'react';
import { useToast } from '@/app/providers/ToastProvider';
import { Input } from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';
import { Plus, Edit, Trash2, Crown } from 'lucide-react';
import Badge from '@/components/ui/Badge';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'monthly' | 'quarterly';
  features: string[];
  status: 'active' | 'inactive';
  subscribers: number;
}

export default function PlansPage() {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    interval: 'monthly' as 'monthly' | 'quarterly',
    features: [''],
  });

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = () => {
    const stored = localStorage.getItem('admin_plans');
    const loaded: Plan[] = stored ? JSON.parse(stored) : [
      {
        id: 'pl1',
        name: 'Básico',
        description: 'Ideal para barbearias iniciantes',
        price: 99.90,
        interval: 'monthly',
        features: ['Até 100 agendamentos/mês', '1 barbeiro', 'Suporte via email', 'App mobile'],
        status: 'active',
        subscribers: 45,
      },
      {
        id: 'pl2',
        name: 'Profissional',
        description: 'Para barbearias em crescimento',
        price: 199.90,
        interval: 'monthly',
        features: ['Até 500 agendamentos/mês', 'Até 5 barbeiros', 'Suporte prioritário', 'Relatórios avançados', 'Integrações'],
        status: 'active',
        subscribers: 78,
      },
      {
        id: 'pl3',
        name: 'Premium',
        description: 'Para grandes operações',
        price: 399.90,
        interval: 'monthly',
        features: ['Agendamentos ilimitados', 'Barbeiros ilimitados', 'Suporte 24/7', 'Todos os recursos', 'API customizada'],
        status: 'active',
        subscribers: 23,
      },
    ];
    setPlans(loaded);
    localStorage.setItem('admin_plans', JSON.stringify(loaded));
  };

  const openAddModal = () => {
    setEditingPlan(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      interval: 'monthly',
      features: [''],
    });
    setModalOpen(true);
  };

  const openEditModal = (plan: Plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      description: plan.description,
      price: plan.price.toString(),
      interval: plan.interval,
      features: plan.features.length > 0 ? plan.features : [''],
    });
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const planData: Plan = {
      id: editingPlan?.id || `pl_${Date.now()}`,
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      interval: formData.interval,
      features: formData.features.filter(f => f.trim() !== ''),
      status: editingPlan?.status || 'active',
      subscribers: editingPlan?.subscribers || 0,
    };

    let updated: Plan[];
    if (editingPlan) {
      updated = plans.map(p => p.id === editingPlan.id ? planData : p);
      showToast('Plano atualizado com sucesso!', 'success');
    } else {
      updated = [...plans, planData];
      showToast('Plano criado com sucesso!', 'success');
    }

    setPlans(updated);
    localStorage.setItem('admin_plans', JSON.stringify(updated));
    setModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const updated = plans.filter(p => p.id !== id);
    setPlans(updated);
    localStorage.setItem('admin_plans', JSON.stringify(updated));
    setDeleteId(null);
    showToast('Plano removido com sucesso!', 'success');
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...formData.features, ''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setFormData({ ...formData, features: formData.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="grid gap-8">
      <div className="flex items-center justify-between animate-fade-in">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-gold mb-2">Planos</h1>
          <p className="text-text-dim">Gerencie os planos de assinatura da plataforma</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus className="w-5 h-5" />
          Novo Plano
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-delayed">
        {plans.map((plan) => (
          <div key={plan.id} className="card card-hover">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
                <Crown className="w-6 h-6 text-gold" />
              </div>
              <Badge variant={plan.status === 'active' ? 'completed' : 'cancelled'}>
                {plan.status === 'active' ? 'Ativo' : 'Inativo'}
              </Badge>
            </div>
            
            <h3 className="text-2xl font-display text-gold mb-1">{plan.name}</h3>
            <p className="text-sm text-text-dim mb-4">{plan.description}</p>
            
            <div className="mb-4">
              <p className="text-3xl font-bold text-text">
                R$ {plan.price.toFixed(2)}
                <span className="text-sm text-text-dim font-normal">
                  /{plan.interval === 'monthly' ? 'mês' : 'trimestre'}
                </span>
              </p>
              <p className="text-sm text-text-dim mt-1">{plan.subscribers} assinantes</p>
            </div>

            <div className="space-y-2 mb-6">
              {plan.features.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-gold mt-1">✓</span>
                  <p className="text-sm text-text-dim">{feature}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-4 border-t border-border">
              <button onClick={() => openEditModal(plan)} className="flex-1 btn btn-outline">
                <Edit className="w-4 h-4" />
                Editar
              </button>
              <button
                onClick={() => setDeleteId(plan.id)}
                className="btn btn-outline text-red-400 hover:bg-red-500/10 border-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <Modal open={modalOpen} onClose={() => setModalOpen(false)} size="fullscreen">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl text-gold mb-6">
              {editingPlan ? 'Editar Plano' : 'Novo Plano'}
            </h2>
            
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="card">
                <h3 className="text-xl font-semibold text-text mb-4">Informações do Plano</h3>
                <div className="grid gap-6">
                  <Input
                    label="Nome do Plano"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Básico, Profissional, Premium"
                    required
                  />
                  
                  <Input
                    label="Descrição"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Breve descrição do plano"
                    required
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                      label="Preço (R$)"
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="99.90"
                      required
                    />
                    
                    <div className="flex flex-col gap-1 w-full">
                      <label className="text-sm text-text/90 mb-2">
                        Intervalo
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors">
                          <input
                            type="radio"
                            value="monthly"
                            checked={formData.interval === 'monthly'}
                            onChange={(e) => setFormData({ ...formData, interval: e.target.value as 'monthly' })}
                            className="text-gold focus:ring-gold"
                            required
                          />
                          <span className="text-sm text-text">Mensal</span>
                        </label>
                        <label className="flex items-center justify-center gap-2 p-3 rounded-xl border border-border hover:border-gold cursor-pointer transition-colors">
                          <input
                            type="radio"
                            value="quarterly"
                            checked={formData.interval === 'quarterly'}
                            onChange={(e) => setFormData({ ...formData, interval: e.target.value as 'quarterly' })}
                            className="text-gold focus:ring-gold"
                          />
                          <span className="text-sm text-text">Trimestral</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-text">Recursos do Plano</h3>
                  <button type="button" onClick={addFeature} className="btn btn-outline">
                    <Plus className="w-4 h-4" />
                    Adicionar
                  </button>
                </div>
                <div className="grid gap-3">
                  {formData.features.map((feature, index) => (
                    <div key={index} className="flex gap-3">
                      <div className="flex-1">
                        <Input
                          value={feature}
                          onChange={(e) => updateFeature(index, e.target.value)}
                          placeholder="Ex: Até 100 agendamentos/mês"
                        />
                      </div>
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="btn btn-outline text-red-400 hover:bg-red-500/10 shrink-0 w-[42px] h-[42px] p-0 flex items-center justify-center self-end mb-5"
                          title="Remover recurso"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPlan ? 'Atualizar' : 'Criar Plano'}
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}

      {deleteId && (
        <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar Exclusão" size="md">
          <p className="text-text-dim mb-6">
            Tem certeza que deseja excluir este plano? Os assinantes existentes serão afetados.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setDeleteId(null)} className="btn btn-outline">Cancelar</button>
            <button onClick={() => handleDelete(deleteId)} className="btn btn-danger">Excluir</button>
          </div>
        </Modal>
      )}
    </div>
  );
}
