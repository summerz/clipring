# clipring

A kill ring for the Claude Code prompt box.

[한국어](README.ko.md)

## Why

You are halfway through a prompt, and something comes up. Or you change your mind. You need to set aside what you typed, write something else first, and not lose the first thing.

Or you wrote a long prompt, and Claude's answer came out different from what you expected. You want to shelve the draft, send a different message, and come back to the draft later.

Or you copied something and want to paste it later, maybe after several other prompts.

clipring covers all three. One key cuts the line (or the whole draft) into a history that survives restarts. A band above the prompt shows what is parked. Another key pastes it back where the cursor is. If you know Emacs, it works like the kill ring.

## Install

At the prompt of a terminal session:

```
/plugin install clipring --marketplace summerz/clipring
```

Answer `y` to add the marketplace, then pick a scope. From a shell, run `claude plugin install clipring --marketplace summerz/clipring`. In the desktop app, `/plugin` does not run. There, click + next to the prompt box, then Plugins, then Add marketplace with `summerz/clipring`, then Add plugin.

## What it does

Text you cut from the prompt box goes into a history of up to 50 clips. The history is kept across sessions, and the text also goes onto the system clipboard. The band above the prompt shows the selected clip and how many you have. Chords appear there and in the help pane as symbols such as ⌥⌫.

Type `/clips` to open a pane that lists everything. Press Enter to paste, Esc to close.

Cuts in a row merge into one clip, like Emacs kills. The cursor lands at the end of the line above, so pressing the key again keeps eating upward.

Shift+left/right select text. Your next cut takes the selection.

Text you kill with ctrl+u or ctrl+k lands in the ring too. A whole-line kill counts as a line cut. That means cmd+backspace works even in terminals that send it as ctrl+u.

If you type with Korean (2-set) input on, the chords still work.

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

## Changing the keys

Every chord is a setting. You can change it in the plugin's rows of the config menu, or in `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "clipring": { "paste": "alt+p", "cut": "ctrl+x" } } }
```

Write a chord as `ctrl`, `alt` (or `option`), `shift` joined with `+`, then the key (`backspace`, `up`, `down`, `left`, `right`, or a letter). A change reloads the mod at once. Shift+left/right selection and the pane's `d` are fixed.

## Notes

1. Most terminals never pass shift+up/down to the prompt box, so there is no vertical selection. Use repeated cuts instead.
2. The band's buttons also answer the default chords through Claude Code keybindings, when the prompt box does not take them first. A chord you changed works through the prompt box alone.

A tip, only if you want it: `~/.claude/keybindings.json` can carry the option-key chords. A mod's button can only receive keys the engine has bound to an action, so this file is how the band buttons answer the default chords from outside the prompt box. If you do not need that, skip it. Be aware that the Global `meta+up` / `meta+down` entries override Claude Code's defaults for those keys (`app:diffFileListUp` / `app:diffFileListDown`, which stay on ctrl+up / ctrl+down). To remove them, delete the blocks marked `clipring` in that file, and the defaults come back.

## License

MIT
