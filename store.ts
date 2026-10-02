import { create } from 'zustand';
import {
  DEFAULT_SAVE,
  DRAG,
  GROUNDBAIT_ADDITIVES,
  GROUNDBAIT_BASES,
  GROUNDBAIT_BATCH,
  KEEPNET_CAPACITY_KG,
  checkKeepable,
  findLine,
  findLure,
  findRod,
  findSpecies,
  findLocation,
  fishValue,
  lengthForWeight,
} from './data';
import { emptyHud, engineRegistry } from './engineRegistry';
import { loadSave, writeSave } from './save';
import type {
  CatchEntry,
  GameEvent,
  GameScreen,
  GroundbaitState,
  HudSnapshot,
  KeepNetEntry,
  Loadout,
  PendingCatch,
  SaveData,
} from './types';

export type BannerSeverity = 'info' | 'good' | 'bad' | 'alert';

export interface Banner {
  id: number;
  text: string;
  detail?: string;
  severity: BannerSeverity;
}

interface GameStore extends SaveData {
  screen: GameScreen;
  hud: HudSnapshot;
  banner: Banner | null;
  soundOn: boolean;
  /** Rod index currently receiving player input. */
  activeRod: number;
  /** Rod whose cast overlay is open, or null. */
  castingRod: number | null;
  /** Landed fish awaiting the keep-or-release decision. */
  pendingCatch: PendingCatch | null;

  setScreen(screen: GameScreen): void;
  setActiveRod(index: number): void;
  setCastingRod(index: number | null): void;
  setLoadout(index: number, partial: Partial<Loadout>): void;
  setDrag(index: number, drag: number): void;
  setSoundOn(on: boolean): void;
  pushHud(snapshot: HudSnapshot): void;
  showBanner(text: string, severity?: BannerSeverity, detail?: string): void;
  dismissBanner(id: number): void;
  resetProgress(): void;
  /** Mix a fresh batch of groundbait (costs money). */
  mixGroundbait(baseId: string, additiveIds: string[]): boolean;
  /** Resolve the pending catch: into the keepnet or back into the water. */
  resolveCatch(keep: boolean): void;
  /** Release every fish from the keepnet (counts as the end of the session). */
  emptyKeepNet(): void;
  /** Sell the keepnet contents. */
  sellKeepNet(): void;
  /** Choose the water body to fish and start the session there. */
  setLocation(locationId: string): void;
}

const syncGroundbait = (gb: GroundbaitState): void =>
  engineRegistry.get()?.setGroundbait(gb.portions, gb.baseId, gb.additiveIds);

const initial = loadSave();
let bannerId = 0;

