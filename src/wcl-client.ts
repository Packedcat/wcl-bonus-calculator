import { sleep } from './utils'
import { View } from './interface'
import { THROTTLE_TIME, API_KEY } from './constant'

class WCLClient {
  static nextRequestTime = 0
  static async fetchWCLv1(path: string) {
    const now = new Date().getTime()
    this.nextRequestTime = Math.max(this.nextRequestTime, now)
    const d = this.nextRequestTime - now
    this.nextRequestTime += THROTTLE_TIME
    await sleep(d)
    const response = await fetch(
      `https://classic.warcraftlogs.com:443/v1/${path}&api_key=${API_KEY}`,
    )
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
  static async fetchEvent<T>(
    view: View,
    code: string,
    start: number,
    end: number,
    slug: string = '',
  ) {
    const events: T[] = []
    let t = start
    while (typeof t === 'number') {
      const json = await this.fetchWCLv1(
        `report/events/${view}/${code}?start=${t}&end=${end}${slug}`,
      )
      if (!json.events) throw 'Could not parse report'
      events.push(...json.events)
      t = json.nextPageTimestamp
    }
    return events
  }
  static async fetchTable<T>(view: View, code: string, end: number, slug: string = '') {
    const json = await this.fetchWCLv1(`report/tables/${view}/${code}?start=0&end=${end}${slug}`)
    if (!json.entries) throw 'Could not parse report'
    return json.entries as T[]
  }
}

export default WCLClient
