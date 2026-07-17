import { Check } from 'lucide-react';
import { useToastStore } from '../store/useToastStore';

export function Toast() {
  const message = useToastStore((state) => state.message);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-forest text-white text-sm font-medium px-4 py-2.5 rounded-full shadow-lg flex items-center gap-2 animate-fadein">
      <Check className="w-4 h-4 text-mustard" />
      {message}
    </div>
  );
}