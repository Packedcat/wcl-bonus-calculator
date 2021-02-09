export function getReportCode(link: string) {
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

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
