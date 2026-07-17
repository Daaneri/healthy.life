import { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AdminLoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setError('Email o contraseña incorrectos.');
      setLoading(false);
      return;
    }

    setLoading(false);
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-md p-8 w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold text-green-800 text-center">
          Healthy Life — Admin
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-beige-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          className="w-full border border-beige-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          disabled={loading}
          onClick={handleLogin}
          className="w-full bg-orange-500 disabled:bg-gray-300 text-white font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </div>
    </div>
  );
}