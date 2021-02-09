import { WCLDeathEvent, WCLFriendly } from './interface'

class DeathRobot {
  constructor(public events: WCLDeathEvent[]) {}
  pair(friendlie: WCLFriendly[]) {
    return this.events.map((e) => ({
      sufferer: friendlie.find((f) => f.id === e.targetID)?.name,
      reason: e.killingAbility.name,
      murder:
        e.killingAbility.guid === 27820
          ? friendlie.find((f) => f.id === e.killerID)!.name
          : undefined,
    }))
  }
}

export default DeathRobot
