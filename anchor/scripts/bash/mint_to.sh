#!/bin/bash
# Скрипт для минтинга токенов на указанный адрес
# Запуск: ./mint_to.sh <MINT_ADDRESS> <DESTINATION_ADDRESS> <AMOUNT>

if [ $# -ne 3 ]; then
  echo "Usage: $0 <MINT_ADDRESS> <DESTINATION_ADDRESS> <AMOUNT>"
  exit 1
fi

MINT="$1"
DEST="$2"
AMOUNT="$3"

spl-token mint "$MINT" "$AMOUNT" "$DEST" 