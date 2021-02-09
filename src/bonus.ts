import { COMMUNISM_CAP, SUNDER_ARMOR_BONUS } from './constant'

class Bonus {
  commanderBonus: number
  sunderArmorBonus: Array<{ name: string; bonus: number }>
  rangeDamageBonus: Array<{ rank: number; name: string; bonus: number }>
  meleeDamageBonus: Array<{ rank: number; name: string; bonus: number }>
  constructor() {
    this.commanderBonus = 0
    this.rangeDamageBonus = []
    this.meleeDamageBonus = []
    this.sunderArmorBonus = []
  }
  static dpsBonusCalc(fine: number) {
    const unit = Math.floor(fine / 20)
    return [unit * 5, unit * 3, unit * 2]
  }
  calc(
    fine: number,
    damageRank: {
      melee: Array<{ name: string; total: number }>
      range: Array<{ name: string; total: number }>
    },
    stackRank: Map<string, number>,
  ) {
    const sunderArmorBonusList = [...stackRank]
      .map(([k, v]) => ({ name: k, count: v }))
      .filter((r) => r.count >= 90)
      .sort((a, b) => b.count - a.count)
    let remainedFine = fine
    if (fine < COMMUNISM_CAP) {
      this.commanderBonus = fine
    } else {
      sunderArmorBonusList.forEach((s) => {
        this.sunderArmorBonus.push({ name: s.name, bonus: SUNDER_ARMOR_BONUS })
        remainedFine -= SUNDER_ARMOR_BONUS
      })
      Bonus.dpsBonusCalc(remainedFine).forEach((b, i) => {
        this.meleeDamageBonus.push({ rank: i + 1, name: damageRank.melee[i].name, bonus: b })
        this.rangeDamageBonus.push({ rank: i + 1, name: damageRank.range[i].name, bonus: b })
      })
    }
  }
}

export default Bonus
