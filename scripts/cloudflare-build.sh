#!/usr/bin/env bash
set -euo pipefail

ensure_mise() {
  if command -v mise &>/dev/null; then
    eval "$(mise activate bash --shims)"
    return
  fi

  curl -fsSL https://mise.run | sh
  export PATH="${HOME}/.local/bin:${PATH}"
  eval "$(mise activate bash --shims)"
}

ensure_mise
cd "$(dirname "$0")/.."
mise install
aube install
aube run build
