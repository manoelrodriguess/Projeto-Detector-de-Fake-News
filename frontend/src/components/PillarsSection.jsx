import { BarChart3, Cpu, ShieldCheck } from 'lucide-react';

export default function PillarsSection() {
  const pillars = [
    {
      icon: BarChart3,
      title: 'Padronização',
      description: 'Tratamento consistente de dados de múltiplas fontes para análise unificada',
    },
    {
      icon: Cpu,
      title: 'Análise de IA',
      description: 'Redução da subjetividade humana através de algoritmos de aprendizado de máquina',
    },
    {
      icon: ShieldCheck,
      title: 'Confiança',
      description: 'Apoio à tomada de decisão baseada em fatos e métricas verificáveis',
    },
  ];

  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-semibold text-slate-100 mb-8 text-center">
        Nossos Pilares
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((pillar, index) => (
          <div
            key={index}
            className="group relative rounded-2xl border border-slate-800 bg-slate-900 p-6 transition-transform duration-200 hover:-translate-y-1 hover:border-slate-700"
          >
            <div className="relative z-10 space-y-3">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-800 bg-slate-950 text-slate-100">
                <pillar.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-100">
                {pillar.title}
              </h3>
              <p className="text-sm leading-relaxed text-slate-400">
                {pillar.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
