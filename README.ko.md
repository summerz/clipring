# clipring

Claude Code 프롬프트 입력창을 위한 킬 링(kill ring)입니다.

[English](README.md)

## 왜 필요한가

프롬프트 입력창이 처리하지 못하는 세 가지 경우가 있습니다.

- 작성 중인 프롬프트를 두고 다른 메시지를 먼저 보내야 합니다.
- Claude의 답이 예상과 다르게 나와 긴 초안을 잠시 치워 두어야 합니다.
- 복사한 내용을 프롬프트 몇 개를 보낸 뒤에 붙여넣어야 합니다.

키 하나로 한 줄 또는 입력 중인 전체 내용을 잘라내면 재시작 후에도 남는 기록에 쌓입니다. 프롬프트 위의 띠에 기록이 표시되고, 다른 키로 커서 위치에 다시 붙여넣습니다. Emacs의 킬 링과 같은 방식입니다.

## Install

터미널 세션의 프롬프트에서 다음 명령을 실행합니다.

```
/plugin install clipring --marketplace summerz/clipring
```

마켓플레이스 추가 여부에 `y`로 답하고 범위(scope)를 선택합니다.

- 프롬프트: 위 명령을 실행합니다.
- 셸: `claude plugin install clipring --marketplace summerz/clipring`
- 데스크톱 앱: `/plugin`이 동작하지 않습니다. 프롬프트 입력창 옆의 +를 누르고 Plugins, Add marketplace에 `summerz/clipring`을 입력한 뒤 Add plugin을 누릅니다.

## 기능

- 클립을 최대 50개까지 보관하며 세션이 바뀌어도 유지됩니다. 잘라낸 텍스트는 시스템 클립보드에도 복사됩니다.
- 프롬프트 위의 띠에 선택된 클립과 전체 개수를 표시합니다. 띠와 도움말에서는 단축키가 ⌥⌫ 같은 기호로 표시됩니다.
- `/clips`로 전체 클립 목록 창을 엽니다. Enter로 붙여넣고 Esc로 닫습니다.
- 연속해서 잘라낸 내용은 Emacs의 kill처럼 하나의 클립으로 합칩니다.
- 줄을 잘라내면 커서가 윗줄 끝에 놓입니다. 같은 키를 다시 누르면 위쪽으로 계속 잘라냅니다.
- Shift+왼쪽/오른쪽으로 텍스트를 선택합니다. 다음 잘라내기는 선택 영역을 대상으로 합니다.
- ctrl+u, ctrl+k로 지운 내용도 기록합니다. 줄 전체를 지우면 줄 잘라내기로 처리하므로, cmd+backspace를 ctrl+u로 보내는 터미널에서도 cmd+backspace가 동작합니다.
- 한국어(2벌식) 입력 상태에서도 단축키가 동작합니다.

## 키

| 키 (기본값) | 동작 |
| --- | --- |
| `option+backspace` | 선택 영역을 잘라냅니다. 선택 영역이 없으면 커서가 있는 줄을 잘라냅니다 |
| `ctrl+option+backspace` | 입력 중인 전체 내용을 잘라냅니다 |
| `option+up` | 더 오래된 클립을 선택합니다 |
| `option+down` | 더 최근 클립을 선택합니다 |
| `option+v` | 선택한 클립을 커서 위치에 붙여넣습니다 |
| `option+d` | 선택한 클립을 삭제합니다 |
| `option+c` | 전체 목록을 열거나 닫습니다 (`/clips`도 가능) |
| `option+h` | 도움말 창을 열거나 닫습니다 |
| `shift+left` / `shift+right` | 텍스트를 선택합니다 |
| `cmd+v` | 시스템 클립보드의 마지막 잘라낸 내용을 붙여넣습니다 |
| 창 안에서: `enter` | 붙여넣습니다 |
| 창 안에서: `d` | 삭제합니다 |
| 창 안에서: `esc` | 창을 닫습니다 |

## 설정

모든 단축키는 설정값입니다. 설정 메뉴의 플러그인 항목에서 변경하거나 `~/.claude/settings.json`을 수정합니다.

```json
{ "pluginConfigs": { "clipring": { "paste": "alt+p", "cut": "ctrl+x" } } }
```

단축키는 `ctrl`, `alt`(또는 `option`), `shift`를 `+`로 연결하고 마지막에 키(`backspace`, `up`, `down`, `left`, `right` 또는 영문자)를 씁니다. 변경하면 모드가 즉시 다시 로드됩니다. Shift+왼쪽/오른쪽 선택과 창 안의 `d`는 변경할 수 없습니다.

## 참고

1. 대부분의 터미널은 shift+up/down을 프롬프트 입력창에 전달하지 않으므로 세로 선택은 지원하지 않습니다. 잘라내기를 반복합니다.
2. 띠의 버튼은 프롬프트 입력창이 키를 먼저 받지 않을 때 Claude Code 키바인딩을 통해 기본 단축키에도 반응합니다. 변경한 단축키는 프롬프트 입력창에서만 동작합니다.
3. 선택 사항: 띠의 버튼은 엔진이 동작에 연결한 키만 받습니다. 입력창 밖에서도 기본 단축키에 반응하게 하려면 `~/.claude/keybindings.json`에 다음을 추가합니다.

```json
{ "bindings": [
  { "context": "Global", "bindings": { "meta+up": "pane:previous", "meta+down": "pane:next", "meta+v": "footer:dismiss", "meta+d": "diff:back", "meta+c": "theme:editCustom", "meta+h": "confirm:previousField" } },
  { "context": "Pane", "bindings": { "meta+backspace": "attachments:remove" } }
] }
```

   이때 `meta+up` / `meta+down`은 Claude Code 기본값인 `app:diffFileListUp` / `app:diffFileListDown`을 덮어씁니다(ctrl+up / ctrl+down에는 그대로 유지). 항목을 지우면 기본값으로 돌아갑니다.

## License

MIT
