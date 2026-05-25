import './index.css';
import Header from './components/Header';
import Home from './pages/Home';

// Componente principal da aplicação com painel analítico avançado
export default function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col overflow-x-hidden">
      {/* Background decorativo com gradientes animados */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Orbe flutuante azul */}
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        
        {/* Orbe flutuante púrpura */}
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Orbe flutuante cyan */}
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Conteúdo principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Cabeçalho */}
        <Header />
        
        {/* Conteúdo principal */}
        <Home />
        
        {/* Rodapé com assinatura */}
        <footer className="w-full border-t border-slate-800/50 py-8 px-4 bg-gradient-to-t from-slate-900/80 to-transparent backdrop-blur-sm mt-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              
              {/* Coluna 1: Sobre */}
              <div>
                <h3 className="text-white font-semibold mb-3">Sobre</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Detector de Fake News é uma solução acadêmica de IA explicável para análise de credibilidade de notícias.
                </p>
              </div>

              {/* Coluna 2: Recursos */}
              <div>
                <h3 className="text-white font-semibold mb-3">Recursos</h3>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li className="hover:text-blue-400 transition-colors cursor-pointer">Análise em Tempo Real</li>
                  <li className="hover:text-blue-400 transition-colors cursor-pointer">Explainability</li>
                  <li className="hover:text-blue-400 transition-colors cursor-pointer">Relatórios Detalhados</li>
                </ul>
              </div>

              {/* Coluna 3: Contato */}
              <div>
                <h3 className="text-white font-semibold mb-3">Tecnologia</h3>
                <div className="flex gap-2 text-xs text-slate-400">
                  <span className="px-2 py-1 bg-slate-800/50 rounded border border-slate-700/50">React 19</span>
                  <span className="px-2 py-1 bg-slate-800/50 rounded border border-slate-700/50">Vite</span>
                  <span className="px-2 py-1 bg-slate-800/50 rounded border border-slate-700/50">Tailwind CSS</span>
                </div>
              </div>
            </div>

            {/* Separador */}
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700/50 to-transparent mb-6" />

            {/* Copyright e Assinatura */}
            <div className="text-center space-y-2">
              <p className="text-slate-500 text-sm">
                © {currentYear} Detector de Fake News. Todos os direitos reservados.
              </p>
              
              {/* Assinatura Destacada */}
              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-slate-400">Desenvolvido pela equipe</span>
                <span className="px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 backdrop-blur-sm rounded-full border border-blue-400/30 text-blue-300 font-semibold shadow-lg shadow-blue-500/10">
                  Deep Analyzers
                </span>
              </div>

              <p className="text-xs text-slate-600 mt-3">
                Projeto Acadêmico de Inteligência Artificial Explicável
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
