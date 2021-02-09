import Bonus from './bonus'
import WCLClient from './wcl-client'
import DeathRobot from './death-robot'
import DamageRobot from './damage-robot'
import SunderArmorRobot from './sunder-armor-robot'
import { getReportCode } from './utils'
import { FINE_UNIT, SUNDER_ARMOR_FILTER, STUPID_DEATH_FILTER } from './constant'
import { WCLDamageTable, WCLDeathEvent, WCLFightRes, WCLStackEvent } from './interface'
import { displaySunderArmor, displayDeath, displayDamage, displayBonus } from './display'

const loading = <HTMLDivElement>document.querySelector('div#loading')
const container = <HTMLDivElement>document.querySelector('div#display-box')
const reportInput = <HTMLInputElement>document.querySelector('input#report')
const fetchButton = <HTMLButtonElement>document.querySelector('button#fetch-button')

async function sunderArmor(reportCode: string, lastTime: number, fightLog: WCLFightRes) {
  const stackLog = await WCLClient.fetchEvent<WCLStackEvent>(
    'summary',
    reportCode,
    0,
    lastTime,
    `&filter=${encodeURI(SUNDER_ARMOR_FILTER)}`,
  )
  const stackResult = new SunderArmorRobot(stackLog).pair(fightLog.friendlies)
  displaySunderArmor(container, stackResult)
  console.log(stackResult)
  return stackResult
}
async function death(reportCode: string, lastTime: number, fightLog: WCLFightRes) {
  const deathLog = await WCLClient.fetchEvent<WCLDeathEvent>(
    'deaths',
    reportCode,
    0,
    lastTime,
    `&filter=${encodeURI(STUPID_DEATH_FILTER)}`,
  )
  const deathResult = new DeathRobot(deathLog).pair(fightLog.friendlies)
  displayDeath(container, deathResult)
  console.log(deathResult)
  return deathResult
}
async function damage(reportCode: string, lastTime: number) {
  const damageLog = await WCLClient.fetchTable<WCLDamageTable>('damage-done', reportCode, lastTime)
  const damageResult = new DamageRobot(damageLog).calc()
  displayDamage(container, damageResult)
  console.log(damageResult)
  return damageResult
}

async function main() {
  container.innerHTML = ''
  const reportCode = getReportCode(reportInput.value)
  fetchButton.disabled = true
  loading.style.display = 'flex'
  const fightLog = (await WCLClient.fetchWCLv1(`report/fights/${reportCode}?`)) as WCLFightRes
  const lastTime = fightLog.fights.slice(-1).pop()!.end_time
  const fine = await death(reportCode, lastTime, fightLog)
  const stackRank = await sunderArmor(reportCode, lastTime, fightLog)
  const damageRank = await damage(reportCode, lastTime)
  const bonus = new Bonus()
  bonus.calc(fine.length * FINE_UNIT, damageRank, stackRank)
  displayBonus(container, bonus)
  console.log(bonus)
  fetchButton.disabled = false
  loading.style.display = 'none'
}

export default {
  main,
}
