# clipring

Claude Code 프롬프트 입력창을 위한 킬 링(kill ring).

[English](README.md)

## Install

터미널 세션의 프롬프트에서 다음을 입력한다.

```
/plugin install clipring --marketplace summerz/clipring
```

마켓플레이스를 추가할지 물으면 `y`로 답하고 범위(scope)를 고른다. 셸에서는 `claude plugin install clipring --marketplace summerz/clipring`으로 설치한다. `/plugin`이 동작하지 않는 데스크톱 앱에서는 프롬프트 입력창 옆의 +를 누르고 Plugins, Add marketplace에 `summerz/clipring`을 입력한 뒤 Add plugin을 누른다.

## 기능

프롬프트 입력창에서 잘라낸 텍스트는 최대 50개까지 기록에 쌓이고, 세션이 바뀌어도 유지되며, 시스템 클립보드에도 복사된다. 프롬프트 위의 띠에는 선택된 클립과 전체 개수가 표시된다. 띠와 도움말에는 단축키가 ⌥⌫ 같은 기호로 표시된다.

`/clips`를 입력하면 전체 목록 창이 열린다. Enter로 붙여넣고 Esc로 닫는다.

연속한 잘라내기는 Emacs의 kill처럼 하나의 클립으로 합쳐진다. 커서는 윗줄 끝에 놓이므로 같은 키를 다시 누르면 위쪽으로 계속 잘라낸다.

Shift+왼쪽/오른쪽으로 텍스트를 선택할 수 있고, 다음 잘라내기는 선택 영역을 가져간다.

ctrl+u, ctrl+k로 지운 내용도 링에 들어간다. 줄 전체를 지우면 줄 잘라내기로 취급하므로, cmd+backspace를 ctrl+u로 보내는 터미널에서도 cmd+backspace가 동작한다.

한국어(2벌식) 입력 상태에서도 단축키가 그대로 동작한다.

## 키

표에는 `option+backspace` 식으로 표기한다.

| 키 (기본값) | 동작 |
| --- | --- |
| `option+backspace` | 선택 영역을, 없으면 커서가 있는 줄을 잘라냄 |
| `ctrl+option+backspace` | 입력 중인 전체 내용을 잘라냄 |
| `option+up` | 더 오래된 클립 선택 |
| `option+down` | 더 최근 클립 선택 |
| `option+v` | 선택한 클립을 커서 위치에 붙여넣음 |
| `option+d` | 선택한 클립 삭제 |
| `option+c` | 전체 목록 열기/닫기 (`/clips`도 가능) |
| `option+h` | 도움말 창 열기/닫기 |
| `shift+left` / `shift+right` | 텍스트 선택 |
| `cmd+v` | 시스템 클립보드의 마지막 잘라낸 내용을 붙여넣음 |
| 창 안에서: `enter` | 붙여넣기 |
| 창 안에서: `d` | 삭제 |
| 창 안에서: `esc` | 닫기 |

## 키 바꾸기

모든 단축키는 설정값이다. 설정 메뉴의 플러그인 항목에서 바꾸거나 `~/.claude/settings.json`에서 바꾼다.

```json
{ "pluginConfigs": { "clipring": { "paste": "alt+p", "cut": "ctrl+x" } } }
```

표기법: `ctrl`, `alt`(또는 `option`), `shift`를 `+`로 이어 붙이고 마지막에 키(`backspace`, `up`, `down`, `left`, `right` 또는 영문자)를 쓴다. 변경하면 모드가 즉시 다시 로드된다. Shift+왼쪽/오른쪽 선택과 창 안의 `d`는 고정이다.

## 참고

1. 대부분의 터미널에서 shift+up/down은 프롬프트 입력창에 전달되지 않아 세로 선택은 없다. 대신 잘라내기를 반복한다.
2. 띠의 버튼은 프롬프트 입력창이 키를 먼저 받지 않을 때 Claude Code 키바인딩을 통해 기본 단축키에도 반응한다. 바꾼 단축키는 프롬프트 입력창에서만 동작한다.

선택 사항: `~/.claude/keybindings.json`에 option 키 조합을 넣을 수 있다. 모드의 버튼은 엔진이 동작에 연결해 둔 키만 받을 수 있기 때문이다. 띠의 버튼이 입력창 밖에서도 기본 단축키에 반응하길 원할 때만 필요하다. Global의 `meta+up` / `meta+down` 항목은 해당 키의 Claude Code 기본값(`app:diffFileListUp` / `app:diffFileListDown`, ctrl+up / ctrl+down에는 그대로 남는다)을 덮어쓴다. 제거하려면 그 파일에서 `clipring`이라고 표시된 블록을 지워 기본값을 되돌린다.

## License

MIT
