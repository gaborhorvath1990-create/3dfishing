import type {
  FloatSpec,
  RigMethod,
  FishSpecies,
  LineSpec,
  LureSpec,
  Loadout,
  RodSpec,
  SaveData,
  WaterBody,
} from './types';

/** Central tuning table. Everything the simulation balances on lives here. */

export const WATER_LEVEL = 0;
export const SHORE_Z = 0;
/** Camera anchor on the bank, in metres. */
export const BANK_Z = 19;
/** Where the rod pod stands. */
export const POD_POSITION = { x: 0.4, y: 0, z: 13.4 };
export const ROD_HEIGHT = 3.6;
export const ROD_FORWARD_TILT = 0.16;

export const CAST = {
  /** Launch speed range in m/s mapped from tapping power 0 – 1. */
  minSpeed: 9,
  maxSpeed: 34,
  /** 45° is optimal; the angle is picked with the vertical aim swipe. */
  gravity: 9.81,
  /** Lateral spread per metre of distance at full side aim. */
  laneSpread: 0.22,
  /** Ideal release angle in degrees. */
  idealAngle: 45,
  /** How far the angle may drift from ideal before power suffers. */
  angleTolerance: 28,
};

export const BITE = {
  /** Base probability that a suitable fish finds the rig per settle cycle. */
  baseChance: 0.42,
  /** Seconds before the first interest check. */
  minWait: 4,
  maxWait: 13,
  /** Length of the strike window — long enough to walk to the rod. */
  window: 6,
  /** Extra seconds of "nibble" lead-in before the real window opens. */
  nibble: 1.4,
};

export const FIGHT = {
  /** Tension above this value breaks the line. */
  breakAt: 1,
  /** Metres of line out at which the fish is netted. */
  netAt: 1.4,
  /** Reel-in speed in metres per second at zero tension. */
  reelSpeed: 4.6,
  /** Slack below this and the hook can fall out. */
  slackThreshold: 0.05,
  /** Chance per second of losing the hook while slack. */
  slackEscapeRate: 0.9,
  /** Rate at which the fish burns stamina. */
  staminaDrain: 0.05,
} as const;

export const DRAG = {
  min: 0.05,
  max: 0.95,
  step: 0.01,
  default: 0.35,
};

export const SPOOL_CAPACITY = 180;

export const RODS: RodSpec[] = [
  { id: 'rod-reed', name: 'Nádas 10 láb', power: 0.9, stiffness: 0.9, price: 0, desc: 'Belépő szintű bot, lágy akcióval. Megbocsátó fárasztás közben.' },
  { id: 'rod-willow', name: 'Fűz 12 láb', power: 1.04, stiffness: 1.05, price: 140, desc: 'Kiegyensúlyozott bot, hosszabb dobásokkal és jobb rúgáselnyeléssel.' },
  { id: 'rod-heron', name: 'Kócsag Pro 13 láb', power: 1.2, stiffness: 1.2, price: 420, desc: 'Versenybot: messzire dob és erős halat is kezel.' },
];

export const LINES: LineSpec[] = [
  { id: 'line-6lb', name: '6 lb monofil', strength: 0.78, price: 0, desc: 'Vékony, kevésbé látható, de hamarabb elpattan.' },
  { id: 'line-10lb', name: '10 lb monofil', strength: 1, price: 90, desc: 'Az univerzális választás, jó kompromisszum.' },
  { id: 'line-15lb', name: '15 lb fonott', strength: 1.28, price: 260, desc: 'Erős fonott zsinór, nagy fékerőt is elvisel.' },
];

export const LURES: LureSpec[] = [
  { id: 'lure-popup', name: 'Pop-up kukorica', weight: 0.6, biteBonus: 0.04, price: 0, desc: 'Könnyű csali, könnyen dobható, átlagos kapáshozam.' },
  { id: 'lure-boilie', name: 'Bojli 16 mm', weight: 1, biteBonus: 0.12, price: 70, desc: 'Megbízható csali, kifejezetten pontyra.' },
  { id: 'lure-tiger', name: 'Tigrismogyoró', weight: 1.3, biteBonus: 0.2, price: 150, desc: 'Nehéz csali, kiváló kapáshozam, kisebb dobástávolság.' },
];

/**
 * Hungarian freshwater species.
 *
 * `minKeepCm` follows the national minimum-size table used by MOHOSZ for
 * species that have one; `protected` species must always be released, and
 * invasive species carry no minimum size.
 */
