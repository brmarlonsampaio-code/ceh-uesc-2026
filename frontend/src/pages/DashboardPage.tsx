import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, FileText, Calendar, Award } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch('https://ceh-backend.onrender.com/user/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Não autorizado');
        }

        const userData = await response.json();
        setUser(userData);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[var(--color-light)]">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)] flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col hidden md:flex">
        <div className="p-8 border-b border-gray-100 flex items-center gap-3">
          <BookOpen className="text-[var(--color-primary)]" size={28} />
          <h1 className="font-bold font-serif text-lg text-gray-800">CEH 2026</h1>
        </div>
        <nav className="flex-1 p-6 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-red-50 text-[var(--color-primary)] rounded-xl font-medium transition-colors">
            <FileText size={20} /> Meus Trabalhos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Calendar size={20} /> Programação
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium transition-colors">
            <Award size={20} /> Certificados
          </button>
        </nav>
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[var(--color-primary)] text-white rounded-full flex items-center justify-center font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-red-600 hover:bg-red-50 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto relative">
         <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-accent)] opacity-5 rounded-full blur-[100px] pointer-events-none"></div>

        <header className="mb-12">
          <h2 className="text-4xl font-bold font-serif text-gray-900 mb-2">Olá, {user?.name ? user.name.split(' ')[0] : 'Usuário'}</h2>
          <p className="text-gray-500 text-lg">Bem-vindo(a) ao painel do congressista.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 font-serif text-gray-900 flex items-center gap-2">
              <FileText className="text-[var(--color-primary)]" /> Submissão de Trabalhos
            </h3>
            <p className="text-gray-600 mb-6">Você ainda não submeteu nenhum resumo expandido ou artigo completo.</p>
            <button className="bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl font-medium hover:bg-[var(--color-primary-dark)] transition-colors w-full sm:w-auto">
              Submeter Novo Trabalho
            </button>
          </div>
          
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold mb-4 font-serif text-gray-900 flex items-center gap-2">
              <Calendar className="text-[var(--color-accent)]" /> Sua Agenda Hoje
            </h3>
            <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-orange-800 text-sm">
              Nenhuma atividade programada para você hoje. Explore a programação do evento.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
