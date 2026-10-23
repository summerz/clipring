export type Chord = { key: string; ctrl: boolean; meta: boolean; shift: boolean }
export type KeyEvent = { key: string; ctrl?: true; shift?: true; meta?: true }

// 2-set Korean layout: the jamo each letter key types, so a chord still matches with Korean input on
export const JAMO: Record<string, string> = { 'ㅂ': 'q', 'ㅈ': 'w', 'ㄷ': 'e', 'ㄱ': 'r', 'ㅅ': 't', 'ㅛ': 'y', 'ㅕ': 'u', 'ㅑ': 'i', 'ㅐ': 'o', 'ㅔ': 'p', 'ㅁ': 'a', 'ㄴ': 's', 'ㅇ': 'd', 'ㄹ': 'f', 'ㅎ': 'g', 'ㅗ': 'h', 'ㅓ': 'j', 'ㅏ': 'k', 'ㅣ': 'l', 'ㅋ': 'z', 'ㅌ': 'x', 'ㅊ': 'c', 'ㅍ': 'v', 'ㅠ': 'b', 'ㅜ': 'n', 'ㅡ': 'm' }

// 'ctrl+alt+backspace' → chord. Modifiers: ctrl, alt (aliases: option, opt, meta), shift. The last part is the key, lowercased.
export const parseChord = (text: string): Chord => {
  const parts = text.toLowerCase().split('+').map(p => p.trim())
  const mods = parts.slice(0, -1)
  return {
    key: parts[parts.length - 1] ?? '',
    ctrl: mods.includes('ctrl'),
    meta: ['alt', 'option', 'opt', 'meta'].some(m => mods.includes(m)),
    shift: mods.includes('shift'),
  }
}

// Does the pressed key match the chord? Modifiers must match exactly; the key is compared after the JAMO map.
export const matches = (k: KeyEvent | undefined, c: Chord): boolean =>
  !!k && !!k.ctrl === c.ctrl && !!k.meta === c.meta && !!k.shift === c.shift && (JAMO[k.key] ?? k.key) === c.key

const GLYPH: Record<string, string> = { backspace: '⌫', up: '↑', down: '↓', left: '←', right: '→', return: '↩', tab: '⇥' }

// '⌃⌥⇧' prefix then the key: backspace→⌫, up→↑, down→↓, left→←, right→→, return→↩, tab→⇥, else the key as written
export const chordLabel = (c: Chord): string =>
  (c.ctrl ? '⌃' : '') + (c.meta ? '⌥' : '') + (c.shift ? '⇧' : '') + (GLYPH[c.key] ?? c.key)
