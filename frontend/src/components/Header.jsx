// Cabeçalho da aplicação
export default function Header() {
  return (
    <header className="bg-slate-900 border-b border-slate-700 py-6 shadow-lg">
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-lg">🔍</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">
              Detector de Fake News
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Análise inteligente de conteúdo suspeito
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
