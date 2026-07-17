import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LeadItem {
  id: number;
  name: string;
  quantity: number;
  price: number;
}

interface Lead {
  id: string;
  name: string;
  phone: string;
  items: LeadItem[];
  total: number;
  created_at: string;
}

export function LeadsManager() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

  if (loading) return <p className="text-center text-gray-400 py-10">Cargando pedidos...</p>;

  if (leads.length === 0) {
    return <p className="text-center text-gray-400 py-10">Todavía no llegaron pedidos.</p>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-green-800">Pedidos ({leads.length})</h2>

      <div className="bg-white border border-beige-200 rounded-xl overflow-hidden divide-y divide-beige-100">
        {leads.map((lead) => {
          const isExpanded = expandedId === lead.id;

          return (
            <div key={lead.id}>
              <button
                onClick={() => setExpandedId(isExpanded ? null : lead.id)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-beige-50 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{lead.name}</p>
                  <p className="text-xs text-gray-400">{formatDate(lead.created_at)}</p>
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
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Teléfono: {lead.phone}</span>
                    <a
                      href={whatsappLink(lead.phone)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 font-medium hover:underline"
                    >
                      Abrir WhatsApp
                    </a>
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
    </div>
  );
}