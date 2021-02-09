import { WCLDamageTable } from './interface'

class DamageRobot {
  constructor(public tables: WCLDamageTable[]) {}
  calc() {
    return {
      melee: this.tables
        .filter((t) => ['Warrior', 'Rogue'].includes(t.type))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
        .map((t) => ({ name: t.name, total: t.total })),
      range: this.tables
        .filter((t) => ['Mage', 'Warlock', 'Hunter'].includes(t.type))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3)
        .map((t) => ({ name: t.name, total: t.total })),
    }
  }
}

export default DamageRobot