export const SPECIES: FishSpecies[] = [
  {
    id: 'fish-bream',
    name: 'Dévérkeszeg',
    latin: 'Abramis brama',
    minKg: 0.2,
    maxKg: 3.5,
    rarity: 26,
    strength: 0.42,
    stamina: 18,
    depth: 26,
    depthTolerance: 20,
    lengthAtMinCm: 22,
    lengthAtMaxCm: 55,
    keepRule: 'free',
    desc: 'A tavak legelterjedtebb fehér hala. Lapos test, lassú, nyomós húzás.',
  },
  {
    id: 'fish-roach',
    name: 'Bodorka',
    latin: 'Rutilus rutilus',
    minKg: 0.05,
    maxKg: 1,
    rarity: 30,
    strength: 0.26,
    stamina: 10,
    depth: 14,
    depthTolerance: 14,
    lengthAtMinCm: 10,
    lengthAtMaxCm: 35,
    keepRule: 'free',
    desc: 'Apró, fürge keszegféle. Piros szem, ezüstös pikkely.',
  },
  {
    id: 'fish-rudd',
    name: 'Vörösszárnyú keszeg',
    latin: 'Scardinius erythrophthalmus',
    minKg: 0.05,
    maxKg: 1.2,
    rarity: 20,
    strength: 0.28,
    stamina: 11,
    depth: 12,
    depthTolerance: 12,
    lengthAtMinCm: 10,
    lengthAtMaxCm: 38,
    keepRule: 'free',
    desc: 'Élénk piros úszók, a felső vízrétegben jár.',
  },
  {
    id: 'fish-silverbream',
    name: 'Karikakeszeg',
    latin: 'Blicca bjoerkna',
    minKg: 0.05,
    maxKg: 0.8,
    rarity: 16,
    strength: 0.25,
    stamina: 9,
    depth: 18,
    depthTolerance: 14,
    lengthAtMinCm: 10,
    lengthAtMaxCm: 30,
    keepRule: 'free',
    desc: 'A dévér kistestű rokona, nagy szemmel.',
  },
  {
    id: 'fish-chub',
    name: 'Domolykó',
    latin: 'Squalius cephalus',
    minKg: 0.3,
    maxKg: 4,
    rarity: 10,
    strength: 0.6,
    stamina: 24,
    depth: 22,
    depthTolerance: 18,
    lengthAtMinCm: 25,
    lengthAtMaxCm: 55,
    keepRule: 'sized',
    minKeepCm: 25,
    desc: 'Óvatos, erős rablóhal. Vastag ajkak, nagy pikkelyek.',
  },
  {
    id: 'fish-asp',
    name: 'Balin',
    latin: 'Leuciscus aspius',
    minKg: 1,
    maxKg: 9,
    rarity: 5,
    strength: 1.05,
    stamina: 44,
    depth: 48,
    depthTolerance: 30,
    lengthAtMinCm: 40,
    lengthAtMaxCm: 85,
    keepRule: 'sized',
    minKeepCm: 40,
    closedSeason: 'Tilalmi idő: március 1. – április 30.',
    dailyLimit: 3,
    desc: 'A felszín ragadozója. Robbanékony, hosszú rohanások.',
  },
  {
    id: 'fish-barbel',
    name: 'Márna',
    latin: 'Barbus barbus',
    minKg: 0.8,
    maxKg: 6,
    rarity: 5,
    strength: 0.95,
    stamina: 42,
    depth: 40,
    depthTolerance: 24,
    lengthAtMinCm: 40,
    lengthAtMaxCm: 75,
    keepRule: 'sized',
    minKeepCm: 40,
    closedSeason: 'Tilalmi idő: április 15. – május 31.',
    dailyLimit: 3,
    desc: 'Fenékjáró, bajuszos hal. Makacs, mély fárasztás.',
  },
  {
    id: 'fish-nase',
    name: 'Paduc',
    latin: 'Chondrostoma nasus',
    minKg: 0.3,
    maxKg: 1.8,
    rarity: 7,
    strength: 0.5,
    stamina: 20,
    depth: 30,
    depthTolerance: 18,
    lengthAtMinCm: 20,
    lengthAtMaxCm: 45,
    keepRule: 'sized',
    minKeepCm: 20,
    closedSeason: 'Tilalmi idő: április 15. – május 31.',
    desc: 'Alsó állású szájjal legeli az algát a kövekről.',
  },
  {
    id: 'fish-vimba',
    name: 'Szilvaorrú keszeg',
    latin: 'Vimba vimba',
    minKg: 0.2,
    maxKg: 1.2,
    rarity: 6,
    strength: 0.42,
    stamina: 18,
    depth: 28,
    depthTolerance: 18,
    lengthAtMinCm: 20,
    lengthAtMaxCm: 40,
    keepRule: 'sized',
    minKeepCm: 20,
    closedSeason: 'Tilalmi idő: április 15. – május 31.',
    desc: 'Jellegzetes, lefelé hajló orrú keszegféle.',
  },
  {
    id: 'fish-ide',
    name: 'Jászkeszeg',
    latin: 'Leuciscus idus',
    minKg: 0.3,
    maxKg: 3,
    rarity: 7,
    strength: 0.55,
    stamina: 22,
    depth: 24,
    depthTolerance: 18,
    lengthAtMinCm: 25,
    lengthAtMaxCm: 55,
    keepRule: 'sized',
    minKeepCm: 25,
    desc: 'Sárgás úszójú, zömök keszegféle.',
  },
  {
    id: 'fish-carp',
    name: 'Ponty',
    latin: 'Cyprinus carpio',
    minKg: 0.5,
    maxKg: 20,
    rarity: 22,
    strength: 0.92,
    stamina: 46,
    depth: 50,
    depthTolerance: 32,
    lengthAtMinCm: 25,
    lengthAtMaxCm: 95,
    keepRule: 'sized',
    minKeepCm: 30,
    closedSeason: 'Tilalmi idő: május 2. – május 31.',
    dailyLimit: 3,
    desc: 'A magyar vizek legnépszerűbb hala. Nagy erő, hosszú fárasztás.',
  },
  {
    id: 'fish-crucian',
    name: 'Széles kárász',
    latin: 'Carassius carassius',
    minKg: 0.1,
    maxKg: 2,
    rarity: 8,
    strength: 0.42,
    stamina: 18,
    depth: 14,
    depthTolerance: 12,
    lengthAtMinCm: 12,
    lengthAtMaxCm: 40,
    keepRule: 'protected',
    desc: 'Őshonos, védett kárászfaj. Fogás után vissza kell engedni.',
  },
  {
    id: 'fish-gibel',
    name: 'Ezüstkárász',
    latin: 'Carassius gibelio',
    minKg: 0.1,
    maxKg: 2.5,
    rarity: 22,
    strength: 0.45,
    stamina: 18,
    depth: 16,
    depthTolerance: 14,
    lengthAtMinCm: 12,
    lengthAtMaxCm: 45,
    keepRule: 'free',
    desc: 'Invazív kárászfaj, nincs rá méretkorlát.',
  },
  {
    id: 'fish-tench',
    name: 'Compó',
    latin: 'Tinca tinca',
    minKg: 0.3,
    maxKg: 3.5,
    rarity: 9,
    strength: 0.62,
    stamina: 28,
    depth: 18,
    depthTolerance: 14,
    lengthAtMinCm: 25,
    lengthAtMaxCm: 55,
    keepRule: 'sized',
    minKeepCm: 25,
    closedSeason: 'Tilalmi idő: május 2. – június 15.',
    desc: 'Sötétzöld, nyálkás bőrű, iszapkedvelő hal.',
  },
  {
    id: 'fish-grasscarp',
    name: 'Amur',
    latin: 'Ctenopharyngodon idella',
    minKg: 2,
    maxKg: 25,
    rarity: 6,
    strength: 1.18,
    stamina: 62,
    depth: 70,
    depthTolerance: 40,
    lengthAtMinCm: 45,
    lengthAtMaxCm: 120,
    keepRule: 'free',
    desc: 'Növényevő telepített faj. Villámgyors, hosszú rohanások.',
  },
  {
    id: 'fish-silvercarp',
    name: 'Busa',
    latin: 'Hypophthalmichthys molitrix',
    minKg: 3,
    maxKg: 28,
    rarity: 5,
    strength: 1.1,
    stamina: 58,
    depth: 60,
    depthTolerance: 36,
    lengthAtMinCm: 50,
    lengthAtMaxCm: 120,
    keepRule: 'free',
    desc: 'Planktonszűrő óriás. Gyakran kívülről akad.',
  },
  {
    id: 'fish-pike',
    name: 'Csuka',
    latin: 'Esox lucius',
    minKg: 0.5,
    maxKg: 14,
    rarity: 10,
    strength: 1,
    stamina: 40,
    depth: 30,
    depthTolerance: 24,
    lengthAtMinCm: 40,
    lengthAtMaxCm: 115,
    keepRule: 'sized',
    minKeepCm: 40,
    closedSeason: 'Tilalmi idő: február 1. – március 31.',
    dailyLimit: 3,
    desc: 'Lesből támadó ragadozó. Heves, rázó fejmozgás.',
  },
  {
    id: 'fish-zander',
    name: 'Süllő',
    latin: 'Sander lucioperca',
    minKg: 0.4,
    maxKg: 10,
    rarity: 9,
    strength: 0.9,
    stamina: 36,
    depth: 44,
    depthTolerance: 28,
    lengthAtMinCm: 30,
    lengthAtMaxCm: 95,
    keepRule: 'sized',
    minKeepCm: 30,
    closedSeason: 'Tilalmi idő: március 1. – április 30.',
    dailyLimit: 3,
    desc: 'Üveges szemű, fogas ragadozó. Óvatos kapás.',
  },
  {
    id: 'fish-volgazander',
    name: 'Kősüllő',
    latin: 'Sander volgensis',
    minKg: 0.2,
    maxKg: 1.5,
    rarity: 4,
    strength: 0.65,
    stamina: 26,
    depth: 40,
    depthTolerance: 24,
    lengthAtMinCm: 25,
    lengthAtMaxCm: 45,
    keepRule: 'sized',
    minKeepCm: 25,
    closedSeason: 'Tilalmi idő: március 1. – április 30.',
    dailyLimit: 3,
    desc: 'A süllő kistestű rokona, agyarfogak nélkül.',
  },
  {
    id: 'fish-perch',
    name: 'Sügér',
    latin: 'Perca fluviatilis',
    minKg: 0.05,
    maxKg: 1.5,
    rarity: 20,
    strength: 0.4,
    stamina: 14,
    depth: 20,
    depthTolerance: 18,
    lengthAtMinCm: 12,
    lengthAtMaxCm: 40,
    keepRule: 'free',
    desc: 'Csíkos, tüskés hátúszójú kis ragadozó.',
  },
  {
    id: 'fish-catfish',
    name: 'Harcsa',
    latin: 'Silurus glanis',
    minKg: 1,
    maxKg: 60,
    rarity: 4,
    strength: 1.35,
    stamina: 80,
    depth: 55,
    depthTolerance: 35,
    lengthAtMinCm: 50,
    lengthAtMaxCm: 200,
    keepRule: 'sized',
    minKeepCm: 60,
    closedSeason: 'Tilalmi idő: május 2. – június 15.',
    dailyLimit: 3,
    desc: 'A magyar vizek óriása. Brutális erő, hosszú csata.',
  },
  {
    id: 'fish-burbot',
    name: 'Menyhal',
    latin: 'Lota lota',
    minKg: 0.2,
    maxKg: 2,
    rarity: 3,
    strength: 0.55,
    stamina: 24,
    depth: 35,
    depthTolerance: 22,
    lengthAtMinCm: 25,
    lengthAtMaxCm: 55,
    keepRule: 'protected',
    desc: 'Védett, hideg vizet kedvelő tőkehalféle. Vissza kell engedni.',
  },
  {
    id: 'fish-eel',
    name: 'Angolna',
    latin: 'Anguilla anguilla',
    minKg: 0.3,
    maxKg: 3,
    rarity: 3,
    strength: 0.8,
    stamina: 48,
    depth: 30,
    depthTolerance: 22,
    lengthAtMinCm: 45,
    lengthAtMaxCm: 110,
    keepRule: 'sized',
    minKeepCm: 45,
    desc: 'Kígyószerű, csavarodó hal. Nehéz kezelni.',
  },
  {
    id: 'fish-ruffe',
    name: 'Vágódurbincs',
    latin: 'Gymnocephalus cernua',
    minKg: 0.02,
    maxKg: 0.25,
    rarity: 12,
    strength: 0.2,
    stamina: 8,
    depth: 16,
    depthTolerance: 14,
    lengthAtMinCm: 8,
    lengthAtMaxCm: 20,
    keepRule: 'free',
    desc: 'Apró, tüskés fenékhal. Gyakori mellékfogás.',
  },
  {
    id: 'fish-bitterling',
    name: 'Szivárványos ökle',
    latin: 'Rhodeus amarus',
    minKg: 0.005,
    maxKg: 0.02,
    rarity: 8,
    strength: 0.12,
    stamina: 5,
    depth: 10,
    depthTolerance: 10,
    lengthAtMinCm: 4,
    lengthAtMaxCm: 9,
    keepRule: 'protected',
    desc: 'Védett törpeméretű hal. Kagylóba ívik. Azonnal vissza kell engedni.',
  },
  {
    id: 'fish-gudgeon',
    name: 'Fenékjáró küllő',
    latin: 'Gobio gobio',
    minKg: 0.01,
    maxKg: 0.1,
    rarity: 10,
    strength: 0.15,
    stamina: 6,
    depth: 12,
    depthTolerance: 10,
    lengthAtMinCm: 8,
    lengthAtMaxCm: 18,
    keepRule: 'protected',
    desc: 'Védett, bajuszos kis fenékhal.',
  },
  {
    id: 'fish-bleak',
    name: 'Szélhajtó küsz',
    latin: 'Alburnus alburnus',
    minKg: 0.01,
    maxKg: 0.1,
    rarity: 18,
    strength: 0.14,
    stamina: 6,
    depth: 8,
    depthTolerance: 10,
    lengthAtMinCm: 8,
    lengthAtMaxCm: 20,
    keepRule: 'free',
    desc: 'Felszín közelében rajzó, ezüstös apró hal.',
  },
  {
    id: 'fish-bullhead',
    name: 'Törpeharcsa',
    latin: 'Ameiurus melas',
    minKg: 0.05,
    maxKg: 0.8,
    rarity: 14,
    strength: 0.35,
    stamina: 14,
    depth: 16,
    depthTolerance: 14,
    lengthAtMinCm: 12,
    lengthAtMaxCm: 30,
    keepRule: 'free',
    desc: 'Invazív faj. Tilos visszaengedni, nincs méretkorlát.',
  },
  {
    id: 'fish-pumpkinseed',
    name: 'Naphal',
    latin: 'Lepomis gibbosus',
    minKg: 0.02,
    maxKg: 0.3,
    rarity: 14,
    strength: 0.22,
    stamina: 8,
    depth: 12,
    depthTolerance: 12,
    lengthAtMinCm: 8,
    lengthAtMaxCm: 22,
    keepRule: 'free',
    desc: 'Színes, invazív naphal. Nincs rá méretkorlát.',
  },
];

