import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { LOCATIONS, findSpecies } from '@/game/data';
import { useGameStore } from '@/game/store';
import { cn } from '@/lib/utils';
import type { WaterKind } from '@/game/types';
import { Droplets, Fish, Gauge, MapPin, Waves } from 'lucide-react';
import ScreenShell from './ScreenShell';

/** Stylised map drawn in a 0-100 box (aspect ratio ~1.61:1), not survey-grade. */
const HUNGARY_PATH = 'M2.3 60.3 L4.7 56.3 L7.1 55.9 L6.7 43.4 L8.4 39.0 L10.0 32.9 L16.0 31.9 L17.4 21.7 L26.0 30.8 L31.0 30.2 L39.9 28.8 L41.4 28.1 L44.7 19.7 L52.9 14.2 L57.9 15.3 L63.6 2.7 L69.7 3.1 L79.3 5.1 L88.6 8.5 L99.3 9.5 L98.1 23.7 L94.3 29.5 L86.4 39.0 L82.9 52.5 L78.6 66.1 L76.0 79.7 L68.6 81.4 L59.3 84.7 L52.1 84.1 L43.6 91.2 L39.0 93.2 L35.7 97.6 L27.9 96.6 L21.6 91.5 L13.6 78.0 L9.3 73.9 L5.0 71.2 Z';
const DANUBE_PATH = 'M17.4 22.0 L26.0 30.8 L31.0 30.2 L39.9 28.8 L43.1 29.8 L44.6 39.0 L42.9 50.8 L42.1 62.7 L40.4 74.6 L39.0 90.2';
const TISZA_PATH = 'M87.9 8.5 L77.9 18.6 L73.6 25.4 L67.9 35.6 L60.7 50.2 L59.3 66.1 L59.3 81.4';
const BALATON_PATH = 'M19.3 64.7 L25.7 63.4 L31.4 58.3 L30.7 57.3 L25.0 61.4 L19.0 63.4 Z';
const MAP_ASPECT = 1.61;

const KIND_LABEL: Record<WaterKind, string> = {
  lake: 'tó',
  river: 'folyó',
  oxbow: 'holtág',
  bay: 'öböl',
  reservoir: 'tározó',
  pond: 'horgásztó',
};

const KIND_COLOR: Record<WaterKind, string> = {
  lake: '#4ea3c4',
  river: '#59b48f',
  oxbow: '#8fb04e',
  bay: '#4eb4b0',
  reservoir: '#6f95cc',
  pond: '#c2a24e',
};

const flowLabel = (flow: number): string => {
  if (flow < 0.1) return 'állóvíz';
  if (flow < 0.3) return 'alig mozog';
  if (flow < 0.6) return 'közepes sodrás';
  if (flow < 0.85) return 'erős sodrás';
  return 'nagyon gyors';
};

const clarityLabel = (c: number): string => {
  if (c < 0.3) return 'zavaros';
  if (c < 0.5) return 'enyhén zavaros';
  if (c < 0.7) return 'tiszta';
  return 'kristálytiszta';
};

