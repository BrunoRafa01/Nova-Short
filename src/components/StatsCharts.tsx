"use client";

import { BarChart3, Smartphone, Monitor, Tablet, Globe } from "lucide-react";

interface TimelineItem {
  date: string;
  clicks: number;
}

interface CountItem {
  name: string;
  count: number;
}

interface StatsChartsProps {
  timeline: TimelineItem[];
  devices: CountItem[];
  browsers: CountItem[];
  referers: CountItem[];
}

export function StatsCharts({ timeline, devices, browsers, referers }: StatsChartsProps) {
  const maxClicks = Math.max(...timeline.map((t) => t.clicks), 1);
  const totalDeviceCount = devices.reduce((sum, d) => sum + d.count, 0) || 1;

  const getDeviceIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("mobile")) return <Smartphone className="w-4 h-4 text-[#3B82F6]" />;
    if (n.includes("tablet")) return <Tablet className="w-4 h-4 text-[#60A5FA]" />;
    return <Monitor className="w-4 h-4 text-emerald-400" />;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Cliques ao Longo do Tempo */}
      <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-6 shadow-nova-card">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-[#3B82F6]" />
            <h3 className="text-sm font-semibold text-[#F8FAFC]">Histórico de Cliques (Últimos Dias)</h3>
          </div>
          <span className="text-xs text-[#94A3B8] font-mono">
            Pico: {maxClicks} cliques/dia
          </span>
        </div>

        {timeline.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            Nenhum clique registrado ainda. Compartilhe seu link para ver as estatísticas!
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-44 flex items-end space-x-3 pt-6 pb-2 border-b border-[#1E2C48]">
              {timeline.map((item) => {
                const heightPercent = Math.round((item.clicks / maxClicks) * 100);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#152238] border border-[#3B82F6] text-[10px] text-white px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-lg z-10">
                      {item.clicks} {item.clicks === 1 ? "clique" : "cliques"} ({item.date})
                    </div>
                    {/* Barra */}
                    <div
                      className="w-full max-w-[32px] rounded-t-md bg-gradient-to-t from-[#3B82F6] to-[#60A5FA] group-hover:brightness-125 transition-all"
                      style={{ height: `${Math.max(8, heightPercent)}%` }}
                    />
                  </div>
                );
              })}
            </div>
            {/* Eixo de Datas */}
            <div className="flex justify-between text-[10px] text-[#64748B] pt-1 font-mono">
              <span>{timeline[0]?.date}</span>
              <span>{timeline[timeline.length - 1]?.date}</span>
            </div>
          </div>
        )}
      </div>

      {/* Grid de Dispositivos e Navegadores */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dispositivos */}
        <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-6 shadow-nova-card">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4">
            Dispositivos
          </h4>
          {devices.length === 0 ? (
            <p className="text-xs text-[#64748B]">Sem dados de dispositivos.</p>
          ) : (
            <div className="space-y-3">
              {devices.map((dev) => {
                const pct = Math.round((dev.count / totalDeviceCount) * 100);
                return (
                  <div key={dev.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center space-x-2 text-[#F8FAFC]">
                        {getDeviceIcon(dev.name)}
                        <span>{dev.name}</span>
                      </span>
                      <span className="text-[#94A3B8] font-mono">{pct}% ({dev.count})</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#080C15] rounded-full overflow-hidden">
                      <div className="h-full bg-[#3B82F6]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Navegadores */}
        <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-6 shadow-nova-card">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8] mb-4">
            Navegadores
          </h4>
          {browsers.length === 0 ? (
            <p className="text-xs text-[#64748B]">Sem dados de navegadores.</p>
          ) : (
            <div className="space-y-3">
              {browsers.map((b) => (
                <div key={b.name} className="flex items-center justify-between text-xs py-1 border-b border-[#1E2C48]/60">
                  <span className="text-[#F8FAFC]">{b.name}</span>
                  <span className="text-[#3B82F6] font-mono font-medium">{b.count} cliques</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-[#101828] border border-[#1E2C48] rounded-2xl p-6 shadow-nova-card">
          <div className="flex items-center space-x-1.5 mb-4">
            <Globe className="w-4 h-4 text-[#3B82F6]" />
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
              Origens de Tráfego
            </h4>
          </div>
          {referers.length === 0 ? (
            <p className="text-xs text-[#64748B]">Sem dados de referência.</p>
          ) : (
            <div className="space-y-2">
              {referers.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs py-1 border-b border-[#1E2C48]/60 truncate">
                  <span className="text-[#F8FAFC] truncate" title={r.name}>{r.name}</span>
                  <span className="text-[#60A5FA] font-mono font-medium ml-2">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
