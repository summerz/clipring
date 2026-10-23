export const lineBounds = (text: string, cursor: number) => {
  const start = text.lastIndexOf('\n', cursor - 1) + 1
  const nl = text.indexOf('\n', cursor)
  return { start, end: nl === -1 ? text.length : nl + 1 }
}

export const firstLine = (text: string, width: number) => {
  const line = text.split('\n')[0] ?? ''
  const more = text.includes('\n') ? ' …' : ''
  return (line.length > width ? line.slice(0, width - 1) + '…' : line) + more
}

const clip = (line: string, width: number) => (line.length > width ? line.slice(0, width - 1) + '…' : line)

// Up to three lines of the text, the last marked when more follow
export const preview = (text: string, width: number, max = 3) => {
  const lines = text.split('\n')
  const shown = lines.slice(0, max).map(line => clip(line, width))
  if (lines.length > max) shown[max - 1] = clip(lines[max - 1] ?? '', width - 2) + ' …'
  return shown
}

// The whole text on one line, each newline drawn as ↵
export const oneLine = (text: string, width: number) => clip(text.replace(/\n/g, ' ↵ '), width)

// What ⌥⌫ removes: the selection [sel, cursor), else the cursor's line with its newline
// (a last line takes the newline before it). The cursor lands at the end of the line above.
export const cutSpan = (text: string, cursor: number, sel?: number) => {
  if (sel !== undefined && sel !== cursor) {
    const [lo, hi] = [Math.min(sel, cursor), Math.max(sel, cursor)]
    return { lo, hi, sep: '', piece: text.slice(lo, hi), cursor: lo }
  }
  const { start, end } = lineBounds(text, cursor)
  const lo = text[end - 1] === '\n' || start === 0 ? start : start - 1
  return { lo, hi: end, sep: '\n', piece: text.slice(start, end).replace(/\n$/, ''), cursor: Math.max(0, start - 1) }
}
