// Componente de carregamento animado
export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-4 border-slate-700"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin"></div>
      </div>
      <p className="mt-4 text-slate-400 text-sm">Analisando notícia...</p>
    </div>
  );
}
