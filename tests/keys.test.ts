import { expect, test } from 'claude-code/testing'
import { chordLabel, matches, parseChord } from '../hooks/keys'

test('chords parse, match and label', () => {
  expect(parseChord('ctrl+alt+backspace')).toEqual({ key: 'backspace', ctrl: true, meta: true, shift: false })
  expect(parseChord('Option+V')).toEqual({ key: 'v', ctrl: false, meta: true, shift: false })
  expect(matches({ key: 'ㅍ', meta: true }, parseChord('alt+v'))).toBe(true)
  expect(matches({ key: 'v' }, parseChord('alt+v'))).toBe(false)
  expect(matches(undefined, parseChord('alt+v'))).toBe(false)
  expect(chordLabel(parseChord('ctrl+alt+backspace'))).toBe('⌃⌥⌫')
  expect(chordLabel(parseChord('alt+up'))).toBe('⌥↑')
  expect(chordLabel(parseChord('alt+v'))).toBe('⌥v')
})
