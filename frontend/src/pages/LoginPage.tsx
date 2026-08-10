import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, User, Lock, Mail, ArrowLeft, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Ocorreu um erro.');
      }

      localStorage.setItem('token', data.token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decoração */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-[var(--color-primary)] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-gray-500 hover:text-[var(--color-primary)] transition-colors"
      >
        <ArrowLeft size={20} /> Voltar para o início
      </button>

      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-10 relative z-10 border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <BookOpen className="text-[var(--color-primary)]" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 font-serif text-center">
            {isLogin ? 'Bem-vindo de volta' : 'Crie sua conta'}
          </h2>
          <p className="text-gray-500 mt-2 text-center">
            {isLogin ? 'Acesse o painel do congressista' : 'Junte-se ao Ciclo de Estudos Históricos 2026'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  required={!isLogin}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-gray-400" size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-gray-400" size={18} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:bg-white transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-primary)] text-white py-4 rounded-xl font-bold text-lg hover:bg-[var(--color-primary-dark)] transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex items-center justify-center gap-2 mt-4"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isLogin ? 'Entrar no Painel' : 'Finalizar Cadastro'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-gray-600">
            {isLogin ? 'Ainda não tem inscrição?' : 'Já possui uma conta?'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 font-bold text-[var(--color-primary)] hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
