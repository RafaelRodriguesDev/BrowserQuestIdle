#!/bin/bash

# Legacy wrapper kept for Unix-like shells. The supported cross-platform build
# command is `npm run build:client` from the repository root.

set -e
cd "$(dirname "$0")/.."
npm run build:client
