import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, RenderElement } from 'claude-code'
import { cutSpan, lineBounds, oneLine, preview } from './lines'
import { chordLabel, matches, parseChord } from './keys'

const PANE = 'clips'
const OPEN = { id: PANE, title: 'Clips', rows: 10, columns: 40 } as const
const HELP = 'clips-help'
const MAX = 50
// ponytail: module variables, a reload drops a half-made selection or chain, which is fine
let anchor: number | undefined
let chain = false
let chainAt = 0
const clips = atom({ plugin: 'clipring', key: 'clips' } as const, [] as string[])
const selected = atom({ plugin: 'clipring', key: 'selected' } as const, 0)

const save = async ($: EngineInterface, text: string) => {
  if (!text.trim()) return
  const list = await update($, clips, list => [text, ...list.filter(one => one !== text)].slice(0, MAX))
  await update($, selected, () => 0)
  await $.store.set('clips', list)
  void $.ui.copy({ text })
}

const move = async ($: EngineInterface, by: number) => {
  const n = (await read($, clips)).length
  if (n) await update($, selected, i => Math.min(n - 1, Math.max(0, i + by)))
}

const pasteSelected = async ($: EngineInterface) => {
  const text = (await read($, clips))[await read($, selected)]
  if (text) await $.prompt.fill({ text, mode: 'insert' })
}

const dropSelected = async ($: EngineInterface) => {
  const cur = await read($, selected)
  const next = await update($, clips, l => l.filter((_, i) => i !== cur))
  await update($, selected, i => Math.min(i, Math.max(0, next.length - 1)))
  await $.store.set('clips', next)
}

const togglePane = async ($: EngineInterface) => {
  if ((await $.ui.panes()).some(pane => pane.id === PANE)) {
    await $.ui.close({ id: PANE })
    return 'Clips pane closed.'
  }
  await $.ui.open({ ...OPEN, focus: true })
  return 'Clips pane opened.'
}

const toggleHelp = async ($: EngineInterface) => {
  if ((await $.ui.panes()).some(pane => pane.id === HELP)) await $.ui.close({ id: HELP })
  else await $.ui.open({ id: HELP, title: 'Clips help', rows: 10, columns: 60, closeOnEscape: true })
}