/** Body length in cm interpolated from the weight within the species range. */
export function lengthForWeight(species: FishSpecies, kg: number): number {
  const span = Math.max(0.0001, species.maxKg - species.minKg);
  const t = Math.max(0, Math.min(1, (kg - species.minKg) / span));
  // Length grows roughly with the cube root of mass.
  const eased = Math.cbrt(t);
  return Math.round(species.lengthAtMinCm + (species.lengthAtMaxCm - species.lengthAtMinCm) * eased);
}

export interface KeepCheck {
  canKeep: boolean;
  reason: string;
}

/** MOHOSZ-style legality check for a single landed fish. */
export function checkKeepable(species: FishSpecies, cm: number): KeepCheck {
  if (species.keepRule === 'protected') {
    return { canKeep: false, reason: `${species.name}: védett faj, nem helyezhető haltartóba.` };
  }
  if (species.keepRule === 'sized') {
    const min = species.minKeepCm ?? 0;
    if (cm < min) {
      return {
        canKeep: false,
        reason: `${species.name}: ${cm} cm — a méretkorlát ${min} cm, ezért vissza kell engedni.`,
      };
    }
    return { canKeep: true, reason: `${species.name}: ${cm} cm, a ${min} cm-es méretkorlát felett.` };
  }
  return { canKeep: true, reason: `${species.name}: nincs méretkorlát, megtartható.` };
}

