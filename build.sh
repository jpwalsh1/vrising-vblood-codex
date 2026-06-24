#!/usr/bin/env bash
# Reassembles index.html from the three source fragments in src/.
# The guide is authored in three parts so the large boss-data array stays
# separate from the markup/logic. This script just concatenates them.
set -euo pipefail
cd "$(dirname "$0")"

OUT="index.html"
cat src/part_head.html src/part_bosses.js src/part_tail.html > "$OUT"

LINES=$(wc -l < "$OUT")
echo "Built $OUT ($LINES lines)."
echo "Run 'node validate.js' to verify the boss data before committing."
