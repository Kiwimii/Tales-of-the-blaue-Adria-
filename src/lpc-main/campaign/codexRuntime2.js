import { COMBAT_MOVES, MAX_EQUIPPED_ATTACKS } from '../../game/combatMoves';
import { ITEMS, QUESTS } from '../../game/content';
import { FRIEND_PROFILES, FRIEND_TEAM_MEMBERS, activeTeamSynergies } from '../../game/friendRoster';
import { ROMANCE_PROFILES, flirtChance } from '../../game/socialSystem';
import { GameStore, STORAGE_KEY } from '../../game/state/GameStore';
import { activeStatuses, statusModifiers } from '../../game/statusSystem';
import { ALL_INTERACTIONS, CAMPAIGN_CHARACTER_BY_ID } from './content';
import { CAMPAIGN_OPPONENTS } from './battleEngine';
import { CHARACTER_VOICES } from './characterVoices';
import { authorityManipulationScore, installAuthorityOverhaul } from './authorityOverhaul';
import { campaignMeta } from './metaStore';
import { ANECDOTES, COMPANION_ACTIONS, WEEKEND_RANKS, branchLabel } from './progression';
import { buildWeekendArcCodexEntries } from './weekendArcCodex';
import codexSource from './codexRuntime.js?raw';
import './codex.css';

const correctedSource = codexSource
  .replace(/^import\s+[^;]+;\s*$/gm, '')
  .replace(/^export\s+/gm, '')
  .replace(
    "note('Verfeinerungspunkt', 'Charmant ist mechanisch schwächer angebunden.'));",
    "note('Verfeinerungspunkt', 'Charmant ist mechanisch schwächer angebunden.')));",
  )
  .replace(
    "  ['world', '⌖', 'Welt & Orte', 'Regionen, Interaktionsorte, Karte und Bewegungsregeln.'],",
    "  ['weekend', '☀', 'Wochenendbogen', 'Freitag-Olympiade, Nachtlärm, Räumungsquest, Faustkampf, Lieder und Secret Millionär.'],\n  ['world', '⌖', 'Welt & Orte', 'Regionen, Interaktionsorte, Karte und Bewegungsregeln.'],",
  )
  .replace(
    '  addWorld(result, snapshot);',
    '  result.push(...buildWeekendArcCodexEntries(snapshot, meta));\n  addWorld(result, snapshot);',
  );

const dependencies = {
  COMBAT_MOVES,
  MAX_EQUIPPED_ATTACKS,
  ITEMS,
  QUESTS,
  FRIEND_PROFILES,
  FRIEND_TEAM_MEMBERS,
  activeTeamSynergies,
  ROMANCE_PROFILES,
  flirtChance,
  GameStore,
  STORAGE_KEY,
  activeStatuses,
  statusModifiers,
  ALL_INTERACTIONS,
  CAMPAIGN_CHARACTER_BY_ID,
  CAMPAIGN_OPPONENTS,
  CHARACTER_VOICES,
  authorityManipulationScore,
  installAuthorityOverhaul,
  campaignMeta,
  ANECDOTES,
  COMPANION_ACTIONS,
  WEEKEND_RANKS,
  branchLabel,
  buildWeekendArcCodexEntries,
};

const runCodex = new Function(
  'dependencies',
  `const {
    COMBAT_MOVES,
    MAX_EQUIPPED_ATTACKS,
    ITEMS,
    QUESTS,
    FRIEND_PROFILES,
    FRIEND_TEAM_MEMBERS,
    activeTeamSynergies,
    ROMANCE_PROFILES,
    flirtChance,
    GameStore,
    STORAGE_KEY,
    activeStatuses,
    statusModifiers,
    ALL_INTERACTIONS,
    CAMPAIGN_CHARACTER_BY_ID,
    CAMPAIGN_OPPONENTS,
    CHARACTER_VOICES,
    authorityManipulationScore,
    installAuthorityOverhaul,
    campaignMeta,
    ANECDOTES,
    COMPANION_ACTIONS,
    WEEKEND_RANKS,
    branchLabel,
    buildWeekendArcCodexEntries,
  } = dependencies;\n${correctedSource}`,
);

runCodex(dependencies);