/** Keepnet capacity in kg, as a practical daily limit. */
export const KEEPNET_CAPACITY_KG = 25;

/**
 * Market value of a landed fish in forints. Rarer species are worth more per
 * kilo, and a specimen-sized fish earns a modest bonus.
 */
export function fishValue(species: FishSpecies, kg: number): number {
  const perKg = 90 + 900 / Math.max(2, species.rarity);
  const specimen = 1 + Math.min(0.5, Math.max(0, (kg - species.minKg) / Math.max(0.1, species.maxKg - species.minKg)) * 0.5);
  return Math.max(40, Math.round(kg * perKg * specimen));
}

export const METHODS: Array<{ id: RigMethod; name: string; desc: string }> = [
  { id: 'float', name: 'Úszós', desc: 'Az úszó jelzi a kapást. Kapásjelző nem kerül a botra.' },
  { id: 'feeder', name: 'Feeder (kosaras)', desc: 'Drótkosár etetőanyaggal, fenekező szerelék, kapásjelzővel.' },
  { id: 'method', name: 'Method feeder', desc: 'Lapos kosár, a csali az etetőanyagba nyomva. Pontos, erős vonzás.' },
  { id: 'boilie', name: 'Bojlis (ólmos)', desc: 'Nehéz ólom, hajszálelőkés bojli. Nagy pontyra.' },
];

