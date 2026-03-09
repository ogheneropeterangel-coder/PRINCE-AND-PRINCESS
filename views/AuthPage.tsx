
import React, { useState, useEffect } from 'react';
import { useAuth } from '../App';
import { supabase } from '../lib/supabase';
import { UserRole } from '../types';
import { db } from '../db';
import { LogIn, UserPlus, AlertCircle, ArrowLeft, Crown, Eye, EyeOff, MoveRight, Fingerprint } from 'lucide-react';

const AuthPage: React.FC = () => {
  const { login, navigateTo, authMode } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '' });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [logo, setLogo] = useState<string>('');

  useEffect(() => {
    if (authMode === 'login') {
      setIsLogin(true);
    }
    db.settings.get().then(settings => {
      if (settings?.logo) setLogo(settings.logo);
    });
  }, [authMode]);

  // Utility to handle Supabase's 6-character minimum requirement transparently
  const getAuthPassword = (raw: string) => {
    if (!raw) return '';
    // If password is too short, we append a consistent internal suffix
    // This allows students with short surnames to use them as passwords
    return raw.length < 6 ? `${raw.toLowerCase().trim()}_ppis` : raw;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const input = formData.email.trim();
    const normalizedUsername = input.toLowerCase().replace(/\//g, '_');
    const emailToUse = !input.includes('@') ? `${normalizedUsername}@ppisms.edu` : input;
    
    // The password we send to Supabase Auth
    const securePassword = getAuthPassword(formData.password);

    try {
      if (isLogin) {
        const { success, error: authError } = await login(emailToUse, securePassword);
        if (success) return;

        // If direct login fails, check if this is a first-time activation from registry
        const { data: registryProfile } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${input.toLowerCase()},username.ilike.${normalizedUsername}`)
          .maybeSingle();

        if (registryProfile) {
          // Check against the plaintext password stored in registry
          if (registryProfile.password === formData.password.toLowerCase().trim()) {
            // Found in registry, but not in Auth yet. Start activation.
            const tempUniqueId = `__sync_${normalizedUsername}_${crypto.randomUUID().split('-')[0]}`;
            await supabase.from('profiles').update({ username: tempUniqueId }).eq('id', registryProfile.id);

            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: emailToUse,
              password: securePassword,
              options: { 
                data: { fullName: registryProfile.full_name, role: registryProfile.role } 
              }
            });

            if (signUpError) {
              await supabase.from('profiles').update({ username: registryProfile.username }).eq('id', registryProfile.id);
              setError(signUpError.message);
              return;
            }

            if (signUpData.user) {
              await login(emailToUse, securePassword);
              return;
            }
          } else {
            setError('Registry Mismatch: Incorrect Password.');
          }
        } else {
          setError('Registry ID not located.');
        }
      } else {
        // Manual Sign Up path
        const { data: registryCheck } = await supabase
          .from('profiles')
          .select('*')
          .or(`username.ilike.${input.toLowerCase()},username.ilike.${normalizedUsername}`)
          .maybeSingle();

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: emailToUse,
          password: securePassword,
          options: { 
            data: { 
              fullName: registryCheck?.full_name || formData.fullName,
              role: registryCheck?.role || UserRole.STUDENT 
            } 
          }
        });

        if (signUpError) {
          setError(signUpError.message);
          return;
        }
        
        if (authData.user) {
          const { data: existing } = await supabase.from('profiles').select('*').eq('username', normalizedUsername).maybeSingle();
          if (!existing && !registryCheck) {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const role = (count === 0) ? UserRole.ADMIN : UserRole.STUDENT;
            await supabase.from('profiles').insert({
              id: authData.user.id,
              full_name: formData.fullName,
              username: normalizedUsername,
              role: role
            });
          }
          setError('Profile created! You may now log in.');
          setIsLogin(true);
        }
      }
    } catch (err: any) {
      if (err.message === 'Failed to fetch') {
        setError('Network Error: Please check your internet connection.');
      } else {
        setError(err.message || 'System error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row font-sans selection:bg-school-royal selection:text-white">
      {/* Left Side: Branding & Visuals */}
      <div className="relative hidden lg:flex lg:w-1/2 bg-school-royal overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1523050335392-9bc5675e583f?auto=format&fit=crop&q=80&w=1200" 
            alt="School Campus" 
            className="w-full h-full object-cover opacity-20 mix-blend-overlay scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-school-royal via-school-royal/80 to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-xl space-y-12">
          <div className="space-y-6">
            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl border-4 border-school-gold/30 animate-pulse">
              {logo ? (
                <img src={logo} alt="School Logo" className="w-full h-full object-contain p-3" />
              ) : (
                <Crown size={48} className="text-school-royal" />
              )}
            </div>
            <div className="space-y-2">
              <h1 className="text-6xl font-black text-white leading-none tracking-tighter uppercase">
                Prince & <br />
                <span className="text-school-gold italic">Princess</span>
              </h1>
              <p className="text-white/60 text-xs font-black uppercase tracking-[0.5em]">International School, Wukari</p>
            </div>
          </div>

          <div className="space-y-8 pt-12 border-t border-white/10">
            <div className="space-y-2">
              <p className="text-school-gold text-[10px] font-black uppercase tracking-[0.3em]">Our Philosophy</p>
              <h3 className="text-3xl font-black text-white tracking-tighter leading-tight uppercase">Character, Skill <br /> and Career</h3>
            </div>
            <p className="text-white/70 text-lg font-medium leading-relaxed">
              Welcome to the official school portal. Access your academic records, manage your profile, and stay connected with the center of excellence.
            </p>
          </div>

          <div className="flex items-center gap-4 pt-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-school-royal bg-slate-200 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <p className="text-white/50 text-[10px] font-black uppercase tracking-widest">Joined by 1,200+ Students & Staff</p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-school-gold via-white/20 to-transparent" />
      </div>

      {/* Right Side: Auth Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-24 bg-slate-50 dark:bg-slate-900 relative">
        <div className="absolute top-8 left-8 lg:left-12">
          <button 
            onClick={() => navigateTo('landing')}
            className="group flex items-center gap-3 text-slate-400 hover:text-school-royal transition-all text-[10px] font-black uppercase tracking-[0.2em]"
          >
            <div className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:bg-school-royal group-hover:text-white transition-all">
              <ArrowLeft size={14} />
            </div>
            Return to Website
          </button>
        </div>

        <div className="w-full max-w-[440px] space-y-10">
          <div className="space-y-3">
            <div className="lg:hidden w-16 h-16 bg-school-royal rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              {logo ? (
                <img src={logo} alt="Logo" className="w-full h-full object-contain p-2" />
              ) : (
                <Crown size={32} className="text-school-gold" />
              )}
            </div>
            <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {isLogin ? 'Welcome Back' : 'Join the Registry'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
              {isLogin ? 'Sign in to access your dashboard.' : 'Activate your student profile to begin.'}
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700 p-8 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                      <UserPlus size={18} />
                    </div>
                    <input
                      required
                      type="text"
                      placeholder="e.g. John Doe"
                      className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-school-royal dark:focus:border-school-gold outline-none transition-all font-bold text-sm dark:text-white placeholder:text-slate-300"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {isLogin ? 'Registry ID / Email Address' : 'Registry / Admission ID'}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <Fingerprint size={18} />
                  </div>
                  <input
                    required
                    type="text"
                    placeholder={isLogin ? "PPIS/2026/XXX or Email" : "PPIS/2026/XXX"}
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-school-royal dark:focus:border-school-gold outline-none transition-all font-bold text-sm dark:text-white placeholder:text-slate-300"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password / Surname</label>
                </div>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300">
                    <LogIn size={18} />
                  </div>
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-transparent focus:bg-white dark:focus:bg-slate-800 focus:border-school-royal dark:focus:border-school-gold outline-none transition-all font-bold text-sm dark:text-white placeholder:text-slate-300"
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-school-royal transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-2xl text-xs font-bold animate-in fade-in slide-in-from-top-2">
                  <AlertCircle size={18} className="shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button 
                disabled={loading}
                type="submit"
                className="w-full py-5 bg-school-royal dark:bg-school-gold text-white dark:text-school-royal rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-black dark:hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group disabled:opacity-50 shadow-xl shadow-school-royal/20 dark:shadow-none"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{isLogin ? 'Authenticate' : 'Activate Profile'}</span>
                    <MoveRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-700 text-center">
              <button 
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="text-[10px] font-black uppercase tracking-widest text-school-royal dark:text-school-gold hover:opacity-70 transition-opacity"
              >
                {isLogin ? "Need to activate your registry ID?" : "Already have an account? Sign in"}
              </button>
            </div>
          </div>

          <div className="text-center space-y-4">
            <p className="text-[10px] text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
              Students: Use your <strong className="text-slate-600 dark:text-slate-300">Surname</strong> as the default password.<br />
              Need assistance? Contact the school office.
            </p>
            
            <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-30">
              <div className="h-4 w-px bg-slate-300" />
              <p className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">PPISMS v2.0 • Secured Access</p>
              <div className="h-4 w-px bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
