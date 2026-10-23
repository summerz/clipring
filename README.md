# clipring

A kill ring for the Claude Code prompt box.

[한국어](README.ko.md)

## Install

At the prompt of a terminal session:

```
/plugin install clipring --marketplace summerz/clipring
```

Answer `y` to add the marketplace, then pick a scope. From a shell: `claude plugin install clipring --marketplace summerz/clipring`. In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `summerz/clipring`, then Add plugin.

## What it does

Text cut from the prompt box goes into a history of up to 50 clips, kept across sessions, and onto the system clipboard. A band above the prompt shows the selected clip and the count (chords appear there and in the help pane as symbols such as ⌥⌫).

`/clips` opens a pane listing everything. Enter pastes, Esc closes.

Cuts in a row merge into one clip, like Emacs kills. The cursor lands at the end of the line above, so pressing again eats upward.

Shift+left/right select text; the next cut takes the selection.

ctrl+u and ctrl+k kills land in the ring too. A whole-line kill counts as a line cut, so cmd+backspace works in terminals that send it as ctrl+u.

Chords keep working with Korean (2-set) input on.

## Keys

| Key (default) | Does |
| --- | --- |
| `option+backspace` | cut the selection, else the cursor's line |
| `ctrl+option+backspace` | cut the whole draft |
| `option+up` | select the older clip |
| `option+down` | select the newer clip |
| `option+v` | paste the selected clip at the cursor |
| `option+d` | delete the selected clip |
| `option+c` | open or close the full list (also `/clips`) |
| `option+h` | open or close the help pane |
| `shift+left` / `shift+right` | select text |
| `cmd+v` | pastes the last cut from the system clipboard |
| In the pane: `enter` | paste |
| In the pane: `d` | delete |
| In the pane: `esc` | close |

## Changing the keys

Every chord is a setting. Change it in the plugin's rows of the config menu, or in `~/.claude/settings.json`:

```json
{ "pluginConfigs": { "clipring": { "paste": "alt+p", "cut": "ctrl+x" } } }
```

Syntax: `ctrl`, `alt` (or `option`), `shift` joined with `+`, then the key (`backspace`, `up`, `down`, `left`, `right`, or a letter). A change reloads the mod at once. Shift+left/right selection and the pane's `d` are fixed.

## Notes

1. shift+up/down never reach the prompt box in most terminals, so there is no vertical selection; use repeated cuts instead.
2. The band's buttons also answer the default chords through Claude Code keybindings when the prompt box does not take them first; a changed chord works through the prompt box alone.

Optional: `~/.claude/keybindings.json` can carry the option-key chords, because a mod's button can only receive keys the engine has bound to an action. This is only needed if you want the band buttons to answer the default chords from outside the prompt box. The Global `meta+up` / `meta+down` entries override Claude Code's defaults for those keys (`app:diffFileListUp` / `app:diffFileListDown`, which remain on ctrl+up / ctrl+down). To remove them, delete the blocks marked `clipring` in that file so the defaults come back.

## License

MIT
