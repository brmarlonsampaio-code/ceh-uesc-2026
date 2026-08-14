import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Fingerprint, Lock, FileDigit, ArrowLeft, Loader2 } from 'lucide-react';

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
      const response = await fetch(`https://ceh-backend.onrender.com${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'ACESSO NEGADO.');
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
    <div className="min-h-screen bg-[var(--color-light)] flex items-center justify-center p-4 relative overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #e0e0e0 25%, #e0e0e0 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px', opacity: 0.9 }}>
      
      <button 
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 flex items-center gap-2 text-black hover:bg-black hover:text-white px-2 py-1 transition-colors font-bold uppercase border-2 border-black bg-white shadow-[4px_4px_0px_#000]"
      >
        <ArrowLeft size={20} /> ABORTAR / RETORNAR
      </button>

      <div className="brutalist-box w-full max-w-md p-10 relative z-10 bg-white">
        <div className="flex flex-col items-center mb-8 border-b-4 border-black pb-6">
          <div className="w-20 h-20 bg-black flex items-center justify-center mb-4">
            <ShieldAlert className="text-white" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-black text-center tracking-widest">
            {isLogin ? 'IDENTIFICAÇÃO' : 'REGISTRO CIVIL'}
          </h2>
          <p className="text-black font-bold mt-2 text-center text-sm uppercase bg-yellow-400 px-2">
            {isLogin ? 'ACESSO RESTRITO AO SISTEMA' : 'INCLUSÃO DE INDIVÍDUO NO BANCO DE DADOS'}
          </p>
        </div>

        {error && (
          <div className="bg-red-600 text-white p-4 mb-6 font-bold uppercase flex items-center gap-2 brutalist-box border-red-900">
            <ShieldAlert size={20}/> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <div>
              <label className="block text-sm font-bold text-black mb-2 uppercase">NOME DO INDIVÍDUO</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Fingerprint className="text-black" size={18} />
                </div>
                <input
                  type="text"
                  required={!isLogin}
                  className="w-full pl-11 pr-4 py-3 brutalist-input"
                  placeholder="NOME COMPLETO"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase">IDENTIFICADOR (E-MAIL)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FileDigit className="text-black" size={18} />
              </div>
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 brutalist-input"
                placeholder="REGISTRO@SISTEMA.GOV"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-black mb-2 uppercase">CÓDIGO DE ACESSO</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-black" size={18} />
              </div>
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 brutalist-input"
                placeholder="********"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full brutalist-button py-4 text-lg flex items-center justify-center gap-2 mt-6"
          >
            {loading && <Loader2 className="animate-spin" size={20} />}
            {isLogin ? 'AUTENTICAR' : 'CADASTRAR NO SISTEMA'}
          </button>
        </form>

        <div className="mt-8 text-center border-t-2 border-black pt-6">
          <p className="text-black font-bold uppercase text-sm">
            {isLogin ? 'INDIVÍDUO NÃO REGISTRADO?' : 'JÁ POSSUI PRONTUÁRIO?'}
            <button
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="ml-2 bg-black text-white px-2 py-1 hover:bg-yellow-400 hover:text-black transition-colors"
            >
              {isLogin ? 'SOLICITAR REGISTRO' : 'INICIAR SESSÃO'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
