#!/bin/bash
# Скрипт для вычисления config PDA
# Запуск: ./calc_config_pda.sh <ADMIN_PUBKEY> <PROGRAM_ID>

if [ $# -ne 2 ]; then
  echo "Usage: $0 <ADMIN_PUBKEY> <PROGRAM_ID>"
  exit 1
fi

ADMIN_PUBKEY="$1"
PROGRAM_ID="$2"

# Используем solana-address для вычисления PDA
PDA=$(solana address -k <(solana-keygen grind --starts-with config:1 --ignore-case --program-id "$PROGRAM_ID" --seed config --seed "$ADMIN_PUBKEY" | grep "Resulting address" | head -n1 | awk '{print $3}'))

echo "Config PDA: $PDA" 