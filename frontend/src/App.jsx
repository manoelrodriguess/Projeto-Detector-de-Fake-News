import './index.css';
import Header from './components/Header';
import Home from './pages/Home';

export default function App() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col overflow-x-hidden">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <Home />

        <footer className="w-full border-t border-slate-800 py-8 px-4 bg-slate-950 mt-auto">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div>
                <h3 className="text-white font-semibold mb-3">Sobre</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Detector de Fake News é uma solução acadêmica de IA explicável para análise de credibilidade de notícias.
                </p>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Recursos</h3>
                <ul className="text-slate-400 text-sm space-y-2">
                  <li className="hover:text-slate-200 transition-colors cursor-pointer">Análise em Tempo Real</li>
                  <li className="hover:text-slate-200 transition-colors cursor-pointer">Explainability</li>
                  <li className="hover:text-slate-200 transition-colors cursor-pointer">Relatórios Detalhados</li>
                </ul>
              </div>

              <div>
                <h3 className="text-white font-semibold mb-3">Tecnologia</h3>
                <div className="flex gap-2 text-xs text-slate-400">
                  <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">React 19</span>
                  <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">Vite</span>
                  <span className="px-2 py-1 bg-slate-900 rounded border border-slate-800">Tailwind CSS</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-800 mb-6" />

            <div className="text-center space-y-2">
              <p className="text-slate-500 text-sm">
                © {currentYear} Detector de Fake News. Todos os direitos reservados.
              </p>

              <div className="flex items-center justify-center gap-2 text-sm">
                <span className="text-slate-400">Desenvolvido pela equipe</span>
                <span className="px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-slate-200 font-semibold">
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