export const useGameStore = create<GameStore>((set, get) => ({
  ...initial,
  // The game opens on the main menu (Horgászat megkezdése / Beállítások);
  // the live 3D lake keeps rendering behind it.
  screen: 'menu',
  hud: emptyHud(),
  banner: null,
  soundOn: true,
  activeRod: 0,
  castingRod: null,
  pendingCatch: null,

  setScreen: (screen) => set({ screen }),

  setLocation: (locationId) => {
    const water = findLocation(locationId);
    engineRegistry.get()?.setLocation(locationId);
    engineRegistry.get()?.resetRods();
    set({ locationId, screen: 'game' });
    get().showBanner(`${water.name}`, 'good', `${water.region} · ${water.desc}`);
  },

  setActiveRod: (index) => {
    engineRegistry.get()?.setActiveRod(index);
    set({ activeRod: index });
  },

  setCastingRod: (index) => set({ castingRod: index }),

  setLoadout: (index, partial) => {
    const loadouts = get().loadouts.map((l, i) => (i === index ? { ...l, ...partial } : l));
    const next = loadouts[index];
    engineRegistry.get()?.setLoadout(index, next);
    set({ loadouts });
  },

  setDrag: (index, drag) => {
    const clamped = Math.max(DRAG.min, Math.min(DRAG.max, drag));
    const drags = get().drags.map((d, i) => (i === index ? clamped : d));
    engineRegistry.get()?.setDrag(index, clamped);
    set({ drags });
  },

  setSoundOn: (on) => {
    engineRegistry.get()?.setAudioEnabled(on);
    set({ soundOn: on });
  },

  pushHud: (snapshot) => set({ hud: snapshot, activeRod: snapshot.activeRod }),

  showBanner: (text, severity = 'info', detail) => {
    bannerId += 1;
    set({ banner: { id: bannerId, text, severity, detail } });
  },

  dismissBanner: (id) => {
    if (get().banner?.id === id) set({ banner: null });
  },

  mixGroundbait: (baseId, additiveIds) => {
    const base = GROUNDBAIT_BASES.find((b) => b.id === baseId);
    if (!base) return false;
    const cost =
      base.price + additiveIds.reduce((s, id) => s + (GROUNDBAIT_ADDITIVES.find((a) => a.id === id)?.price ?? 0), 0);
    const { money, groundbait } = get();
    if (money < cost) {
      get().showBanner('Nincs elég pénz', 'bad', `A keverék ${cost} Ft.`);
      return false;
    }
    // A new mix replaces the bucket contents.
    const next: GroundbaitState = { baseId, additiveIds, portions: GROUNDBAIT_BATCH };
    set({ money: money - cost, groundbait: next });
    syncGroundbait(next);
    get().showBanner('Etetőanyag bekeverve', 'good', `${GROUNDBAIT_BATCH} adag · −${cost} Ft${groundbait.portions ? ' (a maradék kiöntve)' : ''}`);
    return true;
  },

  resolveCatch: (keep) => {
    const { pendingCatch, keepNet, catchLog, stats } = get();
    if (!pendingCatch) return;
    const willKeep = keep && pendingCatch.canKeep;

    const entry: CatchEntry = {
      id: `${Date.now()}-${pendingCatch.rod}`,
      species: pendingCatch.species,
      kg: pendingCatch.kg,
      cm: pendingCatch.cm,
      distance: pendingCatch.distance,
      rod: `${pendingCatch.rod + 1}. bot`,
      at: Date.now(),
      kept: willKeep,
      releaseReason: willKeep ? undefined : pendingCatch.reason,
    };

    const nextStats = {
      ...stats,
      bestKg: Math.max(stats.bestKg, pendingCatch.kg),
      totalKg: Number((stats.totalKg + pendingCatch.kg).toFixed(2)),
      biggest: pendingCatch.kg >= stats.bestKg ? pendingCatch.species : stats.biggest,
    };

    const nextNet: KeepNetEntry[] = willKeep
      ? [
          {
            id: entry.id,
            speciesId: pendingCatch.speciesId,
            species: pendingCatch.species,
            latin: pendingCatch.latin,
            kg: pendingCatch.kg,
            cm: pendingCatch.cm,
            at: entry.at,
            rod: `${pendingCatch.rod + 1}. bot`,
            rodName: pendingCatch.rodName,
            lureName: pendingCatch.lureName,
            distance: pendingCatch.distance,
            value: pendingCatch.value,
          },
          ...keepNet,
        ]
      : keepNet;

    set({
      pendingCatch: null,
      keepNet: nextNet,
      catchLog: [entry, ...catchLog].slice(0, 200),
      stats: nextStats,
    });

    if (willKeep) {
      get().showBanner(
        `Haltartóba: ${pendingCatch.species}`,
        'good',
        `${pendingCatch.kg.toFixed(2)} kg · ${pendingCatch.cm} cm · ${pendingCatch.value} Ft`,
      );
    } else {
      get().showBanner('Visszaengedve', 'info', pendingCatch.reason);
    }
  },

  emptyKeepNet: () => {
    const count = get().keepNet.length;
    if (count === 0) return;
    set({ keepNet: [] });
    get().showBanner('Haltartó kiürítve', 'info', `${count} hal visszaengedve a vízbe.`);
  },

  sellKeepNet: () => {
    const { keepNet, money } = get();
    if (keepNet.length === 0) return;
    const kg = keepNet.reduce((s, e) => s + e.kg, 0);
    const payout = keepNet.reduce((s, e) => s + (e.value ?? Math.round(e.kg * 120)), 0);
    set({ keepNet: [], money: money + payout, screen: 'game' });
    get().showBanner(
      'Horgászat befejezve',
      'good',
      `${keepNet.length} hal · ${kg.toFixed(2)} kg · +${payout} Ft a boltban költheted el.`,
    );
  },

  resetProgress: () => {
    const fresh = JSON.parse(JSON.stringify(DEFAULT_SAVE)) as SaveData;
    set({ ...fresh });
    writeSave(fresh);
    engineRegistry.get()?.resetRods();
    get().showBanner('Előrelépés visszaállítva', 'info');
  },
}));

