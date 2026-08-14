import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, LogOut, FolderArchive, TerminalSquare, FileKey, X, Plus, Activity } from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({ title: '', abstract: '' });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const profileRes = await fetch('https://ceh-backend.onrender.com/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!profileRes.ok) throw new Error('ACESSO NEGADO');
        setUser(await profileRes.json());

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
      if (!file) {
        alert('ARQUIVO OBRIGATÓRIO. ANEXE PROVAS.');
        setSubmitLoading(false);
        return;
      }

      const token = localStorage.getItem('token');
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('abstract', formData.abstract);
      submitData.append('file', file);

      const response = await fetch('https://ceh-backend.onrender.com/submissions', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: submitData
      });

      if (response.ok) {
        const newSub = await response.json();
        setSubmissions([newSub, ...submissions]);
        setIsModalOpen(false);
        setFormData({ title: '', abstract: '' });
        setFile(null);
      } else {
        const err = await response.json();
        alert(err.error || 'ERRO DE TRANSMISSÃO.');
      }
    } catch (error) {
      alert('FALHA DE COMUNICAÇÃO COM SERVIDOR CENTRAL.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-black text-white font-bold tracking-widest uppercase">ESTABELECENDO CONEXÃO...</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--color-light)] flex" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)' }}>
      {/* Sidebar */}
      <aside className="w-72 bg-black text-white border-r-4 border-red-900 flex flex-col hidden md:flex">
        <div className="p-8 border-b-2 border-gray-800 flex items-center gap-3 bg-red-900">
          <ShieldAlert className="text-white" size={28} />
          <h1 className="font-bold text-lg tracking-widest">S.I.S. REGISTRO</h1>
        </div>
        <nav className="flex-1 p-6 space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-white text-black font-bold uppercase transition-colors border-l-4 border-red-600">
            <FolderArchive size={20} /> DOSSIÊS
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 uppercase font-bold transition-colors">
            <TerminalSquare size={20} /> INQUÉRITOS
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-gray-900 uppercase font-bold transition-colors">
            <FileKey size={20} /> ALVARÁS
          </button>
        </nav>
        <div className="p-6 border-t-2 border-gray-800 bg-gray-900">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-red-900 text-white flex items-center justify-center font-bold border border-red-600">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'X'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-white truncate uppercase">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-white hover:bg-red-900 py-2 transition-colors text-sm font-bold border border-gray-700 hover:border-red-600 uppercase"
          >
            <LogOut size={16} /> ENCERRAR SESSÃO
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-12 border-b-4 border-black pb-4">
          <h2 className="text-4xl font-bold text-black mb-2 uppercase">INDIVÍDUO: {user?.name ? user.name.split(' ')[0] : 'DESCONHECIDO'}</h2>
          <p className="text-red-900 font-bold bg-yellow-400 inline-block px-2">ACESSO CONCEDIDO: NÍVEL 1</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="brutalist-box p-8 flex flex-col h-full bg-white">
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-2">
              <h3 className="text-xl font-bold text-black flex items-center gap-2 uppercase">
                <FolderArchive className="text-red-900" /> REGISTRO DE DADOS
              </h3>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="brutalist-button px-3 py-1 flex items-center gap-1 text-sm"
              >
                <Plus size={18} /> INCLUIR
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {submissions.length === 0 ? (
                <div className="text-center text-gray-500 py-10 border-2 border-dashed border-gray-400 font-bold uppercase">
                  <p>NENHUM REGISTRO ENCONTRADO NO BANCO DE DADOS.</p>
                </div>
              ) : (
                submissions.map((sub: any) => (
                  <div key={sub.id} className="p-4 border-2 border-black bg-gray-100 shadow-[4px_4px_0px_#000]">
                    <h4 className="font-bold text-black truncate uppercase">{sub.title}</h4>
                    <p className="text-xs text-gray-600 mt-1 mb-3 line-clamp-2 uppercase border-l-2 border-red-900 pl-2">{sub.abstract}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-xs font-bold px-2 py-1 bg-black text-white flex items-center gap-1 uppercase">
                        <Activity size={12} className="text-red-500 animate-pulse" /> STATUS: {sub.status}
                      </span>
                      <a href={sub.driveLink} target="_blank" rel="noreferrer" className="text-xs text-red-900 font-bold hover:bg-black hover:text-white px-2 py-1 border border-red-900 uppercase">
                        ACESSAR ARQUIVO CLASSIFICADO
                      </a>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="brutalist-box p-8 bg-gray-200">
            <h3 className="text-xl font-bold mb-4 text-black flex items-center gap-2 uppercase border-b-2 border-black pb-2">
              <ShieldAlert className="text-black" /> CONTROLE DE PASSAGEM
            </h3>
            <div className="bg-black border-2 border-red-900 p-4 text-white font-bold uppercase">
              <span className="text-red-500">AVISO:</span> NENHUMA OCORRÊNCIA VINCULADA AO SEU PRONTUÁRIO NA DATA DE HOJE.
            </div>
          </div>
        </div>
      </main>

      {/* Modal de Submissão */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="brutalist-box w-full max-w-2xl bg-white p-0">
            <div className="p-4 border-b-4 border-black bg-yellow-400 flex justify-between items-center">
              <h2 className="text-xl font-bold text-black uppercase flex items-center gap-2">
                <ShieldAlert /> ABERTURA DE PROCESSO
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-black hover:bg-black hover:text-white p-1 border-2 border-transparent hover:border-black transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-black mb-2 uppercase">ASSUNTO / TÍTULO DA OCORRÊNCIA</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-3 brutalist-input"
                    placeholder="DESCREVA BREVEMENTE O CASO..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-black mb-2 uppercase">DEPOIMENTO / DESCRIÇÃO (ABSTRACT)</label>
                  <textarea 
                    required 
                    rows={4}
                    value={formData.abstract}
                    onChange={(e) => setFormData({...formData, abstract: e.target.value})}
                    className="w-full px-4 py-3 brutalist-input resize-none"
                    placeholder="REGISTRO DETALHADO DOS FATOS..."
                  ></textarea>
                </div>

                <div className="border-2 border-black p-4 bg-gray-100">
                  <label className="block text-sm font-bold text-black mb-2 uppercase">ANEXAR PROVAS MATERIAL (PDF)</label>
                  <input 
                    type="file" 
                    accept="application/pdf"
                    required 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full file:mr-4 file:py-2 file:px-4 file:border-2 file:border-black file:text-sm file:font-bold file:bg-black file:text-white hover:file:bg-white hover:file:text-black file:uppercase file:cursor-pointer transition-colors"
                  />
                  <p className="text-xs text-red-700 font-bold mt-2 uppercase">ARQUIVO SERÁ ENVIADO DIRETAMENTE AO SETOR DE INTELIGÊNCIA CENTRAL.</p>
                </div>
              </div>

              <div className="mt-8 flex gap-4 justify-end border-t-2 border-black pt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-black bg-white border-2 border-black hover:bg-gray-200 uppercase shadow-[4px_4px_0px_#000]"
                >
                  CANCELAR
                </button>
                <button 
                  type="submit" 
                  disabled={submitLoading}
                  className="brutalist-button px-6 py-3 flex items-center gap-2 disabled:opacity-50"
                >
                  {submitLoading ? 'PROCESSANDO...' : 'PROTOCOLAR'}
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
