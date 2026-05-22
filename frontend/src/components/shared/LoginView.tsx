import React, { useState } from 'react';
import { Activity, ArrowRight, Lock, User, Shield } from 'lucide-react';
import { loginUser } from '../../services/authService';
import { User as UserType } from '../../types';

interface LoginViewProps {
  onLogin: (user: UserType, token: string) => void;
}

type Department = 'AMBULANCE' | 'HOSPITAL' | 'TOLL';

const DEPARTMENTS: { key: Department; label: string; placeholder: string; demo: string }[] = [
  { key: 'AMBULANCE', label: 'Ambulance',  placeholder: 'e.g. AMB-882',  demo: 'AMB-001'  },
  { key: 'HOSPITAL',  label: 'Hospital',   placeholder: 'e.g. HOSP-001', demo: 'HOSP-001' },
  { key: 'TOLL',      label: 'Toll Plaza', placeholder: 'e.g. TOLL-001', demo: 'TOLL-001' },
];

const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [dept, setDept]             = useState<Department>('AMBULANCE');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');

  const activeDept = DEPARTMENTS.find(d => d.key === dept)!;

  const handleDeptChange = (key: Department) => {
    setDept(key);
    setEmployeeId('');
    setError('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!employeeId.trim() || !password.trim()) {
      setError('Please enter your Employee ID and password.');
      return;
    }
    setLoading(true);
    const result = await loginUser(employeeId.trim(), password);
    setLoading(false);
    if (result.success && result.user && result.token) {
      onLogin(result.user, result.token);
    } else {
      setError(result.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#f0f4f8' }}>

      {/* Navy top arc */}
      <div
        className="fixed top-0 left-0 right-0"
        style={{
          height: '45vh',
          background: 'linear-gradient(160deg, #0a3055 0%, #1a5276 60%, #1a6590 100%)',
          borderRadius: '0 0 60% 60% / 0 0 40px 40px',
        }}
      />

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm">
        <div className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>

          {/* Logo + Title */}
          <div className="pt-10 pb-6 px-8 text-center">
            <div
              className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: 'linear-gradient(135deg, #e8f0fe 0%, #c7d9f8 100%)' }}
            >
              <Activity size={30} style={{ color: '#1a5ea8' }} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">MediResponse</h1>
            <p className="text-sm text-gray-500 mt-1">Secure Emergency Access</p>
          </div>

          <div className="px-8 pb-8 space-y-5">

            {/* Department selector */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                Department
              </label>
              <div className="grid grid-cols-3 gap-2">
                {DEPARTMENTS.map(d => (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => handleDeptChange(d.key)}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 transition-all text-xs font-semibold"
                    style={dept === d.key
                      ? { borderColor: '#1a5ea8', background: '#f0f6ff', color: '#1a5ea8' }
                      : { borderColor: '#e5e7eb', background: 'white',   color: '#9ca3af' }
                    }
                  >
                    {d.key === 'AMBULANCE' && <Activity size={18} strokeWidth={2} />}
                    {d.key === 'HOSPITAL'  && <User     size={18} strokeWidth={2} />}
                    {d.key === 'TOLL'      && <Shield   size={18} strokeWidth={2} />}
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Employee ID
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={employeeId}
                    onChange={e => setEmployeeId(e.target.value)}
                    placeholder={activeDept.placeholder}
                    autoComplete="username"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    style={{ background: '#f8fafc' }}
                  />
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    style={{ background: '#f8fafc' }}
                  />
                  <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
                style={{ background: '#111827' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>Login to System <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <button
              type="button"
              onClick={() => { setEmployeeId(activeDept.demo); setPassword('demo123'); setError(''); }}
              className="w-full text-center text-xs text-gray-400 hover:text-gray-600 transition py-1"
            >
              Use demo credentials for {activeDept.label}
            </button>
          </div>

          <div className="border-t border-gray-100 px-8 py-4 text-center">
            <p className="text-xs text-gray-400 flex items-center justify-center gap-1.5">
              <Shield size={11} />
              Secure Govt. Network v2.5.0
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginView;