/** Map-based water picker: pick a spot on Hungary and start fishing there. */
export default function LocationsScreen() {
  const setScreen = useGameStore((s) => s.setScreen);
  const locationId = useGameStore((s) => s.locationId);
  const setLocation = useGameStore((s) => s.setLocation);
  const [selectedId, setSelectedId] = useState(locationId);

  const selected = LOCATIONS.find((l) => l.id === selectedId) ?? LOCATIONS[0];

  return (
    <ScreenShell
      title="Vízterületek"
      subtitle="Válassz vizet a térképen"
      onBack={() => setScreen('menu')}
      footer={
        <Button
          onClick={() => setLocation(selected.id)}
          className="h-12 w-full rounded-full bg-[#7fb069] text-[13px] font-semibold text-[#0c1a08] hover:bg-[#95c47f] focus-ring"
        >
          Horgászat itt: {selected.name}
        </Button>
      }
    >
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div className="panel rounded-2xl p-3">
          <div className="relative mx-auto w-full" style={{ aspectRatio: MAP_ASPECT }}>
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
              <path d={HUNGARY_PATH} fill="#1b2e25" stroke="#7fb069" strokeOpacity="0.7" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
              <path d={DANUBE_PATH} fill="none" stroke="#4ea3c4" strokeOpacity="0.8" strokeWidth="3" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              <path d={TISZA_PATH} fill="none" stroke="#59b48f" strokeOpacity="0.8" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" />
              <path d={BALATON_PATH} fill="#4ea3c4" fillOpacity="0.85" />
            </svg>
            {LOCATIONS.map((loc) => {
              const active = loc.id === selectedId;
              return (
                <button
                  key={loc.id}
                  type="button"
                  aria-label={loc.name}
                  onClick={() => setSelectedId(loc.id)}
                  className="focus-ring absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{ left: `${loc.mapX}%`, top: `${loc.mapY}%` }}
                >
                  <span
                    className={cn(
                      'block rounded-full border-2 border-[#0b1512] transition-transform',
                      active ? 'bite-pulse h-5 w-5 scale-110' : 'h-3.5 w-3.5',
                    )}
                    style={{ background: active ? '#e8a33d' : KIND_COLOR[loc.kind] }}
                  />
                  {active && (
                    <span className="banner-in panel absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold">
                      {loc.name}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-[#edf5f0]/70">
            {(Object.keys(KIND_LABEL) as WaterKind[]).map((k) => (
              <span key={k} className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full" style={{ background: KIND_COLOR[k] }} />
                {KIND_LABEL[k]}
              </span>
            ))}
          </div>
        </div>

        <div className="panel-solid flex flex-col gap-3 rounded-2xl p-4">
          <div>
            <h2 className="font-display text-xl font-semibold">{selected.name}</h2>
            <p className="flex items-center gap-1 text-xs text-[#edf5f0]/70">
              <MapPin className="h-3.5 w-3.5" />
              {selected.region} · {KIND_LABEL[selected.kind]}
              {selected.id === locationId ? ' · jelenlegi víz' : ''}
            </p>
          </div>
          <p className="text-sm leading-relaxed text-[#edf5f0]/85">{selected.desc}</p>
          <dl className="grid grid-cols-3 gap-2 text-xs">
            <div className="panel rounded-lg p-2">
              <dt className="flex items-center gap-1 text-[#edf5f0]/60"><Waves className="h-3.5 w-3.5" />Mélység</dt>
              <dd className="font-mono-num mt-1 text-sm">{selected.depthM} m</dd>
            </div>
            <div className="panel rounded-lg p-2">
              <dt className="flex items-center gap-1 text-[#edf5f0]/60"><Gauge className="h-3.5 w-3.5" />Áramlás</dt>
              <dd className="mt-1 text-sm">{flowLabel(selected.flow)}</dd>
            </div>
            <div className="panel rounded-lg p-2">
              <dt className="flex items-center gap-1 text-[#edf5f0]/60"><Droplets className="h-3.5 w-3.5" />Víz</dt>
              <dd className="mt-1 text-sm">{clarityLabel(selected.clarity)}</dd>
            </div>
          </dl>
          <div>
            <p className="mb-1 flex items-center gap-1 text-xs text-[#edf5f0]/60"><Fish className="h-3.5 w-3.5" />Halállomány</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.species.map((id) => (
                <span key={id} className="rounded-full border border-[#edf5f0]/15 px-2 py-0.5 text-[11px]">
                  {findSpecies(id)?.name ?? id.replace('fish-', '')}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            type="button"
            onClick={() => setSelectedId(loc.id)}
            className={cn(
              'panel focus-ring flex items-center justify-between gap-2 rounded-xl px-3 py-2 text-left transition-colors',
              loc.id === selectedId && 'border-[#e8a33d]/60',
            )}
          >
            <span>
              <span className="block text-sm font-semibold">{loc.name}</span>
              <span className="block text-[11px] text-[#edf5f0]/65">
                {loc.region} · {KIND_LABEL[loc.kind]} · {flowLabel(loc.flow)}
              </span>
            </span>
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: KIND_COLOR[loc.kind] }} />
          </button>
        ))}
      </div>
    </ScreenShell>
  );
}
