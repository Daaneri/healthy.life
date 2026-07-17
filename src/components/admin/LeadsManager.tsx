import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LeadItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

type LeadStatus = 'pendiente' | 'atendido';

interface Lead {
  id: string;
  name: string;
  phone: string;
  items: LeadItem[];
  total: number;
  created_at: string;
  status: LeadStatus | null;
}

type FilterTab = 'todos' | 'pendiente' | 'atendido';

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>('todos');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeads = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error(error);
      else setLeads(data || []);
      setLoading(false);
    };
    fetchLeads();
  }, []);

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const whatsappLink = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    return `https://wa.me/${cleaned}`;
  };

  const toggleStatus = async (lead: Lead) => {
    const newStatus: LeadStatus = lead.status === 'atendido' ? 'pendiente' : 'atendido';
    setUpdatingId(lead.id);

    const { error } = await supabase
      .from('leads')
      .update({ status: newStatus })
      .eq('id', lead.id);

    if (error) {
      console.error(error);
      alert(
        'No pude actualizar el estado. Revisá que exista la columna "status" en la tabla leads.'
      );
      setUpdatingId(null);
      return;
    }

    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status: newStatus } : l))
    );
    setUpdatingId(null);
  };

  const filteredLeads = leads.filter((lead) => {
    if (filter === 'todos') return true;
    // Los leads viejos, creados antes de agregar la columna, no tienen status → cuentan como pendientes.
    const effectiveStatus = lead.status || 'pendiente';
    return effectiveStatus === filter;
  });

  const pendingCount = leads.filter((l) => (l.status || 'pendiente') === 'pendiente').length;

  if (loading) return <p className="text-center text-gray-400 py-10">Cargando pedidos...</p>;

  if (leads.length === 0) {
    return <p className="text-center text-gray-400 py-10">Todavía no llegaron pedidos.</p>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-lg font-bold text-green-800">
          Pedidos ({leads.length})
          {pendingCount > 0 && (
            <span className="ml-2 text-xs font-semibold bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full align-middle">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''}
            </span>
          )}
        </h2>

        <div className="flex gap-1.5">
          {(['todos', 'pendiente', 'atendido'] as FilterTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors capitalize ${
                filter === tab
                  ? 'bg-green-800 text-white'
                  : 'bg-beige-100 text-gray-500 hover:bg-beige-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {filteredLeads.length === 0 ? (
        <p className="text-center text-gray-400 py-10">No hay pedidos en este filtro.</p>
      ) : (
        <div className="bg-white border border-beige-200 rounded-xl overflow-hidden divide-y divide-beige-100">
          {filteredLeads.map((lead) => {
            const isExpanded = expandedId === lead.id;
            const status: LeadStatus = lead.status || 'pendiente';

            return (
              <div key={lead.id}>
                <button
                  onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                  className="w-full flex items-center justify-between p-4 text-left hover:bg-beige-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${
                        status === 'atendido' ? 'bg-green-500' : 'bg-orange-400'
                      }`}
                    />
                    <div>
                      <p className="font-medium text-sm">{lead.name}</p>
                      <p className="text-xs text-gray-400">{formatDate(lead.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-green-800 text-sm">
                      ${lead.total.toLocaleString('es-AR')}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-4 pb-4 space-y-3">
                    <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                      <span className="text-gray-500">Teléfono: {lead.phone}</span>
                      <div className="flex items-center gap-3">
                        <a
                          href={whatsappLink(lead.phone)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-500 font-medium hover:underline"
                        >
                          Abrir WhatsApp
                        </a>
                        <button
                          onClick={() => toggleStatus(lead)}
                          disabled={updatingId === lead.id}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-colors disabled:opacity-50 ${
                            status === 'atendido'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          }`}
                        >
                          {updatingId === lead.id
                            ? '...'
                            : status === 'atendido'
                            ? '✓ Atendido'
                            : 'Marcar como atendido'}
                        </button>
                      </div>
                    </div>

                    <div className="bg-beige-50 rounded-lg p-3 space-y-1">
                      {lead.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span>
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-gray-500">
                            ${(item.price * item.quantity).toLocaleString('es-AR')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}