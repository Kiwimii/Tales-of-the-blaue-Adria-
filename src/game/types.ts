export type GameMode = 'creator' | 'world' | 'battle' | 'flip-cup';

export type Direction = 'up' | 'down' | 'left' | 'right';

export interface PlayerProfile {
  name: string;
  skinTone: string;
  hair: string;
  shirt: string;
  trait: 'charmant' | 'direkt' | 'chaotisch' | 'hilfsbereit' | 'beobachtend';
}

export interface Needs {
  energy: number;
  hunger: number;
  thirst: number;
  bladder: number;
  alcohol: number;
  highness: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  level: number;
  resolve: number;
  maxResolve: number;
}

export interface SessionState {
  version: 1;
  mode: GameMode;
  profile: PlayerProfile | null;
  day: 1;
  minutes: number;
  money: number;
  needs: Needs;
  inventory: Record<string, number>;
  team: TeamMember[];
  flags: Record<string, boolean>;
  worldPosition: { x: number; y: number };
}

export interface GameSnapshot extends SessionState {
  clockLabel: string;
  phaseLabel: string;
}