export const FLOATS: FloatSpec[] = [
  { id: 'float-stick', name: 'Stick 2 g', shape: 'stick', grams: 2, size: 0.8, sensitivity: 0.95, desc: 'Vékony, nagyon érzékeny, partközelre.' },
  { id: 'float-waggler-s', name: 'Waggler 4 g', shape: 'waggler', grams: 4, size: 1, sensitivity: 0.8, desc: 'Univerzális, közepes távra.' },
  { id: 'float-ball', name: 'Golyóúszó 6 g', shape: 'ball', grams: 6, size: 1.1, sensitivity: 0.45, desc: 'Jól látható, kevésbé érzékeny.' },
  { id: 'float-waggler-l', name: 'Waggler 10 g', shape: 'waggler', grams: 10, size: 1.35, sensitivity: 0.6, desc: 'Nagy távra, szélben is stabil.' },
  { id: 'float-pencil', name: 'Ceruzaúszó 3 g', shape: 'pencil', grams: 3, size: 0.9, sensitivity: 0.85, desc: 'Karcsú, finom kapásokhoz.' },
  { id: 'float-slider', name: 'Csúszóúszó 15 g', shape: 'slider', grams: 15, size: 1.6, sensitivity: 0.5, desc: 'Mély vízre, a legmesszebbre dobható.' },
];

export const FLOAT_COLORS: Array<{ name: string; hex: number }> = [
  { name: 'Piros', hex: 0xff2d2d },
  { name: 'Narancs', hex: 0xff8a00 },
  { name: 'Sárga', hex: 0xffe000 },
  { name: 'Zöld', hex: 0x2ee86b },
  { name: 'Rózsaszín', hex: 0xff4fd8 },
  { name: 'Fekete', hex: 0x151515 },
];

/** Feeder, method feeder and lead weights in grams. */
export const FEEDER_GRAMS = [15, 20, 30, 40, 60, 80, 100];

export const GROUNDBAIT_BASES = [
  { id: 'gb-sweet', name: 'Édes pontyos', bonus: 0.16, carp: 1.3, price: 30, color: 0xb98a4a, desc: 'Karamellás, kukoricalisztes alap.' },
  { id: 'gb-fishmeal', name: 'Halas (fishmeal)', bonus: 0.2, carp: 1.7, price: 40, color: 0x6b4a2b, desc: 'Sötét, olajos, nagy halakra.' },
  { id: 'gb-roach', name: 'Keszegező vaníliás', bonus: 0.18, carp: 0.65, price: 25, color: 0xe0c27a, desc: 'Világos, felhősítő, apró halakra.' },
];

export const GROUNDBAIT_ADDITIVES = [
  { id: 'add-corn', name: 'Csemegekukorica', bonus: 0.04, price: 10 },
  { id: 'add-pellet', name: 'Pellet', bonus: 0.06, price: 15 },
  { id: 'add-maggot', name: 'Csonti', bonus: 0.05, price: 12 },
  { id: 'add-aroma', name: 'Eper aroma', bonus: 0.04, price: 8 },
];

/** Portions produced by one mix. */
export const GROUNDBAIT_BATCH = 8;

/** Effective casting mass factor (1.0 ≈ a 30 g feeder). */
export function castMass(loadout: Loadout): number {
  if (loadout.method === 'float') {
    const float = FLOATS.find((f) => f.id === loadout.floatId) ?? FLOATS[1];
    return Math.max(0.35, float.grams / 10);
  }
  return Math.max(0.5, loadout.feederGrams / 30);
}

export const START_LOADOUTS: Loadout[] = [
  { rodId: 'rod-reed', lineId: 'line-6lb', lureId: 'lure-popup', method: 'float', floatId: 'float-waggler-s', floatColor: 0, feederGrams: 30 },
  { rodId: 'rod-reed', lineId: 'line-10lb', lureId: 'lure-boilie', method: 'feeder', floatId: 'float-waggler-s', floatColor: 2, feederGrams: 30 },
];

/**
 * The twenty starting waters. Geometry is stylised, not surveyed: each entry
 * captures the character of the real water (size, depth, flow, colour) and a
 * plausible species list. mapX / mapY are percent of the map box, projected
 * from real latitude / longitude.
 */
