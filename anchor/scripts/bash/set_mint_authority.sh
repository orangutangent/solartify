#!/bin/bash
# Скрипт для передачи mint authority на PDA
# Запуск: ./set_mint_authority.sh <MINT_ADDRESS> <NEW_AUTHORITY_PUBKEY>

if [ $# -ne 2 ]; then
  echo "Usage: $0 <MINT_ADDRESS> <NEW_AUTHORITY_PUBKEY>"
  exit 1
fi

MINT="$1"
NEW_AUTH="$2"

spl-token authorize "$MINT" mint "$NEW_AUTH" 