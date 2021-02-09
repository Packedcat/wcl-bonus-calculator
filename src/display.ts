import Bonus from './bonus'
import { FINE_UNIT } from './constant'

export function displaySunderArmor(host: HTMLElement, result: Map<string, number>) {
  const container = document.createElement('div')
  container.className = 'part'
  const title = document.createElement('h3')
  title.innerText = 'Sunder Armor Count'
  container.appendChild(title)
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
  host.appendChild(container)
}

export function displayDeath(
  host: HTMLElement,
  result: Array<{ sufferer?: string; reason: string; murder?: string }>,
) {
  const container = document.createElement('div')
  container.className = 'part'
  const title = document.createElement('h3')
  title.innerText = `Death ${FINE_UNIT}/person`
  container.appendChild(title)
  result.forEach((r) => {
    const p = document.createElement('p')
    p.innerHTML = r.murder
      ? `<code>${r.murder}</code> kill ${r.sufferer} with ${r.reason}`
      : `<code>${r.sufferer}</code> dies from ${r.reason}`
    container.appendChild(p)
  })
  host.appendChild(container)
}

export function displayDamage(
  host: HTMLElement,
  result: {
    melee: Array<{ name: string; total: number }>
    range: Array<{ name: string; total: number }>
  },
) {
  const container = document.createElement('div')
  container.className = 'part'
  const meleeOl = document.createElement('ol')
  const rangeOl = document.createElement('ol')
  ;[0, 1, 2].forEach((i) => {
    const meleeLi = document.createElement('li')
    meleeLi.innerHTML = `<label>${result.melee[i].name}:</label> ${(
      result.melee[i].total / 1000
    ).toFixed(2)}K`
    meleeOl.appendChild(meleeLi)
    const rangeLi = document.createElement('li')
    rangeLi.innerHTML = `<label>${result.range[i].name}:</label> ${(
      result.range[i].total / 1000
    ).toFixed(2)}K`
    rangeOl.appendChild(rangeLi)
  })
  const meleeTitle = document.createElement('h3')
  meleeTitle.innerText = 'Melee Rank'
  const rangeTitle = document.createElement('h3')
  rangeTitle.innerText = 'Range Rank'
  container.appendChild(meleeTitle)
  container.appendChild(meleeOl)
  container.appendChild(rangeTitle)
  container.appendChild(rangeOl)
  host.appendChild(container)
}

export function displayBonus(host: HTMLElement, bonus: Bonus) {
  const container = document.createElement('div')
  container.className = 'part'
  const ct = document.createElement('h3')
  ct.innerText = 'Commander Bonus'
  container.appendChild(ct)
  const p = document.createElement('p')
  p.innerText = `RL: ${bonus.commanderBonus}`
  container.appendChild(p)
  const mt = document.createElement('h3')
  mt.innerText = 'Melee Bonus'
  container.appendChild(mt)
  bonus.meleeDamageBonus.forEach((b) => {
    const p = document.createElement('p')
    p.innerHTML = `<label>${b.rank}.${b.name}:</label> ${b.bonus}`
    container.appendChild(p)
  })
  const rt = document.createElement('h3')
  rt.innerText = 'Range Bonus'
  container.appendChild(rt)
  bonus.rangeDamageBonus.forEach((b) => {
    const p = document.createElement('p')
    p.innerHTML = `<label>${b.rank}.${b.name}:</label> ${b.bonus}`
    container.appendChild(p)
  })
  const st = document.createElement('h3')
  st.innerText = 'Sunder Armor Bonus'
  container.appendChild(st)
  bonus.sunderArmorBonus.forEach((b) => {
    const p = document.createElement('p')
    p.innerHTML = `<label>${b.name}:</label> ${b.bonus}`
    container.appendChild(p)
  })
  host.appendChild(container)
}
