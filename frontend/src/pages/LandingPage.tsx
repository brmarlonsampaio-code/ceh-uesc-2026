import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, Users, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col font-sans relative overflow-hidden bg-[var(--color-light)]">
      {/* Background Decorativo */}
      <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-[var(--color-primary)] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[var(--color-accent)] opacity-10 rounded-full blur-[100px] pointer-events-none"></div>

      <header className="glass fixed top-0 w-full z-50 px-8 py-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <BookOpen className="text-[var(--color-primary)]" size={32} />
          <h1 className="text-xl font-bold text-[var(--color-primary-dark)]">CEH UESC</h1>
        </div>
        <nav className="hidden md:flex gap-6 font-medium text-gray-700">
          <a href="#sobre" className="hover:text-[var(--color-primary)] transition-colors">Sobre</a>
          <a href="#programacao" className="hover:text-[var(--color-primary)] transition-colors">Programação</a>
          <a href="#palestrantes" className="hover:text-[var(--color-primary)] transition-colors">Palestrantes</a>
        </nav>
        <button 
          onClick={() => navigate('/login')}
          className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-full font-semibold hover:bg-[var(--color-primary-dark)] transition-all flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-1"
        >
          Área do Congressista
        </button>
      </header>

      <main className="flex-grow pt-32 px-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center text-center">
        <div className="inline-block px-4 py-1 bg-red-50 text-[var(--color-primary)] font-bold text-sm rounded-full mb-6 border border-red-100 uppercase tracking-wider">
          Edição 2026
        </div>
        <h2 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight max-w-4xl">
          Ciclo de Estudos Históricos <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)]">
            UESC 2026
          </span>
        </h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl">
          Conectando o passado ao futuro através do debate acadêmico de excelência. Junte-se aos principais pesquisadores da região sul da Bahia.
        </p>

        <div className="flex flex-col md:flex-row gap-4 mb-20">
          <button onClick={() => navigate('/login')} className="bg-[var(--color-primary)] text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-[var(--color-primary-dark)] transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            Inscreva-se Agora <ArrowRight size={20}/>
          </button>
          <button className="bg-white text-[var(--color-primary)] border-2 border-[var(--color-primary)] px-8 py-4 rounded-full font-bold text-lg hover:bg-red-50 transition-all">
            Ver Programação
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-20">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Calendar className="text-[var(--color-primary)]" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">3 Dias de Evento</h3>
            <p className="text-gray-600">Palestras, mesas redondas e simpósios temáticos intensos.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <Users className="text-[var(--color-primary)]" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Networking</h3>
            <p className="text-gray-600">Conecte-se com acadêmicos e pesquisadores de todo o Brasil.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
              <BookOpen className="text-[var(--color-primary)]" size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">Certificação</h3>
            <p className="text-gray-600">Certificados de 40h válidos em todo o território nacional.</p>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center mt-auto">
        <p>© 2026 Ciclo de Estudos Históricos - Universidade Estadual de Santa Cruz. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
