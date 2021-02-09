import { WCLStackEvent, WCLFriendly } from './interface'

class SunderArmorRobot {
  constructor(
    public events: WCLStackEvent[],
    public resultMap = new Map<number, number>(), // NOTE: friendlies ID => sunder armor count
    public targetEventMap = new Map<string, WCLStackEvent[]>(), // NOTE: target instance => event list
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
  pair(friendlie: WCLFriendly[]) {
    const gamerCountMap = new Map<string, number>()
    this.resultMap.forEach((count, id) =>
      gamerCountMap.set(friendlie.find((f) => f.id === id)!.name, count),
    )
    return gamerCountMap
  }
}

export default SunderArmorRobot
