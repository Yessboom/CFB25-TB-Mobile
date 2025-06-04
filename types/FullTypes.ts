// src/types/api.ts (in your React app)

// Base entity types
export interface User {
  userId: string;
  username: string | null;
  rosters: Roster[];
  playerLoadouts: PlayerLoadout[];
}

export interface Roster {
  rosterId: string;
  name: string | null;
  userId: string;
  isTemplate?: boolean;
  user: {
    userId: string;
    username: string | null;
  };
  players: Player[];
}

export interface BasePlayer {
  id: string;
  playerId: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  overallRating: number;
  speed: number;
  acceleration: number;
  strength: number;
  agility: number;
  height: number;
  weightPounds: number;
  age: number;
  awareness: number;
  catching: number;
  carrying: number;
  throwPower: number;
  throwAccuracy: number;
  kickPower: number;
  kickAccuracy: number;
  runBlock: number;
  passBlock: number;
  tackle: number;
  jumping: number;
  kickReturn: number;
  injury: number;
  stamina: number;
  toughness: number;
  longSnapRating: number;
  contractYearsLeft: number;
  portrait: number;
  comment: string;
  sleeveTemperature: number;
  performLevel: number;
  consecYearsWithTeam: number;
  home_town: string | null;
  trucking: number;
  changeOfDirection: number;
  backfieldVision: number;
  stiffArm: number;
  spinMove: number;
  jukeMove: number;
  impactBlocking: number;
  runBlockPower: number;
  runBlockFinesse: number;
  passBlockPower: number;
  passBlockFinesse: number;
  powerMoves: number;
  finesseMoves: number;
  blockShedding: number;
  pursuit: number;
  playRecognition: number;
  manCoverage: number;
  zoneCoverage: number;
  runningStyle: number;
  spectacularCatch: number;
  catchInTraffic: number;
  mediumRouteRun: number;
  hitPower: number;
  press: number;
  release: number;
  ego: number;
  potential: number;
  minovr: number;
  vismovetype: number;
  throwAccuracyShort: number;
  throwAccuracyMid: number;
  throwAccuracyDeep: number;
  playAction: number;
  throwOnTheRun: number;
  origId: string;
  position: number;
  top: number;
  bottom: number;
  captainspatch: number;
  college: number | null;
  home_state: number | null;
  validTotalSalary: number;
  validSignBonus: number;
  salary1: number;
  validContractLen: number;
  careerPhase: number;
  handedness: number;
  muscle: number;
  reserved1: number;
  style: number;
  prevTeamId: number;
  reservedunit10: number;
  genericHead: number;
  flagProBowl: number;
  icon: number;
  traitDevelopment: number;
  role2: number;
  birthdate: number;
  isCaptain: boolean;
  qbstyle: number;
  stance: number;
  morale: number;
  fatigue: number;
  playerType: number;
  assetName: string;
  breakTackle: number;
  breakSack: number;
  throwUnderPressure: number;
  leadBlock: number;
  shortRouteRun: number;
  deepRouteRun: number;
  portrait_swappable_library_path: number;
  portrait_force_silhouette: boolean;
  isGuestStar: boolean;
  schoolyear: number;
  isImpactPlayer: boolean;
  redshirted: number;
  isEditAllowed: boolean;
  characterBodyType: number;
  bodyType: number | null;
  skinTone: number;
  skinToneScale: string; // Convert BigInt to string for JSON
  genericHeadName: string | null;
  rosterId: string;
  loadouts: PlayerLoadout[];
}

export interface Player extends BasePlayer {
  portraitImage?: string;
  portraitThumbnail?: string;
}

export interface PlayerLoadout {
  loadoutId: string;
  playerId: string;
  userId: string;
  loadoutType: number;
  loadoutCategory: number;
  loadoutElements: LoadoutElement[];
}

export interface LoadoutElement {
  loadoutElementId: string;
  elementName: string;
  elementCategory: string;
  elementType: string;
}

// API Response wrappers
export interface ApiResponse<T = any> {
  success: boolean;
  error?: string;
  data?: T;
}

export interface AuthResponse extends ApiResponse {
  user?: {
    id: string;
    username: string;
  };
}

export interface RosterListResponse extends ApiResponse {
  rosters?: Roster[];
}

export interface RosterResponse extends ApiResponse {
  roster?: Roster;
}

export interface PlayerResponse extends ApiResponse {
  player?: Player;
}

// Form types for React app
export interface LoginForm {
  username: string;
  password: string;
}

export interface CreateRosterForm {
  templateId: string;
  rosterName: string;
}

export interface UpdatePlayerForm {
  field: string;
  value: string | number | boolean;
}

export interface UpdateSkillForm {
  skillName: string;
  skillValue: number;
}