export const LOCATIONS: WaterBody[] = [
  {
    id: 'loc-balaton',
    name: 'Balaton',
    region: 'Dunántúl',
    kind: 'lake',
    mapX: 25.7,
    mapY: 61.0,
    desc: 'Hazánk tengere: hatalmas, sekély, hullámos nagytó nádasokkal.',
    depthM: 3.2,
    flow: 0.05,
    clarity: 0.45,
    waterTop: '#4e6f5e',
    waterDeep: '#2b4a46',
    species: ['fish-carp', 'fish-bream', 'fish-roach', 'fish-rudd', 'fish-pike', 'fish-zander', 'fish-perch', 'fish-catfish', 'fish-tench', 'fish-gibel', 'fish-bleak', 'fish-asp'],
    unlocked: true,
  },
  {
    id: 'loc-duna-godi',
    name: 'Duna — Gödi szakasz',
    region: 'Pest',
    kind: 'river',
    mapX: 45.6,
    mapY: 32.5,
    desc: 'Erős sodrású főmeder kavicspaddal, bedőlt fákkal.',
    depthM: 6.5,
    flow: 0.85,
    clarity: 0.35,
    waterTop: '#5a6a62',
    waterDeep: '#2a3a3c',
    species: ['fish-barbel', 'fish-nase', 'fish-chub', 'fish-asp', 'fish-zander', 'fish-volgazander', 'fish-catfish', 'fish-bream', 'fish-ide', 'fish-vimba', 'fish-gudgeon', 'fish-bleak'],
    unlocked: true,
  },
  {
    id: 'loc-duna-mohacs',
    name: 'Duna — Mohácsi szakasz',
    region: 'Baranya',
    kind: 'river',
    mapX: 39.0,
    mapY: 90.2,
    desc: 'Széles, mély alsó-dunai szakasz, nagy harcsákkal.',
    depthM: 9,
    flow: 0.75,
    clarity: 0.3,
    waterTop: '#55665f',
    waterDeep: '#243336',
    species: ['fish-catfish', 'fish-zander', 'fish-asp', 'fish-barbel', 'fish-bream', 'fish-carp', 'fish-chub', 'fish-volgazander', 'fish-ide', 'fish-nase'],
    unlocked: true,
  },
  {
    id: 'loc-duna-szigetkoz',
    name: 'Duna — Szigetköz',
    region: 'Győr-Moson-Sopron',
    kind: 'river',
    mapX: 20.0,
    mapY: 27.1,
    desc: 'Mellékágak hálózata, tisztább víz, változó sodrás.',
    depthM: 4.5,
    flow: 0.6,
    clarity: 0.55,
    waterTop: '#4f6f66',
    waterDeep: '#27443f',
    species: ['fish-chub', 'fish-barbel', 'fish-nase', 'fish-pike', 'fish-perch', 'fish-ide', 'fish-roach', 'fish-bream', 'fish-gudgeon', 'fish-asp'],
    unlocked: true,
  },
  {
    id: 'loc-tisza-szolnok',
    name: 'Tisza — Szolnoki szakasz',
    region: 'Jász-Nagykun-Szolnok',
    kind: 'river',
    mapX: 60.6,
    mapY: 50.2,
    desc: 'Zavaros, agyagos sodrás, meredek partfalak, nagy harcsák.',
    depthM: 6,
    flow: 0.65,
    clarity: 0.2,
    waterTop: '#5c6450',
    waterDeep: '#2e3429',
    species: ['fish-catfish', 'fish-carp', 'fish-bream', 'fish-zander', 'fish-asp', 'fish-chub', 'fish-ide', 'fish-bullhead', 'fish-perch', 'fish-roach'],
    unlocked: true,
  },
  {
    id: 'loc-tisza-szeged',
    name: 'Tisza — Szegedi szakasz',
    region: 'Csongrád-Csanád',
    kind: 'river',
    mapX: 60.0,
    mapY: 81.4,
    desc: 'Alsó-Tisza, mély gödrökkel és erős halállománnyal.',
    depthM: 7.5,
    flow: 0.6,
    clarity: 0.22,
    waterTop: '#5a6350',
    waterDeep: '#2b3228',
    species: ['fish-catfish', 'fish-zander', 'fish-carp', 'fish-bream', 'fish-asp', 'fish-volgazander', 'fish-bullhead', 'fish-chub', 'fish-perch'],
    unlocked: true,
  },
  {
    id: 'loc-tisza-tokaj',
    name: 'Tisza — Tokaji szakasz',
    region: 'Borsod-Abaúj-Zemplén',
    kind: 'river',
    mapX: 78.0,
    mapY: 18.0,
    desc: 'Felső-Tisza a Bodrog torkolatával, kavicsos padokkal.',
    depthM: 5,
    flow: 0.7,
    clarity: 0.3,
    waterTop: '#566450',
    waterDeep: '#2a352b',
    species: ['fish-barbel', 'fish-chub', 'fish-asp', 'fish-catfish', 'fish-zander', 'fish-nase', 'fish-ide', 'fish-bream', 'fish-perch'],
    unlocked: true,
  },
  {
    id: 'loc-tisza-to',
    name: 'Tisza-tó',
    region: 'Heves',
    kind: 'reservoir',
    mapX: 67.1,
    mapY: 35.6,
    desc: 'Sekély, növényzettel sűrűn benőtt tározó, ragadozó paradicsom.',
    depthM: 2.4,
    flow: 0.15,
    clarity: 0.4,
    waterTop: '#50694c',
    waterDeep: '#2b4030',
    species: ['fish-pike', 'fish-perch', 'fish-carp', 'fish-bream', 'fish-roach', 'fish-rudd', 'fish-tench', 'fish-catfish', 'fish-gibel', 'fish-zander', 'fish-bullhead'],
    unlocked: true,
  },
  {
    id: 'loc-pilismarot',
    name: 'Pilismaróti-öböl',
    region: 'Komárom-Esztergom',
    kind: 'bay',
    mapX: 41.9,
    mapY: 29.5,
    desc: 'Dunai öböl csendes vízzel, a főmedertől védett partokkal.',
    depthM: 3.5,
    flow: 0.2,
    clarity: 0.4,
    waterTop: '#4e6a60',
    waterDeep: '#294340',
    species: ['fish-carp', 'fish-bream', 'fish-roach', 'fish-catfish', 'fish-pike', 'fish-perch', 'fish-zander', 'fish-silverbream', 'fish-bleak'],
    unlocked: true,
  },
  {
    id: 'loc-harosi',
    name: 'Hárosi-öböl',
    region: 'Budapest',
    kind: 'bay',
    mapX: 44.3,
    mapY: 44.4,
    desc: 'Budapesti dunai öböl, városi háttérrel és csendes vízzel.',
    depthM: 4,
    flow: 0.18,
    clarity: 0.3,
    waterTop: '#4f665f',
    waterDeep: '#283c3c',
    species: ['fish-carp', 'fish-bream', 'fish-catfish', 'fish-zander', 'fish-perch', 'fish-roach', 'fish-gibel', 'fish-bleak', 'fish-pike'],
    unlocked: true,
  },
  {
    id: 'loc-rackeve',
    name: 'Ráckevei (Soroksári) Duna-ág',
    region: 'Pest',
    kind: 'river',
    mapX: 42.9,
    mapY: 50.5,
    desc: 'Szabályozott, lassú dunai mellékág: kevés sodrás, nádas partok, sok hal.',
    depthM: 4,
    flow: 0.25,
    clarity: 0.4,
    waterTop: '#50685f',
    waterDeep: '#29403d',
    species: ['fish-carp', 'fish-bream', 'fish-roach', 'fish-silverbream', 'fish-zander', 'fish-catfish', 'fish-pike', 'fish-perch', 'fish-asp', 'fish-gibel', 'fish-bleak'],
    unlocked: true,
  },
  {
    id: 'loc-holt-koros',
    name: 'Holt-Körös (Szarvas)',
    region: 'Békés',
    kind: 'oxbow',
    mapX: 65.7,
    mapY: 60.7,
    desc: 'Klasszikus holtág: álló víz, hínár, fűzfás partok.',
    depthM: 2.8,
    flow: 0.04,
    clarity: 0.5,
    waterTop: '#4d6a46',
    waterDeep: '#2b4230',
    species: ['fish-carp', 'fish-tench', 'fish-bream', 'fish-roach', 'fish-rudd', 'fish-pike', 'fish-perch', 'fish-gibel', 'fish-grasscarp', 'fish-catfish'],
    unlocked: true,
  },
  {
    id: 'loc-peresi',
    name: 'Peresi-holtág',
    region: 'Békés',
    kind: 'oxbow',
    mapX: 68.6,
    mapY: 66.1,
    desc: 'Hosszú, keskeny holtág nádasokkal és nagy pontyokkal.',
    depthM: 2.6,
    flow: 0.03,
    clarity: 0.5,
    waterTop: '#4b6a48',
    waterDeep: '#2a4130',
    species: ['fish-carp', 'fish-grasscarp', 'fish-tench', 'fish-bream', 'fish-roach', 'fish-rudd', 'fish-pike', 'fish-catfish', 'fish-gibel'],
    unlocked: true,
  },
  {
    id: 'loc-fadd',
    name: 'Fadd-Dombori holtág',
    region: 'Tolna',
    kind: 'oxbow',
    mapX: 40.7,
    mapY: 73.9,
    desc: 'Hosszú dunai holtág: csendes, hínáros, ősfás partokkal.',
    depthM: 3.5,
    flow: 0.05,
    clarity: 0.45,
    waterTop: '#4c6a4a',
    waterDeep: '#2a4232',
    species: ['fish-carp', 'fish-grasscarp', 'fish-bream', 'fish-tench', 'fish-pike', 'fish-zander', 'fish-catfish', 'fish-roach', 'fish-rudd', 'fish-perch', 'fish-gibel'],
    unlocked: true,
  },
  {
    id: 'loc-orbottyan',
    name: 'Őrbottyáni horgásztó',
    region: 'Pest',
    kind: 'pond',
    mapX: 47.6,
    mapY: 32.5,
    desc: 'Kis kezelt horgásztó, telepített pontyokkal, kiépített állásokkal.',
    depthM: 2.2,
    flow: 0.02,
    clarity: 0.6,
    waterTop: '#4a6c50',
    waterDeep: '#2a4436',
    species: ['fish-carp', 'fish-gibel', 'fish-bream', 'fish-roach', 'fish-tench', 'fish-grasscarp', 'fish-catfish', 'fish-perch'],
    unlocked: true,
  },
  {
    id: 'loc-danyi',
    name: 'Dányi-tó',
    region: 'Pest',
    kind: 'pond',
    mapX: 51.3,
    mapY: 37.3,
    desc: 'Csendes dombok közti kis tó, tiszta vízzel.',
    depthM: 2.5,
    flow: 0.02,
    clarity: 0.65,
    waterTop: '#4a6e55',
    waterDeep: '#294539',
    species: ['fish-carp', 'fish-tench', 'fish-roach', 'fish-rudd', 'fish-bream', 'fish-pike', 'fish-perch', 'fish-gibel'],
    unlocked: true,
  },
  {
    id: 'loc-hortobagy',
    name: 'Hortobágyi-halastavak',
    region: 'Hajdú-Bihar',
    kind: 'pond',
    mapX: 74.3,
    mapY: 36.3,
    desc: 'Sekély, tápanyagdús halastórendszer a puszta közepén, nagy pontyokkal és amurokkal.',
    depthM: 1.5,
    flow: 0.02,
    clarity: 0.3,
    waterTop: '#58694a',
    waterDeep: '#34422b',
    species: ['fish-carp', 'fish-grasscarp', 'fish-silvercarp', 'fish-gibel', 'fish-bream', 'fish-roach', 'fish-rudd', 'fish-tench', 'fish-pike', 'fish-zander', 'fish-catfish', 'fish-bullhead'],
    unlocked: true,
  },
  {
    id: 'loc-velencei',
    name: 'Velencei-tó',
    region: 'Fejér',
    kind: 'lake',
    mapX: 38.1,
    mapY: 48.1,
    desc: 'Meleg, sekély nádas tó, hatalmas nádszigetekkel.',
    depthM: 1.6,
    flow: 0.04,
    clarity: 0.35,
    waterTop: '#556c48',
    waterDeep: '#324428',
    species: ['fish-carp', 'fish-bream', 'fish-roach', 'fish-rudd', 'fish-tench', 'fish-pike', 'fish-perch', 'fish-gibel', 'fish-catfish', 'fish-bullhead'],
    unlocked: true,
  },
  {
    id: 'loc-deseda',
    name: 'Deseda-tó',
    region: 'Somogy',
    kind: 'reservoir',
    mapX: 22.1,
    mapY: 76.9,
    desc: 'Hosszan elnyúló erdei tározó, kiváló ragadozó vízzel.',
    depthM: 3.8,
    flow: 0.08,
    clarity: 0.5,
    waterTop: '#466a55',
    waterDeep: '#25423a',
    species: ['fish-pike', 'fish-zander', 'fish-perch', 'fish-carp', 'fish-bream', 'fish-roach', 'fish-catfish', 'fish-tench', 'fish-silvercarp'],
    unlocked: true,
  },
  {
    id: 'loc-drava',
    name: 'Dráva — Barcsi szakasz',
    region: 'Somogy',
    kind: 'river',
    mapX: 21.6,
    mapY: 91.2,
    desc: 'Gyors, hideg, tiszta alpesi eredetű folyó kavicspadokkal.',
    depthM: 3.5,
    flow: 0.95,
    clarity: 0.7,
    waterTop: '#45757a',
    waterDeep: '#20464f',
    species: ['fish-barbel', 'fish-chub', 'fish-nase', 'fish-asp', 'fish-ide', 'fish-vimba', 'fish-gudgeon', 'fish-perch', 'fish-pike'],
    unlocked: true,
  },
];

