export type EventType =
  | 'begincast'
  | 'cast'
  | 'miss'
  | 'damage'
  | 'heal'
  | 'absorbed'
  | 'healabsorbed'
  | 'applybuff'
  | 'applydebuff'
  | 'applybuffstack'
  | 'applydebuffstack'
  | 'refreshbuff'
  | 'refreshdebuff'
  | 'removebuff'
  | 'removedebuff'
  | 'removebuffstack'
  | 'removedebuffstack'
  | 'summon'
  | 'create'
  | 'death'
  | 'destroy'
  | 'extraattacks'
  | 'aurabroken'
  | 'dispel'
  | 'interrupt'
  | 'steal'
  | 'leech'
  | 'energize'
  | 'drain'
  | 'resurrect'
  | 'encounterstart'
  | 'encounterend'
  | 'phasestart'
  | 'phaseend'
  | 'mapchange'
  | 'zonechange'
  | 'worldmarkerplaced'
  | 'worldmarkerremoved'
export type View =
  | 'summary'
  | 'damage-done'
  | 'damage-taken'
  | 'healing'
  | 'casts'
  | 'summons'
  | 'buffs'
  | 'debuffs'
  | 'deaths'
  | 'threat'
  | 'resources'
  | 'interrupts'
  | 'dispels'
export type ClassType =
  | 'Mage'
  | 'Warrior'
  | 'Rogue'
  | 'Warlock'
  | 'Paladin'
  | 'Priest'
  | 'Druid'
  | 'Hunter'
export interface WCLFight {
  id: number
  boss: number
  start_time: number
  end_time: number
  name: string
}
export type WCLEnemieType = 'NPC' | 'Boss' | 'Pet'
export interface WCLEnemieFight {
  id: number
  instances: number
  groups?: number
}
export interface WCLEnemie {
  id: number
  guid: number
  icon: string
  name: string
  type: WCLEnemieType
  fights: WCLEnemieFight[]
}
export interface WCLEnemyPet {
  name: string
  id: number
  guid: number
  type: string
  icon: string
  petOwner: number
  fights: WCLEnemieFight[]
}
export interface WCLFriendly {
  name: string
  id: number
  guid: number
  type: string // TODO: FriendlyType
  server: string
  icon: string
  fights: Array<{ id: number }>
}
export interface WCLFriendlyPet {
  name: string
  id: number
  guid: number
  type: 'Pet'
  icon: string
  petOwner: number
  fights: Array<{ id: number; instances: number }>
}
export interface WCLAbility {
  name: string
  guid: number
  type: number
  abilityIcon: string
}
export interface WCLStackEvent {
  fight?: number
  stack?: number
  ability: WCLAbility
  pin: string
  sourceID: number
  sourceIsFriendly: boolean
  targetID: number
  targetInstance: number
  targetIsFriendly: boolean
  targetMarker: number
  timestamp: number
  type: EventType
}
export interface WCLFightRes {
  enemyPets: WCLEnemyPet[]
  enemies: WCLEnemie[]
  friendlies: WCLFriendly[]
  friendlyPets: WCLFriendlyPet[]
  fights: WCLFight[]
}
export interface WCLDeathEvent {
  timestamp: number
  type: string
  source: unknown // TODO: source type
  sourceIsFriendly: boolean
  targetID: number
  targetIsFriendly: boolean
  ability: WCLAbility
  fight: number
  pin: string
  killerID: number
  killingAbility: WCLAbility
}
export interface WCLDamageTable {
  abilities: unknown // TODO
  activeTime: number
  activeTimeReduced: number
  damageAbilities: unknown // TODO
  gear: unknown // TODO
  guid: number
  icon: string
  id: number
  name: string
  talents: unknown // TODO
  targets: unknown // TODO
  total: number
  type: ClassType
}
