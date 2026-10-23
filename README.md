# clipring

A kill ring for the Claude Code prompt box.

[한국어](README.ko.md)

## Why

Three cases the prompt box does not handle:

- A half-typed prompt has to wait while you send something else.
- A long draft needs shelving after Claude's answer comes out unexpected.
- Something you copied needs to be pasted several prompts later.

A key cuts the line or the whole draft into a history that persists across restarts. The band above the prompt shows it. A key pastes it back at the cursor. It works like the kill ring in Emacs.

## Install

Run in the prompt of a terminal session:

```
/plugin install clipring --marketplace summerz/clipring
```

Answer `y` to add the marketplace, then pick a scope.

- Prompt: the command above.
- Shell: `claude plugin install clipring --marketplace summerz/clipring`
- Desktop app: `/plugin` does not run. Click + next to the prompt box, then Plugins, then Add marketplace with `summerz/clipring`, then Add plugin.

## Features

- Keeps up to 50 clips, persisted across sessions. Cut text also goes to the system clipboard.
- Shows the selected clip and the clip count in the band above the prompt. Chords appear there and in the help pane as symbols such as ⌥⌫.
- `/clips` opens a pane that lists every clip. Press Enter to paste, Esc to close.
- Merges consecutive cuts into one clip, as Emacs kills do.
- Leaves the cursor at the end of the line above after a line cut. Press the key again to keep cutting upward.
- Selects text with Shift+left/right. The next cut takes the selection.
- Captures text killed with ctrl+u or ctrl+k. A whole-line kill counts as a line cut, so cmd+backspace works in terminals that send it as ctrl+u.
- Chords work with Korean (2-set) input on.

## Keys

| Key (default) | Does |
| --- | --- |
| `option+backspace` | cut the selection, or the cursor's line if nothing is selected |
| `ctrl+option+backspace` | cut the whole draft |
| `option+up` | select the older clip |
| `option+down` | select the newer clip |
| `option+v` | paste the selected clip at the cursor |
| `option+d` | delete the selected clip |
| `option+c` | open or close the full list (also `/clips`) |
| `option+h` | open or close the help pane |
| `shift+left` / `shift+right` | select text |
| `cmd+v` | paste the last cut from the system clipboard |
| In the pane: `enter` | paste |
| In the pane: `d` | delete |
| In the pane: `esc` | close |

## Configuration

Every chord is a setting. Change it in the plugin's rows of the config menu, or in `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "clipring": { "paste": "alt+p", "cut": "ctrl+x" } } }
```

Write a chord as `ctrl`, `alt` (or `option`), `shift` joined with `+`, then the key (`backspace`, `up`, `down`, `left`, `right`, or a letter). A change reloads the mod at once. Shift+left/right selection and the pane's `d` are fixed.

## Notes

1. Most terminals never pass shift+up/down to the prompt box, so there is no vertical selection. Use repeated cuts.
2. The band's buttons also answer the default chords through Claude Code keybindings, when the prompt box does not take them first. Changed chords work through the prompt box only.
3. Optional: the band's buttons receive only keys the engine binds to an action. To let them answer the default chords outside the prompt box, add to `~/.claude/keybindings.json`:

```json
{ "bindings": [
  { "context": "Global", "bindings": { "meta+up": "pane:previous", "meta+down": "pane:next", "meta+v": "footer:dismiss", "meta+d": "diff:back", "meta+c": "theme:editCustom", "meta+h": "confirm:previousField" } },
  { "context": "Pane", "bindings": { "meta+backspace": "attachments:remove" } }
] }
```

   `meta+up` / `meta+down` then override Claude Code's `app:diffFileListUp` / `app:diffFileListDown`, which stay on ctrl+up / ctrl+down. Remove the entries to restore them.

## License

MIT
