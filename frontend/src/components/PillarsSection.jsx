// Seção com 3 pilares informativos sobre o projeto
export default function PillarsSection() {
  const pillars = [
    {
      icon: '📊',
      title: 'Padronização',
      description: 'Tratamento consistente de dados de múltiplas fontes para análise unificada',
      color: 'from-blue-500/20 to-blue-600/20',
      borderColor: 'border-blue-400/30',
    },
    {
      icon: '🤖',
      title: 'Análise de IA',
      description: 'Redução da subjetividade humana através de algoritmos de aprendizado de máquina',
      color: 'from-purple-500/20 to-purple-600/20',
      borderColor: 'border-purple-400/30',
    },
    {
      icon: '✨',
      title: 'Confiança',
      description: 'Apoio à tomada de decisão baseada em fatos e métricas verificáveis',
      color: 'from-cyan-500/20 to-cyan-600/20',
      borderColor: 'border-cyan-400/30',
    },
  ];

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold text-white mb-8 text-center hover:text-transparent hover:bg-gradient-to-r hover:from-blue-400 hover:via-cyan-400 hover:to-blue-400 hover:bg-clip-text transition-all duration-300">
        Nossos Pilares
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
          <div
            key={index}
            className={`group relative bg-gradient-to-br ${pillar.color} backdrop-blur-xl border ${pillar.borderColor} rounded-2xl p-6 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:border-opacity-100 shadow-lg`}
          >
            {/* Efeito de brilho no hover */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Conteúdo */}
            <div className="relative z-10 space-y-3">
              <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                {pillar.icon}
              </div>
              <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-300 group-hover:to-cyan-300 group-hover:bg-clip-text transition-all duration-300">
                {pillar.title}
              </h3>
              <p className="text-slate-300 text-sm leading-relaxed group-hover:text-slate-200 transition-colors duration-300">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
