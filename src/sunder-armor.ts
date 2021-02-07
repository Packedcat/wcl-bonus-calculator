type EventType =
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
type View =
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
interface WCLFight {
  id: number
  boss: number
  start_time: number
  end_time: number
  name: string
}
type WCLEnemieType = 'NPC' | 'Boss' | 'Pet'
interface WCLEnemieFight {
  id: number
  instances: number
  groups?: number
}
interface WCLEnemie {
  id: number
  guid: number
  icon: string
  name: string
  type: WCLEnemieType
  fights: WCLEnemieFight[]
}
interface WCLEnemyPet {
  name: string
  id: number
  guid: number
  type: string
  icon: string
  petOwner: number
  fights: WCLEnemieFight[]
}
interface WCLFriendly {
  name: string
  id: number
  guid: number
  type: string // TODO: FriendlyType
  server: string
  icon: string
  fights: Array<{ id: number }>
}
interface WCLFriendlyPet {
  name: string
  id: number
  guid: number
  type: 'Pet'
  icon: string
  petOwner: number
  fights: Array<{ id: number; instances: number }>
}
interface WCLAbility {
  name: string
  guid: number
  type: number
  abilityIcon: string
}
interface WCLEvent {
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
interface WCLFightRes {
  enemyPets: WCLEnemyPet[]
  enemies: WCLEnemie[]
  friendlies: WCLFriendly[]
  friendlyPets: WCLFriendlyPet[]
  fights: WCLFight[]
}
const THROTTLE_TIME = 250
const API_KEY = 'd20617b8336021852619e6ec9a25000b'
const SUNDER_ARMOR_FILTER = `ability.id=11597 and type in ('cast', 'applydebuff', 'applydebuffstack', 'removedebuff')`

function sleep(ms: number) {
  return new Promise((f) => setTimeout(f, ms))
}

let nextRequestTime = 0
async function fetchWCLv1(path: string) {
  let now = new Date().getTime()
  nextRequestTime = Math.max(nextRequestTime, now)
  const d = nextRequestTime - now
  nextRequestTime += THROTTLE_TIME
  await sleep(d)
  const response = await fetch(`https://classic.warcraftlogs.com:443/v1/${path}&api_key=${API_KEY}`)
  if (!response) throw 'Could not fetch ' + path
  if (response.status !== 200) {
    if (response.type === 'cors') {
      throw 'Fetch error. The service may be throttled.'
    }
    throw 'Fetch error.'
  }
  const json = await response.json()
  return json
}

function getReportCode(link: string) {
  let ret: string = ''
  const urlmatch = link.match(
    /https:\/\/(?:[a-z]+\.)?(?:classic\.|www\.)?warcraftlogs\.com\/reports\/((?:a:)?\w+)/,
  )
  if (urlmatch) {
    ret = urlmatch[1]
  }
  if (!ret || (ret.length !== 16 && ret.length !== 18)) {
    throw 'report invalid'
  }
  return ret
}

async function fetchEvent(code: string, strat: number, end: number) {
  const events: WCLEvent[] = []
  let t = strat
  while (typeof t === 'number') {
    const json = await fetchWCLv1(
      `report/events/summary/${code}?start=${t}&end=${end}&filter=${encodeURI(
        SUNDER_ARMOR_FILTER,
      )}`,
    )
    if (!json.events) throw 'Could not parse report'
    events.push(...json.events)
    t = json.nextPageTimestamp
  }
  return events
}

class RuthleRobot {
  constructor(
    public events: WCLEvent[],
    public resultMap = new Map<number, number>(), // NOTE: friendlies ID => sunder armor count
    public targetEventMap = new Map<string, WCLEvent[]>(), // NOTE: target instance => event list
  ) {
    this.distribution()
    this.prune()
    this.count()
  }
  private increase(id: number) {
    this.resultMap.set(id, this.resultMap.has(id) ? this.resultMap.get(id)! + 1 : 1)
  }
  distribution() {
    this.events.forEach((e) => {
      const key = `${e.fight}-${e.targetID}-${e.targetInstance}`
      this.targetEventMap.set(
        key,
        this.targetEventMap.has(key) ? this.targetEventMap.get(key)!.concat(e) : [e],
      )
    })
  }
  prune() {
    this.targetEventMap.forEach((el, key) => {
      const validPos = el.findIndex(
        (e) => (e.type === 'applydebuffstack' && e.stack === 5) || e.type === 'removedebuff',
      )
      this.targetEventMap.set(
        key,
        el.slice(0, validPos).filter((e) => e.type === 'cast'),
      )
    })
  }
  count() {
    this.targetEventMap.forEach((el) => el.forEach((e) => this.increase(e.sourceID)))
  }
  static pair(friendlie: WCLFriendly[], result: Map<number, number>) {
    const gamerCountMap = new Map<string, number>()
    result.forEach((count, id) =>
      gamerCountMap.set(friendlie.find((f) => f.id === id)!.name, count),
    )
    return gamerCountMap
  }
}
function displayResult(result: Map<string, number>) {
  const container = <HTMLDivElement>document.querySelector('div#display-box')
  result.forEach((count, name) => {
    const box = document.createElement('div')
    const label = document.createElement('label')
    const input = document.createElement('input')
    input.value = count + ''
    input.disabled = true
    label.innerText = name
    box.appendChild(label)
    box.appendChild(input)
    box.className = 'result-block'
    container.appendChild(box)
  })
}

function removeResult() {
  const container = <HTMLDivElement>document.querySelector('div#display-box')
  container.innerHTML = ''
}

async function main() {
  removeResult()
  const loading = <HTMLDivElement>document.querySelector('div#loading')
  const reportInput = <HTMLInputElement>document.querySelector('input#report')
  const reportCode = getReportCode(reportInput.value)
  const fetchButton = <HTMLButtonElement>document.querySelector('button#fetch-button')
  fetchButton.disabled = true
  loading.style.display = 'flex'
  const data = (await fetchWCLv1(`report/fights/${reportCode}?`)) as WCLFightRes
  const lastTime = data.fights.slice(-1).pop()!.end_time
  const e = await fetchEvent(reportCode, 0, lastTime)
  const r = new RuthleRobot(e)
  const result = RuthleRobot.pair(data.friendlies, r.resultMap)
  fetchButton.disabled = false
  loading.style.display = 'none'
  displayResult(result)
  console.log(result)
}

export default {
  main,
}