/** Translate a one-shot engine event into persistent state changes. */
export function applyGameEvent(event: GameEvent): void {
  const state = useGameStore.getState();

  switch (event.type) {
    case 'cast-complete': {
      useGameStore.setState({ stats: { ...state.stats, casts: state.stats.casts + 1 } });
      break;
    }
    case 'bite': {
      state.showBanner('KAPÁS!', 'alert', `${String(event.rod + 1)}. bot — siess oda és vágj be!`);
      break;
    }
    case 'groundbait-used': {
      useGameStore.setState({
        groundbait: { ...state.groundbait, portions: Math.max(0, state.groundbait.portions - 1) },
      });
      break;
    }
    case 'feeder-filled': {
      state.showBanner('Kosár megtöltve', 'good', 'A következő dobással az etetőanyag a csali mellé kerül.');
      break;
    }
    case 'ball-thrown': {
      state.showBanner('Gombóc bedobva', 'info', `${String(event.rod + 1)}. bot szereléke mellé.`);
      break;
    }
    case 'request-cast': {
      useGameStore.setState({ castingRod: event.rod });
      break;
    }
    case 'beached': {
      state.showBanner('Szárazra dobtál', 'bad', 'A szerelék nem érte el a vizet — vond be.');
      break;
    }
    case 'missed': {
      state.showBanner('Elment', 'info', 'Nem vágtál be időben.');
      break;
    }
    case 'landed': {
      const kg = event.kg ?? 0;
      const species = findSpecies(event.speciesId ?? '');
      if (!species) break;
      const cm = lengthForWeight(species, kg);
      const legal = checkKeepable(species, cm);
      const net = state.keepNet;
      const netKg = net.reduce((s, e) => s + e.kg, 0);
      const full = netKg + kg > KEEPNET_CAPACITY_KG;
      const limitHit =
        species.dailyLimit !== undefined &&
        net.filter((e) => e.speciesId === species.id).length >= species.dailyLimit;

      let canKeep = legal.canKeep;
      let reason = legal.reason;
      if (canKeep && full) {
        canKeep = false;
        reason = `A haltartó megtelt (max. ${KEEPNET_CAPACITY_KG} kg).`;
      } else if (canKeep && limitHit) {
        canKeep = false;
        reason = `${species.name}: a napi darabszám (${species.dailyLimit} db) betelt.`;
      }

      // The angler decides keep-or-release; the log entry is written then.
      const loadout = state.loadouts[event.rod];
      const rodName = findRod(loadout?.rodId ?? '')?.name ?? `${event.rod + 1}. bot`;
      const lureName = findLure(loadout?.lureId ?? '')?.name ?? 'ismeretlen csali';
      useGameStore.setState({
        stats: { ...state.stats, landed: state.stats.landed + 1 },
        pendingCatch: {
          rod: event.rod,
          speciesId: species.id,
          species: species.name,
          latin: species.latin,
          kg,
          cm,
          distance: event.distance ?? 0,
          rodName,
          lureName,
          value: fishValue(species, kg),
          keepRule: species.keepRule,
          minKeepCm: species.minKeepCm,
          closedSeason: species.closedSeason,
          canKeep,
          reason,
        },
      });
      break;
    }
    case 'snapped': {
      useGameStore.setState({ stats: { ...state.stats, snapped: state.stats.snapped + 1 } });
      state.showBanner('ELPATTANT A ZSINÓR', 'bad', 'Túl nagy terhelés a féken.');
      break;
    }
    case 'spooled': {
      useGameStore.setState({ stats: { ...state.stats, snapped: state.stats.snapped + 1 } });
      state.showBanner('LEFUTOTT AZ ORSÓ', 'bad', 'Elfogyott a zsinór az orsóról.');
      break;
    }
    case 'drag-slip': {
      state.showBanner('Csörög az orsó', 'alert', 'A fék enged — állítsd szorosabbra!');
      break;
    }
    default:
      break;
  }
}

/** Debounced persistence: discrete changes only, never per frame. */
let saveTimer: number | null = null;

export function initPersistence(): void {
  let previousKey = '';
  const signature = (s: GameStore): string =>
    JSON.stringify([
      s.money,
      s.loadouts,
      s.drags,
      s.stats,
      s.ownedRods,
      s.ownedLines,
      s.ownedLures,
      s.locationId,
      s.catchLog.length,
      s.groundbait,
      s.keepNet,
    ]);

  previousKey = signature(useGameStore.getState());

  useGameStore.subscribe((state) => {
    const key = signature(state);
    if (key === previousKey) return;
    previousKey = key;
    if (saveTimer !== null) window.clearTimeout(saveTimer);
    saveTimer = window.setTimeout(() => {
      saveTimer = null;
      const s = useGameStore.getState();
      writeSave({
        version: s.version,
        money: s.money,
        loadouts: s.loadouts,
        drags: s.drags,
        catchLog: s.catchLog,
        stats: s.stats,
        ownedRods: s.ownedRods,
        ownedLines: s.ownedLines,
        ownedLures: s.ownedLures,
        locationId: s.locationId,
        groundbait: s.groundbait,
        keepNet: s.keepNet,
      });
    }, 600);
  });
}

/** Convenience helpers used by the HUD. */
export const loadoutNames = (index: number): { rod: string; line: string; lure: string } => {
  const loadout = useGameStore.getState().loadouts[index];
  return {
    rod: findRod(loadout.rodId).name,
    line: findLine(loadout.lineId).name,
    lure: findLure(loadout.lureId).name,
  };
};