export const findLocation = (id: string): WaterBody =>
  LOCATIONS.find((l) => l.id === id) ?? LOCATIONS[0];

/** Species actually present in the selected water. */
export function speciesOf(locationId: string): FishSpecies[] {
  const water = findLocation(locationId);
  const list = SPECIES.filter((s) => water.species.includes(s.id));
  return list.length ? list : SPECIES;
}

export const DEFAULT_SAVE: SaveData = {
  version: 1,
  money: 220,
  loadouts: START_LOADOUTS,
  drags: [DRAG.default, DRAG.default],
  catchLog: [],
  stats: {
    casts: 0,
    landed: 0,
    snapped: 0,
    bestKg: 0,
    totalKg: 0,
    biggest: '—',
  },
  ownedRods: ['rod-reed'],
  ownedLines: ['line-6lb', 'line-10lb'],
  ownedLures: ['lure-popup', 'lure-boilie'],
  locationId: 'loc-balaton',
  groundbait: { baseId: 'gb-sweet', additiveIds: [], portions: 0 },
  keepNet: [],
};

export const findFloat = (id: string): FloatSpec => FLOATS.find((f) => f.id === id) ?? FLOATS[1];

/** Lure spec adjusted to the real casting mass (float grams or feeder grams). */
export function castLure(loadout: Loadout): LureSpec {
  const lure = LURES.find((l) => l.id === loadout.lureId) ?? LURES[0];
  return { ...lure, weight: castMass(loadout) };
}

/** Attraction strength (0–~0.4) and carp bias of the mixed groundbait. */
export function groundbaitPower(baseId: string, additiveIds: string[]): { strength: number; carp: number } {
  const base = GROUNDBAIT_BASES.find((b) => b.id === baseId) ?? GROUNDBAIT_BASES[0];
  const extra = additiveIds.reduce(
    (sum, id) => sum + (GROUNDBAIT_ADDITIVES.find((a) => a.id === id)?.bonus ?? 0),
    0,
  );
  return { strength: base.bonus + extra, carp: base.carp };
}

export const findRod = (id: string): RodSpec =>
  RODS.find((r) => r.id === id) ?? RODS[0];
export const findLine = (id: string): LineSpec =>
  LINES.find((l) => l.id === id) ?? LINES[0];
export const findLure = (id: string): LureSpec =>
  LURES.find((l) => l.id === id) ?? LURES[0];
export const findSpecies = (id: string): FishSpecies | undefined =>
  SPECIES.find((s) => s.id === id);