export const register: Register = (on, options) => {
  const chord = (name: string, fallback: string) => parseChord(typeof options[name] === 'string' && options[name] ? String(options[name]) : fallback)
  const keys = { cut: chord('cut', 'alt+backspace'), cutAll: chord('cutAll', 'ctrl+alt+backspace'), paste: chord('paste', 'alt+v'), drop: chord('drop', 'alt+d'), older: chord('older', 'alt+up'), newer: chord('newer', 'alt+down'), pane: chord('pane', 'alt+c'), help: chord('help', 'alt+h') }
  const L = chordLabel

  on('session.start', async ($, e, next) => {
    const kept = await $.store.get('clips')
    if (Array.isArray(kept)) await update($, clips, () => kept.filter((one): one is string => typeof one === 'string'))
    await $.command.register({ name: 'clips', description: 'Toggle the clip history pane' })
    return next(e)
  })

  // /clips and option+c: open with the keys, or close. Esc in the pane closes it too.
  on('command.run', { command: 'clips' }, async $ => ({ text: await togglePane($) }))

  on('prompt.edit', async ($, e, next) => {
    const k = e.key
    const done = (text: string, cursor: number) => ({ text, cursor })
    const keep = () => done(e.text, e.cursor)
    // shift+arrows stretch a selection from the anchor; any other edit drops it
    const sel = anchor
    anchor = undefined
    const chained = chain
    chain = false
    // shift+left/right stretch a selection from the anchor (the terminal never delivers shift+up/down)
    if (k?.shift && (k.key === 'left' || k.key === 'right')) {
      anchor = sel ?? e.cursor
      const r = await next(e)
      const [lo, hi] = [Math.min(anchor, r.cursor), Math.max(anchor, r.cursor)]
      return { ...r, decorations: [{ start: lo, end: hi, color: 'inverseText', backgroundColor: 'claude' }] }
    }
    if (matches(k, keys.cutAll)) {
      // ctrl+option+backspace: cut the whole draft
      await save($, e.text)
      return done('', 0)
    }
    const cut = async (sel?: number) => {
      // Like Emacs kills, cuts in a row grow one clip: lines joined by newline, selections by nothing.
      // The cursor lands at the end of the line above, so pressing again eats upward.
      const { lo, hi, sep, piece, cursor } = cutSpan(e.text, e.cursor, sel)
      const list = await read($, clips)
      const text = chained && list.length ? (lo <= chainAt ? `${piece}${sep}${list[0]}` : `${list[0]}${sep}${piece}`) : piece
      if (chained && list.length) await update($, clips, l => l.slice(1))
      await save($, text)
      chain = text.trim() !== ''
      chainAt = lo
      return done(e.text.slice(0, lo) + e.text.slice(hi), cursor)
    }
    // option+backspace (cmd+backspace as the terminal sends it): cut the selection, else the cursor's line
    if (matches(k, keys.cut)) return cut(sel)
    if (matches(k, keys.paste)) {
      const text = (await read($, clips))[await read($, selected)] ?? ''
      return done(e.text.slice(0, e.cursor) + text + e.text.slice(e.cursor), e.cursor + text.length)
    }
    if (matches(k, keys.drop)) return (await dropSelected($), keep())
    if (matches(k, keys.pane)) return (await togglePane($), keep())
    if (matches(k, keys.help)) return (await toggleHelp($), keep())
    if (matches(k, keys.older)) return (await move($, -1), keep())
    if (matches(k, keys.newer)) return (await move($, 1), keep())
    if (k?.ctrl && (k.key === 'u' || k.key === 'k')) {
      // ctrl+u / ctrl+k (cmd+backspace as Orca sends it): a kill of the whole line is a line cut, else it lands in the ring
      const { start, end } = lineBounds(e.text, e.cursor)
      if (e.start === start && e.end === (e.text[end - 1] === '\n' ? end - 1 : end)) return cut()
      await save($, e.text.slice(e.start, e.end))
    }
    return next(e)
  })

  // The person's Tab/arrows pick; any other ring move (the pane taking the keys) lands on the pick
  on('ui.focus', { requestId: PANE }, async ($, e, next) => {
    const m = /^clip:(\d+)$/.exec(e.element ?? '')
    if (e.origin.kind === 'person' && m) await update($, selected, () => Number(m[1]))
    if (e.origin.kind !== 'person' && m && Number(m[1]) !== (await read($, selected))) {
      return next({ ...e, element: `clip:${await read($, selected)}` })
    }
    return next(e)
  })

  // The band is the main view: the selected clip on one line. Its buttons take the option-key
  // chords bound in ~/.claude/keybindings.json (see README.md) when the editor does not take them first;
  // those `action` fallbacks only cover the default chords, a changed chord works through the prompt box alone.
  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    const list = await read($, clips)
    if (list.length === 0 || e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const cur = await read($, selected)
    const width = Math.max(20, e.props.bodyColumns - 34)
    const r = await next(e)
    const band = (
      <Box borderStyle="round" borderColor="promptBorder" borderDimColor paddingX={1} gap={1}>
        <Button key="prev" plain dimColor action="pane:previous" label={L(keys.older)}onPress={() => move($, -1)} />
        <Button key="next" plain dimColor action="pane:next" label={L(keys.newer)}onPress={() => move($, 1)} />
        <Button key="paste" plain dimColor action="footer:dismiss" label={L(keys.paste)}onPress={() => pasteSelected($)} />
        <Button key="drop" plain dimColor action="diff:back" label={L(keys.drop)}onPress={() => dropSelected($)} />
        <Button key="pane" plain dimColor action="theme:editCustom" label={L(keys.pane)}onPress={() => togglePane($)} />
        <Button key="help" plain dimColor action="confirm:previousField" label={L(keys.help)}onPress={() => toggleHelp($)} />
        <Text color="claude">{cur + 1}/{list.length}</Text>
        <Text>{oneLine(list[cur] ?? '', width)}</Text>
      </Box>
    )
    return r == null ? band : <Box flexDirection="column">{r as RenderElement}{band}</Box>
  })

  on('ui.render', { component: 'Pane', requestId: HELP }, async ($, e) => {
    const { Box, Text } = $.ui.resolve(e)
    const rows: [string, string][] = [
      ['⇧← / ⇧→', 'select; the next ' + L(keys.cut) + ' cuts the selection'],
      [L(keys.cut), 'cut the cursor line; pressed again, the lines merge into one clip'],
      [L(keys.cutAll), 'cut the whole draft'],
      [L(keys.older) + ' / ' + L(keys.newer), 'select an older / newer clip'],
      [L(keys.paste), 'paste the selected clip at the cursor'],
      [L(keys.drop), 'delete the selected clip'],
      ['cmd+v', 'paste the last cut (system clipboard)'],
      [L(keys.pane) + '  (/clips)', 'open or close the full list; enter pastes, ⌥⌫ deletes, esc closes'],
      [L(keys.help), 'this help'],
    ]
    return (
      <Box flexDirection="column">
        {rows.map(([key, what]) => (
          <Box gap={2}>
            <Box width={18}><Text color="claude">{key}</Text></Box>
            <Text>{what}</Text>
          </Box>
        ))}
      </Box>
    )
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button } = $.ui.resolve(e)
    const list = await read($, clips)
    const cur = await read($, selected)
    const width = Math.max(8, e.props.bodyColumns - 4)

    const paste = (i: number) => async () => {
      await $.prompt.fill({ text: list[i] ?? '', mode: 'insert' })
      await $.ui.close({ id: PANE })
    }

    return (
      <Box flexDirection="column">
        {list.length === 0 && <Text dimColor>Nothing cut yet. {L(keys.cut)} cuts a line, {L(keys.cutAll)} the draft.</Text>}
        {list.map((text, i) => {
          const [head = '', ...rest] = preview(text, width)
          return (
            <Box flexDirection="column">
              <Button key={`clip:${i}`} plain autoFocus={i === cur ? true : undefined} onPress={paste(i)}>
                <Text bold={i === cur} dimColor={i !== cur}>{i === cur ? '›' : ' '}{String(i + 1).padStart(2)} {head}</Text>
              </Button>
              {rest.map(line => (
                <Text bold={i === cur} dimColor={i !== cur}>{'    '}{line}</Text>
              ))}
            </Box>
          )
        })}
        {list.length > 0 && (
          <Box marginTop={1}>
            <Button key="drop" plain hotkey="d" action="attachments:remove" label="d/⌥⌫: delete" onPress={() => dropSelected($)} />
            <Text dimColor>  enter: paste  esc/{L(keys.pane)}: close</Text>
          </Box>
        )}
      </Box>
    )
  })
}
