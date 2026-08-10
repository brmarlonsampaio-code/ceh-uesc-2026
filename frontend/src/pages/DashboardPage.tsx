import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, FileText, Calendar, Award, X, Plus, CheckCircle } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', abstract: '', driveLink: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch Profile
        const profileRes = await fetch('https://ceh-backend.onrender.com/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!profileRes.ok) throw new Error('Não autorizado');
        setUser(await profileRes.json());

        // Fetch Submissions
        const subRes = await fetch('https://ceh-backend.onrender.com/submissions', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (subRes.ok) {
          setSubmissions(await subRes.json());
        }
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://ceh-backend.onrender.com/submissions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const newSub = await response.json();
        setSubmissions([newSub, ...submissions]);
        setIsModalOpen(false);
        setFormData({ title: '', abstract: '', driveLink: '' });
      } else {
        alert('Erro ao enviar o trabalho. Tente novamente.');
      }
    } catch (error) {
      alert('Erro de conexão.');
    } finally {
      setSubmitLoading(false);
    }
  };

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
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-serif text-gray-900 flex items-center gap-2">
                <FileText className="text-[var(--color-primary)]" /> Trabalhos
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-[var(--color-primary)] text-white p-2 rounded-xl hover:bg-[var(--color-primary-dark)] transition-colors flex items-center gap-1 text-sm font-medium"
              >
                <Plus size={18} /> Novo
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center text-gray-500 py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <p>Nenhum trabalho submetido ainda.</p>
                </div>
              ) : (
                submissions.map((sub: any) => (
                  <div key={sub.id} className="p-4 border border-gray-100 rounded-2xl hover:border-[var(--color-primary)] transition-colors bg-white shadow-sm">
                    <h4 className="font-bold text-gray-900 truncate">{sub.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 mb-3 line-clamp-2">{sub.abstract}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 text-yellow-800 rounded-md flex items-center gap-1">
                        <CheckCircle size={12} /> {sub.status}
                      </span>
                      <a href={sub.driveLink} target="_blank" rel="noreferrer" className="text-xs text-[var(--color-primary)] font-medium hover:underline">
                        Ver Arquivo
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
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

      {/* Modal de Submissão */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-fade-in-up">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold font-serif text-gray-900">Submeter Trabalho</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Título do Trabalho</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all"
                    placeholder="Ex: A influência da Revolução Industrial..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Resumo (Abstract)</label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.abstract}
                    onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all resize-none"
                    placeholder="Cole aqui o resumo do seu trabalho..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Link do Arquivo (PDF no Google Drive)</label>
                  <input 
                    type="url" 
                    required 
                    value={formData.driveLink}
                    onChange={(e) => setFormData({...formData, driveLink: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-gray-50 focus:bg-white transition-all"
                    placeholder="https://drive.google.com/..."
                  />
                  <p className="text-xs text-gray-500 mt-2">Certifique-se de que o link está configurado como "Qualquer pessoa com o link pode ler".</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-end">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="px-6 py-3 rounded-xl font-medium bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)] transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {submitLoading ? 'Enviando...' : 'Finalizar Submissão'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
