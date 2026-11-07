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
    if (n.includes("mobile")) return <Smartphone className="w-3.5 h-3.5 text-[#3B82F6]" />;
    if (n.includes("tablet")) return <Tablet className="w-3.5 h-3.5 text-slate-400" />;
    return <Monitor className="w-3.5 h-3.5 text-slate-300" />;
  };

  return (
    <div className="space-y-6">
      {/* Gráfico de Cliques ao Longo do Tempo */}
      <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-[#94A3B8]" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[#F8FAFC]">
              Histórico de Acessos
            </h3>
          </div>
          <span className="text-[11px] text-[#64748B] font-mono">
            Pico: {maxClicks} cliques
          </span>
        </div>

        {timeline.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#64748B]">
            Nenhum clique registrado ainda.
          </div>
        ) : (
          <div className="space-y-2">
            <div className="h-40 flex items-end space-x-3 pt-6 pb-2 border-b border-white/5">
              {timeline.map((item) => {
                const heightPercent = Math.round((item.clicks / maxClicks) * 100);
                return (
                  <div key={item.date} className="flex-1 flex flex-col items-center group relative">
                    {/* Tooltip */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-8 bg-[#0E121B] border border-white/10 text-[10px] text-white px-2 py-0.5 rounded pointer-events-none whitespace-nowrap shadow-md z-10 font-mono">
                      {item.clicks} {item.clicks === 1 ? "clique" : "cliques"} ({item.date})
                    </div>
                    {/* Barra */}
                    <div
                      className="w-full max-w-[28px] rounded-t-md bg-gradient-to-t from-[#1E2536] to-[#475569] group-hover:brightness-125 transition-all"
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
        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-6">
          <h4 className="text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-4">
            Dispositivos
          </h4>
          {devices.length === 0 ? (
            <p className="text-xs text-[#64748B]">Sem dados.</p>
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
                      <span className="text-[#64748B] font-mono text-[11px]">{pct}% ({dev.count})</span>
                    </div>
                    <div className="w-full h-1 bg-[#07080B] rounded-full overflow-hidden">
                      <div className="h-full bg-slate-400" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Navegadores */}
        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-6">
          <h4 className="text-xs font-medium uppercase tracking-wider text-[#94A3B8] mb-4">
            Navegadores
          </h4>
          {browsers.length === 0 ? (
            <p className="text-xs text-[#64748B]">Sem dados.</p>
          ) : (
            <div className="space-y-2.5">
              {browsers.map((b) => (
                <div key={b.name} className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-[#F8FAFC]">{b.name}</span>
                  <span className="text-[#94A3B8] font-mono text-[11px]">{b.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Referrers */}
        <div className="bg-[#0B0E14] border border-white/5 rounded-2xl p-6">
          <div className="flex items-center space-x-1.5 mb-4">
            <Globe className="w-3.5 h-3.5 text-[#64748B]" />
            <h4 className="text-xs font-medium uppercase tracking-wider text-[#94A3B8]">
              Origens de Tráfego
            </h4>
          </div>
          {referers.length === 0 ? (
            <p className="text-xs text-[#64748B]">Sem dados.</p>
          ) : (
            <div className="space-y-2">
              {referers.map((r) => (
                <div key={r.name} className="flex items-center justify-between text-xs py-1 border-b border-white/5 truncate">
                  <span className="text-[#F8FAFC] truncate" title={r.name}>{r.name}</span>
                  <span className="text-[#94A3B8] font-mono text-[11px] ml-2">{r.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
