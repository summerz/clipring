import { expect, test } from 'claude-code/testing'
import { cutSpan, firstLine, lineBounds, oneLine, preview } from '../hooks/lines'

test('cmd+backspace takes the cursor line, newline included', async () => {
  const text = 'one\ntwo\nthree'
  expect(lineBounds(text, 5)).toEqual({ start: 4, end: 8 })
  expect(lineBounds(text, 0)).toEqual({ start: 0, end: 4 })
  expect(lineBounds(text, 13)).toEqual({ start: 8, end: 13 })
  expect(lineBounds('', 0)).toEqual({ start: 0, end: 0 })
  expect(firstLine('abc\ndef', 10)).toBe('abc …')
  expect(firstLine('abcdefghij', 5)).toBe('abcd…')
})

test('preview shows at most three lines and marks the rest', async () => {
  expect(preview('a\nb', 10)).toEqual(['a', 'b'])
  expect(preview('a\nb\nc\nd', 10)).toEqual(['a', 'b', 'c …'])
  expect(preview('abcdefghijkl', 6)).toEqual(['abcde…'])
})

test('oneLine folds newlines into a mark', async () => {
  expect(oneLine('a\nb', 20)).toBe('a ↵ b')
  expect(oneLine('abcdef', 4)).toBe('abc…')
})

test('option+backspace cuts the line and lands at the end of the line above', async () => {
  const text = 'one\ntwo\nthree'
  expect(cutSpan(text, 5)).toEqual({ lo: 4, hi: 8, sep: '\n', piece: 'two', cursor: 3 })
  expect(cutSpan(text, 10)).toEqual({ lo: 7, hi: 13, sep: '\n', piece: 'three', cursor: 7 })  // last line takes the newline before it
  expect(cutSpan(text, 1)).toEqual({ lo: 0, hi: 4, sep: '\n', piece: 'one', cursor: 0 })
  expect(cutSpan(text, 6, 2)).toEqual({ lo: 2, hi: 6, sep: '', piece: 'e\ntw', cursor: 2 })
})
